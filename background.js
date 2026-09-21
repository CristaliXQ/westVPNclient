const DEFAULTS = {
  enabled: false,
  mode: "global",
  whitelist: [
    "x.com",
    "twitter.com",
    "t.co",
    "twimg.com",
    "x.ai",
    "github.com",
    "githubassets.com",
    "githubusercontent.com",
    "youtube.com",
    "googlevideo.com",
    "ytimg.com",
    "youtu.be",
    "instagram.com",
    "cdninstagram.com",
    "rutracker.org",
    "openai.com",
    "chatgpt.com",
    "discord.com",
    "discordapp.com",
    "notion.so"
  ],
  blacklist: [
    "gosuslugi.ru",
    "mos.ru",
    "nalog.gov.ru",
    "rzd.ru",
    "avito.ru",
    "ozon.ru",
    "wildberries.ru",
    "yandex.ru",
    "ya.ru",
    "vk.com",
    "mail.ru",
    "tbank.ru",
    "sberbank.ru"
  ],
  socksHost: "127.0.0.1",
  socksPort: 10808,
  httpPort: 10809,
  bridgeUrl: "http://127.0.0.1:19090",
  activeServer: null,
  servers: [],
  subscriptionUrl: "https://xpnetsub.space/sub/FDffPVcmqpN42V4-"
};

function buildPac(cfg) {
  const proxy = `SOCKS5 ${cfg.socksHost}:${cfg.socksPort}; SOCKS ${cfg.socksHost}:${cfg.socksPort}; PROXY ${cfg.socksHost}:${cfg.httpPort}; DIRECT`;
  const wl = JSON.stringify(cfg.whitelist || []);
  const bl = JSON.stringify(cfg.blacklist || []);

  return `function FindProxyForURL(url, host) {
    if (isPlainHostName(host) || host === "127.0.0.1" || host === "localhost" || host.indexOf(".local") !== -1) return "DIRECT";
    var h = host.toLowerCase();
    var mode = "${cfg.mode}";
    var proxy = "${proxy}";
    function matchDomain(list) {
      for (var i = 0; i < list.length; i++) {
        var d = list[i].toLowerCase();
        if (h === d || h.indexOf("." + d) === (h.length - d.length - 1)) return true;
      }
      return false;
    }
    if (mode === "global") return proxy;
    if (mode === "whitelist") {
      return matchDomain(${wl}) ? proxy : "DIRECT";
    }
    if (mode === "blacklist") {
      return matchDomain(${bl}) ? "DIRECT" : proxy;
    }
    return "DIRECT";
  }`;
}

async function applyProxy() {
  const cfg = await chrome.storage.local.get(DEFAULTS);
  if (!cfg.enabled) {
    await chrome.proxy.settings.set({ value: { mode: "system" }, scope: "regular" });
    chrome.action.setBadgeText({ text: "" });
    return;
  }
  const pac = buildPac(cfg);
  await chrome.proxy.settings.set({
    value: {
      mode: "pac_script",
      pacScript: { data: pac }
    },
    scope: "regular"
  });
  const badgeText = cfg.mode === "global" ? "ALL" : (cfg.mode === "whitelist" ? "WL" : "BL");
  chrome.action.setBadgeText({ text: badgeText });
  chrome.action.setBadgeBackgroundColor({ color: "#00E5FF" });
}

async function ensureData() {
  const current = await chrome.storage.local.get(null);
  const toSet = {};
  for (const k in DEFAULTS) {
    if (current[k] === undefined) toSet[k] = DEFAULTS[k];
  }
  if (!current.servers || current.servers.length === 0) {
    try {
      const resp = await fetch(chrome.runtime.getURL("servers.json"));
      const initial = await resp.json();
      if (initial && initial.length) {
        toSet.servers = initial;
        if (!current.activeServer) toSet.activeServer = initial[0];
      }
    } catch (e) {}
  }
  toSet.subscriptionUrl = "https://xpnetsub.space/sub/FDffPVcmqpN42V4-";
  toSet.mode = current.mode || "global";
  await chrome.storage.local.set(toSet);
  await applyProxy();
}

chrome.runtime.onInstalled.addListener(ensureData);
chrome.runtime.onStartup.addListener(ensureData);

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "APPLY_PROXY") {
    applyProxy().then(() => sendResponse({ ok: true }));
    return true;
  }
  if (msg.action === "GET_STATE") {
    chrome.storage.local.get(DEFAULTS).then(res => sendResponse(res));
    return true;
  }
  if (msg.action === "TOGGLE") {
    chrome.storage.local.get("enabled").then(res => {
      const next = !res.enabled;
      chrome.storage.local.set({ enabled: next }).then(() => {
        applyProxy().then(() => sendResponse({ enabled: next }));
      });
    });
    return true;
  }
});
