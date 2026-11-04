if (typeof importScripts === "function") {
  try { importScripts('default_data.js'); } catch(e) {}
}

function safeEncodeB64Utf8(str) {
  if (!str || typeof str !== "string") return "";
  try {
    const bytes = new TextEncoder().encode(str);
    let binary = "";
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  } catch(e) {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch(err) {
      return "";
    }
  }
}

function cleanDomainForPac(d) {
  if (!d) return "";
  let clean = String(d).trim().toLowerCase();
  clean = clean.replace(/^[a-z]+:\/\//i, "");
  clean = clean.split("/")[0].split("?")[0].split("#")[0];
  clean = clean.split(":")[0];
  if (clean.indexOf("*") === -1 && clean.indexOf("?") === -1) {
    clean = clean.replace(/^\*\./, "").replace(/^\./, "").replace(/\.$/, "");
  }
  return clean;
}

function generatePacScript(cfg) {
  const proxyHost = cfg.proxyHost || "127.0.0.1";
  const proxyPort = cfg.proxyPort || 10818;
  const httpPort = cfg.httpPort || 10819;
  const mode = cfg.mode || "smart";
  const coreMode = cfg.coreMode || "auto";
  const youtubeDirect = cfg.youtubeDirect !== false;
  const localBypass = cfg.localBypass !== false;
  const proxyDomains = cfg.proxyDomains || [];
  const bypassDomains = cfg.bypassDomains || [];

  let proxyDirective = `SOCKS5 ${proxyHost}:${proxyPort}; SOCKS ${proxyHost}:${proxyPort}; SOCKS5 127.0.0.1:10808; SOCKS 127.0.0.1:10808; SOCKS5 127.0.0.1:2080; SOCKS5 127.0.0.1:7890; PROXY ${proxyHost}:${httpPort}; PROXY 127.0.0.1:10809; DIRECT`;
  if (coreMode === "west") {
    proxyDirective = `SOCKS5 ${proxyHost}:${proxyPort}; SOCKS ${proxyHost}:${proxyPort}; PROXY ${proxyHost}:${httpPort}; DIRECT`;
  } else if (coreMode === "external") {
    proxyDirective = `SOCKS5 127.0.0.1:10808; SOCKS 127.0.0.1:10808; PROXY 127.0.0.1:10809; DIRECT`;
  }

  const ytDomains = [
    "youtube.com",
    "youtu.be",
    "googlevideo.com",
    "ytimg.com",
    "ggpht.com",
    "youtube-nocookie.com",
    "wide-youtube.l.google.com",
    "yt.be",
    "gvt1.com",
    "youtubekids.com",
    "jnn-pa.googleapis.com"
  ];

  const cleanBp = Array.from(new Set(bypassDomains.map(cleanDomainForPac).filter(Boolean)));
  const cleanPx = Array.from(new Set(proxyDomains.map(cleanDomainForPac).filter(Boolean)));

  const lines = [];
  lines.push("function FindProxyForURL(url, host) {");
  lines.push("  if (!host) return 'DIRECT';");
  lines.push("  host = host.toLowerCase().replace(/\\.$/, '');");
  lines.push("  if (host.charCodeAt(0) === 91 && host.charCodeAt(host.length - 1) === 93) host = host.slice(1, -1);");
  lines.push("");
  lines.push("  function isPlain(h) {");
  lines.push("    if (typeof isPlainHostName === 'function') return isPlainHostName(h);");
  lines.push("    return h.indexOf('.') === -1 && h.indexOf(':') === -1;");
  lines.push("  }");
  lines.push("");
  lines.push("  function matchHost(h, p) {");
  lines.push("    if (!p || !h) return false;");
  lines.push("    if (p === h) return true;");
  lines.push("    if (p.indexOf('*') !== -1 || p.indexOf('?') !== -1) {");
  lines.push("      if (typeof shExpMatch === 'function') return shExpMatch(h, p);");
  lines.push("    }");
  lines.push("    return (h.length > p.length && h.charCodeAt(h.length - p.length - 1) === 46 && h.slice(h.length - p.length) === p);");
  lines.push("  }");
  lines.push("");

  if (localBypass) {
    lines.push("  if (isPlain(host) || host === 'localhost' || host === '127.0.0.1' || host === '::1' || host === '0.0.0.0' ||");
    lines.push("      /^(127\\.|10\\.|192\\.168\\.|169\\.254\\.|172\\.(1[6-9]|2\\d|3[01])\\.)/.test(host) ||");
    lines.push("      /^(::1|fe80:|fc|fd)/i.test(host) ||");
    lines.push("      /\\.(local|lan|home|internal|localhost)$/.test(host)) {");
    lines.push("    return 'DIRECT';");
    lines.push("  }");
  }

  // Custom per-domain server routing (evaluated first so specific domains take precedence over general bypasses)
  var dRoutes = cfg.domainRoutes || {};
  var usPort = cfg.usProxyPort || 10820;
  var usHttpPort = cfg.usHttpPort || 10821;
  var usDirective = "SOCKS5 127.0.0.1:" + usPort + "; SOCKS 127.0.0.1:" + usPort + "; PROXY 127.0.0.1:" + usHttpPort + "; " + proxyDirective;
  var routeEntries = [];
  var seenDoms = new Set();

  for (var domKey in dRoutes) {
    if (!Object.prototype.hasOwnProperty.call(dRoutes, domKey)) continue;
    var sid = dRoutes[domKey];
    var cDom = cleanDomainForPac(domKey);
    if (!cDom || seenDoms.has(cDom)) continue;
    seenDoms.add(cDom);

    var targetDirective;
    if (sid === "direct") {
      targetDirective = "DIRECT";
    } else {
      var isUs = (sid === cfg.geminiServerId) ||
        (cfg.servers || []).some(function(s) {
          return s.id === sid && (s.flag === "🇺🇸" || (s.name && (s.name.indexOf("USA") !== -1 || s.name.indexOf("US ") !== -1)));
        });
      targetDirective = isUs ? usDirective : proxyDirective;
    }
    routeEntries.push([cDom, targetDirective]);
  }

  // Sort by domain length descending: subdomains (e.g. gemini.google.com) evaluate before parents (google.com)
  routeEntries.sort(function(a, b) {
    return b[0].length - a[0].length;
  });

  if (routeEntries.length > 0) {
    lines.push("  var dRoutes = " + JSON.stringify(routeEntries) + ";");
    lines.push("  for (var d = 0; d < dRoutes.length; d++) {");
    lines.push("    if (matchHost(host, dRoutes[d][0])) return dRoutes[d][1];");
    lines.push("  }");
  }

  // YouTube Zapret bypass vs VPN routing
  lines.push("  var yt = " + JSON.stringify(ytDomains) + ";");
  lines.push("  for (var i = 0; i < yt.length; i++) {");
  if (youtubeDirect) {
    lines.push("    if (matchHost(host, yt[i])) return 'DIRECT';");
  } else {
    lines.push("    if (matchHost(host, yt[i])) return '" + proxyDirective + "';");
  }
  lines.push("  }");

  // Bypass domains (Russian banking, government, user direct list)
  if (cleanBp.length > 0) {
    lines.push("  var bp = " + JSON.stringify(cleanBp) + ";");
    lines.push("  for (var j = 0; j < bp.length; j++) {");
    lines.push("    if (matchHost(host, bp[j])) return 'DIRECT';");
    lines.push("  }");
  }

  // All traffic mode vs Smart PAC mode
  if (mode === "all") {
    lines.push("  return '" + proxyDirective + "';");
  } else {
    lines.push("  var px = " + JSON.stringify(cleanPx) + ";");
    lines.push("  for (var k = 0; k < px.length; k++) {");
    lines.push("    if (matchHost(host, px[k])) return '" + proxyDirective + "';");
    lines.push("  }");
    lines.push("  return 'DIRECT';");
  }

  lines.push("}");
  return lines.join("\n");
}

function updateBadge(cfg) {
  if (!chrome.action) return;
  if (!cfg.enabled || cfg.mode === "direct") {
    chrome.action.setBadgeText({ text: "OFF" });
    chrome.action.setBadgeBackgroundColor({ color: "#64748b" });
  } else if (cfg.mode === "all") {
    chrome.action.setBadgeText({ text: "ALL" });
    chrome.action.setBadgeBackgroundColor({ color: "#3b82f6" });
  } else {
    chrome.action.setBadgeText({ text: "PAC" });
    chrome.action.setBadgeBackgroundColor({ color: "#10b981" });
  }
}

let isApplyingProxy = false;
async function applyProxySettings() {
  if (isApplyingProxy) return;
  isApplyingProxy = true;
  try {
    const data = await chrome.storage.local.get("config");
    let cfg = data.config ? { ...DEFAULT_CONFIG, ...data.config } : DEFAULT_CONFIG;

    if (typeof DEFAULT_CONFIG !== "undefined" && DEFAULT_CONFIG.proxyDomains) {
      const currentList = new Set(cfg.proxyDomains || []);
      const bypassList = new Set(cfg.bypassDomains || []);
      let updated = false;
      for (const d of DEFAULT_CONFIG.proxyDomains) {
        if (!currentList.has(d) && !bypassList.has(d)) {
          currentList.add(d);
          updated = true;
        }
      }
      if (updated) {
        cfg.proxyDomains = Array.from(currentList);
        await chrome.storage.local.set({ config: cfg });
      }
    }

    const isFirefox = typeof browser !== "undefined" && browser.runtime && browser.runtime.getURL("").startsWith("moz-extension://");
    const pacCode = generatePacScript(cfg);

    if (isFirefox) {
      if (!cfg.enabled || cfg.mode === "direct") {
        try {
          await browser.proxy.settings.set({ value: { proxyType: "none" } });
        } catch(e) {
          console.error("West VPN: failed to disable Firefox proxy:", e);
        }
      } else {
        const b64Pac = safeEncodeB64Utf8(pacCode);
        try {
          await browser.proxy.settings.set({
            value: {
              proxyType: "autoConfig",
              autoConfigUrl: "data:application/x-ns-proxy-autoconfig;base64," + b64Pac
            }
          });
        } catch(e) {
          console.error("West VPN: failed to set Firefox autoConfig:", e);
        }
      }
      updateBadge(cfg);
    } else {
      if (!chrome.proxy || !chrome.proxy.settings) {
        updateBadge(cfg);
        return;
      }
      if (!cfg.enabled) {
        chrome.proxy.settings.clear({ scope: "regular" }, () => {
          if (chrome.runtime.lastError) console.warn("Chrome proxy clear warning:", chrome.runtime.lastError.message);
          updateBadge(cfg);
        });
        return;
      }
      if (cfg.mode === "direct") {
        chrome.proxy.settings.set({ value: { mode: "direct" }, scope: "regular" }, () => {
          if (chrome.runtime.lastError) console.warn("Chrome proxy set direct warning:", chrome.runtime.lastError.message);
          updateBadge(cfg);
        });
        return;
      }
      chrome.proxy.settings.set({
        value: {
          mode: "pac_script",
          pacScript: { data: pacCode }
        },
        scope: "regular"
      }, () => {
        if (chrome.runtime.lastError) console.warn("Chrome proxy set pac warning:", chrome.runtime.lastError.message);
        updateBadge(cfg);
      });
      if (cfg.domainRoutes) {
        syncDomainRoutesToBackend(cfg.domainRoutes);
      }
    }
  } catch (err) {
    console.error("Failed to apply proxy settings:", err);
  } finally {
    isApplyingProxy = false;
  }
}

async function setupSubscriptionRule(urlStr) {
  if (!chrome.declarativeNetRequest || !urlStr || !urlStr.startsWith("http")) return;
  try {
    const domain = new URL(urlStr).hostname;
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1001],
      addRules: [{
        id: 1001,
        priority: 1,
        action: {
          type: "modifyHeaders",
          requestHeaders: [
            { header: "user-agent", operation: "set", value: "v2rayNG/1.8.5" }
          ]
        },
        condition: {
          urlFilter: `*://${domain}*`
        }
      }]
    });
  } catch(e) {}
}

async function syncServersToBackend(servers) {
  if (!servers || !servers.length) return;
  try {
    await fetch("http://127.0.0.1:10850/sync_servers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ servers })
    });
  } catch(e) {}
}

async function syncDomainRoutesToBackend(domainRoutes) {
  try {
    await fetch("http://127.0.0.1:10850/set_domain_routes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domainRoutes: domainRoutes || {} })
    });
  } catch(e) {}
}

let serviceOnline = false;
let serviceReconnecting = false;

async function checkServiceHealthAndSync() {
  try {
    const res = await fetch("http://127.0.0.1:10850/status", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      serviceOnline = !!data.online;
      serviceReconnecting = false;

      // Auto-failover detection: if backend watchdog auto-switched to a new server
      if (data.activeServer && data.activeServer.id) {
        const stored = await chrome.storage.local.get("config");
        const cfg = stored.config || DEFAULT_CONFIG;
        if (!cfg.activeServer || cfg.activeServer.id !== data.activeServer.id) {
          console.log("West VPN: Auto-failover detected, updating active server to:", data.activeServer.name);
          cfg.activeServerId = data.activeServer.id;
          cfg.activeServer = data.activeServer;
          await chrome.storage.local.set({ config: cfg });
          await applyProxySettings();

          try {
            chrome.runtime.sendMessage({
              type: "SERVER_CHANGED",
              server: data.activeServer,
              failoverEvent: data.failoverEvent
            }, () => {
              if (chrome.runtime.lastError) {}
            });
          } catch(e) {}
        }
      }
    } else {
      serviceOnline = false;
      serviceReconnecting = true;
    }
  } catch(err) {
    serviceOnline = false;
    serviceReconnecting = true;
  }
}

setInterval(checkServiceHealthAndSync, 10000);

if (typeof chrome !== "undefined" && chrome.alarms) {
  try {
    chrome.alarms.create("west_service_sync", { periodInMinutes: 0.25 });
    chrome.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === "west_service_sync") {
        checkServiceHealthAndSync();
      }
    });
  } catch(e) {}
}

chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.local.get("config");
  let cfg = DEFAULT_CONFIG;
  if (!existing || !existing.config) {
    await chrome.storage.local.set({ config: DEFAULT_CONFIG });
    await setupSubscriptionRule(DEFAULT_CONFIG.subscriptionUrl);
  } else {
    cfg = existing.config;
    let modified = false;
    if (!cfg.domainRoutes) {
      cfg.domainRoutes = { ...(DEFAULT_CONFIG.domainRoutes || {}) };
      modified = true;
    }
    if (cfg.geminiUsRouting === undefined) {
      cfg.geminiUsRouting = true;
      modified = true;
    }
    const missing = DEFAULT_CONFIG.proxyDomains.filter(d => !cfg.proxyDomains.includes(d) && !(cfg.bypassDomains || []).includes(d));
    if (missing.length > 0) {
      cfg.proxyDomains = [...(cfg.proxyDomains || []), ...missing];
      modified = true;
    }
    if (modified) {
      await chrome.storage.local.set({ config: cfg });
    }
    await setupSubscriptionRule(cfg.subscriptionUrl || DEFAULT_CONFIG.subscriptionUrl);
  }
  await applyProxySettings();
  checkServiceHealthAndSync();
  syncServersToBackend(cfg.servers || DEFAULT_CONFIG.servers);
  syncDomainRoutesToBackend(cfg.domainRoutes || DEFAULT_CONFIG.domainRoutes);
});

chrome.runtime.onStartup.addListener(async () => {
  await applyProxySettings();
  const existing = await chrome.storage.local.get("config");
  const cfg = existing?.config || DEFAULT_CONFIG;
  checkServiceHealthAndSync();
  syncServersToBackend(cfg.servers || DEFAULT_CONFIG.servers);
  syncDomainRoutesToBackend(cfg.domainRoutes || DEFAULT_CONFIG.domainRoutes);
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.config) {
    applyProxySettings();
  }
});

if (chrome.proxy && chrome.proxy.onProxyError) {
  chrome.proxy.onProxyError.addListener((details) => {
    console.warn("West Proxy Error:", details.error);
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "APPLY_PROXY") {
    applyProxySettings().then(() => sendResponse({ success: true }));
    return true;
  }

  if (message.type === "UPDATE_SUB_RULE") {
    setupSubscriptionRule(message.url).then(() => sendResponse({ success: true }));
    return true;
  }

  if (message.type === "SELECT_SERVER") {
    (async () => {
      const server = message.server;
      if (!server) {
        sendResponse({ success: false, error: "Сервер не передан" });
        return;
      }
      try {
        const data = await chrome.storage.local.get("config");
        const cfg = data.config || DEFAULT_CONFIG;
        cfg.activeServerId = server.id;
        cfg.activeServer = server;
        await chrome.storage.local.set({ config: cfg });
        await applyProxySettings();

        // Attempt informing local West core service
        try {
          const res = await fetch("http://127.0.0.1:10850/select_server", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ server: server })
          });
          const resData = await res.json();
          sendResponse({ success: true, coreUpdated: resData.success, message: resData.message });
        } catch(coreErr) {
          sendResponse({ success: true, coreUpdated: false, message: "Сервер выбран в PAC (служба оффлайн)" });
        }
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
    })();
    return true;
  }

  if (message.type === "FETCH_SUBSCRIPTION") {
    (async () => {
      const inputStr = (message.url || "").trim();
      if (!inputStr) {
        sendResponse({ success: false, error: "Пустая ссылка или данные" });
        return;
      }

      // Check if input is directly raw subscription nodes or base64 without http
      if (!inputStr.startsWith("http://") && !inputStr.startsWith("https://")) {
        const parsed = parseSubscriptionText(inputStr);
        if (!parsed.servers || parsed.servers.length === 0) {
          sendResponse({ success: false, error: "Не удалось распознать формат ссылок" });
          return;
        }
        const data = await chrome.storage.local.get("config");
        const cfg = data.config || DEFAULT_CONFIG;
        cfg.servers = parsed.servers;
        cfg.subscriptionInfo = parsed.subInfo || cfg.subscriptionInfo;
        cfg.lastUpdated = Date.now();
        await chrome.storage.local.set({ config: cfg });
        sendResponse({ success: true, count: parsed.servers.length, subInfo: parsed.subInfo });
        return;
      }

      try {
        await setupSubscriptionRule(inputStr);
        let rawText = "";

        // First attempt direct browser fetch
        try {
          const res = await fetch(inputStr, { cache: "no-store" });
          if (res.ok) {
            rawText = await res.text();
          }
        } catch(e) {}

        // Fallback to local python core service if browser fetch failed or was blocked
        if (!rawText) {
          try {
            const fallbackRes = await fetch("http://127.0.0.1:10850/fetch_sub", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url: inputStr })
            });
            const fallbackData = await fallbackRes.json();
            if (fallbackData.success && fallbackData.data) {
              rawText = fallbackData.data;
            }
          } catch(e) {}
        }

        if (!rawText) {
          sendResponse({ success: false, error: "Не удалось загрузить подписку. Проверьте интернет или доступность ссылки." });
          return;
        }

        const parsed = parseSubscriptionText(rawText);
        if (!parsed.servers || parsed.servers.length === 0) {
          sendResponse({ success: false, error: "Не найдено серверов в подписке" });
          return;
        }

        const data = await chrome.storage.local.get("config");
        const cfg = data.config || DEFAULT_CONFIG;
        cfg.subscriptionUrl = inputStr;
        cfg.servers = parsed.servers;
        cfg.subscriptionInfo = parsed.subInfo || cfg.subscriptionInfo;
        cfg.lastUpdated = Date.now();

        // Also ensure the subscription domain is unblocked in proxyDomains
        try {
          const subDomain = new URL(inputStr).hostname;
          if (subDomain && !cfg.proxyDomains.includes(subDomain)) {
            cfg.proxyDomains.push(subDomain);
          }
        } catch(e) {}

        await chrome.storage.local.set({ config: cfg });
        syncServersToBackend(cfg.servers);

        sendResponse({
          success: true,
          count: parsed.servers.length,
          subInfo: parsed.subInfo
        });
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
    })();
    return true;
  }

  if (message.type === "CHECK_CORE") {
    (async () => {
      const startTime = Date.now();
      let statusData = null;
      try {
        const res = await fetch("http://127.0.0.1:10850/status", { cache: "no-store" });
        if (res.ok) {
          statusData = await res.json();
        }
      } catch(e) {}

      const latency = Date.now() - startTime;
      if (statusData && statusData.online) {
        serviceOnline = true;
        serviceReconnecting = false;
        sendResponse({
          online: true,
          reconnecting: false,
          latency: latency,
          xrayRunning: statusData.xrayRunning,
          externalCoreRunning: statusData.externalCoreRunning,
          externalCorePort: statusData.externalCorePort,
          activeServer: statusData.activeServer,
          socksPort: statusData.socksPort,
          watchdogActive: statusData.watchdogActive,
          failoverEvent: statusData.failoverEvent
        });
      } else {
        serviceOnline = false;
        serviceReconnecting = true;
        sendResponse({
          online: false,
          reconnecting: true,
          latency: null,
          error: "Служба West Service переподключается..."
        });
      }
    })();
    return true;
  }

  if (message.type === "PING_SERVERS") {
    (async () => {
      try {
        const res = await fetch("http://127.0.0.1:10850/ping_servers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ servers: message.servers || [] })
        });
        const data = await res.json();
        sendResponse(data);
      } catch(e) {
        sendResponse({ success: false, error: e.message });
      }
    })();
    return true;
  }

  if (message.type === "SET_DOMAIN_ROUTE") {
    (async () => {
      try {
        const data = await chrome.storage.local.get("config");
        const cfg = data.config || DEFAULT_CONFIG;
        if (!cfg.domainRoutes) cfg.domainRoutes = {};
        const domain = cleanDomainForPac(message.domain);
        if (domain) {
          cfg.domainRoutes[domain] = message.serverId;
          if (message.serverId === "direct") {
            if (!cfg.bypassDomains.includes(domain)) cfg.bypassDomains.push(domain);
            cfg.proxyDomains = (cfg.proxyDomains || []).filter(d => d !== domain);
          } else {
            if (!cfg.proxyDomains.includes(domain)) cfg.proxyDomains.push(domain);
            cfg.bypassDomains = (cfg.bypassDomains || []).filter(d => d !== domain);
          }
          await chrome.storage.local.set({ config: cfg });
          await applyProxySettings();
          syncDomainRoutesToBackend(cfg.domainRoutes);
          sendResponse({ success: true });
        } else {
          sendResponse({ success: false, error: "Некорректный домен" });
        }
      } catch(err) {
        sendResponse({ success: false, error: err.message });
      }
    })();
    return true;
  }

  if (message.type === "REMOVE_DOMAIN_ROUTE") {
    (async () => {
      try {
        const data = await chrome.storage.local.get("config");
        const cfg = data.config || DEFAULT_CONFIG;
        if (cfg.domainRoutes && message.domain) {
          const domain = cleanDomainForPac(message.domain);
          delete cfg.domainRoutes[domain];
          await chrome.storage.local.set({ config: cfg });
          await applyProxySettings();
          syncDomainRoutesToBackend(cfg.domainRoutes);
        }
        sendResponse({ success: true });
      } catch(err) {
        sendResponse({ success: false, error: err.message });
      }
    })();
    return true;
  }

  if (message.type === "TOGGLE_GEMINI_US") {
    (async () => {
      try {
        const data = await chrome.storage.local.get("config");
        const cfg = data.config || DEFAULT_CONFIG;
        cfg.geminiUsRouting = !!message.enabled;
        const usSrv = message.serverId || cfg.geminiServerId || (typeof findUsServer === "function" ? findUsServer(cfg.servers || DEFAULT_CONFIG.servers)?.id : null) || "srv_27";
        cfg.geminiServerId = usSrv;
        if (!cfg.domainRoutes) cfg.domainRoutes = {};

        const geminiList = (typeof GEMINI_DOMAINS !== "undefined" && GEMINI_DOMAINS) || [
          "gemini.google.com", "aistudio.google.com", "alkalimakersuite-pa.clients6.google.com",
          "generativelanguage.googleapis.com", "makersuite.google.com", "bard.google.com",
          "deepmind.google", "notebooklm.google.com", "aisandbox-pa.googleapis.com",
          "proactivebackend-pa.googleapis.com", "cloudaicompanion.googleapis.com",
          "tasks.google.com", "tasks.sandbox.google.com", "tasks-pa.clients6.google.com"
        ];

        for (const gd of geminiList) {
          if (cfg.geminiUsRouting) {
            cfg.domainRoutes[gd] = usSrv;
            if (!cfg.proxyDomains.includes(gd)) cfg.proxyDomains.push(gd);
            cfg.bypassDomains = (cfg.bypassDomains || []).filter(d => d !== gd);
          } else {
            delete cfg.domainRoutes[gd];
          }
        }
        await chrome.storage.local.set({ config: cfg });
        await applyProxySettings();
        syncDomainRoutesToBackend(cfg.domainRoutes);
        sendResponse({ success: true, enabled: cfg.geminiUsRouting, serverId: usSrv });
      } catch(err) {
        sendResponse({ success: false, error: err.message });
      }
    })();
    return true;
  }

  if (message.type === "DIAGNOSE") {
    (async () => {
      try {
        const res = await fetch("http://127.0.0.1:10850/diagnose");
        const data = await res.json();
        sendResponse({ success: true, data: data });
      } catch(e) {
        sendResponse({ success: false, error: "Служба West Service не запущена" });
      }
    })();
    return true;
  }
});
