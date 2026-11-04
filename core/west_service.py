import os
import sys

_core_dir = os.path.dirname(os.path.abspath(__file__))
if _core_dir not in sys.path:
    sys.path.insert(0, _core_dir)
try:
    os.chdir(_core_dir)
except Exception:
    pass

_dll_dir = os.path.join(os.path.dirname(sys.executable), "DLLs")
if os.path.exists(_dll_dir) and hasattr(os, "add_dll_directory"):
    try:
        os.add_dll_directory(_dll_dir)
    except Exception:
        pass

import json
import time
import socket
import threading
import subprocess
import urllib.parse
import urllib.request
import psutil
from collections import deque
from concurrent.futures import ThreadPoolExecutor
from http.server import HTTPServer, BaseHTTPRequestHandler
from link_to_xray import parse_link_to_outbound

try:
    import ssl
except Exception:
    ssl = None

CORE_DIR = os.path.dirname(os.path.abspath(__file__))
REAL_CORE_DIR = os.path.realpath(CORE_DIR).lower()
XRAY_EXE = os.path.join(CORE_DIR, "xraycore.exe")
ACTIVE_CONFIG = os.path.join(CORE_DIR, "active_config.json")
STATE_FILE = os.path.join(CORE_DIR, "state.json")
SERVERS_CACHE_FILE = os.path.join(CORE_DIR, "default_servers.json")

SOCKS_PORT = 10818
HTTP_PORT = 10819
US_SOCKS_PORT = 10820
US_HTTP_PORT = 10821
SERVICE_PORT = 10850
CREATION_FLAGS = 0x08000000 if os.name == "nt" else 0

DOMAIN_ROUTES_FILE = os.path.join(CORE_DIR, "domain_routes.json")
domain_routes = {}
domain_routes_lock = threading.Lock()

xray_process = None
current_server = None
log_buffer = deque(maxlen=150)
log_lock = threading.Lock()
xray_lock = threading.RLock()

watchdog_paused = False
consecutive_probe_failures = 0
last_failover_time = 0
last_failover_event = None
server_pool = []
server_pool_lock = threading.Lock()

def load_server_pool():
    global server_pool
    # 1. From SERVERS_CACHE_FILE
    if os.path.exists(SERVERS_CACHE_FILE):
        try:
            with open(SERVERS_CACHE_FILE, "r", encoding="utf-8") as f:
                srvs = json.load(f)
                if isinstance(srvs, list) and srvs:
                    with server_pool_lock:
                        server_pool = srvs
                    return
        except Exception:
            pass

    # 2. Extract from ../default_data.js if SERVERS_CACHE_FILE not found
    default_data_file = os.path.join(CORE_DIR, "..", "default_data.js")
    if os.path.exists(default_data_file):
        try:
            with open(default_data_file, "r", encoding="utf-8") as f:
                content = f.read()
            idx = content.find("servers:")
            if idx != -1:
                start = content.find("[", idx)
                if start != -1:
                    depth = 0
                    end = -1
                    for i in range(start, len(content)):
                        if content[i] == "[":
                            depth += 1
                        elif content[i] == "]":
                            depth -= 1
                            if depth == 0:
                                end = i + 1
                                break
                    if end != -1:
                        srvs = json.loads(content[start:end])
                        if isinstance(srvs, list) and srvs:
                            with server_pool_lock:
                                server_pool = srvs
                            with open(SERVERS_CACHE_FILE, "w", encoding="utf-8") as sf:
                                json.dump(srvs, sf, ensure_ascii=False, indent=2)
                            return
        except Exception:
            pass

def load_state():
    global current_server, domain_routes
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                current_server = data.get("activeServer")
        except Exception:
            pass
    if os.path.exists(DOMAIN_ROUTES_FILE):
        try:
            with open(DOMAIN_ROUTES_FILE, "r", encoding="utf-8") as f:
                routes = json.load(f)
                if isinstance(routes, dict):
                    domain_routes = routes
        except Exception:
            pass
    if not domain_routes:
        domain_routes = {
            "gemini.google.com": "srv_27",
            "aistudio.google.com": "srv_27",
            "alkalimakersuite-pa.clients6.google.com": "srv_27",
            "generativelanguage.googleapis.com": "srv_27",
            "makersuite.google.com": "srv_27",
            "bard.google.com": "srv_27",
            "deepmind.google": "srv_27",
            "notebooklm.google.com": "srv_27",
            "aisandbox-pa.googleapis.com": "srv_27",
            "proactivebackend-pa.googleapis.com": "srv_27",
            "cloudaicompanion.googleapis.com": "srv_27",
            "tasks.google.com": "srv_27",
            "tasks.sandbox.google.com": "srv_27",
            "tasks-pa.clients6.google.com": "srv_27"
        }

def save_state():
    try:
        with open(STATE_FILE, "w", encoding="utf-8") as f:
            json.dump({
                "activeServer": current_server,
                "pid": xray_process.pid if xray_process else None
            }, f, ensure_ascii=False, indent=2)
    except Exception:
        pass
    try:
        with open(DOMAIN_ROUTES_FILE, "w", encoding="utf-8") as f:
            json.dump(domain_routes, f, ensure_ascii=False, indent=2)
    except Exception:
        pass

def is_port_listening(port, host="127.0.0.1"):
    try:
        s = socket.create_connection((host, port), timeout=0.15)
        s.close()
        return True
    except Exception:
        return False

def can_bind_port(port, host="127.0.0.1"):
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 0)
        s.bind((host, port))
        s.close()
        return True
    except OSError:
        return False

def release_service_port():
    """If an old west_service is holding port 10850, terminate it so we can bind."""
    try:
        my_pid = os.getpid()
        for conn in psutil.net_connections(kind='tcp'):
            if conn.laddr and conn.laddr.port == SERVICE_PORT and conn.status in (psutil.CONN_LISTEN, 'LISTEN'):
                if conn.pid and conn.pid != my_pid:
                    try:
                        p = psutil.Process(conn.pid)
                        name = p.name().lower()
                        cmd = " ".join(p.cmdline() or []).lower()
                        if ("python" in name) and ("west_service" in cmd):
                            p.terminate()
                            try:
                                p.wait(timeout=1.0)
                            except Exception:
                                p.kill()
                    except Exception:
                        pass
    except Exception:
        pass

    if not can_bind_port(SERVICE_PORT):
        try:
            my_pid = os.getpid()
            for p in psutil.process_iter(['pid', 'name']):
                try:
                    name = (p.info.get('name') or '').lower()
                    if name in ('pythonw.exe', 'python.exe') and p.pid != my_pid:
                        cmd = " ".join(p.cmdline() or []).lower()
                        if "west_service" in cmd:
                            p.terminate()
                            try:
                                p.wait(timeout=1.0)
                            except Exception:
                                p.kill()
                except Exception:
                    pass
        except Exception:
            pass

    deadline = time.time() + 2.5
    while time.time() < deadline:
        if can_bind_port(SERVICE_PORT):
            break
        time.sleep(0.05)

def generate_xray_config(outbound_obj, custom_routes=None, pool=None):
    if custom_routes is None:
        with domain_routes_lock:
            custom_routes = dict(domain_routes)
    if pool is None:
        with server_pool_lock:
            pool = list(server_pool)

    outbound_obj["tag"] = "main"
    outbound_obj["mux"] = {"enabled": False, "concurrency": -1}
    if "streamSettings" not in outbound_obj:
        outbound_obj["streamSettings"] = {}
    if "sockopt" not in outbound_obj["streamSettings"]:
        outbound_obj["streamSettings"]["sockopt"] = {}
    outbound_obj["streamSettings"]["sockopt"]["tcpKeepAliveInterval"] = 15

    server_map = {s.get("id"): s for s in pool if s.get("id")}
    outbounds = [outbound_obj]
    added_tags = {"main", "direct", "dns-out"}

    us_server = None
    for s_id in custom_routes.values():
        if s_id in server_map:
            s_obj = server_map[s_id]
            if s_obj.get("flag") == "🇺🇸" or "usa" in s_obj.get("name", "").lower() or "us " in s_obj.get("name", "").lower():
                us_server = s_obj
                break
    if not us_server:
        us_server = server_map.get("srv_27") or next((s for s in pool if s.get("flag") == "🇺🇸" or "usa" in s.get("name", "").lower() or "us " in s.get("name", "").lower()), None)

    us_tag = None
    if us_server:
        us_tag = f"out_{us_server['id']}"
        if us_tag not in added_tags:
            us_out = parse_link_to_outbound(us_server.get("raw"))
            if us_out:
                us_out["tag"] = us_tag
                us_out["mux"] = {"enabled": False, "concurrency": -1}
                if "streamSettings" not in us_out:
                    us_out["streamSettings"] = {}
                if "sockopt" not in us_out["streamSettings"]:
                    us_out["streamSettings"]["sockopt"] = {}
                us_out["streamSettings"]["sockopt"]["tcpKeepAliveInterval"] = 15
                outbounds.append(us_out)
                added_tags.add(us_tag)

    for sid in set(custom_routes.values()):
        if not sid or sid == "direct":
            continue
        tag = f"out_{sid}"
        if tag in added_tags:
            continue
        if sid in server_map:
            s_obj = server_map[sid]
            c_out = parse_link_to_outbound(s_obj.get("raw"))
            if c_out:
                c_out["tag"] = tag
                c_out["mux"] = {"enabled": False, "concurrency": -1}
                if "streamSettings" not in c_out:
                    c_out["streamSettings"] = {}
                if "sockopt" not in c_out["streamSettings"]:
                    c_out["streamSettings"]["sockopt"] = {}
                c_out["streamSettings"]["sockopt"]["tcpKeepAliveInterval"] = 15
                outbounds.append(c_out)
                added_tags.add(tag)

    outbounds.append({
        "protocol": "freedom",
        "tag": "direct",
        "settings": {"domainStrategy": "UseIPv4"},
        "streamSettings": {"sockopt": {"tcpKeepAliveInterval": 15}}
    })
    outbounds.append({"protocol": "dns", "tag": "dns-out"})

    inbounds = [
        {
            "tag": "socks-in",
            "protocol": "socks",
            "listen": "127.0.0.1",
            "port": SOCKS_PORT,
            "sniffing": {
                "enabled": True,
                "destOverride": ["http", "tls"]
            },
            "settings": {"udp": True, "auth": "noauth", "userLevel": 0},
            "streamSettings": {
                "sockopt": {"tcpKeepAliveInterval": 15}
            }
        },
        {
            "tag": "http-in",
            "protocol": "http",
            "listen": "127.0.0.1",
            "port": HTTP_PORT,
            "sniffing": {
                "enabled": True,
                "destOverride": ["http", "tls"]
            },
            "settings": {"userLevel": 0},
            "streamSettings": {
                "sockopt": {"tcpKeepAliveInterval": 15}
            }
        }
    ]

    all_inbound_tags = ["socks-in", "http-in"]
    if us_tag and us_tag in added_tags:
        inbounds.append({
            "tag": "us-socks-in",
            "protocol": "socks",
            "listen": "127.0.0.1",
            "port": US_SOCKS_PORT,
            "sniffing": {
                "enabled": True,
                "destOverride": ["http", "tls"]
            },
            "settings": {"udp": True, "auth": "noauth", "userLevel": 0},
            "streamSettings": {
                "sockopt": {"tcpKeepAliveInterval": 15}
            }
        })
        inbounds.append({
            "tag": "us-http-in",
            "protocol": "http",
            "listen": "127.0.0.1",
            "port": US_HTTP_PORT,
            "sniffing": {
                "enabled": True,
                "destOverride": ["http", "tls"]
            },
            "settings": {"userLevel": 0},
            "streamSettings": {
                "sockopt": {"tcpKeepAliveInterval": 15}
            }
        })
        all_inbound_tags.extend(["us-socks-in", "us-http-in"])

    routing_rules = [
        {
            "type": "field",
            "inboundTag": all_inbound_tags,
            "port": 53,
            "outboundTag": "dns-out"
        },
        {
            "type": "field",
            "outboundTag": "direct",
            "port": 53,
            "network": "udp,tcp"
        }
    ]

    if us_tag and us_tag in added_tags:
        routing_rules.append({
            "type": "field",
            "inboundTag": ["us-socks-in", "us-http-in"],
            "outboundTag": us_tag
        })

    direct_domains = [f"domain:{d}" for d, s in custom_routes.items() if s == "direct"]
    if direct_domains:
        routing_rules.append({
            "type": "field",
            "inboundTag": ["socks-in", "http-in"],
            "domain": direct_domains,
            "outboundTag": "direct"
        })

    sid_to_doms = {}
    for dom, sid in custom_routes.items():
        if sid and sid != "direct":
            sid_to_doms.setdefault(sid, []).append(f"domain:{dom}")

    for sid, doms in sid_to_doms.items():
        target_tag = f"out_{sid}" if f"out_{sid}" in added_tags else "main"
        routing_rules.append({
            "type": "field",
            "inboundTag": ["socks-in", "http-in"],
            "domain": doms,
            "outboundTag": target_tag
        })

    routing_rules.append({
        "type": "field",
        "inboundTag": ["socks-in", "http-in"],
        "outboundTag": "main"
    })

    return {
        "log": {"loglevel": "warning"},
        "dns": {
            "hosts": {
                "dns.google": "8.8.8.8",
                "cloudflare-dns.com": "1.1.1.1",
                "one.one.one.one": "1.1.1.1"
            },
            "servers": [
                "https://1.1.1.1/dns-query",
                "https://8.8.8.8/dns-query",
                "https://dns.google/dns-query",
                "1.1.1.1",
                "8.8.8.8",
                "9.9.9.9"
            ],
            "queryStrategy": "UseIPv4"
        },
        "policy": {
            "levels": {
                "0": {
                    "handshake": 4,
                    "connIdle": 300,
                    "uplinkOnly": 2,
                    "downlinkOnly": 5,
                    "bufferSize": 512
                },
                "8": {
                    "handshake": 4,
                    "connIdle": 300,
                    "uplinkOnly": 2,
                    "downlinkOnly": 5,
                    "bufferSize": 512
                }
            }
        },
        "inbounds": inbounds,
        "outbounds": outbounds,
        "routing": {
            "domainStrategy": "AsIs",
            "rules": routing_rules
        }
    }

def capture_stream(stream):
    try:
        for line in iter(stream.readline, b""):
            text = line.decode("utf-8", "ignore").strip()
            if text:
                with log_lock:
                    log_buffer.append(text)
    except Exception:
        pass
    finally:
        try:
            stream.close()
        except Exception:
            pass

def get_west_xray_pids():
    """
    Finds ONLY West Client's own xraycore processes.
    STRICT RULE: Do NOT kill or touch external VPNs, v2RayTun, or other xraycore instances running for other tools.
    Only target West Client's own xraycore running active_config.json or located in West Client core dir.
    """
    pids = set()

    # 1. Check PID from state.json
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, "r", encoding="utf-8") as f:
                st = json.load(f)
                saved_pid = st.get("pid")
                if saved_pid and isinstance(saved_pid, int):
                    pids.add(saved_pid)
        except Exception:
            pass

    # 2. Port owner inspection (find any process holding 10818, 10819, 10820, 10821)
    try:
        for conn in psutil.net_connections(kind='tcp'):
            if conn.laddr and conn.laddr.port in (SOCKS_PORT, HTTP_PORT, US_SOCKS_PORT, US_HTTP_PORT):
                if conn.pid:
                    pids.add(conn.pid)
    except Exception:
        pass

    # 3. Fast name-filtered process inspection via psutil (~0.005s)
    psutil_ok = False
    try:
        for p in psutil.process_iter(['pid', 'name']):
            try:
                name = (p.info.get('name') or '').lower()
                if name in ('xraycore.exe', 'xray.exe'):
                    pids.add(p.pid)
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                pass
        psutil_ok = True
    except Exception:
        psutil_ok = False

    # 4. Fallback to PowerShell ONLY if psutil failed or is unavailable
    if not psutil_ok and not pids:
        try:
            ps_cmd = [
                "powershell", "-NoProfile", "-Command",
                "Get-CimInstance Win32_Process | Where-Object { ($_.Name -like '*xray*') -and ($_.CommandLine -like '*active_config.json*') } | Select-Object -ExpandProperty ProcessId"
            ]
            res = subprocess.run(ps_cmd, capture_output=True, text=True, timeout=5, creationflags=CREATION_FLAGS)
            for line in res.stdout.split():
                if line.strip().isdigit():
                    pids.add(int(line.strip()))
        except Exception:
            pass

    # Strict safety filter: verify every PID is genuinely a West Client xraycore process
    verified_pids = []
    for pid in list(pids):
        is_safe = False
        try:
            proc = psutil.Process(pid)
            name = proc.name().lower()
            if name not in ('xraycore.exe', 'xray.exe'):
                continue

            exe_path = ""
            try:
                exe_path = os.path.realpath(proc.exe() or "").lower()
            except Exception:
                pass

            cmd = ""
            try:
                cmd = " ".join(proc.cmdline() or []).lower()
            except Exception:
                pass

            if (REAL_CORE_DIR in exe_path) or ("active_config.json" in cmd) or ("west client" in exe_path) or ("west client" in cmd):
                is_safe = True
        except (psutil.NoSuchProcess, psutil.AccessDenied, Exception):
            try:
                ps_verify = [
                    "powershell", "-NoProfile", "-Command",
                    f"(Get-CimInstance Win32_Process | Where-Object {{ $_.ProcessId -eq {pid} }} | Select-Object -ExpandProperty CommandLine)"
                ]
                v_res = subprocess.run(ps_verify, capture_output=True, text=True, timeout=3, creationflags=CREATION_FLAGS)
                v_out = v_res.stdout.lower()
                if "active_config.json" in v_out or "west client" in v_out:
                    is_safe = True
            except Exception:
                pass
        if is_safe:
            verified_pids.append(pid)

    return verified_pids

def stop_xray():
    global xray_process
    # 1. Terminate tracked xray_process
    if xray_process:
        try:
            xray_process.terminate()
            xray_process.wait(timeout=1.0)
        except Exception:
            try:
                xray_process.kill()
            except Exception:
                pass
        xray_process = None

    # 2. Terminate any orphan West Client xraycore running active_config.json
    orphan_pids = get_west_xray_pids()
    for pid in orphan_pids:
        try:
            p = psutil.Process(pid)
            p.terminate()
            try:
                p.wait(timeout=1.0)
            except (psutil.TimeoutExpired, Exception):
                p.kill()
        except psutil.NoSuchProcess:
            pass
        except Exception:
            try:
                subprocess.run(["taskkill", "/F", "/PID", str(pid)], capture_output=True, creationflags=CREATION_FLAGS)
            except Exception:
                pass

    # 3. Wait for inbound ports to be released and freely bindable
    deadline = time.time() + 2.5
    while time.time() < deadline:
        if can_bind_port(SOCKS_PORT) and can_bind_port(HTTP_PORT) and can_bind_port(US_SOCKS_PORT) and can_bind_port(US_HTTP_PORT):
            break
        time.sleep(0.05)

    save_state()

def start_xray(server_obj, retry_on_bind=True, validate_connectivity=True):
    global xray_process, current_server
    if not server_obj or not server_obj.get("raw"):
        return False, "Не указан raw-конфиг сервера"

    outbound = parse_link_to_outbound(server_obj["raw"])
    if not outbound:
        return False, "Не удалось распознать формат ссылки сервера"

    cfg = generate_xray_config(outbound)
    with open(ACTIVE_CONFIG, "w", encoding="utf-8") as f:
        json.dump(cfg, f, ensure_ascii=False, indent=2)

    stop_xray()
    with log_lock:
        log_buffer.clear()

    # Pre-verify ports are released and freely bindable
    deadline = time.time() + 2.0
    while time.time() < deadline:
        if can_bind_port(SOCKS_PORT) and can_bind_port(HTTP_PORT) and can_bind_port(US_SOCKS_PORT) and can_bind_port(US_HTTP_PORT):
            break
        time.sleep(0.05)

    creation_flags = 0x08000000 if os.name == "nt" else 0
    try:
        xray_process = subprocess.Popen(
            [XRAY_EXE, "run", "--path", ACTIVE_CONFIG, "--asset-dir", CORE_DIR],
            creationflags=creation_flags,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        threading.Thread(target=capture_stream, args=(xray_process.stdout,), daemon=True).start()
        threading.Thread(target=capture_stream, args=(xray_process.stderr,), daemon=True).start()

        # Wait up to 3.0 seconds for xray to bind to SOCKS port or exit on error
        for _ in range(30):
            exit_code = xray_process.poll()
            if exit_code is not None:
                with log_lock:
                    err_text = " ".join(list(log_buffer)[-5:])
                if retry_on_bind and ("listen tcp" in err_text or "bind:" in err_text or "Only one usage" in err_text):
                    stop_xray()
                    time.sleep(0.25)
                    return start_xray(server_obj, retry_on_bind=False, validate_connectivity=validate_connectivity)
                xray_process = None
                save_state()
                return False, f"Xray завершился с кодом {exit_code}: {err_text or 'Неизвестная ошибка конфигурации'}"
            if is_port_listening(SOCKS_PORT):
                break
            time.sleep(0.1)

        exit_code = xray_process.poll()
        if exit_code is not None:
            with log_lock:
                err_text = " ".join(list(log_buffer)[-5:])
            if retry_on_bind and ("listen tcp" in err_text or "bind:" in err_text or "Only one usage" in err_text):
                stop_xray()
                time.sleep(0.25)
                return start_xray(server_obj, retry_on_bind=False, validate_connectivity=validate_connectivity)
            xray_process = None
            save_state()
            return False, f"Xray завершился с кодом {exit_code}: {err_text or 'Ошибка запуска'}"

        if validate_connectivity:
            # Active connectivity probe to verify real TLS/data throughput through the newly bound core
            time.sleep(0.15)
            alive = test_socks_proxy_alive(SOCKS_PORT, timeout=3.5)
            if not alive:
                time.sleep(0.2)
                alive = test_socks_proxy_alive(SOCKS_PORT, timeout=3.5)

            if not alive:
                stop_xray()
                current_server = None
                save_state()
                return False, f"Узел {server_obj.get('name', 'VPN')} не отвечает на TLS/Reality запросы или заблокирован ТСПУ"

        current_server = server_obj
        save_state()
        return True, "OK"
    except Exception as e:
        xray_process = None
        save_state()
        return False, str(e)

def test_socks_proxy_alive(port=SOCKS_PORT, timeout=4.0):
    try:
        s = socket.create_connection(("127.0.0.1", port), timeout=timeout)
        s.sendall(b"\x05\x01\x00")
        r1 = s.recv(2)
        if r1 != b"\x05\x00":
            s.close()
            return False

        target_host = "cloudflare.com"
        target_port = 443
        domain_bytes = target_host.encode("ascii")
        req = b"\x05\x01\x00\x03" + bytes([len(domain_bytes)]) + domain_bytes + target_port.to_bytes(2, "big")
        s.sendall(req)

        # Accurately read entire SOCKS5 reply frame (RFC 1928)
        reply_head = b""
        while len(reply_head) < 4:
            chunk = s.recv(4 - len(reply_head))
            if not chunk:
                s.close()
                return False
            reply_head += chunk

        if reply_head[1] != 0:
            s.close()
            return False

        atyp = reply_head[3]
        if atyp == 1:
            bytes_to_read = 6  # IPv4 (4) + port (2)
        elif atyp == 3:
            l_byte = s.recv(1)
            if not l_byte:
                s.close()
                return False
            bytes_to_read = l_byte[0] + 2  # Domain + port
        elif atyp == 4:
            bytes_to_read = 18  # IPv6 (16) + port (2)
        else:
            s.close()
            return False

        rem = b""
        while len(rem) < bytes_to_read:
            chunk = s.recv(bytes_to_read - len(rem))
            if not chunk:
                break
            rem += chunk

        # Socket buffer is clean; start TLS probe
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        ss = ctx.wrap_socket(s, server_hostname=target_host)
        ss.settimeout(timeout)
        ss.sendall(b"HEAD /cdn-cgi/trace HTTP/1.1\r\nHost: cloudflare.com\r\nConnection: close\r\n\r\n")
        data = ss.recv(64)
        ss.close()
        return len(data) > 0 and b"HTTP/" in data
    except Exception:
        return False

def perform_auto_failover():
    global current_server, last_failover_time, last_failover_event, consecutive_probe_failures
    now = time.time()
    if now - last_failover_time < 10:
        return False

    old_server_name = current_server.get("name") if current_server else "None"
    old_id = current_server.get("id") if current_server else None

    with server_pool_lock:
        candidates = list(server_pool)

    if not candidates:
        load_server_pool()
        with server_pool_lock:
            candidates = list(server_pool)

    if not candidates:
        with log_lock:
            log_buffer.append("[Watchdog Failover] Server pool is empty, cannot failover")
        return False

    pool = [s for s in candidates if s.get("id") != old_id and s.get("raw")]
    if not pool:
        return False

    def candidate_score(s):
        sid = s.get("id") or ""
        sni = (s.get("sni") or "").lower()
        proto = (s.get("proto") or "").lower()
        score = 1000
        # Priority for known verified high-reliability nodes (e.g. Latvia srv_13, Finland srv_9, UK srv_7, Poland srv_22, Germany)
        if sid == "srv_13":  # Latvia
            score -= 850
        elif sid == "srv_9":  # Finland
            score -= 800
        elif sid == "srv_7":  # UK
            score -= 750
        elif sid == "srv_22":  # Poland
            score -= 700
        elif sid in ("srv_32", "srv_33"):  # Germany
            score -= 650

        if any(x in sni for x in ("farmerly.cc", "ibm.com", "cloudflare", "fastly", "suzuki.lol")):
            score -= 300
        if "cendora.ru" in sni or "videofriend" in sni:
            score += 5000
        if proto in ("hy2", "hysteria2"):
            score += 400
        return score

    pool.sort(key=candidate_score)

    with log_lock:
        log_buffer.append(f"[Watchdog Failover] Active node '{old_server_name}' failed. Testing {len(pool)} failover candidates...")

    for candidate in pool[:15]:
        h = candidate.get("host")
        p = candidate.get("port", 443)
        lat = tcp_ping(h, p, timeout=1.5)
        if lat is None:
            continue

        with log_lock:
            log_buffer.append(f"[Watchdog Failover] Attempting switch to {candidate.get('name')} ({lat}ms)...")

        ok, msg = start_xray(candidate, validate_connectivity=True)
        if ok:
            last_failover_time = time.time()
            consecutive_probe_failures = 0
            last_failover_event = {
                "previousServer": old_server_name,
                "newServer": candidate,
                "timestamp": last_failover_time,
                "reason": "TSPU block / TLS handshake failure detected"
            }
            save_state()
            with log_lock:
                log_buffer.append(f"[Watchdog Failover] SUCCESS: switched to {candidate.get('name')}")
            return True

    with log_lock:
        log_buffer.append("[Watchdog Failover] All candidate servers unreachable or blocked")
    return False

def watchdog_loop():
    global consecutive_probe_failures
    last_probe_time = 0
    while True:
        try:
            time.sleep(3.0)
            if watchdog_paused or not current_server:
                continue

            # Check 1: Process liveness (PID died or port 10818 closed)
            is_dead = (xray_process is None) or (xray_process.poll() is not None) or not is_port_listening(SOCKS_PORT)
            if is_dead:
                with log_lock:
                    log_buffer.append(f"[Watchdog] Xraycore stopped or port {SOCKS_PORT} down. Auto-recovering...")
                ok, msg = start_xray(current_server, validate_connectivity=False)
                if not ok:
                    consecutive_probe_failures += 1
                    if consecutive_probe_failures >= 2:
                        perform_auto_failover()
                else:
                    consecutive_probe_failures = 0
                continue

            # Check 2: Active connectivity probe (every 15s)
            now = time.time()
            if now - last_probe_time >= 15:
                last_probe_time = now
                alive = test_socks_proxy_alive(SOCKS_PORT, timeout=3.5)
                if alive:
                    consecutive_probe_failures = 0
                else:
                    # Retry once to avoid transient glitches
                    time.sleep(1.0)
                    alive2 = test_socks_proxy_alive(SOCKS_PORT, timeout=3.5)
                    if alive2:
                        consecutive_probe_failures = 0
                    else:
                        consecutive_probe_failures += 1
                        with log_lock:
                            log_buffer.append(f"[Watchdog] Connectivity probe failed ({consecutive_probe_failures}/2)")
                        if consecutive_probe_failures >= 2:
                            perform_auto_failover()
        except Exception:
            time.sleep(2.0)

def tcp_ping(host, port, timeout=2.0):
    if not host or not port:
        return None
    t0 = time.time()
    try:
        s = socket.create_connection((host, int(port)), timeout=timeout)
        s.close()
        return round((time.time() - t0) * 1000)
    except Exception:
        return None

def check_external_core():
    for p in (10808, 10809, 2080, 7890):
        try:
            s = socket.create_connection(("127.0.0.1", p), timeout=0.15)
            s.close()
            return True, p
        except Exception:
            pass
    return False, None

class CoreHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        return

    def send_cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors()
        self.end_headers()

    def send_json(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_cors()
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        global current_server, xray_process
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path

        if path == "/status":
            is_running = (xray_process is not None and xray_process.poll() is None) or is_port_listening(SOCKS_PORT)
            ext_running, ext_port = check_external_core()
            resp = {
                "online": True,
                "xrayRunning": is_running,
                "activeServer": current_server,
                "socksPort": SOCKS_PORT,
                "httpPort": HTTP_PORT,
                "usSocksPort": US_SOCKS_PORT,
                "usHttpPort": US_HTTP_PORT,
                "usTunnelActive": is_port_listening(US_SOCKS_PORT),
                "domainRoutesCount": len(domain_routes),
                "externalCoreRunning": ext_running,
                "externalCorePort": ext_port,
                "watchdogActive": True,
                "failoverEvent": last_failover_event
            }
            self.send_json(200, resp)

        elif path == "/domain_routes":
            with domain_routes_lock:
                self.send_json(200, {"success": True, "domainRoutes": domain_routes})

        elif path == "/diagnose":
            is_running = (xray_process is not None and xray_process.poll() is None) or is_port_listening(SOCKS_PORT)
            ext_running, ext_port = check_external_core()

            srv_ping = None
            srv_reachable = False
            h = current_server.get("host") if current_server else None
            p = current_server.get("port") if current_server else None
            if current_server and not h and current_server.get("raw"):
                try:
                    u = urllib.parse.urlparse(current_server["raw"])
                    h = u.hostname
                    p = u.port or 443
                except Exception:
                    pass

            if h and p:
                srv_ping = tcp_ping(h, p, timeout=2.5)
                srv_reachable = srv_ping is not None

            doh_ok = False
            try:
                s = socket.create_connection(("1.1.1.1", 443), timeout=1.5)
                s.close()
                doh_ok = True
            except Exception:
                pass

            with log_lock:
                recent_logs = list(log_buffer)[-30:]

            recs = []
            has_mitm_error = any("REALITY: received real certificate" in line for line in recent_logs)
            proto = (current_server.get("proto") or "").lower() if current_server else ""

            if not is_running:
                recs.append("Встроенное ядро Xray не запущено. Выберите узел связи в списке для запуска.")
            if current_server and not srv_reachable:
                recs.append(f"Сервер {current_server.get('name', '')} ({h}:{p}) недоступен по TCP. Нажмите «⚡ Мин. пинг» для выбора доступного сервера.")
            if has_mitm_error:
                recs.append(f"Ошибка проверки ключей Reality у текущего сервера (REALITY: received real certificate). Ключи узла устарели или перехвачены ТСПУ. Нажмите «⚡ Мин. пинг» для автоматического переключения на узел с действующими ключами (UK, Finland, DE).")
            if proto in ("hysteria2", "hy2"):
                recs.append("Протокол Hysteria2 использует UDP, который может фильтроваться или замедляться провайдером. При задержках переключитесь на VLESS Reality.")
            if not doh_ok:
                recs.append("Порт 443 к Cloudflare DoH (1.1.1.1) недоступен. Проверьте интернет-соединение.")
            if ext_running:
                recs.append(f"Обнаружено внешнее ядро v2RayTun / Sing-Box на порту {ext_port}. В браузере умная маршрутизация автоматически использует его как резервный канал.")
            if not recs:
                recs.append("Все узлы связи работают штатно. Пинг минимальный, соединение стабильно.")

            resp = {
                "westService": {"online": True, "port": SERVICE_PORT},
                "xrayCore": {
                    "running": is_running,
                    "pid": xray_process.pid if (xray_process and xray_process.poll() is None) else None,
                    "socksPort": SOCKS_PORT,
                    "httpPort": HTTP_PORT,
                    "logs": recent_logs
                },
                "externalCore": {
                    "running": ext_running,
                    "port": ext_port
                },
                "activeServer": {
                    "server": current_server,
                    "reachable": srv_reachable,
                    "ping": srv_ping
                },
                "network": {
                    "dohReachable": doh_ok
                },
                "recommendations": recs
            }
            self.send_json(200, resp)

        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        global current_server
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path

        try:
            content_length = int(self.headers.get("Content-Length", 0))
        except (ValueError, TypeError):
            content_length = 0

        body = self.rfile.read(content_length) if content_length > 0 else b"{}"

        try:
            data = json.loads(body.decode("utf-8")) if body else {}
        except Exception:
            data = {}

        if path == "/select_server":
            global watchdog_paused
            watchdog_paused = True
            try:
                server = data.get("server")
                success, msg = start_xray(server)
                resp = {"success": success, "message": msg, "activeServer": current_server}
                self.send_json(200 if success else 400, resp)
            finally:
                watchdog_paused = False

        elif path == "/sync_servers":
            srvs = data.get("servers", [])
            if srvs and isinstance(srvs, list):
                with server_pool_lock:
                    server_pool = srvs
                try:
                    with open(SERVERS_CACHE_FILE, "w", encoding="utf-8") as f:
                        json.dump(srvs, f, ensure_ascii=False, indent=2)
                except Exception:
                    pass
                self.send_json(200, {"success": True, "count": len(srvs)})
            else:
                self.send_json(400, {"success": False, "error": "Invalid servers list"})

        elif path == "/set_domain_routes":
            routes = data.get("domainRoutes", {})
            if isinstance(routes, dict):
                with domain_routes_lock:
                    global domain_routes
                    domain_routes = routes
                try:
                    with open(DOMAIN_ROUTES_FILE, "w", encoding="utf-8") as f:
                        json.dump(routes, f, ensure_ascii=False, indent=2)
                except Exception:
                    pass
                if current_server:
                    ok, msg = start_xray(current_server)
                    self.send_json(200 if ok else 500, {"success": ok, "message": msg, "count": len(routes)})
                else:
                    self.send_json(200, {"success": True, "count": len(routes)})
            else:
                self.send_json(400, {"success": False, "error": "Invalid domainRoutes"})

        elif path == "/ping_server":
            host = data.get("host")
            port = data.get("port")
            if not host and data.get("raw"):
                try:
                    u = urllib.parse.urlparse(data["raw"])
                    host = u.hostname
                    port = u.port or 443
                except Exception:
                    pass

            latency = tcp_ping(host, port, timeout=2.5)
            if latency is not None:
                self.send_json(200, {"success": True, "latency": latency})
            else:
                self.send_json(200, {"success": False, "error": "Timeout / Host unreachable"})

        elif path == "/ping_servers":
            servers = data.get("servers", [])
            results = {}

            def check_srv(s):
                sid = s.get("id")
                h = s.get("host")
                p = s.get("port", 443)
                lat = tcp_ping(h, p, timeout=2.0)
                return sid, lat, s

            with ThreadPoolExecutor(max_workers=25) as executor:
                futures = [executor.submit(check_srv, s) for s in servers if s.get("id")]
                raw_results = []
                for f in futures:
                    try:
                        sid, lat, s = f.result()
                        results[sid] = lat
                        if lat is not None:
                            raw_results.append((sid, lat, s))
                    except Exception:
                        pass

            # Smart min ping ranking:
            # Nodes with known broken SNI like 'cendora.ru' (Reality MITM error) are penalized,
            # prioritizing verified working nodes (ibm.com, anicdn, farmerly, etc.)
            def score_node(item):
                sid, lat, s = item
                sni = (s.get("sni") or "").lower()
                proto = (s.get("proto") or "").lower()
                name = (s.get("name") or "").lower()
                penalty = 0
                if "cendora.ru" in sni:
                    penalty += 5000  # Deprioritize known broken Reality keys
                if "videofriend" in sni:
                    penalty += 5000  # Deprioritize dead grpc-tunnel
                if "anicdn.fun" in sni:
                    penalty += 5000  # Deprioritize failing Finland TCP
                if proto in ("hy2", "hysteria2"):
                    penalty += 1000  # Deprioritize UDP due to TSPU packet drop
                # If latency is unrealistically low (< 10ms) for an international endpoint,
                # it is a local middlebox/CDN edge ACK rather than a genuine overseas tunnel:
                if lat < 10 and not ("russia" in name or "🇷🇺" in name or ".ru" in sni):
                    penalty += 400
                # Prioritize verified reliable domains (ibm.com, fastly, farmerly, etc.)
                if any(x in sni for x in ("ibm.com", "farmerly.cc", "cloudflare", "fastly", "yandex-api.store")):
                    penalty -= 200
                return lat + penalty

            raw_results.sort(key=score_node)
            min_id = raw_results[0][0] if raw_results else None
            min_lat = results.get(min_id) if min_id else None

            self.send_json(200, {
                "success": True,
                "results": results,
                "minPingId": min_id,
                "minLatency": min_lat
            })

        elif path == "/fetch_sub":
            url = data.get("url", "").strip()
            if not url:
                self.send_json(400, {"success": False, "error": "URL не указан"})
                return

            req = urllib.request.Request(url, headers={
                "User-Agent": "v2rayNG/1.8.5",
                "Accept": "*/*"
            })
            # Context for cases where subscription endpoint has custom/expired SSL cert
            ssl_ctx = None
            if ssl is not None:
                try:
                    ssl_ctx = ssl.create_default_context()
                    ssl_ctx.check_hostname = False
                    ssl_ctx.verify_mode = ssl.CERT_NONE
                except Exception:
                    ssl_ctx = None

            try:
                open_kwargs = {"timeout": 10}
                if ssl_ctx is not None:
                    open_kwargs["context"] = ssl_ctx
                with urllib.request.urlopen(req, **open_kwargs) as res:
                    raw_text = res.read().decode("utf-8", "ignore")
                    headers_dict = dict(res.headers.items())
                    self.send_json(200, {
                        "success": True,
                        "data": raw_text,
                        "headers": headers_dict
                    })
            except Exception as e:
                self.send_json(200, {"success": False, "error": str(e)})

        elif path == "/shutdown":
            self.send_json(200, {"success": True, "message": "West Service shutting down"})
            threading.Thread(target=lambda: (time.sleep(0.2), stop_xray(), os._exit(0))).start()

        else:
            self.send_response(404)
            self.end_headers()

def main():
    global current_server
    try:
        load_state()
        load_server_pool()
        if not can_bind_port(SERVICE_PORT):
            release_service_port()
        stop_xray()  # Terminate any orphaned West Client xraycore before starting
        if current_server:
            ok, _ = start_xray(current_server)
            if not ok:
                current_server = None
        if not current_server:
            # Default working UK server
            default_link = "vless://185e2bb3-2934-48d0-bbd5-dd20d16e83ee@104.194.141.56:443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&sni=ibm.com&fp=firefox&sid=359a73eef9d34266&pbk=twBuhDINIiFlIGYOJydRfRTbIXXo90hnjX0t2atMwik#%F0%9F%87%AC%F0%9F%87%A7%20%F0%9F%A4%96%20%E2%99%BE%EF%B8%8F%20United%20Kingdom%20%7C%20TCP-1%20%28AI%29"
            default_srv = {
                "id": "srv_7",
                "name": "🇬🇧 🤖 ♾️ United Kingdom | TCP-1 (AI)",
                "flag": "🇬🇧",
                "proto": "vless",
                "host": "104.194.141.56",
                "port": 443,
                "type": "tcp",
                "security": "reality",
                "sni": "ibm.com",
                "path": "",
                "raw": default_link
            }
            ok, _ = start_xray(default_srv)
            if not ok:
                perform_auto_failover()

        # Start automated background watchdog
        watchdog_t = threading.Thread(target=watchdog_loop, daemon=True)
        watchdog_t.start()

        server = HTTPServer(("127.0.0.1", SERVICE_PORT), CoreHandler)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            stop_xray()
            server.server_close()
    except Exception as e:
        import traceback
        with open(os.path.join(CORE_DIR, "crash.log"), "w", encoding="utf-8") as f:
            traceback.print_exc(file=f)

if __name__ == "__main__":
    main()
