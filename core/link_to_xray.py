import json
import base64
import urllib.parse

def clean_unquote(s):
    if not s:
        return ""
    try:
        return urllib.parse.unquote(s)
    except Exception:
        return s

def safe_int_port(port_val, default=443):
    try:
        p = int(port_val)
        if 1 <= p <= 65535:
            return p
    except Exception:
        pass
    return default

def parse_link_to_outbound(raw_link):
    if not raw_link or "://" not in raw_link:
        return None
    raw_link = raw_link.strip()
    proto = raw_link.split("://")[0].lower().strip()

    if proto == "vless":
        try:
            u = urllib.parse.urlparse(raw_link)
            uuid = clean_unquote(u.username or "")
            host = u.hostname or ""
            port = safe_int_port(u.port, 443)
            qs = urllib.parse.parse_qs(u.query)

            if not host or not uuid:
                return None

            security = qs.get("security", ["none"])[0]
            net_type = qs.get("type", ["tcp"])[0]
            flow = qs.get("flow", [""])[0]
            sni = qs.get("sni", [host])[0]
            fp = qs.get("fp", ["chrome"])[0]
            pbk = qs.get("pbk", [""])[0] or qs.get("publicKey", [""])[0]
            sid = qs.get("sid", [""])[0] or qs.get("shortId", [""])[0]
            spx = qs.get("spx", [""])[0] or qs.get("spiderX", [""])[0]
            path = clean_unquote(qs.get("path", [""])[0])
            ws_host = qs.get("host", [""])[0] or sni or host
            service_name = qs.get("serviceName", [""])[0] or qs.get("service_name", [""])[0]
            mode = qs.get("mode", [""])[0]
            alpn_raw = qs.get("alpn", [""])[0]
            extra_raw = qs.get("extra", [""])[0]

            user_obj = {
                "id": uuid,
                "level": 8,
                "encryption": "none"
            }
            if flow:
                user_obj["flow"] = flow

            stream = {
                "network": net_type,
                "security": security
            }

            if security == "reality":
                r_set = {
                    "serverName": sni,
                    "publicKey": pbk,
                    "shortId": sid,
                    "spiderX": spx or "/",
                    "fingerprint": fp
                }
                stream["realitySettings"] = r_set
            elif security == "tls":
                tls_set = {
                    "serverName": sni,
                    "fingerprint": fp
                }
                if alpn_raw:
                    tls_set["alpn"] = [x.strip() for x in clean_unquote(alpn_raw).split(",") if x.strip()]
                stream["tlsSettings"] = tls_set

            if net_type == "ws":
                ws_set = {"path": path or "/"}
                if ws_host:
                    ws_set["headers"] = {"Host": ws_host}
                stream["wsSettings"] = ws_set
            elif net_type == "grpc":
                stream["grpcSettings"] = {"serviceName": service_name, "multiMode": True}
            elif net_type in ("xhttp", "splithttp"):
                stream["network"] = "xhttp"
                xhttp_set = {
                    "path": path or "/",
                    "mode": mode or "auto"
                }
                if ws_host:
                    xhttp_set["host"] = ws_host
                if extra_raw:
                    try:
                        xhttp_set["extra"] = json.loads(clean_unquote(extra_raw))
                    except Exception:
                        pass
                stream["xhttpSettings"] = xhttp_set

            return {
                "tag": "proxy",
                "protocol": "vless",
                "settings": {
                    "vnext": [{
                        "address": host,
                        "port": port,
                        "users": [user_obj]
                    }]
                },
                "streamSettings": stream
            }
        except Exception:
            return None

    elif proto == "trojan":
        try:
            u = urllib.parse.urlparse(raw_link)
            password = clean_unquote(u.username or u.password or "")
            host = u.hostname or ""
            port = safe_int_port(u.port, 443)
            qs = urllib.parse.parse_qs(u.query)

            if not host or not password:
                return None

            security = qs.get("security", ["tls"])[0]
            net_type = qs.get("type", ["tcp"])[0]
            sni = qs.get("sni", [host])[0]
            fp = qs.get("fp", ["chrome"])[0]
            path = clean_unquote(qs.get("path", [""])[0])
            ws_host = qs.get("host", [""])[0] or sni or host
            service_name = qs.get("serviceName", [""])[0] or qs.get("service_name", [""])[0]
            alpn_raw = qs.get("alpn", [""])[0]

            stream = {
                "network": net_type,
                "security": security
            }

            if security == "tls":
                tls_set = {
                    "serverName": sni,
                    "fingerprint": fp
                }
                if alpn_raw:
                    tls_set["alpn"] = [x.strip() for x in clean_unquote(alpn_raw).split(",") if x.strip()]
                stream["tlsSettings"] = tls_set
            elif security == "reality":
                pbk = qs.get("pbk", [""])[0] or qs.get("publicKey", [""])[0]
                sid = qs.get("sid", [""])[0] or qs.get("shortId", [""])[0]
                spx = qs.get("spx", [""])[0] or qs.get("spiderX", [""])[0]
                stream["realitySettings"] = {
                    "serverName": sni,
                    "publicKey": pbk,
                    "shortId": sid,
                    "spiderX": spx or "/",
                    "fingerprint": fp
                }

            if net_type == "ws":
                ws_set = {"path": path or "/"}
                if ws_host:
                    ws_set["headers"] = {"Host": ws_host}
                stream["wsSettings"] = ws_set
            elif net_type == "grpc":
                stream["grpcSettings"] = {"serviceName": service_name, "multiMode": True}

            return {
                "tag": "proxy",
                "protocol": "trojan",
                "settings": {
                    "servers": [{
                        "address": host,
                        "port": port,
                        "password": password
                    }]
                },
                "streamSettings": stream
            }
        except Exception:
            return None

    elif proto == "vmess":
        try:
            after = raw_link[8:].split("#")[0]
            pad = len(after) % 4
            if pad:
                after += "=" * (4 - pad)
            json_str = base64.b64decode(after).decode("utf-8", "ignore")
            obj = json.loads(json_str)

            host = obj.get("add", "")
            port = safe_int_port(obj.get("port"), 443)
            uuid = obj.get("id", "")
            aid = int(obj.get("aid", 0))
            scy = obj.get("scy", "auto")
            net_type = obj.get("net", "tcp")
            tls = obj.get("tls", "none")
            sni = obj.get("sni") or obj.get("host") or host
            path = obj.get("path", "")
            fp = obj.get("fp", "chrome")
            alpn_raw = obj.get("alpn", "")

            if not host or not uuid:
                return None

            stream = {
                "network": net_type,
                "security": "tls" if tls == "tls" else "none"
            }

            if tls == "tls":
                tls_set = {
                    "serverName": sni,
                    "fingerprint": fp
                }
                if alpn_raw:
                    tls_set["alpn"] = [x.strip() for x in alpn_raw.split(",") if x.strip()]
                stream["tlsSettings"] = tls_set

            if net_type == "ws":
                ws_set = {"path": path or "/"}
                ws_host = obj.get("host") or sni or host
                if ws_host:
                    ws_set["headers"] = {"Host": ws_host}
                stream["wsSettings"] = ws_set
            elif net_type == "grpc":
                stream["grpcSettings"] = {"serviceName": path or "", "multiMode": True}

            return {
                "tag": "proxy",
                "protocol": "vmess",
                "settings": {
                    "vnext": [{
                        "address": host,
                        "port": port,
                        "users": [{
                            "id": uuid,
                            "alterId": aid,
                            "security": scy,
                            "level": 8
                        }]
                    }]
                },
                "streamSettings": stream
            }
        except Exception:
            return None

    elif proto in ("hysteria2", "hy2"):
        try:
            u = urllib.parse.urlparse(raw_link)
            auth = clean_unquote(u.username or u.password or "")
            host = u.hostname or ""
            port = safe_int_port(u.port, 443)
            qs = urllib.parse.parse_qs(u.query)
            sni = qs.get("sni", [host])[0]

            if not host or not auth:
                return None

            return {
                "tag": "proxy",
                "protocol": "hysteria",
                "settings": {
                    "version": 2,
                    "address": host,
                    "port": port
                },
                "streamSettings": {
                    "network": "hysteria",
                    "security": "tls",
                    "tlsSettings": {"serverName": sni},
                    "hysteriaSettings": {
                        "version": 2,
                        "auth": auth
                    }
                }
            }
        except Exception:
            return None

    elif proto == "ss":
        try:
            clean_link = raw_link.split("#")[0]
            after_proto = clean_link[5:]
            host = ""
            port = 8388
            method = "aes-128-gcm"
            password = ""

            if "@" in after_proto:
                auth_part, hp = after_proto.split("@", 1)
                try:
                    pad = len(auth_part) % 4
                    if pad:
                        auth_part += "=" * (4 - pad)
                    decoded_auth = base64.b64decode(auth_part).decode("utf-8", "ignore")
                    if ":" in decoded_auth:
                        method, password = decoded_auth.split(":", 1)
                    else:
                        method, password = auth_part.split(":", 1)
                except Exception:
                    if ":" in auth_part:
                        method, password = auth_part.split(":", 1)
                
                if ":" in hp:
                    host, port_s = hp.split(":", 1)
                    port_s = port_s.split("/")[0].split("?")[0]
                    port = safe_int_port(port_s, 8388)
                else:
                    host = hp.split("/")[0].split("?")[0]
            else:
                try:
                    pad = len(after_proto) % 4
                    if pad:
                        after_proto += "=" * (4 - pad)
                    decoded = base64.b64decode(after_proto).decode("utf-8", "ignore")
                    if "@" in decoded:
                        auth_part, hp = decoded.split("@", 1)
                        if ":" in auth_part:
                            method, password = auth_part.split(":", 1)
                        if ":" in hp:
                            host, port_s = hp.split(":", 1)
                            port_s = port_s.split("/")[0].split("?")[0]
                            port = safe_int_port(port_s, 8388)
                except Exception:
                    pass

            if host and password:
                return {
                    "tag": "proxy",
                    "protocol": "shadowsocks",
                    "settings": {
                        "servers": [{
                            "address": host,
                            "port": port,
                            "method": method,
                            "password": password
                        }]
                    }
                }
        except Exception:
            return None

    return None
