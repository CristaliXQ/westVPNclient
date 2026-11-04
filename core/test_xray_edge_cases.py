import json
import link_to_xray

links = [
    # 1. Standard VLESS Reality
    ("VLESS Reality", "vless://d72f05b0-b182-4783-a6f2-21cecc7d841a@31.76.101.39:443?security=reality&encryption=none&pbk=SibLV5WBGdljTiUCmKx77KhHQfErCwjDMD_ZLoha3js&fp=chrome&type=tcp&flow=xtls-rprx-vision&sni=dzen.ru&sid=a1b2c3d4#Test1"),
    # 2. VLESS WS
    ("VLESS WS", "vless://d72f05b0-b182-4783-a6f2-21cecc7d841a@example.com:443?type=ws&security=tls&sni=example.com&path=/ws&host=example.com#Test2"),
    # 3. Trojan WS
    ("Trojan WS", "trojan://password123@example.com:443?type=ws&security=tls&sni=example.com&path=/trojan#Test3"),
    # 4. VMess WS
    ("VMess WS", "vmess://eyJhZGQiOiJleGFtcGxlLmNvbSIsImFpZCI6MCwiaG9zdCI6ImV4YW1wbGUuY29tIiwiaWQiOiIxMjM0NTY3OC0xMjM0LTEyMzQtMTIzNC0xMjM0NTY3ODkxYmMiLCJuZXQiOiJ3cyIsInBhdGgiOiIvd3MiLCJwb3J0Ijo0NDMsInBzIjoiVGVzdCBWTWVzcyIsInNjeSI6ImF1dG8iLCJzbmkiOiJleGFtcGxlLmNvbSIsInRscyI6InRscyJ9"),
    # 5. Shadowsocks with method:password@host:port
    ("Shadowsocks Plain", "ss://YWVzLTEyOC1nY206cGFzc3dvcmQ=@1.2.3.4:8388#TestSS"),
    # 6. Shadowsocks with URL-encoded auth
    ("Shadowsocks URL Auth", "ss://chacha20-ietf-poly1305:secret123@1.2.3.4:8388#TestSS2"),
    # 7. Hysteria 2
    ("Hysteria2", "hy2://secretpass@1.2.3.4:443?sni=example.com#TestHy2"),
    # 8. VLESS xhttp
    ("VLESS xhttp", "vless://uuid@1.2.3.4:443?type=xhttp&security=reality&sni=example.com&path=/xhttp&mode=auto#TestXhttp"),
    # 9. VLESS with unknown security or missing host
    ("VLESS missing host", "vless://uuid@:443?type=tcp#EmptyHost"),
    # 10. SS with plugin (SIP003 / v2ray-plugin)
    ("Shadowsocks plugin", "ss://YWVzLTEyOC1nY206cGFzc3dvcmQ=@1.2.3.4:8388/?plugin=v2ray-plugin%3Bpath%3D%2Fws#SSPlugin")
]

for name, link in links:
    try:
        out = link_to_xray.parse_link_to_outbound(link)
        if out is None:
            print(f"[FAIL] {name}: parsed to None")
        else:
            print(f"[OK] {name}: protocol={out.get('protocol')}, tag={out.get('tag')}")
    except Exception as e:
        print(f"[ERROR] {name}: {e}")
