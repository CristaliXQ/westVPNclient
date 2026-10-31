let appConfig = null;
let currentTabDomain = "";
let currentDomainSubTab = "proxy";
let serverPings = {};

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

async function saveConfig() {
  await chrome.storage.local.set({ config: appConfig });
  chrome.runtime.sendMessage({ type: "APPLY_PROXY" }, () => {
    if (chrome.runtime.lastError) {}
  });
}

function updateBadgeAndUI() {
  const modeBadge = document.getElementById("modeBadge");
  const masterToggle = document.getElementById("masterToggle");
  const coreStatusText = document.getElementById("coreStatusText");
  const activeHeader = document.getElementById("activeServerHeader");
  const activeFlag = document.getElementById("activeServerFlag");
  const activePing = document.getElementById("activeServerPing");

  if (masterToggle) masterToggle.checked = appConfig.enabled;

  document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.mode === appConfig.mode);
  });

  if (!appConfig.enabled || appConfig.mode === "direct") {
    if (modeBadge) {
      modeBadge.textContent = "OFF";
      modeBadge.className = "badge";
    }
  } else if (appConfig.mode === "all") {
    if (modeBadge) {
      modeBadge.textContent = "ALL";
      modeBadge.className = "badge on";
    }
  } else {
    if (modeBadge) {
      modeBadge.textContent = "PAC";
      modeBadge.className = "badge on";
    }
  }

  const coreMode = appConfig.coreMode || "auto";
  let coreLabel = `${appConfig.proxyHost || "127.0.0.1"}:${appConfig.proxyPort || 10818} • SOCKS5`;
  if (coreMode === "external") {
    coreLabel = "127.0.0.1:10808 • v2RayTun";
  } else if (coreMode === "auto") {
    coreLabel = `${appConfig.proxyPort || 10818} -> 10808 (Авто)`;
  }
  if (coreStatusText) coreStatusText.textContent = coreLabel;

  const serversBadge = document.getElementById("serversCountBadge");
  if (serversBadge) serversBadge.textContent = (appConfig.servers || []).length;

  const activeSrv = (appConfig.servers || []).find(s => s.id === appConfig.activeServerId) || appConfig.activeServer || (appConfig.servers || [])[0];
  if (activeHeader && activeSrv) {
    const sName = cleanServerName(activeSrv.name);
    activeHeader.textContent = sName || "Подключен";
    if (activeFlag) activeFlag.textContent = activeSrv.flag || extractFlag(activeSrv.name, activeSrv.host);
    const pingVal = serverPings[activeSrv.id];
    if (activePing) {
      activePing.textContent = pingVal ? `${pingVal} ms` : "";
    }
  }
}

function updateCurrentSiteBar() {
  const domainEl = document.getElementById("currentDomain");
  const statusEl = document.getElementById("currentSiteStatus");
  const btnEl = document.getElementById("currentSiteBtn");
  if (!domainEl || !statusEl || !btnEl) return;

  if (!currentTabDomain) {
    domainEl.textContent = "Служебная страница";
    statusEl.textContent = "Direct";
    statusEl.className = "site-status";
    btnEl.style.display = "none";
    return;
  }

  domainEl.textContent = currentTabDomain;
  btnEl.style.display = "inline-flex";

  const isLan = currentTabDomain === "localhost" ||
    currentTabDomain === "127.0.0.1" ||
    currentTabDomain.endsWith(".local") ||
    currentTabDomain.endsWith(".lan") ||
    currentTabDomain.startsWith("192.168.") ||
    currentTabDomain.startsWith("10.");
  if (isLan) {
    statusEl.textContent = "LAN (Direct)";
    statusEl.className = "site-status";
    btnEl.style.display = "none";
    return;
  }

  const isYt = ["youtube.com", "youtu.be", "googlevideo.com", "ytimg.com", "ggpht.com", "gvt1.com", "youtube-nocookie.com", "yt.be", "youtubekids.com", "wide-youtube.l.google.com", "jnn-pa.googleapis.com"].some(
    d => currentTabDomain === d || currentTabDomain.endsWith("." + d)
  );

  if (isYt) {
    if (appConfig.youtubeDirect !== false) {
      statusEl.textContent = "Zapret (Direct)";
      statusEl.className = "site-status";
      statusEl.style.color = "#00bcd4";
      statusEl.style.borderColor = "#00bcd4";
      btnEl.textContent = "В VPN";
      btnEl.onclick = async () => {
        appConfig.youtubeDirect = false;
        if (!appConfig.proxyDomains.includes(currentTabDomain)) {
          appConfig.proxyDomains.push(currentTabDomain);
        }
        appConfig.bypassDomains = (appConfig.bypassDomains || []).filter(
          d => d !== currentTabDomain && !currentTabDomain.endsWith("." + d)
        );
        await saveConfig();
        renderAll();
        showToast("YouTube переключен в VPN");
      };
    } else {
      statusEl.textContent = "В VPN";
      statusEl.className = "site-status proxy";
      statusEl.style.color = "";
      statusEl.style.borderColor = "";
      btnEl.textContent = "В Direct";
      btnEl.onclick = async () => {
        appConfig.youtubeDirect = true;
        await saveConfig();
        renderAll();
        showToast("YouTube переключен на Zapret (Direct)");
      };
    }
    return;
  }

  const inProxy = (appConfig.proxyDomains || []).some(
    d => currentTabDomain === d || currentTabDomain.endsWith("." + d)
  );
  const inBypass = (appConfig.bypassDomains || []).some(
    d => currentTabDomain === d || currentTabDomain.endsWith("." + d)
  );

  if (inProxy) {
    statusEl.textContent = "В VPN";
    statusEl.className = "site-status proxy";
    statusEl.style.color = "";
    statusEl.style.borderColor = "";
    btnEl.textContent = "В Direct";
    btnEl.onclick = async () => {
      appConfig.proxyDomains = (appConfig.proxyDomains || []).filter(
        d => d !== currentTabDomain && !currentTabDomain.endsWith("." + d)
      );
      if (!appConfig.bypassDomains.includes(currentTabDomain)) {
        appConfig.bypassDomains.push(currentTabDomain);
      }
      await saveConfig();
      renderAll();
      showToast(`${currentTabDomain} исключен в Direct`);
    };
  } else if (inBypass) {
    statusEl.textContent = "В Direct";
    statusEl.className = "site-status";
    statusEl.style.color = "";
    statusEl.style.borderColor = "";
    btnEl.textContent = "В VPN";
    btnEl.onclick = async () => {
      appConfig.bypassDomains = (appConfig.bypassDomains || []).filter(
        d => d !== currentTabDomain && !currentTabDomain.endsWith("." + d)
      );
      if (!appConfig.proxyDomains.includes(currentTabDomain)) {
        appConfig.proxyDomains.push(currentTabDomain);
      }
      await saveConfig();
      renderAll();
      showToast(`${currentTabDomain} переключен в VPN`);
    };
  } else {
    if (appConfig.mode === "all") {
      statusEl.textContent = "В VPN (Все)";
      statusEl.className = "site-status proxy";
      btnEl.textContent = "В Direct";
      btnEl.onclick = async () => {
        if (!appConfig.bypassDomains.includes(currentTabDomain)) {
          appConfig.bypassDomains.push(currentTabDomain);
        }
        await saveConfig();
        renderAll();
        showToast(`${currentTabDomain} добавлен в исключения`);
      };
    } else {
      statusEl.textContent = "Direct (По умолчанию)";
      statusEl.className = "site-status";
      btnEl.textContent = "В VPN";
      btnEl.onclick = async () => {
        if (!appConfig.proxyDomains.includes(currentTabDomain)) {
          appConfig.proxyDomains.push(currentTabDomain);
        }
        await saveConfig();
        renderAll();
        showToast(`${currentTabDomain} добавлен в VPN`);
      };
    }
  }
}

async function selectServer(server) {
  if (!server) return;
  appConfig.activeServerId = server.id;
  appConfig.activeServer = server;
  renderAll();

  const cleanName = cleanServerName(server.name);
  showToast(`Подключение: ${cleanName}...`);

  chrome.runtime.sendMessage({ type: "SELECT_SERVER", server: server }, (res) => {
    if (res && res.success) {
      if (res.coreUpdated) {
        showToast(`✔ Активен: ${cleanName}`);
      } else if (res.message && res.message !== "OK") {
        showToast(`⚠️ ${res.message}`);
      } else {
        showToast(`✔ Выбран в PAC (${cleanName})`);
      }
    } else {
      showToast(`Ошибка: ${res ? (res.error || res.message) : "Таймаут"}`);
    }
  });
}

function renderServersList() {
  const container = document.getElementById("serversListContainer");
  if (!container) return;
  const search = (document.getElementById("serverSearchInput")?.value || "").trim().toLowerCase();
  const servers = appConfig.servers || [];
  const filtered = search
    ? servers.filter(s => s.name.toLowerCase().includes(search) || (s.proto && s.proto.includes(search)) || (s.sni && s.sni.includes(search)) || (s.host && s.host.includes(search)))
    : servers;

  container.innerHTML = "";
  const statusTxt = document.getElementById("subStatusText");
  if (statusTxt) statusTxt.textContent = appConfig.subscriptionInfo || "Подписка активна";

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:20px; color:#666;">${search ? "Серверов не найдено" : "Нет серверов"}</div>`;
    return;
  }

  filtered.forEach(server => {
    const card = document.createElement("div");
    const isActive = server.id === appConfig.activeServerId || (appConfig.activeServer && appConfig.activeServer.id === server.id);
    card.className = "server-card" + (isActive ? " active" : "");

    const proto = (server.proto || "vless").toLowerCase();
    const cleanName = cleanServerName(server.name);
    const flag = server.flag || extractFlag(server.name, server.host);

    const pingVal = serverPings[server.id];
    let pingHtml = `<span class="ping-pill none">-- ms</span>`;
    if (pingVal !== undefined) {
      if (pingVal === null) {
        pingHtml = `<span class="ping-pill slow">✕ Оффлайн</span>`;
      } else if (pingVal < 60) {
        pingHtml = `<span class="ping-pill fast">⚡ ${pingVal} ms</span>`;
      } else if (pingVal < 150) {
        pingHtml = `<span class="ping-pill medium">⚡ ${pingVal} ms</span>`;
      } else {
        pingHtml = `<span class="ping-pill slow">⚡ ${pingVal} ms</span>`;
      }
    }

    card.innerHTML = `
      <div class="server-header">
        <div class="server-title-box">
          <span class="server-flag">${flag}</span>
          <span class="server-title" title="${server.name}">${cleanName || 'Server'}</span>
        </div>
        <span class="proto-badge">${proto}</span>
      </div>
      <div class="server-details">
        <span>${server.host}:${server.port}</span>
        <span>SNI: ${server.sni || "-"}</span>
      </div>
      <div class="server-bottom-row">
        <div>${pingHtml}</div>
        <div style="display:flex; gap:6px;">
          ${isActive ? '<button class="btn btn-xs btn-accent btn-select" disabled>✔ Активен</button>' : '<button class="btn btn-xs btn-primary btn-select">Подключить</button>'}
          <button class="btn btn-xs btn-outline btn-copy" title="Копировать ключ">📋</button>
        </div>
      </div>
    `;

    const selectAction = (e) => {
      e.stopPropagation();
      if (!isActive) selectServer(server);
    };

    card.onclick = selectAction;
    const btnSelect = card.querySelector(".btn-select");
    if (btnSelect) btnSelect.onclick = selectAction;

    card.querySelector(".btn-copy").onclick = async (e) => {
      e.stopPropagation();
      try {
        await navigator.clipboard.writeText(server.raw);
        showToast("Конфигурация скопирована!");
      } catch (err) {
        showToast("Ошибка копирования");
      }
    };

    container.appendChild(card);
  });
}

function renderDomainList() {
  const container = document.getElementById("domainListContainer");
  if (!container) return;
  const search = (document.getElementById("domainSearchInput")?.value || "").trim().toLowerCase();
  const isProxy = currentDomainSubTab === "proxy";

  const pCount = document.getElementById("proxyCount");
  const bCount = document.getElementById("bypassCount");
  if (pCount) pCount.textContent = (appConfig.proxyDomains || []).length;
  if (bCount) bCount.textContent = (appConfig.bypassDomains || []).length;
  
  document.getElementById("subTabProxy")?.classList.toggle("active", isProxy);
  document.getElementById("subTabBypass")?.classList.toggle("active", !isProxy);

  const list = isProxy ? (appConfig.proxyDomains || []) : (appConfig.bypassDomains || []);
  const filtered = search ? list.filter(d => d.includes(search)) : list;

  container.innerHTML = "";
  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:20px; color:#666;">${search ? "Ничего не найдено" : "Список пуст"}</div>`;
    return;
  }

  filtered.forEach(domain => {
    const row = document.createElement("div");
    row.className = "domain-item";
    row.innerHTML = `
      <span class="domain-text">${domain}</span>
      <button class="btn-remove" title="Удалить">×</button>
    `;

    row.querySelector(".btn-remove").onclick = async () => {
      if (isProxy) {
        appConfig.proxyDomains = appConfig.proxyDomains.filter(d => d !== domain);
      } else {
        appConfig.bypassDomains = appConfig.bypassDomains.filter(d => d !== domain);
      }
      await saveConfig();
      renderAll();
      showToast(`Домен удален`);
    };

    container.appendChild(row);
  });
}

function renderDiagnostics(data) {
  const srvCard = document.getElementById("diagServiceStatus");
  const xrayCard = document.getElementById("diagXrayStatus");
  const extCard = document.getElementById("diagExternalStatus");
  const serverCard = document.getElementById("diagServerStatus");
  const recsBox = document.getElementById("diagRecsBox");
  const logsBox = document.getElementById("diagLogsBox");

  if (!data) {
    if (srvCard) { srvCard.textContent = "Не отвечает"; srvCard.className = "diag-card-status bad"; }
    if (xrayCard) { xrayCard.textContent = "Остановлен"; xrayCard.className = "diag-card-status bad"; }
    if (recsBox) {
      recsBox.innerHTML = `
        <div style="color:#ef4444; font-weight:600; margin-bottom:4px;">Служба ядра West Service не запущена!</div>
        <div>1. Запустите файл <code>start_service.vbs</code> или <code>start_service.bat</code> в папке проекта.</div>
        <div>2. Если запущен v2RayTun, расширение автоматически переключится на его порт 10808.</div>
      `;
    }
    return;
  }

  if (srvCard) {
    srvCard.textContent = "Работает (порт 10850)";
    srvCard.className = "diag-card-status ok";
  }

  if (xrayCard) {
    if (data.xrayCore && data.xrayCore.running) {
      xrayCard.textContent = `Активен (PID ${data.xrayCore.pid || "-"})`;
      xrayCard.className = "diag-card-status ok";
    } else {
      xrayCard.textContent = "Остановлен";
      xrayCard.className = "diag-card-status bad";
    }
  }

  if (extCard) {
    if (data.externalCore && data.externalCore.running) {
      extCard.textContent = `Обнаружен (порт ${data.externalCore.port})`;
      extCard.className = "diag-card-status ok";
    } else {
      extCard.textContent = "Не обнаружен";
      extCard.className = "diag-card-status warn";
    }
  }

  if (serverCard) {
    if (data.activeServer && data.activeServer.reachable) {
      serverCard.textContent = `Доступен (${data.activeServer.ping} ms)`;
      serverCard.className = "diag-card-status ok";
    } else if (data.activeServer && data.activeServer.server) {
      serverCard.textContent = "Таймаут (Не отвечает)";
      serverCard.className = "diag-card-status bad";
    } else {
      serverCard.textContent = "Не выбран";
      serverCard.className = "diag-card-status warn";
    }
  }

  if (recsBox && data.recommendations) {
    recsBox.innerHTML = data.recommendations.map((r, i) => `<div>${i + 1}. ${r}</div>`).join("");
  }

  if (logsBox && data.xrayCore && data.xrayCore.logs) {
    logsBox.textContent = data.xrayCore.logs.length > 0 ? data.xrayCore.logs.join("\n") : "Лог пуст (ошибок нет)";
  }
}

function renderSettings() {
  const yt = document.getElementById("ytShieldToggle");
  const lan = document.getElementById("lanShieldToggle");
  const hfb = document.getElementById("httpFallbackToggle");
  const host = document.getElementById("proxyHostInput");
  const port = document.getElementById("proxyPortInput");
  const hport = document.getElementById("httpPortInput");
  const sub = document.getElementById("subUrlInput");
  const coreMode = document.getElementById("coreModeSelect");

  if (yt) yt.checked = appConfig.youtubeDirect !== false;
  if (lan) lan.checked = appConfig.localBypass !== false;
  if (hfb) hfb.checked = appConfig.httpFallback !== false;
  if (host) host.value = appConfig.proxyHost || "127.0.0.1";
  if (port) port.value = appConfig.proxyPort || 10818;
  if (hport) hport.value = appConfig.httpPort || 10819;
  if (sub) sub.value = appConfig.subscriptionUrl || "";
  if (coreMode) coreMode.value = appConfig.coreMode || "auto";
}

function renderAll() {
  updateBadgeAndUI();
  updateCurrentSiteBar();
  renderDomainList();
  renderServersList();
  renderSettings();
}

function setupEventListeners() {
  document.getElementById("masterToggle")?.addEventListener("change", async (e) => {
    appConfig.enabled = e.target.checked;
    await saveConfig();
    updateBadgeAndUI();
  });

  document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.onclick = async () => {
      appConfig.mode = btn.dataset.mode;
      await saveConfig();
      renderAll();
    };
  });

  document.querySelectorAll(".nav-tab").forEach(tab => {
    tab.onclick = () => {
      document.querySelectorAll(".nav-tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
      tab.classList.add("active");
      const targetPane = document.getElementById("tab-" + tab.dataset.tab);
      if (targetPane) targetPane.classList.add("active");

      if (tab.dataset.tab === "diagnostics") {
        document.getElementById("runDiagBtn")?.click();
      }
    };
  });

  document.getElementById("subTabProxy")?.addEventListener("click", () => {
    currentDomainSubTab = "proxy";
    renderDomainList();
  });
  document.getElementById("subTabBypass")?.addEventListener("click", () => {
    currentDomainSubTab = "bypass";
    renderDomainList();
  });

  const addDomainAction = async () => {
    const input = document.getElementById("newDomainInput");
    const rawVal = input?.value.trim();
    if (!rawVal) return;

    const domain = cleanDomain(rawVal);
    if (!domain) {
      showToast("Некорректный домен");
      return;
    }

    const targetType = document.getElementById("domainTargetType")?.value;
    if (targetType === "proxy") {
      if (!appConfig.proxyDomains.includes(domain)) {
        appConfig.proxyDomains.unshift(domain);
      }
      appConfig.bypassDomains = appConfig.bypassDomains.filter(d => d !== domain);
      currentDomainSubTab = "proxy";
      showToast(`Добавлен: ${domain}`);
    } else {
      if (!appConfig.bypassDomains.includes(domain)) {
        appConfig.bypassDomains.unshift(domain);
      }
      appConfig.proxyDomains = appConfig.proxyDomains.filter(d => d !== domain);
      currentDomainSubTab = "bypass";
      showToast(`Добавлен: ${domain}`);
    }

    if (input) input.value = "";
    await saveConfig();
    renderAll();
  };

  document.getElementById("addDomainBtn")?.addEventListener("click", addDomainAction);
  document.getElementById("newDomainInput")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addDomainAction();
  });

  document.getElementById("domainSearchInput")?.addEventListener("input", () => renderDomainList());

  const subUrlInput = document.getElementById("subUrlInput");
  if (subUrlInput) {
    subUrlInput.onchange = async (e) => {
      appConfig.subscriptionUrl = e.target.value.trim();
      await saveConfig();
    };
    subUrlInput.onkeydown = (e) => {
      if (e.key === "Enter") {
        document.getElementById("refreshSubBtn")?.click();
      }
    };
  }

  document.getElementById("refreshSubBtn")?.addEventListener("click", async () => {
    const subUrl = subUrlInput?.value.trim();
    if (!subUrl) {
      showToast("Введите ссылку на подписку");
      return;
    }

    const btn = document.getElementById("refreshSubBtn");
    if (btn) {
      btn.disabled = true;
      btn.textContent = "...";
    }

    chrome.runtime.sendMessage({ type: "FETCH_SUBSCRIPTION", url: subUrl }, async (res) => {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Обновить";
      }

      if (res && res.success) {
        const data = await chrome.storage.local.get("config");
        appConfig = data.config;
        renderAll();
        showToast(`Успешно! Серверов: ${res.count}`);
      } else {
        showToast("Ошибка: " + (res ? res.error : "Таймаут"));
      }
    });
  });

  document.getElementById("serverSearchInput")?.addEventListener("input", () => renderServersList());

  // MIN PING ACTION
  document.getElementById("minPingBtn")?.addEventListener("click", () => {
    const btn = document.getElementById("minPingBtn");
    if (btn) {
      btn.disabled = true;
      btn.textContent = "⚡ Тест...";
    }

    chrome.runtime.sendMessage({
      type: "PING_SERVERS",
      servers: appConfig.servers || []
    }, async (res) => {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "⚡ Мин. пинг";
      }

      if (res && res.success && res.results) {
        serverPings = res.results;
        renderServersList();

        if (res.minPingId) {
          const fastest = (appConfig.servers || []).find(s => s.id === res.minPingId);
          if (fastest) {
            await selectServer(fastest);
            showToast(`Мин. пинг: ${cleanServerName(fastest.name)} (${res.minLatency}ms)`);
          }
        } else {
          showToast("Все узлы оффлайн или блокируются");
        }
      } else {
        showToast("Ошибка проверки связи с ядром");
      }
    });
  });

  // PING ALL ACTION
  document.getElementById("pingAllBtn")?.addEventListener("click", () => {
    const btn = document.getElementById("pingAllBtn");
    if (btn) {
      btn.disabled = true;
      btn.textContent = "...";
    }

    chrome.runtime.sendMessage({
      type: "PING_SERVERS",
      servers: appConfig.servers || []
    }, (res) => {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "🔄 Пинг";
      }

      if (res && res.success && res.results) {
        serverPings = res.results;
        renderServersList();
        showToast("Пинг обновлен");
      } else {
        showToast("Служба ядра не ответила");
      }
    });
  });

  // DIAGNOSTICS ACTION
  document.getElementById("runDiagBtn")?.addEventListener("click", () => {
    const btn = document.getElementById("runDiagBtn");
    if (btn) {
      btn.disabled = true;
      btn.textContent = "...";
    }

    chrome.runtime.sendMessage({ type: "DIAGNOSE" }, (res) => {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Проверить";
      }

      if (res && res.success && res.data) {
        renderDiagnostics(res.data);
      } else {
        renderDiagnostics(null);
      }
    });
  });

  document.getElementById("coreModeSelect")?.addEventListener("change", async (e) => {
    appConfig.coreMode = e.target.value;
    await saveConfig();
    updateBadgeAndUI();
    showToast("Режим ядра сохранен");
  });

  document.getElementById("ytShieldToggle")?.addEventListener("change", async (e) => {
    appConfig.youtubeDirect = e.target.checked;
    await saveConfig();
  });
  document.getElementById("lanShieldToggle")?.addEventListener("change", async (e) => {
    appConfig.localBypass = e.target.checked;
    await saveConfig();
  });
  document.getElementById("httpFallbackToggle")?.addEventListener("change", async (e) => {
    appConfig.httpFallback = e.target.checked;
    await saveConfig();
  });

  document.getElementById("saveCoreSettingsBtn")?.addEventListener("click", async () => {
    appConfig.proxyHost = document.getElementById("proxyHostInput")?.value.trim() || "127.0.0.1";
    appConfig.proxyPort = parseInt(document.getElementById("proxyPortInput")?.value, 10) || 10818;
    appConfig.httpPort = parseInt(document.getElementById("httpPortInput")?.value, 10) || 10819;
    await saveConfig();
    updateBadgeAndUI();
    showToast("Настройки ядра сохранены");
  });
}

async function init() {
  const data = await chrome.storage.local.get("config");
  appConfig = data.config ? { ...DEFAULT_CONFIG, ...data.config } : JSON.parse(JSON.stringify(DEFAULT_CONFIG));

  if (!appConfig.servers || appConfig.servers.length === 0) {
    appConfig.servers = DEFAULT_CONFIG.servers;
  }
  if (!appConfig.activeServer) {
    appConfig.activeServer = appConfig.servers[0];
    appConfig.activeServerId = appConfig.servers[0]?.id;
  }

  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs && tabs[0] && tabs[0].url) {
      currentTabDomain = cleanDomain(tabs[0].url);
    }
  } catch(e) {}

  setupEventListeners();
  renderAll();

  // Listen for auto-failover server changes from background watchdog
  chrome.runtime.onMessage.addListener((message) => {
    if (message && message.type === "SERVER_CHANGED" && message.server) {
      appConfig.activeServerId = message.server.id;
      appConfig.activeServer = message.server;
      renderAll();
      const cleanName = cleanServerName(message.server.name);
      showToast(`⚡ Авто-переключение: ${cleanName}`);
    }
  });

  // Check core service state (clean reconnecting indicator without unhandled errors)
  chrome.runtime.sendMessage({ type: "CHECK_CORE" }, (res) => {
    if (chrome.runtime.lastError) return;
    if (res) {
      if (res.reconnecting) {
        const coreStatusText = document.getElementById("coreStatusText");
        if (coreStatusText) coreStatusText.textContent = "127.0.0.1:10818 • Переподключение...";
      } else if (res.activeServer && res.activeServer.id !== appConfig.activeServerId) {
        appConfig.activeServerId = res.activeServer.id;
        appConfig.activeServer = res.activeServer;
        renderAll();
      }
    }
  });

  // Fast background ping for active server
  if (appConfig.activeServer && appConfig.activeServer.host) {
    fetch("http://127.0.0.1:10850/ping_server", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ host: appConfig.activeServer.host, port: appConfig.activeServer.port || 443 })
    }).then(r => r.json()).then(data => {
      if (data && data.success) {
        serverPings[appConfig.activeServer.id] = data.latency;
        const pingEl = document.getElementById("activeServerPing");
        if (pingEl) pingEl.textContent = `${data.latency} ms`;
      }
    }).catch(() => {});
  }
}

document.addEventListener("DOMContentLoaded", init);
