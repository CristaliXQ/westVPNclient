import json
import os
import sys
import socket
import subprocess
import time
import base64
import urllib.request
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler
from concurrent.futures import ThreadPoolExecutor

HOST = "127.0.0.1"
PORT = 19090
DIR = os.path.dirname(os.path.abspath(__file__))
STATE_FILE = os.path.join(DIR, "bridge_state.json")
CONFIG_FILE = os.path.join(DIR, "connection.json")

core_proc = None

def is_regular_server(srv):
    name = (srv.get("name") or "").lower()
    addr = (srv.get("address") or "").lower()
    if "бел" in name or "white" in name or "daysleft" in addr:
        return False
    return True

def find_xray_core():
    bin_path = os.path.normpath(os.path.join(DIR, "..", "bin", "xraycore.exe"))
    if os.path.exists(bin_path):
        return bin_path
    local_bin = os.path.join(DIR, "xraycore.exe")
    if os.path.exists(local_bin):
        return local_bin
    v2raytun_temp = os.path.expandvars(r"%LOCALAPPDATA%\Temp\v2RayTun\xraycore.exe")
    if os.path.exists(v2raytun_temp):
        return v2raytun_temp
    return "xraycore.exe"

def get_asset_dir():
    bin_dir = os.path.normpath(os.path.join(DIR, "..", "bin"))
    if os.path.exists(os.path.join(bin_dir, "geoip.dat")):
        return bin_dir
    v2raytun_temp = os.path.expandvars(r"%LOCALAPPDATA%\Temp\v2RayTun")
    if os.path.exists(os.path.join(v2raytun_temp, "geoip.dat")):
        return v2raytun_temp
    return DIR

def load_state():
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {"active_server": None, "servers": []}

def save_state(state):
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, ensure_ascii=False, indent=2)

def generate_xray_config(srv):
    proto = srv.get("protocol", "vless").lower()
    params = srv.get("params", {})

    outbound = {
        "tag": "main",
        "protocol": proto,
        "mux": {"enabled": False, "concurrency": -1}
    }

    if proto == "vless":
        users = [{
            "id": srv.get("uuid", ""),
            "level": 8,
            "encryption": "none"
        }]
        if params.get("flow"):
            users[0]["flow"] = params["flow"]
        outbound["settings"] = {
            "vnext": [{
                "address": srv["address"],
                "port": int(srv["port"]),
                "users": users
            }]
        }
    elif proto == "vmess":
        users = [{
            "id": srv.get("uuid", ""),
            "alterId": int(params.get("aid", 0)),
            "security": params.get("scy", "auto"),
            "level": 8
        }]
        outbound["settings"] = {
            "vnext": [{
                "address": srv["address"],
                "port": int(srv["port"]),
                "users": users
            }]
        }
    elif proto == "trojan":
        outbound["settings"] = {
            "servers": [{
                "address": srv["address"],
                "port": int(srv["port"]),
                "password": srv.get("password", ""),
                "level": 8
            }]
        }

    net = params.get("type", params.get("net", "tcp"))
    sec = params.get("security", "none")

    stream = {
        "network": net,
        "security": sec
    }

    if sec == "reality":
        stream["realitySettings"] = {
            "serverName": params.get("sni", srv["address"]),
            "publicKey": params.get("pbk", ""),
            "shortId": params.get("sid", ""),
            "fingerprint": params.get("fp", "chrome")
        }
    elif sec == "tls":
        stream["tlsSettings"] = {
            "serverName": params.get("sni", srv["address"]),
            "allowInsecure": False,
            "fingerprint": params.get("fp", "chrome")
        }

    if net == "ws":
        stream["wsSettings"] = {
            "path": params.get("path", "/"),
            "headers": {"Host": params.get("host", srv["address"])}
        }
    elif net == "grpc":
        stream["grpcSettings"] = {
            "serviceName": params.get("serviceName", "")
        }

    outbound["streamSettings"] = stream

    return {
        "log": {"loglevel": "warning"},
        "dns": {"servers": ["8.8.8.8", "1.1.1.1"]},
        "inbounds": [
            {
                "tag": "socks-in",
                "protocol": "socks",
                "listen": "127.0.0.1",
                "port": 10808,
                "sniffing": {"enabled": True, "destOverride": ["http", "tls"]},
                "settings": {"udp": True, "auth": "noauth"}
            },
            {
                "tag": "http-in",
                "protocol": "http",
                "listen": "127.0.0.1",
                "port": 10809,
                "sniffing": {"enabled": True, "destOverride": ["http", "tls"]},
                "settings": {}
            }
        ],
        "outbounds": [
            outbound,
            {"protocol": "freedom", "tag": "direct"},
            {"protocol": "blackhole", "tag": "block"}
        ],
        "routing": {
            "domainStrategy": "AsIs",
            "rules": [
                {"type": "field", "inboundTag": ["socks-in", "http-in"], "outboundTag": "main"}
            ]
        }
    }

def start_or_restart_core(srv):
    global core_proc
    cfg = generate_xray_config(srv)
    with open(CONFIG_FILE, "w", encoding="utf-8") as f:
        json.dump(cfg, f, ensure_ascii=False, indent=2)

    if core_proc and core_proc.poll() is None:
        core_proc.terminate()
        try:
            core_proc.wait(timeout=1.5)
        except Exception:
            core_proc.kill()

    exe = find_xray_core()
    asset_dir = get_asset_dir()
    cmd = [exe, "run", "--path", CONFIG_FILE, "--asset-dir", asset_dir]
    core_proc = subprocess.Popen(
        cmd,
        cwd=os.path.dirname(exe),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    return True

def ping_host_port(host, port):
    samples = []
    for _ in range(2):
        t0 = time.time()
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(1.0)
            s.connect((host, int(port)))
            s.close()
            samples.append(int((time.time() - t0) * 1000))
        except Exception:
            pass
        time.sleep(0.01)
    return min(samples) if samples else 9999

def pick_best_server(servers):
    regular = [s for s in servers if is_regular_server(s)]
    if not regular:
        regular = servers

    def test_item(idx_srv):
        idx, s = idx_srv
        addr = s.get("address")
        port = s.get("port", 443)
        return idx, ping_host_port(addr, port)

    with ThreadPoolExecutor(max_workers=20) as executor:
        results = dict(executor.map(test_item, enumerate(regular)))

    best_idx = None
    min_ping = 9999
    for idx, p in results.items():
        if p < min_ping:
            min_ping = p
            best_idx = idx

    if best_idx is not None and min_ping < 5000:
        res_srv = dict(regular[best_idx])
        res_srv["ping"] = min_ping
        return res_srv, results
    return (regular[0] if regular else None), results

class BridgeHandler(BaseHTTPRequestHandler):
    def _cors(self, code=200):
        self.send_response(code)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()

    def do_OPTIONS(self):
        self._cors(200)

    def do_GET(self):
        global core_proc
        if self.path == "/status":
            st = load_state()
            is_running = core_proc is not None and core_proc.poll() is None
            if not is_running:
                s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                s.settimeout(0.2)
                try:
                    s.connect(("127.0.0.1", 10808))
                    is_running = True
                    s.close()
                except Exception:
                    is_running = False

            data = {
                "running": True,
                "xray_running": is_running,
                "active_server": st.get("active_server"),
                "servers": st.get("servers", [])
            }
            self._cors(200)
            self.wfile.write(json.dumps(data).encode("utf-8"))
        else:
            self._cors(404)

    def do_POST(self):
        global core_proc
        content_len = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_len).decode("utf-8") if content_len > 0 else "{}"
        req = json.loads(body)

        if self.path == "/select_server":
            srv = req.get("server")
            if srv:
                st = load_state()
                st["active_server"] = srv
                save_state(st)
                start_or_restart_core(srv)
                self._cors(200)
                self.wfile.write(json.dumps({"ok": True}).encode("utf-8"))
            else:
                self._cors(400)

        elif self.path == "/auto_select":
            servers = req.get("servers", [])
            if not servers:
                st = load_state()
                servers = st.get("servers", [])
            best_srv, pings = pick_best_server(servers)
            if best_srv:
                st = load_state()
                st["active_server"] = best_srv
                save_state(st)
                start_or_restart_core(best_srv)
                self._cors(200)
                self.wfile.write(json.dumps({"ok": True, "server": best_srv, "pings": pings}).encode("utf-8"))
            else:
                self._cors(500)

        elif self.path == "/subscription":
            url = req.get("url")
            headers = {"User-Agent": "v2rayng/1.8.5"}
            rq = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(rq, timeout=10) as response:
                content = response.read().decode("utf-8")
            try:
                content = base64.b64decode(content).decode("utf-8")
            except Exception:
                pass
            lines = [l.strip() for l in content.splitlines() if l.strip()]
            servers = []
            for line in lines:
                if line.startswith("vless://"):
                    rest = line[8:]
                    name = ""
                    if "#" in rest:
                        rest, raw_name = rest.split("#", 1)
                        name = urllib.parse.unquote(raw_name).strip()
                    query = ""
                    if "?" in rest:
                        rest, query = rest.split("?", 1)
                    if "@" in rest:
                        uuid, hp = rest.split("@", 1)
                        host = hp
                        port = 443
                        if ":" in hp:
                            host, p = hp.split(":", 1)
                            port = int(p)
                        item = {
                            "protocol": "vless",
                            "name": name or host,
                            "address": host,
                            "port": port,
                            "uuid": uuid,
                            "params": dict(urllib.parse.parse_qsl(query)),
                            "raw": line
                        }
                        if is_regular_server(item):
                            servers.append(item)
            st = load_state()
            st["servers"] = servers
            save_state(st)
            self._cors(200)
            self.wfile.write(json.dumps({"servers": servers}).encode("utf-8"))

        elif self.path == "/ping_servers":
            servers = req.get("servers", [])
            results = {}
            with ThreadPoolExecutor(max_workers=20) as executor:
                futures = {
                    executor.submit(ping_host_port, s["address"], s["port"]): idx
                    for idx, s in enumerate(servers) if "address" in s and "port" in s and is_regular_server(s)
                }
                for f in futures:
                    lat = f.result()
                    results[futures[f]] = lat if lat < 5000 else -1
            self._cors(200)
            self.wfile.write(json.dumps({"results": results}).encode("utf-8"))

        elif self.path == "/stop_core":
            if core_proc and core_proc.poll() is None:
                core_proc.terminate()
            self._cors(200)
            self.wfile.write(json.dumps({"ok": True}).encode("utf-8"))

        else:
            self._cors(404)

if __name__ == "__main__":
    server = HTTPServer((HOST, PORT), BridgeHandler)
    print(f"West Bridge started at http://{HOST}:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        if core_proc and core_proc.poll() is None:
            core_proc.terminate()
        server.server_close()
