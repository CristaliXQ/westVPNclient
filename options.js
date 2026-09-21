let currentConfig = {};

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
  });
});

function showToast(msg) {
  const t = document.getElementById("toast");
  t.innerText = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2000);
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
    const params = {};
    if (queryStr) {
      const q = new URLSearchParams(queryStr);
      for (const [k, v] of q.entries()) params[k] = v;
    }
    return {
      protocol: "vless",
      name: name || address,
      address,
      port,
      uuid,
      params,
      raw: url
    };
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
    const params = {};
    if (queryStr) {
      const q = new URLSearchParams(queryStr);
      for (const [k, v] of q.entries()) params[k] = v;
    }
    return {
      protocol: "trojan",
      name: name || address,
      address,
      port,
      password,
      params,
      raw: url
    };
  }
  if (url.startsWith("vmess://")) {
    try {
      const b64 = url.slice(8);
      const json = JSON.parse(decodeBase64Utf8(b64));
      return {
        protocol: "vmess",
        name: json.ps || json.add,
        address: json.add,
        port: parseInt(json.port),
        uuid: json.id,
        params: json,
        raw: url
      };
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

async function loadSettings() {
  currentConfig = await chrome.storage.local.get(null);
  document.getElementById("whitelistInput").value = (currentConfig.whitelist || []).join("\n");
  document.getElementById("blacklistInput").value = (currentConfig.blacklist || []).join("\n");
  document.getElementById("subUrlInput").value = currentConfig.subscriptionUrl || "";
  document.getElementById("socksHostInput").value = currentConfig.socksHost || "127.0.0.1";
  document.getElementById("socksPortInput").value = currentConfig.socksPort || 10808;
  document.getElementById("httpPortInput").value = currentConfig.httpPort || 10809;
  document.getElementById("bridgeUrlInput").value = currentConfig.bridgeUrl || "http://127.0.0.1:19090";

  renderServersTable(currentConfig.servers || []);
}

function renderServersTable(servers) {
  const tbody = document.getElementById("serversTableBody");
  tbody.innerHTML = "";
  if (!servers.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#8b949e; padding:16px;">Серверы еще не добавлены</td></tr>`;
    return;
  }
  servers.forEach(s => {
    const tr = document.createElement("tr");
    const isAct = currentConfig.activeServer && currentConfig.activeServer.raw === s.raw;
    tr.innerHTML = `
      <td><strong>${s.name || s.address}</strong></td>
      <td><span class="btn btn-sm">${(s.protocol || "v2ray").toUpperCase()}</span></td>
      <td><code>${s.address}:${s.port}</code></td>
      <td style="color:#00e676">${s.ping ? s.ping + " ms" : "-"}</td>
      <td>
        <button class="btn btn-sm ${isAct ? 'btn-primary' : ''}">
          ${isAct ? "Активен" : "Выбрать"}
        </button>
      </td>
    `;
    tr.querySelector("button").onclick = async () => {
      currentConfig.activeServer = s;
      await chrome.storage.local.set({ activeServer: s });
      renderServersTable(servers);
      showToast(`Выбран: ${s.name || s.address}`);
      try {
        await fetch(`${currentConfig.bridgeUrl}/select_server`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ server: s })
        });
      } catch (e) {}
    };
    tbody.appendChild(tr);
  });
}

function addPreset(inputId, domains) {
  const el = document.getElementById(inputId);
  const current = el.value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  const set = new Set([...current, ...domains]);
  el.value = Array.from(set).join("\n");
}

document.getElementById("presetMedia").onclick = () => addPreset("whitelistInput", ["youtube.com", "googlevideo.com", "ytimg.com", "youtu.be", "discord.com", "discordapp.com", "discord.gg"]);
document.getElementById("presetSocial").onclick = () => addPreset("whitelistInput", ["instagram.com", "cdninstagram.com", "x.com", "twitter.com", "twimg.com", "facebook.com", "threads.net"]);
document.getElementById("presetAi").onclick = () => addPreset("whitelistInput", ["openai.com", "chatgpt.com", "oaistatic.com", "oaiusercontent.com", "anthropic.com", "claude.ai"]);
document.getElementById("presetTorrents").onclick = () => addPreset("whitelistInput", ["rutracker.org", "nnmclub.to", "kinozal.tv", "rutor.info"]);
document.getElementById("presetRuServices").onclick = () => addPreset("blacklistInput", ["gosuslugi.ru", "mos.ru", "nalog.gov.ru", "sberbank.ru", "tbank.ru", "vtb.ru"]);
document.getElementById("presetRuMarkets").onclick = () => addPreset("blacklistInput", ["ozon.ru", "wildberries.ru", "avito.ru", "yandex.ru", "ya.ru", "market.yandex.ru"]);

document.getElementById("saveBtn").onclick = async () => {
  const wl = document.getElementById("whitelistInput").value.split(/\r?\n/).map(s => s.trim().toLowerCase()).filter(Boolean);
  const bl = document.getElementById("blacklistInput").value.split(/\r?\n/).map(s => s.trim().toLowerCase()).filter(Boolean);
  const toSave = {
    whitelist: Array.from(new Set(wl)),
    blacklist: Array.from(new Set(bl)),
    subscriptionUrl: document.getElementById("subUrlInput").value.trim(),
    socksHost: document.getElementById("socksHostInput").value.trim(),
    socksPort: parseInt(document.getElementById("socksPortInput").value) || 10808,
    httpPort: parseInt(document.getElementById("httpPortInput").value) || 10809,
    bridgeUrl: document.getElementById("bridgeUrlInput").value.trim()
  };
  await chrome.storage.local.set(toSave);
  await chrome.runtime.sendMessage({ action: "APPLY_PROXY" });
  showToast("Настройки успешно применены");
};

document.getElementById("importRawBtn").onclick = async () => {
  const text = document.getElementById("rawKeysInput").value;
  const servers = parseSubscriptionText(text);
  if (!servers.length) {
    alert("Ключи не распознаны. Проверьте формат vless:// или vmess://");
    return;
  }
  currentConfig.servers = servers;
  await chrome.storage.local.set({ servers });
  renderServersTable(servers);
  showToast(`Импортировано серверов: ${servers.length}`);
};

document.getElementById("loadSubBtn").onclick = async () => {
  const url = document.getElementById("subUrlInput").value.trim();
  if (!url) return;
  const btn = document.getElementById("loadSubBtn");
  btn.innerText = "Загрузка...";
  try {
    const res = await fetch(url);
    const text = await res.text();
    const servers = parseSubscriptionText(text);
    if (servers.length) {
      currentConfig.servers = servers;
      await chrome.storage.local.set({ servers, subscriptionUrl: url });
      renderServersTable(servers);
      showToast(`Загружено серверов: ${servers.length}`);
    }
  } catch (e) {
    try {
      const res = await fetch(`${document.getElementById("bridgeUrlInput").value}/subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      if (data.servers && data.servers.length) {
        currentConfig.servers = data.servers;
        await chrome.storage.local.set({ servers: data.servers, subscriptionUrl: url });
        renderServersTable(data.servers);
        showToast(`Загружено через Bridge: ${data.servers.length}`);
      }
    } catch (err) {
      alert("Ошибка загрузки. Проверьте соединение.");
    }
  }
  btn.innerText = "Загрузить";
};

document.getElementById("testConnBtn").onclick = async () => {
  const resLabel = document.getElementById("testConnResult");
  resLabel.innerText = "Проверка...";
  try {
    const res = await fetch(`${document.getElementById("bridgeUrlInput").value}/status`);
    if (res.ok) {
      resLabel.innerText = "Bridge доступен! Ядро управляется.";
      resLabel.style.color = "#00e676";
      return;
    }
  } catch (e) {}
  resLabel.innerText = "Bridge не обнаружен. Работает в режиме прямого порта (10808).";
  resLabel.style.color = "#58a6ff";
};

document.getElementById("pingAllBtn").onclick = async () => {
  const bridgeUrl = document.getElementById("bridgeUrlInput").value;
  const btn = document.getElementById("pingAllBtn");
  btn.innerText = "Пингуем...";
  try {
    const res = await fetch(`${bridgeUrl}/ping_servers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ servers: currentConfig.servers || [] })
    });
    const data = await res.json();
    if (data.results) {
      (currentConfig.servers || []).forEach((s, idx) => {
        if (data.results[idx] !== undefined) s.ping = data.results[idx];
      });
      await chrome.storage.local.set({ servers: currentConfig.servers });
      renderServersTable(currentConfig.servers);
    }
  } catch (e) {
    alert("Для пинга серверов запустите West Core (Запустить West.bat).");
  }
  btn.innerText = "Проверить пинг серверов";
};

loadSettings();
