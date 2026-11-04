const fs = require('fs');
const assert = require('assert');

// Load default config
const { DEFAULT_CONFIG } = require('./default_data.js');

// Extract generatePacScript from background.js
const bgCode = fs.readFileSync('./background.js', 'utf8');

// Isolate functions needed for PAC generation
const extractCode = `
${bgCode.slice(0, bgCode.indexOf('chrome.runtime.onInstalled'))}
global.generatePacScript = generatePacScript;
`;
eval(extractCode);

function createPacEnvironment(pacCode) {
  const sandbox = {
    isPlainHostName: function(host) {
      return host.indexOf('.') === -1 && host.indexOf(':') === -1;
    },
    shExpMatch: function(str, pattern) {
      const p = pattern.replace(/[-[\]{}()+?.,\\^$|#\s]/g, '\\$&').replace(/\*/g, '.*');
      return new RegExp('^' + p + '$', 'i').test(str);
    }
  };
  const scriptFunc = new Function('url', 'host', 'isPlainHostName', 'shExpMatch', `
    ${pacCode}
    return FindProxyForURL(url, host);
  `);
  return function(url, host) {
    return scriptFunc(url, host, sandbox.isPlainHostName, sandbox.shExpMatch);
  };
}

console.log("=== RUNNING PAC SUITE TESTS ===");
let passed = 0;
let total = 0;

function check(testName, actual, expectedSnippet) {
  total++;
  const ok = actual.includes(expectedSnippet);
  if (ok) {
    passed++;
    console.log(`  ✔ [PASS] ${testName}`);
  } else {
    console.error(`  ✖ [FAIL] ${testName}: expected snippet "${expectedSnippet}", got "${actual}"`);
  }
}

// 1. SMART MODE with YouTube Direct (default)
const pacSmart = generatePacScript({ ...DEFAULT_CONFIG, mode: 'smart', youtubeDirect: true });
const evalSmart = createPacEnvironment(pacSmart);

console.log("\n1. Testing Smart Mode (youtubeDirect = true):");
check("Discord main", evalSmart("https://discord.com", "discord.com"), "SOCKS5 127.0.0.1:10818");
check("Discord subdomain", evalSmart("https://gateway.discord.gg", "gateway.discord.gg"), "SOCKS5 127.0.0.1:10818");
check("ChatGPT", evalSmart("https://chatgpt.com", "chatgpt.com"), "SOCKS5 127.0.0.1:10818");
check("Claude AI", evalSmart("https://claude.ai", "claude.ai"), "SOCKS5 127.0.0.1:10818");
check("Gemini Google", evalSmart("https://gemini.google.com", "gemini.google.com"), "SOCKS5 127.0.0.1:10818");
check("Google main", evalSmart("https://google.com", "google.com"), "SOCKS5 127.0.0.1:10818");
check("Gstatic assets", evalSmart("https://www.gstatic.com", "www.gstatic.com"), "SOCKS5 127.0.0.1:10818");
check("Instagram", evalSmart("https://instagram.com", "instagram.com"), "SOCKS5 127.0.0.1:10818");
check("Twitter / X", evalSmart("https://x.com", "x.com"), "SOCKS5 127.0.0.1:10818");
check("Notion", evalSmart("https://notion.so", "notion.so"), "SOCKS5 127.0.0.1:10818");
check("Spotify", evalSmart("https://open.spotify.com", "open.spotify.com"), "SOCKS5 127.0.0.1:10818");
check("RuTracker", evalSmart("https://rutracker.org", "rutracker.org"), "SOCKS5 127.0.0.1:10818");
check("Syntax Client", evalSmart("https://syntaxclient.ru", "syntaxclient.ru"), "SOCKS5 127.0.0.1:10818");

// YouTube Zapret Direct
check("YouTube main -> DIRECT", evalSmart("https://youtube.com", "youtube.com"), "DIRECT");
check("Googlevideo CDN -> DIRECT", evalSmart("https://rr1---sn-xxx.googlevideo.com", "rr1---sn-xxx.googlevideo.com"), "DIRECT");
check("Ytimg -> DIRECT", evalSmart("https://i.ytimg.com", "i.ytimg.com"), "DIRECT");

// Russian services -> DIRECT
check("Gosuslugi -> DIRECT", evalSmart("https://gosuslugi.ru", "gosuslugi.ru"), "DIRECT");
check("Sberbank -> DIRECT", evalSmart("https://www.sberbank.ru", "www.sberbank.ru"), "DIRECT");
check("Yandex -> DIRECT", evalSmart("https://yandex.ru", "yandex.ru"), "DIRECT");

// Unlisted -> DIRECT
check("Wikipedia -> DIRECT", evalSmart("https://wikipedia.org", "wikipedia.org"), "DIRECT");
check("Habr -> DIRECT", evalSmart("https://habr.com", "habr.com"), "DIRECT");

// Anti-spoofing checks
check("Fake discord (nodiscord.com) -> DIRECT", evalSmart("https://nodiscord.com", "nodiscord.com"), "DIRECT");
check("Fake X (fakex.com) -> DIRECT", evalSmart("https://fakex.com", "fakex.com"), "DIRECT");
check("Attacker subdomain of notion -> DIRECT", evalSmart("https://notion.so.evil.com", "notion.so.evil.com"), "DIRECT");

// Localhost and LAN
check("localhost -> DIRECT", evalSmart("http://localhost:3000", "localhost"), "DIRECT");
check("127.0.0.1 -> DIRECT", evalSmart("http://127.0.0.1:8080", "127.0.0.1"), "DIRECT");
check("192.168.1.1 -> DIRECT", evalSmart("http://192.168.1.1", "192.168.1.1"), "DIRECT");
check("IPv6 loopback [::1] -> DIRECT", evalSmart("http://[::1]:8080", "[::1]"), "DIRECT");
check("Plain intranet -> DIRECT", evalSmart("http://intranet/page", "intranet"), "DIRECT");

// 2. SMART MODE with YouTube in VPN (youtubeDirect = false)
console.log("\n2. Testing Smart Mode (youtubeDirect = false):");
const pacYtVpn = generatePacScript({ ...DEFAULT_CONFIG, mode: 'smart', youtubeDirect: false });
const evalYtVpn = createPacEnvironment(pacYtVpn);
check("YouTube main -> PROXY", evalYtVpn("https://youtube.com", "youtube.com"), "SOCKS5 127.0.0.1:10818");
check("Googlevideo CDN -> PROXY", evalYtVpn("https://rr1---sn-xxx.googlevideo.com", "rr1---sn-xxx.googlevideo.com"), "SOCKS5 127.0.0.1:10818");
check("Discord -> PROXY", evalYtVpn("https://discord.com", "discord.com"), "SOCKS5 127.0.0.1:10818");
check("Gosuslugi -> DIRECT", evalYtVpn("https://gosuslugi.ru", "gosuslugi.ru"), "DIRECT");

// 3. ALL TRAFFIC MODE
console.log("\n3. Testing All Traffic Mode:");
const pacAll = generatePacScript({ ...DEFAULT_CONFIG, mode: 'all', youtubeDirect: true });
const evalAll = createPacEnvironment(pacAll);
check("Wikipedia in ALL -> PROXY", evalAll("https://wikipedia.org", "wikipedia.org"), "SOCKS5 127.0.0.1:10818");
check("Discord in ALL -> PROXY", evalAll("https://discord.com", "discord.com"), "SOCKS5 127.0.0.1:10818");
check("YouTube in ALL with zapret -> DIRECT", evalAll("https://youtube.com", "youtube.com"), "DIRECT");
check("Gosuslugi in ALL -> DIRECT", evalAll("https://gosuslugi.ru", "gosuslugi.ru"), "DIRECT");
check("LAN in ALL -> DIRECT", evalAll("http://192.168.0.1", "192.168.0.1"), "DIRECT");

// 4. CORE MODE VARIATIONS
console.log("\n4. Testing Core Modes (west vs external vs auto):");
const pacWest = generatePacScript({ ...DEFAULT_CONFIG, coreMode: 'west' });
check("West core only", createPacEnvironment(pacWest)("https://discord.com", "discord.com"), "SOCKS5 127.0.0.1:10818; SOCKS 127.0.0.1:10818; PROXY 127.0.0.1:10819; DIRECT");

const pacExt = generatePacScript({ ...DEFAULT_CONFIG, coreMode: 'external' });
check("External core only", createPacEnvironment(pacExt)("https://discord.com", "discord.com"), "SOCKS5 127.0.0.1:10808; SOCKS 127.0.0.1:10808; PROXY 127.0.0.1:10809; DIRECT");

// 5. PER-DOMAIN SERVER ROUTING & GEMINI US MODE
console.log("\n5. Testing Per-Domain Server Routing & Gemini US Mode:");
const pacGemini = generatePacScript({
  ...DEFAULT_CONFIG,
  mode: 'smart',
  usProxyPort: 10820,
  domainRoutes: {
    "gemini.google.com": "srv_27",
    "aistudio.google.com": "srv_27",
    "custom-uk.com": "srv_7"
  }
});
const evalGemini = createPacEnvironment(pacGemini);
check("Gemini Google routes to US port 10820", evalGemini("https://gemini.google.com", "gemini.google.com"), "SOCKS5 127.0.0.1:10820");
check("AI Studio routes to US port 10820", evalGemini("https://aistudio.google.com", "aistudio.google.com"), "SOCKS5 127.0.0.1:10820");
check("Custom UK site routes to general proxy", evalGemini("https://custom-uk.com", "custom-uk.com"), "SOCKS5 127.0.0.1:10818");
check("General proxy site remains on 10818", evalGemini("https://chatgpt.com", "chatgpt.com"), "SOCKS5 127.0.0.1:10818");
check("LAN remains DIRECT during domain routing", evalGemini("http://127.0.0.1:3000", "127.0.0.1"), "DIRECT");
check("YouTube Zapret remains DIRECT during domain routing", evalGemini("https://youtube.com", "youtube.com"), "DIRECT");

console.log(`\n========================================`);
console.log(`TOTAL TESTS: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
if (passed === total) {
  console.log("ALL PAC TESTS PASSED SUCCESSFULLY!");
  process.exit(0);
} else {
  console.error("SOME PAC TESTS FAILED!");
  process.exit(1);
}
