let appConfig = null;
let currentTabDomain = "";
let currentDomainSubTab = "dedicated";
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

function getUsServers(servers) {
  const list = servers || [];
  return list.filter(s => {
    const n = (s.name || "").toLowerCase();
    return s.flag === "🇺🇸" || n.includes("usa") || n.includes("us ") || n.includes("united states");
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
  let coreLabel = `${appConfig.proxyPort || 10818} (Main) • ${appConfig.usProxyPort || 10820} (US)`;
  if (coreMode === "external") {
    coreLabel = "127.0.0.1:10808 • v2RayTun";
  } else if (coreMode === "west") {
    coreLabel = `${appConfig.proxyPort || 10818} (Main) • ${appConfig.usProxyPort || 10820} (US)`;
  }
  if (coreStatusText) coreStatusText.textContent = coreLabel;

  const serversBadge = document.getElementById("serversCountBadge");
  if (serversBadge) serversBadge.textContent = (appConfig.servers || []).length;

  const customCount = Object.keys(appConfig.domainRoutes || {}).length;
  const customCountBadge = document.getElementById("domainRulesCountBadge");
  if (customCountBadge) customCountBadge.textContent = customCount;

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
  const siteSelect = document.getElementById("currentSiteServerSelect");
  const geminiBtn = document.getElementById("geminiSiteQuickBtn");
  if (!domainEl || !statusEl || !btnEl) return;

  if (!currentTabDomain) {
    domainEl.textContent = "Служебная вкладка";
    statusEl.textContent = "Direct";
    statusEl.className = "site-status direct";
    btnEl.style.display = "none";
    if (geminiBtn) geminiBtn.style.display = "none";
    if (siteSelect) siteSelect.disabled = true;
    return;
  }

  domainEl.textContent = currentTabDomain;
  btnEl.style.display = "inline-flex";
  if (siteSelect) siteSelect.disabled = false;

  const isLan = currentTabDomain === "localhost" ||
    currentTabDomain === "127.0.0.1" ||
    currentTabDomain.endsWith(".local") ||
    currentTabDomain.endsWith(".lan") ||
    currentTabDomain.startsWith("192.168.") ||
    currentTabDomain.startsWith("10.");
  if (isLan) {
    statusEl.textContent = "LAN (Direct)";
    statusEl.className = "site-status direct";
    btnEl.style.display = "none";
    if (geminiBtn) geminiBtn.style.display = "none";
    return;
  }

  // Populate site dropdown if needed
  populateSiteServerDropdown();

  const isGeminiSite = currentTabDomain.includes("gemini") || currentTabDomain.includes("aistudio") || currentTabDomain.includes("makersuite") || currentTabDomain.includes("bard.google");
  const assignedServerId = (appConfig.domainRoutes || {})[currentTabDomain];

  if (assignedServerId) {
    if (assignedServerId === "direct") {
      statusEl.textContent = "Direct";
      statusEl.className = "site-status direct";
      btnEl.textContent = "В VPN";
    } else {
      const srvObj = (appConfig.servers || []).find(s => s.id === assignedServerId);
      const isUs = srvObj && (srvObj.flag === "🇺🇸" || (srvObj.name && srvObj.name.includes("USA")));
      if (isUs) {
        statusEl.textContent = "🇺🇸 США (Gemini Tasks)";
        statusEl.className = "site-status gemini-us";
      } else {
        statusEl.textContent = `VPN: ${srvObj ? cleanServerName(srvObj.name).slice(0, 16) : 'Выделенный'}`;
        statusEl.className = "site-status proxy";
      }
      btnEl.textContent = "В Direct";
    }
    if (siteSelect) siteSelect.value = assignedServerId;
    if (geminiBtn) geminiBtn.style.display = "none";
    return;
  }

  const isYt = ["youtube.com", "youtu.be", "googlevideo.com", "ytimg.com", "ggpht.com", "gvt1.com", "youtube-nocookie.com", "yt.be", "youtubekids.com", "wide-youtube.l.google.com", "jnn-pa.googleapis.com"].some(
    d => currentTabDomain === d || currentTabDomain.endsWith("." + d)
  );

  if (isYt) {
    if (appConfig.youtubeDirect !== false) {
      statusEl.textContent = "Zapret (Direct)";
      statusEl.className = "site-status direct";
      btnEl.textContent = "В VPN";
      if (siteSelect) siteSelect.value = "direct";
    } else {
      statusEl.textContent = "В VPN";
      statusEl.className = "site-status proxy";
      btnEl.textContent = "В Direct";
      if (siteSelect) siteSelect.value = "default";
    }
    if (geminiBtn) geminiBtn.style.display = "none";
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
    btnEl.textContent = "В Direct";
    if (siteSelect) siteSelect.value = "default";
  } else if (inBypass) {
    statusEl.textContent = "В Direct";
    statusEl.className = "site-status direct";
    btnEl.textContent = "В VPN";
    if (siteSelect) siteSelect.value = "direct";
  } else {
    if (appConfig.mode === "all") {
      statusEl.textContent = "В VPN (Все)";
      statusEl.className = "site-status proxy";
      btnEl.textContent = "В Direct";
      if (siteSelect) siteSelect.value = "default";
    } else {
      statusEl.textContent = "Direct (По умолч.)";
      statusEl.className = "site-status direct";
      btnEl.textContent = "В VPN";
      if (siteSelect) siteSelect.value = "direct";
    }
  }

  if (geminiBtn) {
    geminiBtn.style.display = isGeminiSite ? "inline-flex" : "none";
  }
}

function isLanDomain(d) {
  if (!d) return true;
  return d === "localhost" || d === "127.0.0.1" || d.endsWith(".local") || d.endsWith(".lan") || d.startsWith("192.168.") || d.startsWith("10.");
}

function buildServerOptionsHtml(selectedId, includeDefault = true, includeDirect = true) {
  const servers = appConfig.servers || [];
  const usServers = getUsServers(servers);
  const otherServers = servers.filter(s => !usServers.includes(s));
  let html = "";

  if (includeDefault) {
    html += `<option value="default" ${selectedId === 'default' ? 'selected' : ''}>🌐 Основной VPN (по умолч.)</option>`;
  }
  if (includeDirect) {
    html += `<option value="direct" ${selectedId === 'direct' ? 'selected' : ''}>⚡ Direct (без VPN)</option>`;
  }

  if (usServers.length > 0) {
    html += `<optgroup label="🇺🇸 США (для задач Gemini / AI)">`;
    usServers.forEach(s => {
      html += `<option value="${s.id}" ${selectedId === s.id ? 'selected' : ''}>${s.flag || '🇺🇸'} ${cleanServerName(s.name)}</option>`;
    });
    html += `</optgroup>`;
  }

  if (otherServers.length > 0) {
    html += `<optgroup label="🌍 Все серверы подписки">`;
    otherServers.forEach(s => {
      html += `<option value="${s.id}" ${selectedId === s.id ? 'selected' : ''}>${s.flag || '🌐'} ${cleanServerName(s.name)}</option>`;
    });
    html += `</optgroup>`;
  }

  return html;
}

function populateSiteServerDropdown() {
  const siteSelect = document.getElementById("currentSiteServerSelect");
  if (!siteSelect) return;
  const currentVal = siteSelect.value;
  siteSelect.innerHTML = buildServerOptionsHtml(currentVal, true, true);
  if (currentVal) siteSelect.value = currentVal;
}

function updateGeminiCard() {
  const geminiToggle = document.getElementById("geminiToggle");
  const geminiSelect = document.getElementById("geminiServerSelect");
  const geminiPortTag = document.getElementById("geminiPortTag");
  const settingsGemini = document.getElementById("settingsGeminiToggle");

  if (geminiToggle) geminiToggle.checked = !!appConfig.geminiUsRouting;
  if (settingsGemini) settingsGemini.checked = !!appConfig.geminiUsRouting;
  if (geminiPortTag) geminiPortTag.textContent = `Порт: ${appConfig.usProxyPort || 10820}`;

  if (geminiSelect) {
    const servers = appConfig.servers || [];
    const usServers = getUsServers(servers);
    geminiSelect.innerHTML = "";

    if (usServers.length === 0) {
      const opt = document.createElement("option");
      opt.value = appConfig.activeServerId || "srv_27";
      opt.textContent = "🇺🇸 Авто-поиск США (srv_27)";
      geminiSelect.appendChild(opt);
    } else {
      usServers.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s.id;
        opt.textContent = `${s.flag || '🇺🇸'} ${cleanServerName(s.name)}`;
        if (s.id === appConfig.geminiServerId) opt.selected = true;
        geminiSelect.appendChild(opt);
      });
    }

    if (appConfig.geminiServerId) {
      geminiSelect.value = appConfig.geminiServerId;
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
    const isGeminiUs = server.id === appConfig.geminiServerId;
    card.className = "server-card" + (isActive ? " active" : "") + (isGeminiUs ? " gemini-active" : "");

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

    const isUs = server.flag === "🇺🇸" || (server.name && (server.name.includes("USA") || server.name.includes("US ")));
    const isBoundToCurrentTab = !!currentTabDomain && ((appConfig.domainRoutes || {})[currentTabDomain] === server.id);
    const bindBtnHtml = currentTabDomain && !isLanDomain(currentTabDomain)
      ? `<button class="btn btn-xs ${isBoundToCurrentTab ? 'btn-accent' : 'btn-outline'} btn-bind-site" title="${isBoundToCurrentTab ? 'Сервер назначен для ' + currentTabDomain : 'Привязать этот сервер к сайту ' + currentTabDomain}">${isBoundToCurrentTab ? '🎯 На сайте' : '🎯 На сайт'}</button>`
      : '';

    card.innerHTML = `
      <div class="server-header">
        <div class="server-title-box">
          <span class="server-flag">${flag}</span>
          <span class="server-title" title="${server.name}">${cleanName || 'Server'}</span>
        </div>
        <div style="display:flex; gap:4px; align-items:center;">
          ${isGeminiUs ? '<span class="version-pill" style="border-color:#06b6d4; color:#38bdf8;">Gemini US</span>' : ''}
          <span class="proto-badge">${proto}</span>
        </div>
      </div>
      <div class="server-details">
        <span>${server.host}:${server.port}</span>
        <span>SNI: ${server.sni || "-"}</span>
      </div>
      <div class="server-bottom-row">
        <div>${pingHtml}</div>
        <div style="display:flex; gap:5px; flex-wrap:wrap; justify-content:flex-end;">
          ${bindBtnHtml}
          ${isUs ? `<button class="btn btn-xs btn-outline btn-set-gemini" title="Назначить этот сервер для Gemini Task Mode">🤖 Для Gemini</button>` : ''}
          ${isActive ? '<button class="btn btn-xs btn-accent btn-select" disabled>✔ Активен</button>' : '<button class="btn btn-xs btn-primary btn-select">Подключить</button>'}
          <button class="btn btn-xs btn-outline btn-copy" title="Копировать конфигурацию">📋</button>
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

    const btnBind = card.querySelector(".btn-bind-site");
    if (btnBind) {
      btnBind.onclick = async (e) => {
        e.stopPropagation();
        if (!currentTabDomain) return;
        if (!appConfig.domainRoutes) appConfig.domainRoutes = {};
        appConfig.domainRoutes[currentTabDomain] = server.id;
        if (!appConfig.proxyDomains.includes(currentTabDomain)) appConfig.proxyDomains.push(currentTabDomain);
        appConfig.bypassDomains = (appConfig.bypassDomains || []).filter(d => d !== currentTabDomain);
        await saveConfig();
        chrome.runtime.sendMessage({
          type: "SET_DOMAIN_ROUTE",
          domain: currentTabDomain,
          serverId: server.id
        });
        showToast(`${currentTabDomain} ➔ ${cleanName}`);
        renderAll();
      };
    }

    const btnGemini = card.querySelector(".btn-set-gemini");
    if (btnGemini) {
      btnGemini.onclick = async (e) => {
        e.stopPropagation();
        appConfig.geminiServerId = server.id;
        appConfig.geminiUsRouting = true;
        chrome.runtime.sendMessage({
          type: "TOGGLE_GEMINI_US",
          enabled: true,
          serverId: server.id
        }, async () => {
          const data = await chrome.storage.local.get("config");
          appConfig = data.config || appConfig;
          renderAll();
          showToast(`Сервер Gemini: ${cleanName}`);
        });
      };
    }

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

function renderDedicatedRoutesList() {
  const container = document.getElementById("dedicatedListContainer");
  if (!container) return;
  const search = (document.getElementById("dedicatedSearchInput")?.value || "").trim().toLowerCase();
  const routes = appConfig.domainRoutes || {};
  const entries = Object.entries(routes);

  const customBadge = document.getElementById("customServerCount");
  if (customBadge) customBadge.textContent = entries.length;

  const filtered = search ? entries.filter(([d]) => d.toLowerCase().includes(search)) : entries;

  container.innerHTML = "";
  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:18px; color:#64748b;">${search ? "Привязок не найдено" : "Нет выделенных привязок сайтов"}</div>`;
    return;
  }

  const servers = appConfig.servers || [];

  filtered.forEach(([domain, serverId]) => {
    const card = document.createElement("div");
    card.className = "domain-card";

    const optionsHtml = buildServerOptionsHtml(serverId, false, true);

    card.innerHTML = `
      <div class="domain-info">
        <span class="domain-name" title="${domain}">${domain}</span>
      </div>
      <div class="domain-actions">
        <select class="domain-server-inline-select" data-domain="${domain}" title="Сменить сервер для ${domain}">
          ${optionsHtml}
        </select>
        <button class="btn-del-domain" data-domain="${domain}" title="Удалить привязку">✕</button>
      </div>
    `;

    const inlineSelect = card.querySelector(".domain-server-inline-select");
    if (inlineSelect) {
      inlineSelect.onchange = async (e) => {
        const newSid = e.target.value;
        if (!appConfig.domainRoutes) appConfig.domainRoutes = {};
        appConfig.domainRoutes[domain] = newSid;
        if (newSid === "direct") {
          if (!appConfig.bypassDomains.includes(domain)) appConfig.bypassDomains.push(domain);
          appConfig.proxyDomains = (appConfig.proxyDomains || []).filter(d => d !== domain);
        } else {
          if (!appConfig.proxyDomains.includes(domain)) appConfig.proxyDomains.push(domain);
          appConfig.bypassDomains = (appConfig.bypassDomains || []).filter(d => d !== domain);
        }
        await saveConfig();
        chrome.runtime.sendMessage({
          type: "SET_DOMAIN_ROUTE",
          domain: domain,
          serverId: newSid
        });
        const matched = servers.find(s => s.id === newSid);
        const sName = matched ? cleanServerName(matched.name) : (newSid === 'direct' ? 'Direct' : newSid);
        showToast(`${domain} ➔ ${sName}`);
        renderAll();
      };
    }

    card.querySelector(".btn-del-domain").onclick = () => {
      chrome.runtime.sendMessage({ type: "REMOVE_DOMAIN_ROUTE", domain: domain }, async () => {
        delete appConfig.domainRoutes[domain];
        await chrome.storage.local.set({ config: appConfig });
        renderAll();
        showToast(`Привязка для ${domain} удалена`);
      });
    };

    container.appendChild(card);
  });

  // Populate new dedicated server select
  const select = document.getElementById("newDedicatedServerSelect");
  if (select) {
    const curVal = select.value || (appConfig.geminiServerId || "srv_27");
    select.innerHTML = buildServerOptionsHtml(curVal, false, true);
    select.value = curVal;
  }
}

function renderDomainList() {
  renderDedicatedRoutesList();

  const proxyContainer = document.getElementById("domainListContainer");
  const bypassContainer = document.getElementById("bypassListContainer");

  const pCount = document.getElementById("proxyCount");
  const bCount = document.getElementById("bypassCount");
  if (pCount) pCount.textContent = (appConfig.proxyDomains || []).length;
  if (bCount) bCount.textContent = (appConfig.bypassDomains || []).length;

  if (proxyContainer) {
    const search = (document.getElementById("domainSearchInput")?.value || "").trim().toLowerCase();
    const list = appConfig.proxyDomains || [];
    const filtered = search ? list.filter(d => d.includes(search)) : list;
    proxyContainer.innerHTML = "";
    if (filtered.length === 0) {
      proxyContainer.innerHTML = `<div style="text-align:center; padding:15px; color:#64748b;">${search ? "Ничего не найдено" : "Список пуст"}</div>`;
    } else {
      filtered.forEach(domain => {
        const row = document.createElement("div");
        row.className = "domain-card";
        row.innerHTML = `
          <span class="domain-name">${domain}</span>
          <button class="btn-del-domain" title="Удалить">×</button>
        `;
        row.querySelector(".btn-del-domain").onclick = async () => {
          appConfig.proxyDomains = appConfig.proxyDomains.filter(d => d !== domain);
          await saveConfig();
          renderAll();
          showToast(`Удален: ${domain}`);
        };
        proxyContainer.appendChild(row);
      });
    }
  }

  if (bypassContainer) {
    const search = (document.getElementById("bypassSearchInput")?.value || "").trim().toLowerCase();
    const list = appConfig.bypassDomains || [];
    const filtered = search ? list.filter(d => d.includes(search)) : list;
    bypassContainer.innerHTML = "";
    if (filtered.length === 0) {
      bypassContainer.innerHTML = `<div style="text-align:center; padding:15px; color:#64748b;">${search ? "Ничего не найдено" : "Список пуст"}</div>`;
    } else {
      filtered.forEach(domain => {
        const row = document.createElement("div");
        row.className = "domain-card";
        row.innerHTML = `
          <span class="domain-name">${domain}</span>
          <button class="btn-del-domain" title="Удалить">×</button>
        `;
        row.querySelector(".btn-del-domain").onclick = async () => {
          appConfig.bypassDomains = appConfig.bypassDomains.filter(d => d !== domain);
          await saveConfig();
          renderAll();
          showToast(`Удален: ${domain}`);
        };
        bypassContainer.appendChild(row);
      });
    }
  }
}

function renderDiagnostics(data) {
  const srvCard = document.getElementById("diagServiceStatus");
  const xrayCard = document.getElementById("diagXrayStatus");
  const usTunnelCard = document.getElementById("diagUsTunnelStatus");
  const extCard = document.getElementById("diagExternalStatus");
  const recsBox = document.getElementById("diagRecsBox");
  const logsBox = document.getElementById("diagLogsBox");

  if (!data) {
    if (srvCard) { srvCard.textContent = "Не отвечает"; srvCard.className = "diag-card-status err"; }
    if (xrayCard) { xrayCard.textContent = "Остановлен"; xrayCard.className = "diag-card-status err"; }
    if (usTunnelCard) { usTunnelCard.textContent = "Остановлен"; usTunnelCard.className = "diag-card-status err"; }
    if (recsBox) {
      recsBox.innerHTML = `
        <div style="color:#f87171; font-weight:700; margin-bottom:4px;">Служба ядра West Service не запущена!</div>
        <div>1. Запустите файл <code>start_service.vbs</code> или <code>start_service.bat</code> в папке расширения.</div>
        <div>2. Если запущен v2RayTun, расширение автоматически использует его как резерв на порту 10808.</div>
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
      xrayCard.textContent = `Активен (10818 • PID ${data.xrayCore.pid || "-"})`;
      xrayCard.className = "diag-card-status ok";
    } else {
      xrayCard.textContent = "Остановлен";
      xrayCard.className = "diag-card-status err";
    }
  }

  if (usTunnelCard) {
    usTunnelCard.textContent = `Активен (порт ${appConfig.usProxyPort || 10820})`;
    usTunnelCard.className = "diag-card-status ok";
  }

  if (extCard) {
    if (data.externalCore && data.externalCore.running) {
      extCard.textContent = `Обнаружен (порт ${data.externalCore.port})`;
      extCard.className = "diag-card-status ok";
    } else {
      extCard.textContent = "Не запущен (резерв)";
      extCard.className = "diag-card-status warn";
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
  const gem = document.getElementById("settingsGeminiToggle");
  const host = document.getElementById("proxyHostInput");
  const port = document.getElementById("proxyPortInput");
  const hport = document.getElementById("httpPortInput");
  const usPort = document.getElementById("usProxyPortInput");
  const sub = document.getElementById("subUrlInput");
  const coreMode = document.getElementById("coreModeSelect");

  if (yt) yt.checked = appConfig.youtubeDirect !== false;
  if (lan) lan.checked = appConfig.localBypass !== false;
  if (hfb) hfb.checked = appConfig.httpFallback !== false;
  if (gem) gem.checked = !!appConfig.geminiUsRouting;
  if (host) host.value = appConfig.proxyHost || "127.0.0.1";
  if (port) port.value = appConfig.proxyPort || 10818;
  if (hport) hport.value = appConfig.httpPort || 10819;
  if (usPort) usPort.value = appConfig.usProxyPort || 10820;
  if (sub) sub.value = appConfig.subscriptionUrl || "";
  if (coreMode) coreMode.value = appConfig.coreMode || "auto";
}

function renderAll() {
  updateBadgeAndUI();
  updateGeminiCard();
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

  // Current Site Server Dropdown
  document.getElementById("currentSiteServerSelect")?.addEventListener("change", async (e) => {
    if (!currentTabDomain) return;
    const val = e.target.value;
    if (val === "default") {
      delete appConfig.domainRoutes[currentTabDomain];
      if (!appConfig.proxyDomains.includes(currentTabDomain)) appConfig.proxyDomains.push(currentTabDomain);
      appConfig.bypassDomains = (appConfig.bypassDomains || []).filter(d => d !== currentTabDomain);
      showToast(`${currentTabDomain}: Основной VPN`);
    } else if (val === "direct") {
      appConfig.domainRoutes[currentTabDomain] = "direct";
      if (!appConfig.bypassDomains.includes(currentTabDomain)) appConfig.bypassDomains.push(currentTabDomain);
      appConfig.proxyDomains = (appConfig.proxyDomains || []).filter(d => d !== currentTabDomain);
      showToast(`${currentTabDomain}: Direct`);
    } else {
      appConfig.domainRoutes[currentTabDomain] = val;
      if (!appConfig.proxyDomains.includes(currentTabDomain)) appConfig.proxyDomains.push(currentTabDomain);
      appConfig.bypassDomains = (appConfig.bypassDomains || []).filter(d => d !== currentTabDomain);
      const srv = (appConfig.servers || []).find(s => s.id === val);
      showToast(`${currentTabDomain} -> ${srv ? cleanServerName(srv.name) : val}`);
    }
    await saveConfig();
    chrome.runtime.sendMessage({
      type: "SET_DOMAIN_ROUTE",
      domain: currentTabDomain,
      serverId: val
    });
    renderAll();
  });

  // Current Site Quick Toggle Button (В VPN / В Direct)
  document.getElementById("currentSiteBtn")?.addEventListener("click", () => {
    if (!currentTabDomain) return;
    const siteSelect = document.getElementById("currentSiteServerSelect");
    const isCurrentlyVpn = siteSelect && siteSelect.value !== "direct";
    const nextVal = isCurrentlyVpn ? "direct" : "default";
    if (siteSelect) {
      siteSelect.value = nextVal;
      siteSelect.dispatchEvent(new Event("change"));
    }
  });

  // Quick Gemini button on current site
  document.getElementById("geminiSiteQuickBtn")?.addEventListener("click", () => {
    if (!currentTabDomain) return;
    const usSrv = appConfig.geminiServerId || "srv_27";
    chrome.runtime.sendMessage({
      type: "SET_DOMAIN_ROUTE",
      domain: currentTabDomain,
      serverId: usSrv
    }, async () => {
      appConfig.domainRoutes[currentTabDomain] = usSrv;
      await chrome.storage.local.set({ config: appConfig });
      renderAll();
      showToast(`${currentTabDomain} привязан к серверу США!`);
    });
  });

  // Gemini Card Toggle
  document.getElementById("geminiToggle")?.addEventListener("change", (e) => {
    const isEnabled = e.target.checked;
    chrome.runtime.sendMessage({
      type: "TOGGLE_GEMINI_US",
      enabled: isEnabled,
      serverId: appConfig.geminiServerId
    }, async (res) => {
      appConfig.geminiUsRouting = isEnabled;
      const data = await chrome.storage.local.get("config");
      appConfig = data.config || appConfig;
      renderAll();
      showToast(isEnabled ? "Режим задач Gemini (США) включен" : "Режим Gemini отключен");
    });
  });

  // Gemini Server Select
  document.getElementById("geminiServerSelect")?.addEventListener("change", (e) => {
    const newUsId = e.target.value;
    appConfig.geminiServerId = newUsId;
    if (appConfig.geminiUsRouting) {
      chrome.runtime.sendMessage({
        type: "TOGGLE_GEMINI_US",
        enabled: true,
        serverId: newUsId
      }, async () => {
        const data = await chrome.storage.local.get("config");
        appConfig = data.config || appConfig;
        renderAll();
        showToast("Сервер США для Gemini обновлен");
      });
    } else {
      saveConfig();
    }
  });

  // Routing Subtabs
  document.getElementById("subTabDedicated")?.addEventListener("click", () => {
    switchRoutingSubtab("dedicated");
  });
  document.getElementById("subTabProxy")?.addEventListener("click", () => {
    switchRoutingSubtab("proxy");
  });
  document.getElementById("subTabBypass")?.addEventListener("click", () => {
    switchRoutingSubtab("bypass");
  });

  function switchRoutingSubtab(sub) {
    currentDomainSubTab = sub;
    document.querySelectorAll(".route-subtab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".routing-subpane").forEach(p => p.classList.remove("active"));
    if (sub === "dedicated") {
      document.getElementById("subTabDedicated")?.classList.add("active");
      document.getElementById("subpaneDedicated")?.classList.add("active");
    } else if (sub === "proxy") {
      document.getElementById("subTabProxy")?.classList.add("active");
      document.getElementById("subpaneProxy")?.classList.add("active");
    } else {
      document.getElementById("subTabBypass")?.classList.add("active");
      document.getElementById("subpaneBypass")?.classList.add("active");
    }
  }

  // Apply Gemini Preset Button
  document.getElementById("applyGeminiPresetBtn")?.addEventListener("click", () => {
    chrome.runtime.sendMessage({
      type: "TOGGLE_GEMINI_US",
      enabled: true,
      serverId: appConfig.geminiServerId || "srv_27"
    }, async () => {
      const data = await chrome.storage.local.get("config");
      appConfig = data.config || appConfig;
      renderAll();
      showToast("⚡ Все 14 доменов Gemini привязаны к серверу США!");
    });
  });

  // Add Dedicated Domain Route
  document.getElementById("addDedicatedRouteBtn")?.addEventListener("click", () => {
    const input = document.getElementById("newDedicatedDomainInput");
    const serverSelect = document.getElementById("newDedicatedServerSelect");
    const rawVal = input?.value.trim();
    if (!rawVal) return;
    const domain = cleanDomain(rawVal);
    if (!domain) {
      showToast("Некорректный домен");
      return;
    }
    const serverId = serverSelect?.value;
    if (!serverId) {
      showToast("Выберите сервер");
      return;
    }

    chrome.runtime.sendMessage({
      type: "SET_DOMAIN_ROUTE",
      domain: domain,
      serverId: serverId
    }, async () => {
      if (!appConfig.domainRoutes) appConfig.domainRoutes = {};
      appConfig.domainRoutes[domain] = serverId;
      if (serverId === "direct") {
        if (!appConfig.bypassDomains.includes(domain)) appConfig.bypassDomains.push(domain);
        appConfig.proxyDomains = (appConfig.proxyDomains || []).filter(d => d !== domain);
      } else {
        if (!appConfig.proxyDomains.includes(domain)) appConfig.proxyDomains.push(domain);
        appConfig.bypassDomains = (appConfig.bypassDomains || []).filter(d => d !== domain);
      }
      input.value = "";
      await chrome.storage.local.set({ config: appConfig });
      renderAll();
      showToast(`Сайт ${domain} привязан`);
    });
  });

  document.getElementById("clearCustomRoutesBtn")?.addEventListener("click", async () => {
    appConfig.domainRoutes = {};
    await saveConfig();
    chrome.runtime.sendMessage({ type: "APPLY_PROXY" });
    try {
      await fetch("http://127.0.0.1:10850/set_domain_routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domainRoutes: {} })
      });
    } catch(e) {}
    renderAll();
    showToast("Пользовательские привязки сброшены");
  });

  // Add General Proxy Domain
  document.getElementById("addDomainBtn")?.addEventListener("click", async () => {
    const input = document.getElementById("newDomainInput");
    const rawVal = input?.value.trim();
    if (!rawVal) return;
    const domain = cleanDomain(rawVal);
    if (!domain) {
      showToast("Некорректный домен");
      return;
    }
    if (!appConfig.proxyDomains.includes(domain)) {
      appConfig.proxyDomains.unshift(domain);
    }
    appConfig.bypassDomains = (appConfig.bypassDomains || []).filter(d => d !== domain);
    input.value = "";
    await saveConfig();
    renderAll();
    showToast(`В VPN: ${domain}`);
  });

  // Add Bypass Domain
  document.getElementById("addBypassDomainBtn")?.addEventListener("click", async () => {
    const input = document.getElementById("newBypassDomainInput");
    const rawVal = input?.value.trim();
    if (!rawVal) return;
    const domain = cleanDomain(rawVal);
    if (!domain) {
      showToast("Некорректный домен");
      return;
    }
    if (!appConfig.bypassDomains.includes(domain)) {
      appConfig.bypassDomains.unshift(domain);
    }
    appConfig.proxyDomains = (appConfig.proxyDomains || []).filter(d => d !== domain);
    input.value = "";
    await saveConfig();
    renderAll();
    showToast(`В Direct: ${domain}`);
  });

  // Search Inputs
  document.getElementById("dedicatedSearchInput")?.addEventListener("input", () => renderDedicatedRoutesList());
  document.getElementById("domainSearchInput")?.addEventListener("input", () => renderDomainList());
  document.getElementById("bypassSearchInput")?.addEventListener("input", () => renderDomainList());

  // Subscription Refresh
  const subUrlInput = document.getElementById("subUrlInput");
  if (subUrlInput) {
    subUrlInput.onchange = async (e) => {
      appConfig.subscriptionUrl = e.target.value.trim();
      await saveConfig();
    };
  }

  document.getElementById("refreshSubBtn")?.addEventListener("click", () => {
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
        appConfig = data.config || appConfig;
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
      btn.textContent = "⚡...";
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

  // FIND US SERVER BUTTON
  document.getElementById("findUsServerBtn")?.addEventListener("click", () => {
    const usServers = getUsServers(appConfig.servers || []);
    if (usServers.length === 0) {
      showToast("Серверы США не найдены в подписке");
      return;
    }
    const bestUs = usServers[0];
    selectServer(bestUs);
    showToast(`Выбран сервер США: ${cleanServerName(bestUs.name)}`);
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
      renderDiagnostics(res && res.success ? res.data : null);
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
  document.getElementById("settingsGeminiToggle")?.addEventListener("change", async (e) => {
    document.getElementById("geminiToggle")?.click();
  });

  document.getElementById("saveCoreSettingsBtn")?.addEventListener("click", async () => {
    appConfig.proxyHost = document.getElementById("proxyHostInput")?.value.trim() || "127.0.0.1";
    appConfig.proxyPort = parseInt(document.getElementById("proxyPortInput")?.value, 10) || 10818;
    appConfig.httpPort = parseInt(document.getElementById("httpPortInput")?.value, 10) || 10819;
    appConfig.usProxyPort = parseInt(document.getElementById("usProxyPortInput")?.value, 10) || 10820;
    await saveConfig();
    updateBadgeAndUI();
    showToast("Настройки портов сохранены");
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
  if (!appConfig.domainRoutes) {
    appConfig.domainRoutes = { ...(DEFAULT_CONFIG.domainRoutes || {}) };
  }

  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs && tabs[0] && tabs[0].url) {
      currentTabDomain = cleanDomain(tabs[0].url);
    }
  } catch(e) {}

  setupEventListeners();
  renderAll();

  chrome.runtime.onMessage.addListener((message) => {
    if (message && message.type === "SERVER_CHANGED" && message.server) {
      appConfig.activeServerId = message.server.id;
      appConfig.activeServer = message.server;
      renderAll();
      const cleanName = cleanServerName(message.server.name);
      showToast(`⚡ Авто-переключение: ${cleanName}`);
    }
  });

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
