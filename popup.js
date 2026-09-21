let appState = null;
let currentTabHost = "";

function isRegularServer(srv) {
  const n = (srv.name || "").toLowerCase();
  const a = (srv.address || "").toLowerCase();
  return !n.includes("бел") && !n.includes("white") && a !== "daysleft";
}

function extractRootDomain(hostname) {
  if (!hostname) return "";
  const parts = hostname.split(".");
  if (parts.length <= 2) return hostname;
  return parts.slice(-2).join(".");
}

function decodeBase64Utf8(str) {
  str = str.trim().replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder("utf-8").decode(bytes);
}

function parseV2RayUrl(url) {
  url = url.trim();
  if (url.startsWith("vless://")) {
    let rest = url.slice(8);
    let name = "";
    const hashIdx = rest.indexOf("#");
    if (hashIdx !== -1) {
      try {
        name = decodeURIComponent(rest.slice(hashIdx + 1)).trim();
      } catch (e) {
        name = rest.slice(hashIdx + 1).trim();
      }
      rest = rest.slice(0, hashIdx);
    }
    let queryStr = "";
    const qIdx = rest.indexOf("?");
    if (qIdx !== -1) {
      queryStr = rest.slice(qIdx + 1);
      rest = rest.slice(0, qIdx);
    }
    const atIdx = rest.indexOf("@");
    if (atIdx === -1) return null;
    const uuid = rest.slice(0, atIdx);
    const hostPort = rest.slice(atIdx + 1);
    const colonIdx = hostPort.lastIndexOf(":");
    let address = hostPort;
    let port = 443;
    if (colonIdx !== -1) {
      address = hostPort.slice(0, colonIdx);
      port = parseInt(hostPort.slice(colonIdx + 1)) || 443;
    }
    const item = {
      protocol: "vless",
      name: name || address,
      address,
      port,
      uuid,
      params: queryStr ? Object.fromEntries(new URLSearchParams(queryStr).entries()) : {},
      raw: url
    };
    return isRegularServer(item) ? item : null;
  }
  if (url.startsWith("trojan://")) {
    let rest = url.slice(9);
    let name = "";
    const hashIdx = rest.indexOf("#");
    if (hashIdx !== -1) {
      try {
        name = decodeURIComponent(rest.slice(hashIdx + 1)).trim();
      } catch (e) {
        name = rest.slice(hashIdx + 1).trim();
      }
      rest = rest.slice(0, hashIdx);
    }
    let queryStr = "";
    const qIdx = rest.indexOf("?");
    if (qIdx !== -1) {
      queryStr = rest.slice(qIdx + 1);
      rest = rest.slice(0, qIdx);
    }
    const atIdx = rest.indexOf("@");
    if (atIdx === -1) return null;
    const password = rest.slice(0, atIdx);
    const hostPort = rest.slice(atIdx + 1);
    const colonIdx = hostPort.lastIndexOf(":");
    let address = hostPort;
    let port = 443;
    if (colonIdx !== -1) {
      address = hostPort.slice(0, colonIdx);
      port = parseInt(hostPort.slice(colonIdx + 1)) || 443;
    }
    const item = {
      protocol: "trojan",
      name: name || address,
      address,
      port,
      password,
      params: queryStr ? Object.fromEntries(new URLSearchParams(queryStr).entries()) : {},
      raw: url
    };
    return isRegularServer(item) ? item : null;
  }
  if (url.startsWith("vmess://")) {
    try {
      const b64 = url.slice(8);
      const json = JSON.parse(decodeBase64Utf8(b64));
      const item = {
        protocol: "vmess",
        name: json.ps || json.add,
        address: json.add,
        port: parseInt(json.port),
        uuid: json.id,
        params: json,
        raw: url
      };
      return isRegularServer(item) ? item : null;
    } catch (e) {
      return null;
    }
  }
  return null;
}

function parseSubscriptionText(text) {
  let decoded = text.trim();
  try {
    if (!decoded.includes("://")) decoded = decodeBase64Utf8(decoded);
  } catch (e) {}
  const lines = decoded.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const servers = [];
  for (const line of lines) {
    const parsed = parseV2RayUrl(line);
    if (parsed) servers.push(parsed);
  }
  return servers;
}

async function init() {
  appState = await chrome.runtime.sendMessage({ action: "GET_STATE" });
  const GITHUB_DOMAINS = ["github.com", "github.io", "githubassets.com", "githubusercontent.com", "raw.githubusercontent.com", "objects.githubusercontent.com", "api.github.com"];
  const wl = appState.whitelist || [];
  const missing = GITHUB_DOMAINS.filter(d => !wl.includes(d));
  if (missing.length) {
    appState.whitelist = [...wl, ...missing];
    await chrome.storage.local.set({ whitelist: appState.whitelist });
    await chrome.runtime.sendMessage({ action: "APPLY_PROXY" });
  }
  if (!appState.servers || appState.servers.length === 0 || appState.servers.some(s => !isRegularServer(s))) {
    try {
      const resp = await fetch(chrome.runtime.getURL("servers.json"));
      let initial = await resp.json();
      initial = initial.filter(isRegularServer);
      if (initial && initial.length) {
        appState.servers = initial;
        if (!appState.activeServer || !isRegularServer(appState.activeServer)) {
          appState.activeServer = initial[0];
        }
        await chrome.storage.local.set({
          servers: initial,
          activeServer: appState.activeServer,
          subscriptionUrl: "https://xpnetsub.space/sub/FDffPVcmqpN42V4-"
        });
      }
    } catch (e) {}
  }
  renderState();
  initTabDomain();
  checkBridge();
}

function renderState() {
  const isConn = appState.enabled;
  document.getElementById("powerBtn").className = "power-btn" + (isConn ? " active" : "");
  document.getElementById("statusPill").className = "status-pill" + (isConn ? " connected" : "");
  document.getElementById("statusText").innerText = isConn ? "Подключен" : "Отключен";
  document.getElementById("powerHint").innerText = isConn ? "Нажмите для отключения" : "Нажмите для подключения";

  document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.className = "mode-btn" + (btn.dataset.mode === appState.mode ? " active" : "");
  });

  if (appState.activeServer) {
    document.getElementById("serverName").innerText = appState.activeServer.name || appState.activeServer.address;
    const pingPart = appState.activeServer.ping ? ` • ${appState.activeServer.ping}ms` : "";
    document.getElementById("serverSub").innerText = `${appState.activeServer.protocol.toUpperCase()}${pingPart} • ${appState.activeServer.address}`;
  } else {
    document.getElementById("serverName").innerText = "Локальный порт 10808 (West Core)";
    document.getElementById("serverSub").innerText = `SOCKS5 ${appState.socksHost}:${appState.socksPort}`;
  }

  updateDomainCard();
}

async function initTabDomain() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.url || !tab.url.startsWith("http")) {
    document.getElementById("domainCard").style.display = "none";
    return;
  }
  const u = new URL(tab.url);
  currentTabHost = u.hostname;
  document.getElementById("currentDomain").innerText = currentTabHost;
  updateDomainCard();
}

function updateDomainCard() {
  if (!currentTabHost) return;
  const list = appState.mode === "blacklist" ? appState.blacklist : appState.whitelist;
  const exists = list.some(d => currentTabHost === d || currentTabHost.endsWith("." + d));
  const btn = document.getElementById("domainActionBtn");

  if (exists) {
    btn.innerText = "Удалить из списка";
    btn.className = "domain-action-btn remove";
  } else {
    btn.innerText = appState.mode === "blacklist" ? "+ В исключения" : "+ В список VPN";
    btn.className = "domain-action-btn";
  }
}

async function checkBridge() {
  const ind = document.getElementById("bridgeIndicator");
  const txt = document.getElementById("bridgeText");
  try {
    const res = await fetch(`${appState.bridgeUrl}/status`, { signal: AbortSignal.timeout(1200) });
    if (res.ok) {
      const data = await res.json();
      ind.querySelector(".bridge-dot").className = "bridge-dot active";
      txt.innerText = data.xray_running ? "Ядро активно" : "Bridge онлайн";
      const valid = (data.servers || []).filter(isRegularServer);
      if (valid.length && (!appState.servers || !appState.servers.length)) {
        appState.servers = valid;
        chrome.storage.local.set({ servers: valid });
      }
      return;
    }
  } catch (e) {}

  ind.querySelector(".bridge-dot").className = "bridge-dot direct";
  txt.innerText = `SOCKS5: ${appState.socksPort}`;
}

document.getElementById("powerBtn").addEventListener("click", async () => {
  const res = await chrome.runtime.sendMessage({ action: "TOGGLE" });
  appState.enabled = res.enabled;
  renderState();
});

document.querySelectorAll(".mode-btn").forEach(btn => {
  btn.addEventListener("click", async () => {
    appState.mode = btn.dataset.mode;
    await chrome.storage.local.set({ mode: appState.mode });
    await chrome.runtime.sendMessage({ action: "APPLY_PROXY" });
    renderState();
  });
});

document.getElementById("domainActionBtn").addEventListener("click", async () => {
  if (!currentTabHost) return;
  const key = appState.mode === "blacklist" ? "blacklist" : "whitelist";
  const list = [...appState[key]];
  const root = extractRootDomain(currentTabHost);
  const idx = list.findIndex(d => currentTabHost === d || currentTabHost.endsWith("." + d));

  if (idx !== -1) {
    list.splice(idx, 1);
  } else {
    list.push(root);
  }

  appState[key] = list;
  await chrome.storage.local.set({ [key]: list });
  await chrome.runtime.sendMessage({ action: "APPLY_PROXY" });
  updateDomainCard();
});

document.getElementById("serverCard").addEventListener("click", () => {
  renderServerList();
  document.getElementById("serverModal").classList.add("open");
});

document.getElementById("modalClose").addEventListener("click", () => {
  document.getElementById("serverModal").classList.remove("open");
});

document.getElementById("serverSearch").addEventListener("input", (e) => {
  renderServerList(e.target.value.toLowerCase());
});

document.getElementById("pingModalBtn").addEventListener("click", async () => {
  const btn = document.getElementById("pingModalBtn");
  btn.innerText = "⏳...";
  try {
    const res = await fetch(`${appState.bridgeUrl}/ping_servers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ servers: appState.servers })
    });
    const data = await res.json();
    if (data.results) {
      appState.servers.forEach((s, idx) => {
        if (data.results[idx] !== undefined && data.results[idx] > 0) {
          s.ping = data.results[idx];
        }
      });
      appState.servers.sort((a, b) => (a.ping || 9999) - (b.ping || 9999));
      await chrome.storage.local.set({ servers: appState.servers });
      renderServerList();
    }
  } catch (e) {
    alert("Для точного пинга запустите West Core (Start_West.bat).");
  }
  btn.innerText = "⚡ Тест пинга";
});

function renderServerList(filter = "") {
  const container = document.getElementById("serverList");
  container.innerHTML = "";

  const autoItem = document.createElement("div");
  autoItem.className = "server-item" + (appState.activeServer && appState.activeServer.isAuto ? " selected" : "");
  autoItem.innerHTML = `
    <div class="server-item-left">
      <span>⚡</span>
      <div class="server-item-title">Автоподбор (Лучшая страна)</div>
      <span class="server-item-badge" style="background:#00e5ff;color:#0b0e14">AUTO</span>
    </div>
  `;
  autoItem.onclick = async () => {
    appState.enabled = true;
    try {
      const res = await fetch(`${appState.bridgeUrl}/auto_select`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ servers: appState.servers })
      });
      const data = await res.json();
      if (data.server) {
        data.server.isAuto = true;
        appState.activeServer = data.server;
        await chrome.storage.local.set({ activeServer: data.server, enabled: true });
        await chrome.runtime.sendMessage({ action: "APPLY_PROXY" });
        document.getElementById("serverModal").classList.remove("open");
        renderState();
        return;
      }
    } catch (e) {}

    const first = (appState.servers && appState.servers[0]) ? { ...appState.servers[0], isAuto: true } : null;
    appState.activeServer = first;
    await chrome.storage.local.set({ activeServer: first, enabled: true });
    await chrome.runtime.sendMessage({ action: "APPLY_PROXY" });
    document.getElementById("serverModal").classList.remove("open");
    renderState();
  };
  container.appendChild(autoItem);

  const defaultItem = document.createElement("div");
  defaultItem.className = "server-item" + (!appState.activeServer ? " selected" : "");
  defaultItem.innerHTML = `
    <div class="server-item-left">
      <span>⚙️</span>
      <div class="server-item-title">Прямой порт 10808 (West Core)</div>
      <span class="server-item-badge">DIRECT</span>
    </div>
  `;
  defaultItem.onclick = async () => {
    appState.activeServer = null;
    appState.enabled = true;
    await chrome.storage.local.set({ activeServer: null, enabled: true });
    await chrome.runtime.sendMessage({ action: "APPLY_PROXY" });
    document.getElementById("serverModal").classList.remove("open");
    renderState();
  };
  container.appendChild(defaultItem);

  const servers = (appState.servers || []).filter(isRegularServer);
  document.getElementById("modalTitle").innerText = `Доступные серверы (${servers.length})`;
  servers.forEach((srv) => {
    if (filter && !srv.name.toLowerCase().includes(filter) && !srv.address.toLowerCase().includes(filter)) return;
    const item = document.createElement("div");
    const isSel = appState.activeServer && !appState.activeServer.isAuto && appState.activeServer.raw === srv.raw;
    item.className = "server-item" + (isSel ? " selected" : "");
    const pingVal = srv.ping ? srv.ping : null;
    let pingColor = "#00e676";
    if (pingVal && pingVal > 130) pingColor = "#ff9800";
    else if (pingVal && pingVal > 60) pingColor = "#ffeb3b";

    item.innerHTML = `
      <div class="server-item-left">
        <span>🌐</span>
        <div class="server-item-title">${srv.name || srv.address}</div>
        <span class="server-item-badge">${(srv.protocol || "v2ray").toUpperCase()}</span>
      </div>
      ${pingVal ? `<span class="server-ping" style="color:${pingColor}">${pingVal}ms</span>` : ""}
    `;
    item.onclick = async () => {
      srv.isAuto = false;
      appState.activeServer = srv;
      appState.enabled = true;
      await chrome.storage.local.set({ activeServer: srv, enabled: true });
      await chrome.runtime.sendMessage({ action: "APPLY_PROXY" });
      document.getElementById("serverModal").classList.remove("open");
      renderState();

      try {
        await fetch(`${appState.bridgeUrl}/select_server`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ server: srv })
        });
      } catch (e) {}
    };
    container.appendChild(item);
  });
}

document.getElementById("reloadExtBtn").addEventListener("click", () => {
  chrome.runtime.reload();
});

document.getElementById("refreshSubBtn").addEventListener("click", async () => {
  const btn = document.getElementById("refreshSubBtn");
  btn.style.opacity = "0.5";
  try {
    const res = await fetch(appState.subscriptionUrl || "https://xpnetsub.space/sub/FDffPVcmqpN42V4-");
    const text = await res.text();
    let servers = parseSubscriptionText(text);
    servers = servers.filter(isRegularServer);
    if (servers.length) {
      appState.servers = servers;
      if (!appState.activeServer || !isRegularServer(appState.activeServer)) appState.activeServer = servers[0];
      await chrome.storage.local.set({ servers, activeServer: appState.activeServer });
      alert(`Успешно обновлено! Загружено обычных серверов: ${servers.length}`);
    }
  } catch (e) {
    try {
      const res = await fetch(`${appState.bridgeUrl}/subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: appState.subscriptionUrl || "https://xpnetsub.space/sub/FDffPVcmqpN42V4-" })
      });
      const data = await res.json();
      const valid = (data.servers || []).filter(isRegularServer);
      if (valid.length) {
        appState.servers = valid;
        if (!appState.activeServer || !isRegularServer(appState.activeServer)) appState.activeServer = valid[0];
        await chrome.storage.local.set({ servers: valid, activeServer: appState.activeServer });
        alert(`Обновлено через Bridge! Обычных серверов: ${valid.length}`);
      }
    } catch (err) {
      alert("Не удалось загрузить подписку через сеть. Проверьте соединение.");
    }
  }
  btn.style.opacity = "1";
  renderState();
});

document.getElementById("settingsBtn").addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

init();
