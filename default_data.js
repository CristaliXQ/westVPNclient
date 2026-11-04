const DEFAULT_CONFIG = {
  enabled: true,
  mode: "smart",
  coreMode: "auto",
  proxyHost: "127.0.0.1",
  proxyPort: 10818,
  proxyType: "SOCKS5",
  httpFallback: true,
  httpPort: 10819,
  youtubeDirect: true,
  localBypass: true,
  usProxyPort: 10820,
  usHttpPort: 10821,
  geminiUsRouting: true,
  geminiServerId: "srv_27",
  domainRoutes: {
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
  },
  subscriptionUrl: "https://xpnetsub.space/sub/FDffPVcmqpN42V4-",
  subscriptionInfo: "TG - @xpnetvpn • 📅 120д.",
  lastUpdated: Date.now(),
  activeServerId: "srv_7",
  activeServer: {
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
    "raw": "vless://185e2bb3-2934-48d0-bbd5-dd20d16e83ee@104.194.141.56:443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&sni=ibm.com&fp=firefox&sid=359a73eef9d34266&pbk=twBuhDINIiFlIGYOJydRfRTbIXXo90hnjX0t2atMwik#%F0%9F%87%AC%F0%9F%87%A7%20%F0%9F%A4%96%20%E2%99%BE%EF%B8%8F%20United%20Kingdom%20%7C%20TCP-1%20%28AI%29"
  },
  servers: [
  {
    "id": "srv_1",
    "name": "🇸🇪 ♾️ Sweden | TCP",
    "flag": "🇸🇪",
    "proto": "vless",
    "host": "13.143.174.130",
    "port": 443,
    "type": "tcp",
    "security": "reality",
    "sni": "nordic.cendora.ru",
    "path": "",
    "raw": "vless://81027a6a-753d-4688-bd3b-b993fcadd641@13.143.174.130:443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&sni=nordic.cendora.ru&fp=qq&sid=2186a755ed67b034&pbk=YQTixaXzPVImuRc4TUbrFAekjIiaYV-t5S-HTKlH0AU#%F0%9F%87%B8%F0%9F%87%AA%20%E2%99%BE%EF%B8%8F%20Sweden%20%7C%20TCP"
  },
  {
    "id": "srv_2",
    "name": "🇸🇪 🤖 ♾️ Sweden | gRPC (AI)",
    "flag": "🇸🇪",
    "proto": "vless",
    "host": "se1.h1cloud.net",
    "port": 26128,
    "type": "grpc",
    "security": "reality",
    "sni": "www.icloud.com",
    "path": "",
    "raw": "vless://68c3d665-b2b5-4ffb-9f37-9f3d8c47324d@se1.h1cloud.net:26128?type=grpc&security=reality&fp=random&pbk=sACiHit5lNtPRK_eFP6jT8dMPUZ4kQRsfPj_LL5p7Uk&sid=13ac4d3bdadf1ea1&sni=www.icloud.com&mode=gun&serviceName=df50147201bf&spx=/#%F0%9F%87%B8%F0%9F%87%AA%20%F0%9F%A4%96%20%E2%99%BE%EF%B8%8F%20Sweden%20%7C%20gRPC%20%28AI%29"
  },
  {
    "id": "srv_3",
    "name": "🇸🇪 🎮 ♾️ Sweden | Hysteria2-1",
    "flag": "🇸🇪",
    "proto": "hy2",
    "host": "sweedenqfds777.qcloud.surf",
    "port": 21223,
    "type": "udp",
    "security": "tls",
    "sni": "sweedenqfds777.qcloud.surf",
    "path": "",
    "raw": "hy2://6656cc0a-5908-4d04-a436-64f5843c0c7a@sweedenqfds777.qcloud.surf:21223?#%F0%9F%87%B8%F0%9F%87%AA%20%F0%9F%8E%AE%20%E2%99%BE%EF%B8%8F%20Sweden%20%7C%20Hysteria2-1"
  },
  {
    "id": "srv_4",
    "name": "🇸🇪 🎮 ♾️ Sweden | Hysteria2-2",
    "flag": "🇸🇪",
    "proto": "hysteria2",
    "host": "sweedenqfds777.qcloud.surf",
    "port": 21223,
    "type": "udp",
    "security": "tls",
    "sni": "sweedenqfds777.qcloud.surf",
    "path": "",
    "raw": "hysteria2://408c51e8-9246-483d-ba73-34ab4e202eb9@sweedenqfds777.qcloud.surf:21223?security=tls&sni=sweedenqfds777.qcloud.surf&alpn=h3&insecure=0#%F0%9F%87%B8%F0%9F%87%AA%20%F0%9F%8E%AE%20%E2%99%BE%EF%B8%8F%20Sweden%20%7C%20Hysteria2-2"
  },
  {
    "id": "srv_5",
    "name": "🇮🇹 ♾️ Italy | TCP",
    "flag": "🌐",
    "proto": "vless",
    "host": "150.241.73.234",
    "port": 443,
    "type": "tcp",
    "security": "reality",
    "sni": "eu-central.cendora.ru",
    "path": "",
    "raw": "vless://81027a6a-753d-4688-bd3b-b993fcadd641@150.241.73.234:443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&sni=eu-central.cendora.ru&fp=qq&sid=00bca5982f82d083&pbk=b-Cm9hX-3UHsS1L_lnUB6AMjuKhlN1IDdBbZ506itjI#%F0%9F%87%AE%F0%9F%87%B9%20%E2%99%BE%EF%B8%8F%20Italy%20%7C%20TCP"
  },
  {
    "id": "srv_6",
    "name": "🇨🇿 ♾️ Czech | TCP",
    "flag": "🌐",
    "proto": "vless",
    "host": "13.143.183.42",
    "port": 443,
    "type": "tcp",
    "security": "reality",
    "sni": "eu-central.cendora.ru",
    "path": "",
    "raw": "vless://81027a6a-753d-4688-bd3b-b993fcadd641@13.143.183.42:443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&sni=eu-central.cendora.ru&fp=qq&sid=00bca5982f82d083&pbk=b-Cm9hX-3UHsS1L_lnUB6AMjuKhlN1IDdBbZ506itjI#%F0%9F%87%A8%F0%9F%87%BF%20%E2%99%BE%EF%B8%8F%20Czech%20%7C%20TCP"
  },
  {
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
    "raw": "vless://185e2bb3-2934-48d0-bbd5-dd20d16e83ee@104.194.141.56:443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&sni=ibm.com&fp=firefox&sid=359a73eef9d34266&pbk=twBuhDINIiFlIGYOJydRfRTbIXXo90hnjX0t2atMwik#%F0%9F%87%AC%F0%9F%87%A7%20%F0%9F%A4%96%20%E2%99%BE%EF%B8%8F%20United%20Kingdom%20%7C%20TCP-1%20%28AI%29"
  },
  {
    "id": "srv_8",
    "name": "🇬🇧 ♾️ United Kingdom | TCP-2",
    "flag": "🇬🇧",
    "proto": "vless",
    "host": "144.31.213.85",
    "port": 443,
    "type": "tcp",
    "security": "reality",
    "sni": "eu-central.cendora.ru",
    "path": "",
    "raw": "vless://81027a6a-753d-4688-bd3b-b993fcadd641@144.31.213.85:443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&sni=eu-central.cendora.ru&fp=qq&sid=00bca5982f82d083&pbk=b-Cm9hX-3UHsS1L_lnUB6AMjuKhlN1IDdBbZ506itjI#%F0%9F%87%AC%F0%9F%87%A7%20%E2%99%BE%EF%B8%8F%20United%20Kingdom%20%7C%20TCP-2"
  },
  {
    "id": "srv_9",
    "name": "🇫🇮 ♾️ Finland | TCP",
    "flag": "🇫🇮",
    "proto": "vless",
    "host": "2.26.104.40",
    "port": 443,
    "type": "tcp",
    "security": "reality",
    "sni": "edge12.anicdn.fun",
    "path": "",
    "raw": "vless://f4d71fd6-1c25-4748-836b-1dbda9268039@2.26.104.40:443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&sni=edge12.anicdn.fun&fp=safari&sid=987847afa6c4a8b4&pbk=fWccUR51FmYx8iqLFhZx6V-9J_W6b1Ozbxf4jg6sOAg#%F0%9F%87%AB%F0%9F%87%AE%20%E2%99%BE%EF%B8%8F%20Finland%20%7C%20TCP"
  },
  {
    "id": "srv_10",
    "name": "🇫🇮 ♾️ Finland | gRPC",
    "flag": "🇫🇮",
    "proto": "vless",
    "host": "193.233.217.20",
    "port": 7443,
    "type": "grpc",
    "security": "reality",
    "sni": "cdn.suzuki.lol",
    "path": "",
    "raw": "vless://92e135b9-4c04-4e7e-8b28-d8074a202cf8@193.233.217.20:7443?mode=gun&security=reality&encryption=none&authority=&pbk=36VgwCvCzW3ST22DrfRU7y8mVfm0PM7JpkXQnN9yLiE&fp=random&type=grpc&serviceName=grpc&sni=cdn.suzuki.lol#%F0%9F%87%AB%F0%9F%87%AE%20%E2%99%BE%EF%B8%8F%20Finland%20%7C%20gRPC"
  },
  {
    "id": "srv_11",
    "name": "🇰🇿 ♾️ Kazakhstan | TCP",
    "flag": "🌐",
    "proto": "vless",
    "host": "5.180.21.46",
    "port": 443,
    "type": "tcp",
    "security": "reality",
    "sni": "nordic.cendora.ru",
    "path": "",
    "raw": "vless://81027a6a-753d-4688-bd3b-b993fcadd641@5.180.21.46:443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&sni=nordic.cendora.ru&fp=qq&sid=2186a755ed67b034&pbk=YQTixaXzPVImuRc4TUbrFAekjIiaYV-t5S-HTKlH0AU#%F0%9F%87%B0%F0%9F%87%BF%20%E2%99%BE%EF%B8%8F%20Kazakhstan%20%7C%20TCP"
  },
  {
    "id": "srv_12",
    "name": "🇹🇷 ♾️ Turkey | TCP",
    "flag": "🌐",
    "proto": "vless",
    "host": "81.177.215.156",
    "port": 443,
    "type": "raw",
    "security": "reality",
    "sni": "tr-4vps.yourzloy.site",
    "path": "",
    "raw": "vless://9d981e91-ed04-41f9-b8f1-b993c1585d4d@81.177.215.156:443?security=reality&pbk=VNinTQ6vwOujTkrJgK_NPV4SpSBU6B7xG2tpM7prITQ&fp=firefox&type=raw&flow=xtls-rprx-vision&sni=tr-4vps.yourzloy.site&sid=fd5b0def0660cdb1#%F0%9F%87%B9%F0%9F%87%B7%20%E2%99%BE%EF%B8%8F%20Turkey%20%7C%20TCP"
  },
  {
    "id": "srv_13",
    "name": "🇱🇻 ♾️ Latvia | TCP-1",
    "flag": "🇱🇻",
    "proto": "vless",
    "host": "so-lv-01.farmerly.cc",
    "port": 443,
    "type": "tcp",
    "security": "reality",
    "sni": "so-lv-01.farmerly.cc",
    "path": "",
    "raw": "vless://a00e48ce-e56e-4ac1-8272-38983f0d8f99@so-lv-01.farmerly.cc:443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&sni=so-lv-01.farmerly.cc&fp=firefox&sid=05a3e6a1da09ea2a&pbk=dtNVjR_dkZVrC4RNyu4_4H88pfzBVU72Ekr94fxtI0M#%F0%9F%87%B1%F0%9F%87%BB%20%E2%99%BE%EF%B8%8F%20Latvia%20%7C%20TCP-1"
  },
  {
    "id": "srv_14",
    "name": "🇱🇻 ♾️ Latvia | TCP-2",
    "flag": "🇱🇻",
    "proto": "vless",
    "host": "2.27.210.57",
    "port": 443,
    "type": "tcp",
    "security": "reality",
    "sni": "eu-west.cendora.ru",
    "path": "",
    "raw": "vless://81027a6a-753d-4688-bd3b-b993fcadd641@2.27.210.57:443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&sni=eu-west.cendora.ru&fp=edge&sid=dd3ff38418d29d22&pbk=m6RDw1b8R4lCaRUIzhHpy6TtX2Dhk6nyby8dWzeQqA0#%F0%9F%87%B1%F0%9F%87%BB%20%E2%99%BE%EF%B8%8F%20Latvia%20%7C%20TCP-2"
  },
  {
    "id": "srv_15",
    "name": "🇨🇭 ♾️ Switzerland | TCP-1",
    "flag": "🌐",
    "proto": "vless",
    "host": "193.151.108.95",
    "port": 443,
    "type": "tcp",
    "security": "reality",
    "sni": "eu-central.cendora.ru",
    "path": "",
    "raw": "vless://81027a6a-753d-4688-bd3b-b993fcadd641@193.151.108.95:443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&sni=eu-central.cendora.ru&fp=qq&sid=00bca5982f82d083&pbk=b-Cm9hX-3UHsS1L_lnUB6AMjuKhlN1IDdBbZ506itjI#%F0%9F%87%A8%F0%9F%87%AD%20%E2%99%BE%EF%B8%8F%20Switzerland%20%7C%20TCP-1"
  },
  {
    "id": "srv_16",
    "name": "🇨🇭 ♾️ Switzerland | TCP-2",
    "flag": "🌐",
    "proto": "vless",
    "host": "45.133.151.186",
    "port": 25414,
    "type": "tcp",
    "security": "reality",
    "sni": "www.icloud.com",
    "path": "",
    "raw": "vless://d54a7512-dda3-4218-8ae7-c591d300fd7c@45.133.151.186:25414?fp=firefox&pbk=KjcB2_xuklgTEHo_L_y3YdGdQoDgA91Yaa3YgRu_Iis&security=reality&sid=609c2d15e86108cd&sni=www.icloud.com&type=tcp#%F0%9F%87%A8%F0%9F%87%AD%20%E2%99%BE%EF%B8%8F%20Switzerland%20%7C%20TCP-2"
  },
  {
    "id": "srv_17",
    "name": "🇵🇱 ♾️ Poland | TCP",
    "flag": "🇵🇱",
    "proto": "vless",
    "host": "201.10.90.175",
    "port": 443,
    "type": "tcp",
    "security": "reality",
    "sni": "pl1.vntof.com",
    "path": "",
    "raw": "vless://f1aaf00f-510b-452c-b73e-103331b04709@201.10.90.175:443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&sni=pl1.vntof.com&fp=firefox&pbk=mtGBmzOSWcG_2ev-bZSnUzLis7LGUB_5-Vf94JupbR8&sid=d87d3c1de8fe0509#%F0%9F%87%B5%F0%9F%87%B1%20%E2%99%BE%EF%B8%8F%20Poland%20%7C%20TCP"
  },
  {
    "id": "srv_18",
    "name": "🇵🇱 ♾️ Poland | WebSocket",
    "flag": "🇵🇱",
    "proto": "vless",
    "host": "ru-spb.tunnelgate.org",
    "port": 443,
    "type": "ws",
    "security": "tls",
    "sni": "ru-spb.tunnelgate.org",
    "path": "/ws/v1/pl",
    "raw": "vless://81027a6a-753d-4688-bd3b-b993fcadd641@ru-spb.tunnelgate.org:443?encryption=mlkem768x25519plus.native.0rtt.hYkwSqWzlFQb2Ix1APhXoBAbBetuqxVyj3aPkTmEnJIPuSdhHoKwaiykvPcPQzZ3G4gkfssihcQMdEJAbdG64re2gnfGP2JbZYVQB1K_ZiRgXbW0txGPvIY4ZqwGcdzFQlsvewHP_ipVjmdiI3M7VSRGNqhXRId84Ycaa4CTgjMslMiimzm3ZEgukxMOUPGielAsdfByKDq3yMksVVp3sKa6ceu6pbeMj8uANyC_iCdI55wCS_K2dklswmAf4AK-YWAMmekloMpaY4cVroTO3LqwDNyVNDcUifdOm4xjfvARxVfE89lf12aE3nqaPjQmCYu9HMELoWBI2GRsrJdNiXMjowq5ceYwuJpudIdrhoKgqNTKB1SIjGbCHSZStbl8D6UBWIwZ69mkkQQllnGR5zC0e4wDhbGaZMV477gvyImowAibtmddVIwmWgagBsicoixxELTPNYcOJHtElTlBCalAHSZsn2eBlGcxomBCsPIFprJIsyEQSTO_-LJ9mvGNbIOX2bchBcy6eeCJL7PKzDIluaMe7fLOOcKB98fIdic_gnyw3mYAgMF-ztIIqBRnm6VJ0zqfMSl-RrY5_3A_zEKb4WhSBlWiuGBo2mWT4YqhppWoQoqs-ehEPcRj3FEI6-tZP7VTK6vHkjRObebI3am-jZYm8Zi_SSHGX7TPmMwVn4DHBQLO8flCUJCx7AO44acrhMMVMGJtWPO98DOJQ3LCbAGiozUCttqO4La8gaxQkLQhOlt9sCZi06Q4hWxFR4OrFzqj-ohnNBlEJpzHvPBIFUaDmPaUMxvDd6UmlENXwHQKM6p32nEY-cyFmTKWeiekvhkWs1Row_AkmQSOCMuyfUCMAgZaohqeCceoTnidqqeN5XgCm9WUc4wBbgVIBqg_fkhJWcTGZgTBpraXK2BGT2YaYFsAAGi_BHSHT4XLnGN2X2FAHnFrP3KUkriIMQCMPlEQx6Q197Qtm9ySZQQvNbG7AtECi6k5Ees1yfk_tIYhUcs8aowY7cQCHEnBqxkeTEWVtThMVxgbo8e4rTMb1mZQ6-aaeGDFeWpUBRQdmoiABaYBOqQfmgA2IFZJpHKsXvsETQU3iVolFoYMmMtGlsKo_qsY9eJLRdvLdVtUS5FPeYoup3UWEDq0G2eXWAipoCKQVoS_5IRNtbgPGKuO88R0hWef66wYd3dp9AUgpJcHkTxaEZRBDPFd-ABYsWUVlvBmzluaQ0xle_JnAYkoiMqvBwaiPtg8ZlhPlAdoz6zCB5uF0KgEp7xf6jKtClNzhzYW6VcKEkl3Zcuy3DKWFRKeeHNyePdzwLKZE2ZFpZCJoBqWtTs3xHRD-RxA28VMY-WqzZtMV3SCxVyLQilL1Hgzi1A7s9wj_5RGneXKSenCnsYWJXOWGqLIFLWu2fWsgSSZyec24Tg4XAVtraEDABOEBIsvQCeS5WpenSYXWdVbUPsmYKoDCaZ04nMSkoPJIldwTTistEoBe1ZGXYJDslm1WpwlrxdMJrweb7NnoGnNmZwJVGcPFxMMzkhhDbdjpUfShI4zM7co6H1FeNeI_6_7mQOZlfSP-rKZ-SA&type=ws&security=tls&sni=ru-spb.tunnelgate.org&fp=qq&alpn=http%2F1.1&path=%2Fws%2Fv1%2Fpl&host=ru-spb.tunnelgate.org#%F0%9F%87%B5%F0%9F%87%B1%20%E2%99%BE%EF%B8%8F%20Poland%20%7C%20WebSocket"
  },
  {
    "id": "srv_19",
    "name": "🇫🇷 ♾️ France | TCP",
    "flag": "🇫🇷",
    "proto": "vless",
    "host": "188.130.226.25",
    "port": 443,
    "type": "tcp",
    "security": "reality",
    "sni": "eu-central.cendora.ru",
    "path": "",
    "raw": "vless://81027a6a-753d-4688-bd3b-b993fcadd641@188.130.226.25:443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&sni=eu-central.cendora.ru&fp=qq&sid=00bca5982f82d083&pbk=b-Cm9hX-3UHsS1L_lnUB6AMjuKhlN1IDdBbZ506itjI#%F0%9F%87%AB%F0%9F%87%B7%20%E2%99%BE%EF%B8%8F%20France%20%7C%20TCP"
  },
  {
    "id": "srv_20",
    "name": "🇫🇷 ♾️ France | XHTTP",
    "flag": "🇫🇷",
    "proto": "vless",
    "host": "cdnex.nztvpn.com",
    "port": 443,
    "type": "xhttp",
    "security": "tls",
    "sni": "cdnex.nztvpn.com",
    "path": "/api/v2/client/sync/database/",
    "raw": "vless://ee18d188-14cc-417e-beb1-70e4add6d023@cdnex.nztvpn.com:443?mode=packet-up&path=%2Fapi%2Fv2%2Fclient%2Fsync%2Fdatabase%2F&security=tls&encryption=none&alpn=h2%2Chttp%2F1.1&extra=%7B%22xmux%22%3A%7B%22cMaxReuseTimes%22%3A%2236-96%22%2C%22maxConcurrency%22%3A%226-16%22%2C%22hKeepAlivePeriod%22%3A0%2C%22hMaxRequestTimes%22%3A%22320-640%22%2C%22hMaxReusableSecs%22%3A%22720-1800%22%7D%2C%22seqKey%22%3A%22offset%22%2C%22headers%22%3A%7B%22Accept%22%3A%22application%2Fvnd.api%2Bjson%2C%20application%2Fjson%2C%20text%2Fplain%2C%20%2A%2F%2A%22%2C%22Pragma%22%3A%22no-cache%22%2C%22Cache-Control%22%3A%22no-cache%22%2C%22Accept-Language%22%3A%22ru-RU%2Cru%3Bq%3D0.9%2Cen-US%3Bq%3D0.8%2Cen%3Bq%3D0.7%22%7D%2C%22sessionKey%22%3A%22media_sid%22%2C%22xPaddingKey%22%3A%22q%22%2C%22seqPlacement%22%3A%22query%22%2C%22sessionIDKey%22%3A%22media_sid%22%2C%22uplinkDataKey%22%3A%22%22%2C%22xPaddingBytes%22%3A%2248-320%22%2C%22xPaddingHeader%22%3A%22X-Rewrite-URL%22%2C%22xPaddingMethod%22%3A%22tokenish%22%2C%22sessionPlacement%22%3A%22cookie%22%2C%22uplinkHTTPMethod%22%3A%22GET%22%2C%22xPaddingObfsMode%22%3Atrue%2C%22xPaddingPlacement%22%3A%22queryInHeader%22%2C%22scMaxBufferedPosts%22%3A32%2C%22scMaxEachPostBytes%22%3A%221536-6144%22%2C%22sessionIDPlacement%22%3A%22cookie%22%2C%22uplinkDataPlacement%22%3A%22header%22%2C%22scMinPostsIntervalMs%22%3A%224-18%22%2C%22serverMaxHeaderBytes%22%3A32768%7D&insecure=1&host=cdnex.nztvpn.com&type=xhttp&allowInsecure=1&sni=cdnex.nztvpn.com#%F0%9F%87%AB%F0%9F%87%B7%20%E2%99%BE%EF%B8%8F%20France%20%7C%20XHTTP"
  },
  {
    "id": "srv_21",
    "name": "🇳🇱 ♾️ Netherlands | TCP",
    "flag": "🇳🇱",
    "proto": "vless",
    "host": "nl1.balancer.vbuste-bot.com",
    "port": 443,
    "type": "tcp",
    "security": "reality",
    "sni": "nl1.balancer.vbuste-bot.com",
    "path": "",
    "raw": "vless://318c935d-c195-41d3-99ad-9bbcfdab3386@nl1.balancer.vbuste-bot.com:443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&sni=nl1.balancer.vbuste-bot.com&fp=chrome&sid=4be4110078ebed4a&pbk=0-or5ogGhYbBgsVSrSC2Fhxyp2BN97Y9pqIdg61Qd08#%F0%9F%87%B3%F0%9F%87%B1%20%E2%99%BE%EF%B8%8F%20Netherlands%20%7C%20TCP"
  },
  {
    "id": "srv_22",
    "name": "🇳🇱 🤖 ♾️ Netherlands | XHTTP (AI)",
    "flag": "🇳🇱",
    "proto": "vless",
    "host": "threecdn.cahmes.space",
    "port": 443,
    "type": "xhttp",
    "security": "tls",
    "sni": "threecdn.cahmes.space",
    "path": "/static/js/main.chunk.js",
    "raw": "vless://c18bfa32-32c7-460d-911a-543ddb5e18c8@threecdn.cahmes.space:443?encryption=none&type=xhttp&security=tls&sni=threecdn.cahmes.space&fp=chrome&alpn=h2%2Chttp%2F1.1&path=%2Fstatic%2Fjs%2Fmain.chunk.js&host=threecdn.cahmes.space&mode=packet-up&extra=%7B%22noGRPCHeader%22%3Atrue%2C%22scMaxEachPostBytes%22%3A32768%2C%22scMinPostsIntervalMs%22%3A10%2C%22seqKey%22%3A%22offset%22%2C%22seqPlacement%22%3A%22query%22%2C%22serverMaxHeaderBytes%22%3A65536%2C%22sessionIDKey%22%3A%22sessionid%22%2C%22sessionIDPlacement%22%3A%22query%22%2C%22uplinkChunkSize%22%3A16384%2C%22uplinkDataKey%22%3A%22X-Request-Id%22%2C%22uplinkDataPlacement%22%3A%22header%22%2C%22uplinkHTTPMethod%22%3A%22HEAD%22%2C%22xPaddingBytes%22%3A%22100-1000%22%2C%22xPaddingKey%22%3A%22q%22%2C%22xPaddingMethod%22%3A%22tokenish%22%2C%22xPaddingObfsMode%22%3Atrue%2C%22xPaddingPlacement%22%3A%22query%22%2C%22xmux%22%3A%7B%22cMaxReuseTimes%22%3A0%2C%22hKeepAlivePeriod%22%3A0%2C%22hMaxRequestTimes%22%3A%22600-900%22%2C%22hMaxReusableSecs%22%3A%221800-3000%22%2C%22maxConcurrency%22%3A%2216-32%22%2C%22maxConnections%22%3A0%7D%7D#%F0%9F%87%B3%F0%9F%87%B1%20%F0%9F%A4%96%20%E2%99%BE%EF%B8%8F%20Netherlands%20%7C%20XHTTP%20%28AI%29"
  },
  {
    "id": "srv_23",
    "name": "🇳🇱 ♾️ Netherlands | TROJAN-1",
    "flag": "🇳🇱",
    "proto": "trojan",
    "host": "146.75.57.238",
    "port": 443,
    "type": "ws",
    "security": "tls",
    "sni": "google.com",
    "path": "/ bored_vpn",
    "raw": "trojan://m%69tivpn@146.75.57.238:443?pcs=cd6e838b9bfe31cab8b3d5c858b0d6223fe84ece236c1fdb281be93c302e1e6e&path=%2F%20bored_vpn&security=tls&alpn=http%2F1.1&insecure=0&host=mitivpn-s1.global.ssl.fastly.net&fp=chrome&type=ws&allowInsecure=0&sni=google.com#%F0%9F%87%B3%F0%9F%87%B1%20%E2%99%BE%EF%B8%8F%20Netherlands%20%7C%20TROJAN-1"
  },
  {
    "id": "srv_24",
    "name": "🇳🇱 ♾️ Netherlands | TROJAN-2",
    "flag": "🇳🇱",
    "proto": "trojan",
    "host": "199.232.78.160",
    "port": 443,
    "type": "ws",
    "security": "tls",
    "sni": "www.google.com",
    "path": "/ mehrosaboran",
    "raw": "trojan://m%69tivpn@199.232.78.160:443?pcs=cd6e838b9bfe31cab8b3d5c858b0d6223fe84ece236c1fdb281be93c302e1e6e&path=%2F%20mehrosaboran&security=tls&alpn=http%2F1.1&insecure=0&host=mitivpn-s1.global.ssl.fastly.net&fp=chrome&type=ws&allowInsecure=0&sni=www.google.com#%F0%9F%87%B3%F0%9F%87%B1%20%E2%99%BE%EF%B8%8F%20Netherlands%20%7C%20TROJAN-2"
  },
  {
    "id": "srv_25",
    "name": "🇳🇱 🎮 🤖 ♾️ Netherlands | Hysteria2-1 (AI)",
    "flag": "🇳🇱",
    "proto": "hysteria2",
    "host": "130.49.161.70",
    "port": 443,
    "type": "udp",
    "security": "tls",
    "sni": "hy2.aspidnet.xyz",
    "path": "",
    "raw": "hysteria2://p7Q76LzlnS4hIzr1W3staBOnUe_WwSkR@130.49.161.70:443?insecure=0&sni=hy2.aspidnet.xyz&obfs=salamander&obfs-password=rG07s3COMIEvdnQipRyWzx_H_2xygNC3#%F0%9F%87%B3%F0%9F%87%B1%20%F0%9F%8E%AE%20%F0%9F%A4%96%20%E2%99%BE%EF%B8%8F%20Netherlands%20%7C%20Hysteria2-1%20%28AI%29"
  },
  {
    "id": "srv_26",
    "name": "🇳🇱 🎮 ♾️ Netherlands | Hysteria2-2",
    "flag": "🇳🇱",
    "proto": "hysteria2",
    "host": "130.49.161.70",
    "port": 443,
    "type": "udp",
    "security": "tls",
    "sni": "hy2.aspidnet.xyz",
    "path": "",
    "raw": "hysteria2://p7Q76LzlnS4hIzr1W3staBOnUe_WwSkR@130.49.161.70:443?security=tls&obfs=salamander&obfs-password=rG07s3COMIEvdnQipRyWzx_H_2xygNC3&insecure=0&sni=hy2.aspidnet.xyz#%F0%9F%87%B3%F0%9F%87%B1%20%F0%9F%8E%AE%20%E2%99%BE%EF%B8%8F%20Netherlands%20%7C%20Hysteria2-2"
  },
  {
    "id": "srv_27",
    "name": "🇺🇸 🤖 ♾️ USA | TCP (AI)",
    "flag": "🇺🇸",
    "proto": "vless",
    "host": "so-us-01.farmerly.cc",
    "port": 443,
    "type": "tcp",
    "security": "reality",
    "sni": "so-us-01.farmerly.cc",
    "path": "",
    "raw": "vless://a00e48ce-e56e-4ac1-8272-38983f0d8f99@so-us-01.farmerly.cc:443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&sni=so-us-01.farmerly.cc&fp=firefox&sid=106b1cb4088eb926&pbk=Dec-i9bT62Vlig1Qct1q_hEG6zHj-fvkHvtyR9DCXjk#%F0%9F%87%BA%F0%9F%87%B8%20%F0%9F%A4%96%20%E2%99%BE%EF%B8%8F%20USA%20%7C%20TCP%20%28AI%29"
  },
  {
    "id": "srv_28",
    "name": "🇺🇸 ♾️ USA | XHTTP",
    "flag": "🇺🇸",
    "proto": "vless",
    "host": "us-05.avroraservice.online",
    "port": 8443,
    "type": "xhttp",
    "security": "reality",
    "sni": "cdn-us.cahmes.space",
    "path": "/xhttp",
    "raw": "vless://c18bfa32-32c7-460d-911a-543ddb5e18c8@us-05.avroraservice.online:8443?encryption=none&type=xhttp&security=reality&sni=cdn-us.cahmes.space&fp=chrome&sid=6bd33a75ebc0f26e&pbk=KZejN2d1cwCrITHNxFYQVZ4rpMTZzHgJd9p30MZm_3k&path=%2Fxhttp&mode=stream-one#%F0%9F%87%BA%F0%9F%87%B8%20%E2%99%BE%EF%B8%8F%20USA%20%7C%20XHTTP"
  },
  {
    "id": "srv_29",
    "name": "🇺🇸 🎮 ♾️ USA | Hysteria2",
    "flag": "🇺🇸",
    "proto": "hy2",
    "host": "77.232.139.128",
    "port": 11592,
    "type": "udp",
    "security": "tls",
    "sni": "srv-8718e6.frd21.ru",
    "path": "",
    "raw": "hy2://033dc6b532@77.232.139.128:11592?sni=srv-8718e6.frd21.ru&obfs=salamander&obfs-password=eba1b4766d2a26d6c167e2d2e9efabf4#%F0%9F%87%BA%F0%9F%87%B8%20%F0%9F%8E%AE%20%E2%99%BE%EF%B8%8F%20USA%20%7C%20Hysteria2"
  },
  {
    "id": "srv_30",
    "name": "🇩🇪 ♾️ Germany | TCP",
    "flag": "🇩🇪",
    "proto": "vless",
    "host": "de1.balancer.vbuste-services.com",
    "port": 443,
    "type": "tcp",
    "security": "reality",
    "sni": "de1.balancer.vbuste-services.com",
    "path": "",
    "raw": "vless://318c935d-c195-41d3-99ad-9bbcfdab3386@de1.balancer.vbuste-services.com:443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&sni=de1.balancer.vbuste-services.com&fp=firefox&sid=4be4110078ebed4a&pbk=0-or5ogGhYbBgsVSrSC2Fhxyp2BN97Y9pqIdg61Qd08#%F0%9F%87%A9%F0%9F%87%AA%20%E2%99%BE%EF%B8%8F%20Germany%20%7C%20TCP"
  },
  {
    "id": "srv_31",
    "name": "🇩🇪 ♾️ Germany | XHTTP",
    "flag": "🇩🇪",
    "proto": "vless",
    "host": "cdnde3.nztvpn.com",
    "port": 443,
    "type": "xhttp",
    "security": "tls",
    "sni": "cdnde3.nztvpn.com",
    "path": "/api/v2/client/sync/database/",
    "raw": "vless://ee18d188-14cc-417e-beb1-70e4add6d023@cdnde3.nztvpn.com:443?type=xhttp&headerType=none&security=tls&encryption=none&sni=cdnde3.nztvpn.com&fp=firefox&alpn=h2%2Chttp%2F1.1&path=%2Fapi%2Fv2%2Fclient%2Fsync%2Fdatabase%2F&host=cdnde3.nztvpn.com&mode=packet-up&extra=%7B%22xmux%22%3A%20%7B%22cMaxReuseTimes%22%3A%20%2236-96%22%2C%20%22maxConcurrency%22%3A%20%226-16%22%2C%20%22hKeepAlivePeriod%22%3A%200%2C%20%22hMaxRequestTimes%22%3A%20%22320-640%22%2C%20%22hMaxReusableSecs%22%3A%20%22720-1800%22%7D%2C%20%22seqKey%22%3A%20%22offset%22%2C%20%22headers%22%3A%20%7B%22Accept%22%3A%20%22application%2Fvnd.api%2Bjson%2C%20application%2Fjson%2C%20text%2Fplain%2C%20%2A%2F%2A%22%2C%20%22Pragma%22%3A%20%22no-cache%22%2C%20%22Cache-Control%22%3A%20%22no-cache%22%2C%20%22Accept-Language%22%3A%20%22ru-RU%2Cru%3Bq%3D0.9%2Cen-US%3Bq%3D0.8%2Cen%3Bq%3D0.7%22%7D%2C%20%22sessionKey%22%3A%20%22media_sid%22%2C%20%22xPaddingKey%22%3A%20%22q%22%2C%20%22seqPlacement%22%3A%20%22query%22%2C%20%22sessionIDKey%22%3A%20%22media_sid%22%2C%20%22uplinkDataKey%22%3A%20%22%22%2C%20%22xPaddingBytes%22%3A%20%2248-320%22%2C%20%22xPaddingHeader%22%3A%20%22X-Rewrite-URL%22%2C%20%22xPaddingMethod%22%3A%20%22tokenish%22%2C%20%22sessionPlacement%22%3A%20%22cookie%22%2C%20%22uplinkHTTPMethod%22%3A%20%22GET%22%2C%20%22xPaddingObfsMode%22%3A%20true%2C%20%22xPaddingPlacement%22%3A%20%22queryInHeader%22%2C%20%22scMaxBufferedPosts%22%3A%2032%2C%20%22scMaxEachPostBytes%22%3A%20%221536-6144%22%2C%20%22sessionIDPlacement%22%3A%20%22cookie%22%2C%20%22uplinkDataPlacement%22%3A%20%22header%22%2C%20%22scMinPostsIntervalMs%22%3A%20%224-18%22%2C%20%22serverMaxHeaderBytes%22%3A%2032768%7D#%F0%9F%87%A9%F0%9F%87%AA%20%E2%99%BE%EF%B8%8F%20Germany%20%7C%20XHTTP"
  },
  {
    "id": "srv_32",
    "name": "🇩🇪 ♾️ Germany | TROJAN-1",
    "flag": "🇩🇪",
    "proto": "trojan",
    "host": "199.232.78.160",
    "port": 443,
    "type": "ws",
    "security": "tls",
    "sni": "www.google.com",
    "path": "/ mehrosaboran",
    "raw": "trojan://mitivpn@199.232.78.160:443?security=tls&sni=www.google.com&fp=chrome&alpn=http%2F1.1&pcs=cd6e838b9bfe31cab8b3d5c858b0d6223fe84ece236c1fdb281be93c302e1e6e&type=ws&host=mitivpn-s1.global.ssl.fastly.net&path=%2F+mehrosaboran#%F0%9F%87%A9%F0%9F%87%AA%20%E2%99%BE%EF%B8%8F%20Germany%20%7C%20TROJAN-1"
  },
  {
    "id": "srv_33",
    "name": "🇩🇪 ♾️ Germany | TROJAN-2",
    "flag": "🇩🇪",
    "proto": "trojan",
    "host": "199.232.78.160",
    "port": 443,
    "type": "ws",
    "security": "tls",
    "sni": "www.google.com",
    "path": "/---@MiTiVPN---@MiTiVPN/---@MiTiVPN---@MiTiVPN/---@MiTiVPN---@MiTiVPN/NLSus---@MiTiVPN---@MiTiVPN/---@MiTiVPN---@MiTiVPN/---@MiTiVPN---@MiTiVPN",
    "raw": "trojan://mitivpn@199.232.78.160:443?pcs=cd6e838b9bfe31cab8b3d5c858b0d6223fe84ece236c1fdb281be93c302e1e6e&path=%2F---%40MiTiVPN---%40MiTiVPN%2F---%40MiTiVPN---%40MiTiVPN%2F---%40MiTiVPN---%40MiTiVPN%2FNLSus---%40MiTiVPN---%40MiTiVPN%2F---%40MiTiVPN---%40MiTiVPN%2F---%40MiTiVPN---%40MiTiVPN&security=tls&alpn=http%2F1.1&insecure=0&host=mitivpn-s1.global.ssl.fastly.net&fp=chrome&type=ws&allowInsecure=0&sni=www.google.com#%F0%9F%87%A9%F0%9F%87%AA%20%E2%99%BE%EF%B8%8F%20Germany%20%7C%20TROJAN-2"
  },
  {
    "id": "srv_34",
    "name": "🇩🇪 🎮 ♾️ Germany | Hysteria2-1",
    "flag": "🇩🇪",
    "proto": "hysteria2",
    "host": "qcloudge1.exitvpn.shop",
    "port": 20270,
    "type": "udp",
    "security": "tls",
    "sni": "qcloudge1.exitvpn.shop",
    "path": "",
    "raw": "hysteria2://8bd04756-3beb-4348-82c9-d35453df50ce@qcloudge1.exitvpn.shop:20270?alpn=h3&sni=qcloudge1.exitvpn.shop#%F0%9F%87%A9%F0%9F%87%AA%20%F0%9F%8E%AE%20%E2%99%BE%EF%B8%8F%20Germany%20%7C%20Hysteria2-1"
  },
  {
    "id": "srv_35",
    "name": "🇩🇪 🎮 ♾️ Germany | Hysteria2-2",
    "flag": "🇩🇪",
    "proto": "hy2",
    "host": "qcloudge1.exitvpn.shop",
    "port": 20270,
    "type": "udp",
    "security": "tls",
    "sni": "qcloudge1.exitvpn.shop",
    "path": "",
    "raw": "hy2://4ad3dbf5-2005-4d96-b56c-a0ca9905cab6@qcloudge1.exitvpn.shop:20270?sni=qcloudge1.exitvpn.shop#%F0%9F%87%A9%F0%9F%87%AA%20%F0%9F%8E%AE%20%E2%99%BE%EF%B8%8F%20Germany%20%7C%20Hysteria2-2"
  },
  {
    "id": "srv_36",
    "name": "🇪🇪 🤖 ♾️ Estonia | TCP (AI)",
    "flag": "🌐",
    "proto": "vless",
    "host": "2.26.104.40",
    "port": 443,
    "type": "tcp",
    "security": "reality",
    "sni": "edge14.anicdn.fun",
    "path": "",
    "raw": "vless://f4d71fd6-1c25-4748-836b-1dbda9268039@2.26.104.40:443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&sni=edge14.anicdn.fun&fp=safari&sid=06537d746a117662&pbk=R-kjOFswKtHxNOtANDDVtQwKlUN85Fh7_w_AygJe3Vw#%F0%9F%87%AA%F0%9F%87%AA%20%F0%9F%A4%96%20%E2%99%BE%EF%B8%8F%20Estonia%20%7C%20TCP%20%28AI%29"
  },
  {
    "id": "srv_37",
    "name": "🇪🇪 ♾️ Estonia | gRPC",
    "flag": "🌐",
    "proto": "vless",
    "host": "188.225.38.216",
    "port": 443,
    "type": "grpc",
    "security": "tls",
    "sni": "lalibobi.online",
    "path": "",
    "raw": "vless://30292475-4666-4c26-bcb2-338a0919958b@188.225.38.216:443?allowInsecure=1&type=grpc&security=tls&fp=edge&sni=lalibobi.online&mode=gun&serviceName=lalibobi.orbit.v3.Connect#%F0%9F%87%AA%F0%9F%87%AA%20%E2%99%BE%EF%B8%8F%20Estonia%20%7C%20gRPC"
  },
  {
    "id": "srv_38",
    "name": "🇯🇵 🤖 ♾️ Japan | TCP (AI)",
    "flag": "🌐",
    "proto": "vless",
    "host": "34.153.208.209",
    "port": 443,
    "type": "tcp",
    "security": "reality",
    "sni": "www.cloudflare.com",
    "path": "",
    "raw": "vless://51a43b75-c84b-46eb-885e-c24e7819cd0b@34.153.208.209:443?encryption=none&flow=&security=reality&sni=www.cloudflare.com&fp=chrome&pbk=qMPnrSiXgWvw2ETefb46OfJKnYpfX6HfyGdWpWWxtVI&sid=780152c21e234b5a&type=tcp#%F0%9F%87%AF%F0%9F%87%B5%20%F0%9F%A4%96%20%E2%99%BE%EF%B8%8F%20Japan%20%7C%20TCP%20%28AI%29"
  },
  {
    "id": "srv_39",
    "name": "🇮🇳 🤖 ♾️ India | TCP (AI)",
    "flag": "🌐",
    "proto": "vless",
    "host": "5.253.29.72",
    "port": 443,
    "type": "tcp",
    "security": "reality",
    "sni": "asia.cendora.ru",
    "path": "",
    "raw": "vless://81027a6a-753d-4688-bd3b-b993fcadd641@5.253.29.72:443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&sni=asia.cendora.ru&fp=safari&sid=e53048e82bb20077&pbk=eaRNeC8fccrx0nBNvBpAXZgK4m4FxfnQ-t0W7NOM7mU#%F0%9F%87%AE%F0%9F%87%B3%20%F0%9F%A4%96%20%E2%99%BE%EF%B8%8F%20India%20%7C%20TCP%20%28AI%29"
  },
  {
    "id": "srv_40",
    "name": "🇷🇺 🛰️ Обход бел. списков #1-1",
    "flag": "🌐",
    "proto": "vless",
    "host": "kumar.oblachniy.ink",
    "port": 443,
    "type": "xhttp",
    "security": "tls",
    "sni": "kumar.oblachniy.ink",
    "path": "/api/library/track/",
    "raw": "vless://3c9ea6c3-114b-4128-b502-92263e750a7a@kumar.oblachniy.ink:443?encryption=none&type=xhttp&security=tls&sni=kumar.oblachniy.ink&fp=firefox&alpn=h2%2Chttp%2F1.1&path=%2Fapi%2Flibrary%2Ftrack%2F&host=kumar.oblachniy.ink&mode=packet-up&extra=%7B%22path%22%3A%22%2Fapi%2Flibrary%2Ftrack%22%2C%22scMaxEachPostBytes%22%3A4096%2C%22seqKey%22%3A%22chapter%22%2C%22seqPlacement%22%3A%22query%22%2C%22serverMaxHeaderBytes%22%3A50000%2C%22sessionIDKey%22%3A%22reader_sid%22%2C%22sessionIDLength%22%3A%225-8%22%2C%22sessionIDPlacement%22%3A%22query%22%2C%22uplinkChunkSize%22%3A0%2C%22uplinkDataKey%22%3A%22X-Library-Sync%22%2C%22uplinkDataPlacement%22%3A%22header%22%2C%22uplinkHTTPMethod%22%3A%22GET%22%2C%22xPaddingBytes%22%3A%221-32%22%2C%22xPaddingHeader%22%3A%22X-Reader-Token%22%2C%22xPaddingKey%22%3A%22_r%22%2C%22xPaddingMethod%22%3A%22tokenish%22%2C%22xPaddingObfsMode%22%3Atrue%2C%22xPaddingPlacement%22%3A%22header%22%2C%22xmux%22%3A%7B%22cMaxReuseTimes%22%3A%2264-128%22%2C%22hMaxRequestTimes%22%3A%22600-1000%22%2C%22hMaxReusableSecs%22%3A%221800-3600%22%2C%22maxConcurrency%22%3A%2248-96%22%2C%22maxConnections%22%3A0%7D%7D#%F0%9F%87%B7%F0%9F%87%BA%20%F0%9F%9B%B0%EF%B8%8F%20%D0%9E%D0%B1%D1%85%D0%BE%D0%B4%20%D0%B1%D0%B5%D0%BB.%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%BE%D0%B2%20%231-1"
  },
  {
    "id": "srv_41",
    "name": "🇩🇪 🛰️ Обход бел. списков #1-2",
    "flag": "🌐",
    "proto": "vless",
    "host": "ob3.floatingcars.net",
    "port": 443,
    "type": "xhttp",
    "security": "tls",
    "sni": "ob3.floatingcars.net",
    "path": "/media/live",
    "raw": "vless://d3e53f03-0e2b-441c-89f4-bd4602c29587@ob3.floatingcars.net:443?encryption=none&type=xhttp&security=tls&sni=ob3.floatingcars.net&fp=firefox&alpn=h2%2Chttp%2F1.1&path=%2Fmedia%2Flive&host=ob3.floatingcars.net&mode=packet-up&extra=%7B%22headers%22%3A%7B%22Accept%22%3A%22%2A%2F%2A%22%2C%22Accept-Language%22%3A%22ru-RU%2Cru%3Bq%3D0.9%2Cen-US%3Bq%3D0.8%2Cen%3Bq%3D0.7%22%2C%22Cookie%22%3A%22session_id%3D583347db8e6cf4574a2dac34b7b846fe%22%2C%22Origin%22%3A%22https%3A%2F%2Fob3.floatingcars.net%2F%22%2C%22Referer%22%3A%22https%3A%2F%2Fob3.floatingcars.net%2F%22%2C%22Sec-Fetch-Dest%22%3A%22empty%22%2C%22Sec-Fetch-Mode%22%3A%22cors%22%2C%22Sec-Fetch-Site%22%3A%22same-origin%22%2C%22User-Agent%22%3A%22Mozilla%2F5.0+%28Windows+NT+10.0%3B+Win64%3B+x64%3B+rv%3A151.0%29+Gecko%2F20100101+Firefox%2F151.0%22%7D%2C%22mode%22%3A%22packet-up%22%2C%22noSSEHeader%22%3Afalse%2C%22path%22%3A%22%2Fmedia%2Flive%2F%22%2C%22scMaxBufferedPosts%22%3A512%2C%22scMaxEachPostBytes%22%3A524288%2C%22scMinPostsIntervalMs%22%3A%2250-150%22%2C%22uplinkHTTPMethod%22%3A%22GET%22%2C%22xPaddingBytes%22%3A%2248-300%22%2C%22xPaddingHeader%22%3A%22X-Cache%22%2C%22xPaddingKey%22%3A%22_rnd%22%2C%22xPaddingMethod%22%3A%22tokenish%22%2C%22xPaddingObfsMode%22%3Atrue%2C%22xPaddingPlacement%22%3A%22queryInHeader%22%2C%22xmux%22%3A%7B%22cMaxReuseTimes%22%3A%22128-256%22%2C%22hKeepAlivePeriod%22%3A15%2C%22hMaxRequestTimes%22%3A%221000-2000%22%2C%22hMaxReusableSecs%22%3A%221800-3600%22%2C%22maxConcurrency%22%3A%228-16%22%7D%7D#%F0%9F%87%A9%F0%9F%87%AA%20%F0%9F%9B%B0%EF%B8%8F%20%D0%9E%D0%B1%D1%85%D0%BE%D0%B4%20%D0%B1%D0%B5%D0%BB.%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%BE%D0%B2%20%231-2"
  },
  {
    "id": "srv_42",
    "name": "🇳🇱 🛰️ Обход бел. списков #1-3",
    "flag": "🌐",
    "proto": "vless",
    "host": "stroyservis.cc",
    "port": 443,
    "type": "ws",
    "security": "tls",
    "sni": "stroyservis.cc",
    "path": "/media/stream/5o5LQpy6SwFu",
    "raw": "vless://d84953fb-1610-4f76-a77f-652357de5dd3@stroyservis.cc:443?encryption=none&type=ws&security=tls&sni=stroyservis.cc&fp=edge&alpn=http%2F1.1&path=%2Fmedia%2Fstream%2F5o5LQpy6SwFu&host=stroyservis.cc#%F0%9F%87%B3%F0%9F%87%B1%20%F0%9F%9B%B0%EF%B8%8F%20%D0%9E%D0%B1%D1%85%D0%BE%D0%B4%20%D0%B1%D0%B5%D0%BB.%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%BE%D0%B2%20%231-3"
  },
  {
    "id": "srv_43",
    "name": "🇵🇱 🛰️ Обход бел. списков #2-1",
    "flag": "🌐",
    "proto": "vless",
    "host": "cdn-ya.shamanapp.online",
    "port": 443,
    "type": "xhttp",
    "security": "tls",
    "sni": "cdn-ya.shamanapp.online",
    "path": "/media/hls/720p/",
    "raw": "vless://40c8a202-4b7f-45a6-b0aa-37db0fac4df8@cdn-ya.shamanapp.online:443?encryption=none&type=xhttp&security=tls&sni=cdn-ya.shamanapp.online&fp=firefox&alpn=h2%2Chttp%2F1.1&path=%2Fmedia%2Fhls%2F720p%2F&host=cdn-ya.shamanapp.online&mode=packet-up&extra=%7B%22noGRPCHeader%22%3Atrue%2C%22noSSEHeader%22%3Atrue%2C%22scMaxBufferedPosts%22%3A64%2C%22scMaxEachPostBytes%22%3A20000%2C%22scMinPostsIntervalMs%22%3A5%2C%22scStreamUpServerSecs%22%3A60%2C%22seqKey%22%3A%22page%22%2C%22seqPlacement%22%3A%22query%22%2C%22sessionIDKey%22%3A%22token%22%2C%22sessionIDLength%22%3A%2216-32%22%2C%22sessionIDPlacement%22%3A%22path%22%2C%22sessionIDTable%22%3A%22Base62%22%2C%22uplinkChunkSize%22%3A20000%2C%22uplinkDataKey%22%3A%22X-Request-Id%22%2C%22uplinkDataPlacement%22%3A%22header%22%2C%22uplinkHTTPMethod%22%3A%22GET%22%2C%22xPaddingBytes%22%3A%22100-1000%22%2C%22xPaddingHeader%22%3A%22X-Cache%22%2C%22xPaddingKey%22%3A%22_dc%22%2C%22xPaddingMethod%22%3A%22tokenish%22%2C%22xPaddingObfsMode%22%3Atrue%2C%22xPaddingPlacement%22%3A%22header%22%2C%22xmux%22%3A%7B%22cMaxReuseTimes%22%3A0%2C%22hKeepAlivePeriod%22%3A0%2C%22hMaxRequestTimes%22%3A%22600-900%22%2C%22hMaxReusableSecs%22%3A%22600-900%22%2C%22maxConcurrency%22%3A%2216-32%22%2C%22maxConnections%22%3A0%7D%7D#%F0%9F%87%B5%F0%9F%87%B1%20%F0%9F%9B%B0%EF%B8%8F%20%D0%9E%D0%B1%D1%85%D0%BE%D0%B4%20%D0%B1%D0%B5%D0%BB.%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%BE%D0%B2%20%232-1"
  },
  {
    "id": "srv_44",
    "name": "🇵🇱 🛰️ Обход бел. списков #3-1",
    "flag": "🌐",
    "proto": "vless",
    "host": "cdn5.papar.online",
    "port": 443,
    "type": "xhttp",
    "security": "tls",
    "sni": "cdn5.papar.online",
    "path": "/api/v2/locale/",
    "raw": "vless://c37e8a11-cff8-4f11-bbbb-f0f8d7cbcb0c@cdn5.papar.online:443?encryption=none&type=xhttp&security=tls&sni=cdn5.papar.online&fp=qq&alpn=h2%2Chttp%2F1.1&path=%2Fapi%2Fv2%2Flocale%2F&host=cdn5.papar.online&mode=packet-up&extra=%7B%22mode%22%3A%22packet-up%22%2C%22path%22%3A%22%2Fapi%2Fv2%2Flocale%2F%22%2C%22scMaxEachPostBytes%22%3A32768%2C%22scMinPostsIntervalMs%22%3A10%2C%22serverMaxHeaderBytes%22%3A65536%2C%22uplinkChunkSize%22%3A%2216384%22%2C%22uplinkDataKey%22%3A%22data%22%2C%22uplinkDataPlacement%22%3A%22header%22%2C%22uplinkHTTPMethod%22%3A%22GET%22%2C%22xPaddingHeader%22%3A%22X-Cache%22%2C%22xPaddingKey%22%3A%22_dc%22%2C%22xPaddingMethod%22%3A%22tokenish%22%2C%22xPaddingObfsMode%22%3Atrue%2C%22xPaddingPlacement%22%3A%22queryInHeader%22%2C%22xmux%22%3A%7B%22maxConnections%22%3A4%7D%7D#%F0%9F%87%B5%F0%9F%87%B1%20%F0%9F%9B%B0%EF%B8%8F%20%D0%9E%D0%B1%D1%85%D0%BE%D0%B4%20%D0%B1%D0%B5%D0%BB.%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%BE%D0%B2%20%233-1"
  },
  {
    "id": "srv_45",
    "name": "🇵🇱 🛰️ Обход бел. списков #4-1",
    "flag": "🌐",
    "proto": "vless",
    "host": "api.pl.fast1984.io",
    "port": 443,
    "type": "xhttp",
    "security": "tls",
    "sni": "api.pl.fast1984.io",
    "path": "/api/uploadFile/",
    "raw": "vless://a443d7bf-f506-46ce-b64d-cf8891c0a9f7@api.pl.fast1984.io:443?encryption=none&type=xhttp&security=tls&sni=api.pl.fast1984.io&fp=edge&alpn=h2%2Chttp%2F1.1&path=%2Fapi%2FuploadFile%2F&host=api.pl.fast1984.io&mode=packet-up&extra=%7B%22noGRPCHeader%22%3Afalse%2C%22noSSEHeader%22%3Afalse%2C%22path%22%3A%22%2Fapi%2FuploadFile%2F%22%2C%22scStreamUpServerSecs%22%3A%22120-300%22%2C%22seqKey%22%3A%22chunk_id%22%2C%22seqPlacement%22%3A%22query%22%2C%22sessionIDKey%22%3A%22X-Upload-Token%22%2C%22sessionIDLength%22%3A%2216-24%22%2C%22sessionIDPlacement%22%3A%22header%22%2C%22sessionIDTable%22%3A%220123456789abcdef%22%2C%22uplinkDataKey%22%3A%22X-Upload-Data%22%2C%22uplinkDataPlacement%22%3A%22header%22%2C%22uplinkHTTPMethod%22%3A%22GET%22%2C%22xPaddingBytes%22%3A%2248-320%22%2C%22xPaddingHeader%22%3A%22X-Client-Version%22%2C%22xPaddingKey%22%3A%22hash%22%2C%22xPaddingMethod%22%3A%22tokenish%22%2C%22xPaddingObfsMode%22%3Atrue%2C%22xPaddingPlacement%22%3A%22queryInHeader%22%2C%22xmux%22%3A%7B%22hMaxRequestTimes%22%3A%22600-900%22%2C%22hMaxReusableSecs%22%3A%221800-3000%22%2C%22maxConnections%22%3A2%7D%7D&fm=%7B%22tcp%22%3A%5B%7B%22type%22%3A%22fragment%22%2C%22settings%22%3A%7B%22delay%22%3A%2210-20%22%2C%22length%22%3A%22100-200%22%2C%22packets%22%3A%22tlshello%22%2C%22maxSplit%22%3A3%7D%7D%5D%7D#%F0%9F%87%B5%F0%9F%87%B1%20%F0%9F%9B%B0%EF%B8%8F%20%D0%9E%D0%B1%D1%85%D0%BE%D0%B4%20%D0%B1%D0%B5%D0%BB.%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%BE%D0%B2%20%234-1"
  },
  {
    "id": "srv_46",
    "name": "🇷🇺 🛰️ Обход бел. списков #5-1",
    "flag": "🌐",
    "proto": "vless",
    "host": "185.141.227.180",
    "port": 2053,
    "type": "xhttp",
    "security": "tls",
    "sni": "dismissaltree.net",
    "path": "/api/v1/upload",
    "raw": "vless://2c634977-584e-4e1f-b501-1b70c77a6743@185.141.227.180:2053?encryption=none&type=xhttp&security=tls&sni=dismissaltree.net&fp=chrome&alpn=h2%2Chttp%2F1.1&path=%2Fapi%2Fv1%2Fupload&host=dismissaltree.net&mode=auto&extra=%7B%22downloadSettings%22%3Anull%2C%22headers%22%3Anull%2C%22host%22%3A%22%22%2C%22mode%22%3A%22%22%2C%22noGRPCHeader%22%3Afalse%2C%22noSSEHeader%22%3Afalse%2C%22path%22%3A%22%22%2C%22scMaxBufferedPosts%22%3A0%2C%22scMaxEachPostBytes%22%3A%221000000%22%2C%22scMinPostsIntervalMs%22%3A%2230%22%2C%22scStreamUpServerSecs%22%3A%220%22%2C%22seqKey%22%3A%22%22%2C%22seqPlacement%22%3A%22%22%2C%22serverMaxHeaderBytes%22%3A0%2C%22sessionIDKey%22%3A%22%22%2C%22sessionIDLength%22%3A%220%22%2C%22sessionIDPlacement%22%3A%22%22%2C%22sessionIDTable%22%3A%22%22%2C%22uplinkChunkSize%22%3A%220%22%2C%22uplinkDataKey%22%3A%22%22%2C%22uplinkDataPlacement%22%3A%22%22%2C%22uplinkHTTPMethod%22%3A%22%22%2C%22xPaddingBytes%22%3A%22100-1000%22%2C%22xPaddingHeader%22%3A%22%22%2C%22xPaddingKey%22%3A%22%22%2C%22xPaddingMethod%22%3A%22%22%2C%22xPaddingObfsMode%22%3Afalse%2C%22xPaddingPlacement%22%3A%22%22%2C%22xmux%22%3A%7B%22cMaxReuseTimes%22%3A%2264-128%22%2C%22hKeepAlivePeriod%22%3A0%2C%22hMaxRequestTimes%22%3A%220%22%2C%22hMaxReusableSecs%22%3A%220%22%2C%22maxConcurrency%22%3A%2216-32%22%2C%22maxConnections%22%3A%220%22%7D%7D#%F0%9F%87%B7%F0%9F%87%BA%20%F0%9F%9B%B0%EF%B8%8F%20%D0%9E%D0%B1%D1%85%D0%BE%D0%B4%20%D0%B1%D0%B5%D0%BB.%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%BE%D0%B2%20%235-1"
  },
  {
    "id": "srv_47",
    "name": "🇷🇺 🛰️ Обход бел. списков #5-2",
    "flag": "🌐",
    "proto": "vless",
    "host": "78.159.246.85",
    "port": 2053,
    "type": "xhttp",
    "security": "tls",
    "sni": "fitindoor.net",
    "path": "/api/v1/upload",
    "raw": "vless://95a608b6-bff1-4e10-bb61-0a39f221bb7d@78.159.246.85:2053?encryption=none&type=xhttp&security=tls&sni=fitindoor.net&fp=firefox&alpn=h2%2Chttp%2F1.1&path=%2Fapi%2Fv1%2Fupload&host=fitindoor.net&mode=auto&extra=%7B%22downloadSettings%22%3Anull%2C%22headers%22%3Anull%2C%22host%22%3A%22%22%2C%22mode%22%3A%22%22%2C%22noGRPCHeader%22%3Afalse%2C%22noSSEHeader%22%3Afalse%2C%22path%22%3A%22%22%2C%22scMaxBufferedPosts%22%3A0%2C%22scMaxEachPostBytes%22%3A%221000000%22%2C%22scMinPostsIntervalMs%22%3A%2230%22%2C%22scStreamUpServerSecs%22%3A%220%22%2C%22seqKey%22%3A%22%22%2C%22seqPlacement%22%3A%22%22%2C%22serverMaxHeaderBytes%22%3A0%2C%22sessionIDKey%22%3A%22%22%2C%22sessionIDLength%22%3A%220%22%2C%22sessionIDPlacement%22%3A%22%22%2C%22sessionIDTable%22%3A%22%22%2C%22uplinkChunkSize%22%3A%220%22%2C%22uplinkDataKey%22%3A%22%22%2C%22uplinkDataPlacement%22%3A%22%22%2C%22uplinkHTTPMethod%22%3A%22%22%2C%22xPaddingBytes%22%3A%22100-1000%22%2C%22xPaddingHeader%22%3A%22%22%2C%22xPaddingKey%22%3A%22%22%2C%22xPaddingMethod%22%3A%22%22%2C%22xPaddingObfsMode%22%3Afalse%2C%22xPaddingPlacement%22%3A%22%22%2C%22xmux%22%3A%7B%22cMaxReuseTimes%22%3A%2264-128%22%2C%22hKeepAlivePeriod%22%3A0%2C%22hMaxRequestTimes%22%3A%220%22%2C%22hMaxReusableSecs%22%3A%220%22%2C%22maxConcurrency%22%3A%2216-32%22%2C%22maxConnections%22%3A%220%22%7D%7D#%F0%9F%87%B7%F0%9F%87%BA%20%F0%9F%9B%B0%EF%B8%8F%20%D0%9E%D0%B1%D1%85%D0%BE%D0%B4%20%D0%B1%D0%B5%D0%BB.%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%BE%D0%B2%20%235-2"
  },
  {
    "id": "srv_48",
    "name": "🇷🇺 🛰️ Обход бел. списков #6-1",
    "flag": "🌐",
    "proto": "vless",
    "host": "188.225.77.254",
    "port": 8443,
    "type": "grpc",
    "security": "reality",
    "sni": "io.ozone.ru",
    "path": "",
    "raw": "vless://9cfb9099-439f-4bd2-87d3-54e67269fdc3@188.225.77.254:8443?encryption=none&type=grpc&security=reality&sni=io.ozone.ru&fp=firefox&sid=4951a2313524dd8f&pbk=rJ-fFNYXh7WW9LuYe1N71fh7nAEe5i09Pi5ZDSDlH1s&serviceName=ozone&authority=io.ozone.ru#%F0%9F%87%B7%F0%9F%87%BA%20%F0%9F%9B%B0%EF%B8%8F%20%D0%9E%D0%B1%D1%85%D0%BE%D0%B4%20%D0%B1%D0%B5%D0%BB.%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%BE%D0%B2%20%236-1"
  },
  {
    "id": "srv_49",
    "name": "🇷🇺 🛰️ Обход бел. списков #7-1",
    "flag": "🌐",
    "proto": "vless",
    "host": "188.225.77.254",
    "port": 8443,
    "type": "grpc",
    "security": "reality",
    "sni": "io.ozone.ru",
    "path": "",
    "raw": "vless://1071a55c-99fd-4d05-977f-cd450ac9a1c8@188.225.77.254:8443?encryption=none&type=grpc&security=reality&sni=io.ozone.ru&fp=firefox&sid=4951a2313524dd8f&pbk=rJ-fFNYXh7WW9LuYe1N71fh7nAEe5i09Pi5ZDSDlH1s&serviceName=ozone&authority=io.ozone.ru#%F0%9F%87%B7%F0%9F%87%BA%20%F0%9F%9B%B0%EF%B8%8F%20%D0%9E%D0%B1%D1%85%D0%BE%D0%B4%20%D0%B1%D0%B5%D0%BB.%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%BE%D0%B2%20%237-1"
  },
  {
    "id": "srv_50",
    "name": "🇵🇱 🛰️ Обход бел. списков #8-1",
    "flag": "🌐",
    "proto": "vless",
    "host": "api.pl.fast1984.io",
    "port": 443,
    "type": "xhttp",
    "security": "tls",
    "sni": "api.pl.fast1984.io",
    "path": "/api/uploadFile/",
    "raw": "vless://c720cb74-4c84-4fce-b8ae-637dbaa16199@api.pl.fast1984.io:443?encryption=none&type=xhttp&security=tls&sni=api.pl.fast1984.io&fp=edge&alpn=h2%2Chttp%2F1.1&path=%2Fapi%2FuploadFile%2F&host=api.pl.fast1984.io&mode=packet-up&extra=%7B%22noGRPCHeader%22%3Afalse%2C%22noSSEHeader%22%3Afalse%2C%22path%22%3A%22%2Fapi%2FuploadFile%2F%22%2C%22scStreamUpServerSecs%22%3A%22120-300%22%2C%22seqKey%22%3A%22chunk_id%22%2C%22seqPlacement%22%3A%22query%22%2C%22sessionIDKey%22%3A%22X-Upload-Token%22%2C%22sessionIDLength%22%3A%2216-24%22%2C%22sessionIDPlacement%22%3A%22header%22%2C%22sessionIDTable%22%3A%220123456789abcdef%22%2C%22uplinkDataKey%22%3A%22X-Upload-Data%22%2C%22uplinkDataPlacement%22%3A%22header%22%2C%22uplinkHTTPMethod%22%3A%22GET%22%2C%22xPaddingBytes%22%3A%2248-320%22%2C%22xPaddingHeader%22%3A%22X-Client-Version%22%2C%22xPaddingKey%22%3A%22hash%22%2C%22xPaddingMethod%22%3A%22tokenish%22%2C%22xPaddingObfsMode%22%3Atrue%2C%22xPaddingPlacement%22%3A%22queryInHeader%22%2C%22xmux%22%3A%7B%22hMaxRequestTimes%22%3A%22600-900%22%2C%22hMaxReusableSecs%22%3A%221800-3000%22%2C%22maxConnections%22%3A2%7D%7D&fm=%7B%22tcp%22%3A%5B%7B%22type%22%3A%22fragment%22%2C%22settings%22%3A%7B%22delay%22%3A%2210-20%22%2C%22length%22%3A%22100-200%22%2C%22packets%22%3A%22tlshello%22%2C%22maxSplit%22%3A3%7D%7D%5D%7D#%F0%9F%87%B5%F0%9F%87%B1%20%F0%9F%9B%B0%EF%B8%8F%20%D0%9E%D0%B1%D1%85%D0%BE%D0%B4%20%D0%B1%D0%B5%D0%BB.%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%BE%D0%B2%20%238-1"
  },
  {
    "id": "srv_51",
    "name": "🇩🇪 🛰️ Обход бел. списков #9-1",
    "flag": "🌐",
    "proto": "vless",
    "host": "yan9.aliboba.shop",
    "port": 443,
    "type": "xhttp",
    "security": "tls",
    "sni": "yan9.aliboba.shop",
    "path": "/api/api_v2/mediaupload_process",
    "raw": "vless://18ab3da9-f571-4784-93f2-025b43302c08@yan9.aliboba.shop:443?encryption=none&type=xhttp&security=tls&sni=yan9.aliboba.shop&fp=chrome&alpn=h2%2Chttp%2F1.1&path=%2Fapi%2Fapi_v2%2Fmediaupload_process&mode=packet-up&extra=%7B%22noSSEHeader%22%3Afalse%2C%22scMaxBufferedPosts%22%3A512%2C%22scMaxEachPostBytes%22%3A%2220480-24576%22%2C%22scMinPostsIntervalMs%22%3A%222-3%22%2C%22seqKey%22%3A%22segment%22%2C%22seqPlacement%22%3A%22query%22%2C%22serverMaxHeaderBytes%22%3A262144%2C%22sessionIDKey%22%3A%22media_session%22%2C%22sessionIDLength%22%3A%2222-30%22%2C%22sessionIDPlacement%22%3A%22query%22%2C%22sessionIDTable%22%3A%22Base62%22%2C%22uplinkChunkSize%22%3A%224096-6144%22%2C%22uplinkDataKey%22%3A%22data%22%2C%22uplinkDataPlacement%22%3A%22header%22%2C%22uplinkHTTPMethod%22%3A%22GET%22%2C%22xPaddingBytes%22%3A%2264-320%22%2C%22xPaddingHeader%22%3A%22Referer%22%2C%22xPaddingKey%22%3A%22cacheVersion%22%2C%22xPaddingMethod%22%3A%22tokenish%22%2C%22xPaddingObfsMode%22%3Atrue%2C%22xPaddingPlacement%22%3A%22queryInHeader%22%2C%22xmux%22%3A%7B%22cMaxReuseTimes%22%3A%22128-256%22%2C%22hMaxRequestTimes%22%3A%221200-2400%22%2C%22hMaxReusableSecs%22%3A%22900-1800%22%2C%22maxConcurrency%22%3A%2216-32%22%2C%22maxConnections%22%3A0%7D%7D#%F0%9F%87%A9%F0%9F%87%AA%20%F0%9F%9B%B0%EF%B8%8F%20%D0%9E%D0%B1%D1%85%D0%BE%D0%B4%20%D0%B1%D0%B5%D0%BB.%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%BE%D0%B2%20%239-1"
  },
  {
    "id": "srv_52",
    "name": "🇺🇸 🛰️ Обход бел. списков #10-1",
    "flag": "🌐",
    "proto": "vless",
    "host": "95.181.173.68",
    "port": 9443,
    "type": "tcp",
    "security": "reality",
    "sni": "usa.edgeses.org",
    "path": "",
    "raw": "vless://c3db7657-88ce-42a6-b998-1e0364b277ac@95.181.173.68:9443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&sni=usa.edgeses.org&fp=firefox&sid=649ab61e575fdbc9&pbk=ELJzJkc4SiCeCn6OF-8V9oeoJqXcD1y9WUntP3It53g#%F0%9F%87%BA%F0%9F%87%B8%20%F0%9F%9B%B0%EF%B8%8F%20%D0%9E%D0%B1%D1%85%D0%BE%D0%B4%20%D0%B1%D0%B5%D0%BB.%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%BE%D0%B2%20%2310-1"
  },
  {
    "id": "srv_53",
    "name": "🇺🇸 🛰️ Обход бел. списков #10-2",
    "flag": "🌐",
    "proto": "vless",
    "host": "193.233.202.250",
    "port": 9443,
    "type": "tcp",
    "security": "reality",
    "sni": "usa.edgeses.org",
    "path": "",
    "raw": "vless://c3db7657-88ce-42a6-b998-1e0364b277ac@193.233.202.250:9443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&sni=usa.edgeses.org&fp=firefox&sid=649ab61e575fdbc9&pbk=ELJzJkc4SiCeCn6OF-8V9oeoJqXcD1y9WUntP3It53g#%F0%9F%87%BA%F0%9F%87%B8%20%F0%9F%9B%B0%EF%B8%8F%20%D0%9E%D0%B1%D1%85%D0%BE%D0%B4%20%D0%B1%D0%B5%D0%BB.%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%BE%D0%B2%20%2310-2"
  },
  {
    "id": "srv_54",
    "name": "🇺🇸 🛰️ Обход бел. списков #10-3",
    "flag": "🌐",
    "proto": "vless",
    "host": "213.165.50.45",
    "port": 9443,
    "type": "tcp",
    "security": "reality",
    "sni": "usa.edgeses.org",
    "path": "",
    "raw": "vless://c3db7657-88ce-42a6-b998-1e0364b277ac@213.165.50.45:9443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&sni=usa.edgeses.org&fp=firefox&sid=649ab61e575fdbc9&pbk=ELJzJkc4SiCeCn6OF-8V9oeoJqXcD1y9WUntP3It53g#%F0%9F%87%BA%F0%9F%87%B8%20%F0%9F%9B%B0%EF%B8%8F%20%D0%9E%D0%B1%D1%85%D0%BE%D0%B4%20%D0%B1%D0%B5%D0%BB.%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%BE%D0%B2%20%2310-3"
  },
  {
    "id": "srv_55",
    "name": "🇩🇪 🛰️ Обход бел. списков #11-1",
    "flag": "🌐",
    "proto": "vless",
    "host": "cdn.fius.dev",
    "port": 443,
    "type": "xhttp",
    "security": "tls",
    "sni": "cdn.fius.dev",
    "path": "/api-test",
    "raw": "vless://000187a2-924b-8be4-b475-485a4699c80d@cdn.fius.dev:443?encryption=none&security=tls&sni=cdn.fius.dev&fp=firefox&alpn=h2%2Chttp/1.1&type=xhttp&host=cdn.fius.dev&path=/api-test&mode=packet-up&extra=%7B%22xPaddingObfsMode%22%3Atrue%2C%22xPaddingKey%22%3A%22dc%22%2C%22xPaddingHeader%22%3A%22X-Cache%22%2C%22xPaddingMethod%22%3A%22tokenish%22%2C%22xPaddingPlacement%22%3A%22queryInHeader%22%2C%22xPaddingBytes%22%3A%22100-1000%22%2C%22scMaxEachPostBytes%22%3A16384%2C%22scMinPostsIntervalMs%22%3A10%2C%22uplinkDataPlacement%22%3A%22header%22%2C%22uplinkChunkSize%22%3A4096%2C%22uplinkHTTPMethod%22%3A%22OPTIONS%22%7D#%F0%9F%87%A9%F0%9F%87%AA%20%F0%9F%9B%B0%EF%B8%8F%20%D0%9E%D0%B1%D1%85%D0%BE%D0%B4%20%D0%B1%D0%B5%D0%BB.%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%BE%D0%B2%20%2311-1"
  },
  {
    "id": "srv_56",
    "name": "🇷🇺 🛰️ Обход бел. списков #12-1",
    "flag": "🌐",
    "proto": "vless",
    "host": "188.225.77.254",
    "port": 8443,
    "type": "grpc",
    "security": "reality",
    "sni": "io.ozone.ru",
    "path": "",
    "raw": "vless://5473d93b-3cb2-4a10-9fd5-2b98459d9c53@188.225.77.254:8443?encryption=none&type=grpc&serviceName=ozone&mode=gun&authority=io.ozone.ru&security=reality&sni=io.ozone.ru&fp=firefox&pbk=rJ-fFNYXh7WW9LuYe1N71fh7nAEe5i09Pi5ZDSDlH1s&sid=4951a2313524dd8f#%F0%9F%87%B7%F0%9F%87%BA%20%F0%9F%9B%B0%EF%B8%8F%20%D0%9E%D0%B1%D1%85%D0%BE%D0%B4%20%D0%B1%D0%B5%D0%BB.%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%BE%D0%B2%20%2312-1"
  },
  {
    "id": "srv_57",
    "name": "🇪🇺 🛰️ Обход бел. списков #13-1",
    "flag": "🌐",
    "proto": "vless",
    "host": "wb.firestream.space",
    "port": 444,
    "type": "tcp",
    "security": "reality",
    "sni": "perekretok.ru",
    "path": "",
    "raw": "vless://50a87e21-f0e2-4b53-a787-91adfe748f63@wb.firestream.space:444?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&sni=perekretok.ru&fp=firefox&sid=71e87186710e710e&pbk=fX-c03-U5C_PdT9fUWsvfleurki1versFhT9jHNy20s#%F0%9F%87%AA%F0%9F%87%BA%20%F0%9F%9B%B0%EF%B8%8F%20%D0%9E%D0%B1%D1%85%D0%BE%D0%B4%20%D0%B1%D0%B5%D0%BB.%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%BE%D0%B2%20%2313-1"
  },
  {
    "id": "srv_58",
    "name": "🇩🇪 🛰️ Обход бел. списков #14-1",
    "flag": "🌐",
    "proto": "vless",
    "host": "cdn-1.frdmhere.com",
    "port": 443,
    "type": "xhttp",
    "security": "tls",
    "sni": "cdn-1.frdmhere.com",
    "path": "/api/v2/events/short",
    "raw": "vless://44be63a1-e570-4161-9165-6970f8a7075d@cdn-1.frdmhere.com:443?encryption=none&type=xhttp&security=tls&sni=cdn-1.frdmhere.com&fp=firefox&alpn=h2&path=%2Fapi%2Fv2%2Fevents%2Fshort&host=cdn-1.frdmhere.com&mode=packet-up&extra=%7B%22headers%22%3A%7B%7D%2C%22noGRPCHeader%22%3Afalse%2C%22noSSEHeader%22%3Atrue%2C%22scMaxEachPostBytes%22%3A1000000%2C%22scMinPostsIntervalMs%22%3A30%2C%22scStreamUpServerSecs%22%3A%222-6%22%2C%22seqKey%22%3A%22x_seq%22%2C%22seqPlacement%22%3A%22query%22%2C%22serverMaxHeaderBytes%22%3A65536%2C%22sessionIDKey%22%3A%22x_session%22%2C%22sessionIDPlacement%22%3A%22query%22%2C%22uplinkChunkSize%22%3A%22512-1024%22%2C%22uplinkDataKey%22%3A%22X-Data%22%2C%22uplinkDataPlacement%22%3A%22header%22%2C%22uplinkHTTPMethod%22%3A%22GET%22%2C%22xPaddingBytes%22%3A%221-16%22%2C%22xPaddingHeader%22%3A%22Referer%22%2C%22xPaddingKey%22%3A%22utm_source%22%2C%22xPaddingMethod%22%3A%22tokenish%22%2C%22xPaddingObfsMode%22%3Atrue%2C%22xPaddingPlacement%22%3A%22queryInHeader%22%2C%22xmux%22%3A%7B%22cMaxReuseTimes%22%3A0%2C%22hKeepAlivePeriod%22%3A0%2C%22hMaxRequestTimes%22%3A%22200-400%22%2C%22hMaxReusableSecs%22%3A%22600-1200%22%2C%22maxConnections%22%3A3%7D%7D#%F0%9F%87%A9%F0%9F%87%AA%20%F0%9F%9B%B0%EF%B8%8F%20%D0%9E%D0%B1%D1%85%D0%BE%D0%B4%20%D0%B1%D0%B5%D0%BB.%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%BE%D0%B2%20%2314-1"
  },
  {
    "id": "srv_59",
    "name": "🇷🇺 🛰️ Обход бел. списков #15-1",
    "flag": "🌐",
    "proto": "vless",
    "host": "ru-spb.tunnelgate.org",
    "port": 443,
    "type": "ws",
    "security": "tls",
    "sni": "ru-spb.tunnelgate.org",
    "path": "/ws/v1/ru",
    "raw": "vless://028a5a2c-2607-4e8f-804b-cbe731f87d05@ru-spb.tunnelgate.org:443?encryption=mlkem768x25519plus.native.0rtt.fsGtiqlb1xuwUZF-iPrG-9aedIIVJyMnPCNu9EiNrMKVfwcDmvBNvhRpcaxvSMuhMjDI1qh0W1wI1rRzA3OB_TKFqNomhKW841Na5qKCCFYAGRENYXCVY0qqLaU1a9gqdak6T2LG9aUtXLdY_sY1jxI5JOhcNtc6lQGIj6NVHPOa5Zd3FhdRGUo8aFopsJJUaCePlkWN4UxrzUA5geFtM1g7WcVNiFpuV_vOEQKPgHQNgwAdWYGZWfVIp6TJTfk3HYvChZgjbUkeU9y6t8A9H2Ut9QiTqjA-z1IV8CgUUNa7PvuHYOUgsLipX9BeFYOf4VSpwsmMtWtywIN2LyBU69wjyhMPmEwGOdGWdvGyVJWQ4xULffWEpvlCBBCRSJAQGyIMHPVdYuU7ALzE5dgM_Aodphek1LLAcAx3ZWIAdtowSvKD9GwuPIotC-TFNaa60qCHbsW1YFQS1CJDGxDIUCYbwKGgIqM4__BYhtDIrGtmltQKyjxJJrI3ndKrHaJb4tjDc2dJ1yO_Lom8K8mZfpVM9qg0xIE3aqeBaSFIxiueWzVf4uy0FISgxip0pzw7E4tjepIXkXbI1ZkMG2VtPmwr0wR4fWddPPV-rdklaeNzonguCspC9-JEwTjFQ3nG5yXPrLm5LcovgjIHPylwDqsQiqN2J8ESI9xOQcKJ-JVrSzZwnEhO8iZ4wVhm_Ga7qIk-TDK23JDHRRJAkvy7WYWtCluPIlXK_upU_gN-BAUrC3V81AvHQqWnBeopVaGppFo7QZd9JpoXB_RqqpXGRfXGHptsPhGUR0h-7dYnEFR_MCIV_jNLCwy2U2UDd2TBBODKF5fEPisCoYMiXQrKhhhacZqL5Io5UpWYB9lmH9VFyHwTBFfJuAuYrhcKx_Ag5kNJoBJDRTiMDifBS7MewSSrzeWCoIuiK2Q5BGodsSZAdcbGs5mySwsmQBwQWCqgDObMYzeHMxu-IksLlLKMCVQET5smRdRTkgtJclAvsuB9l4rDkPcVsKCCH8ktxGO6aSPLS4ib2Hc32qNgKASVRZYfyGM6GoN5c9hsa_QVtfa4ANqaqMzJmbJaxcA2FmsHXhaG6UXGqDd32hofLjt1NyUH8DjAIksdA2Ycy5xz3yRZCIIeKHaUR5s9uoQWfZYYMYJfl6o6ohmEXrScGGN_BYgb1GSkX5OcODGDKBVdPEd20IQ62je4pYUJzjtw66MkZUuS2_VRlni1aqNz4JB3sKpAtDyMqYApa-x2v5YU1tdH1BQkYmty16pqE1w4akVZ-rJOQwnJlrY6-1gz2PtjWHQoWju_31E92WYYwoMBSPkEhgCcbTys0FAD6sxu6Mh2UrSh0AZIX3mdXWk2IlmSd7QuoFuNEClwRCiNpokoclMkyvOe7oEFa6xIGvGMGnc2RzkmCyXBjyZgIgussYtl8ZplgcOAiAZzf-sM7-XItKlWAABWituyNyOiL_FtLkGgrpYw4NjJ_iZtoJaVpkGcALwtnrSWv1M9yvMV4wFlkDiyOyaWERidV5s75sA0l_ADPKpMd0_DPh_PN_2luzFs4QMrudBp2KJEE8Jn5Ob0_dk&type=ws&security=tls&sni=ru-spb.tunnelgate.org&fp=qq&alpn=http%2F1.1&path=%2Fws%2Fv1%2Fru&host=ru-spb.tunnelgate.org#%F0%9F%87%B7%F0%9F%87%BA%20%F0%9F%9B%B0%EF%B8%8F%20%D0%9E%D0%B1%D1%85%D0%BE%D0%B4%20%D0%B1%D0%B5%D0%BB.%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%BE%D0%B2%20%2315-1"
  },
  {
    "id": "srv_60",
    "name": "🇷🇺 🛰️ Обход бел. списков #15-2",
    "flag": "🌐",
    "proto": "vless",
    "host": "ware.tunnelgate.org",
    "port": 443,
    "type": "ws",
    "security": "tls",
    "sni": "ware.tunnelgate.org",
    "path": "/ws/v1/ru",
    "raw": "vless://028a5a2c-2607-4e8f-804b-cbe731f87d05@ware.tunnelgate.org:443?encryption=mlkem768x25519plus.native.0rtt.fsGtiqlb1xuwUZF-iPrG-9aedIIVJyMnPCNu9EiNrMKVfwcDmvBNvhRpcaxvSMuhMjDI1qh0W1wI1rRzA3OB_TKFqNomhKW841Na5qKCCFYAGRENYXCVY0qqLaU1a9gqdak6T2LG9aUtXLdY_sY1jxI5JOhcNtc6lQGIj6NVHPOa5Zd3FhdRGUo8aFopsJJUaCePlkWN4UxrzUA5geFtM1g7WcVNiFpuV_vOEQKPgHQNgwAdWYGZWfVIp6TJTfk3HYvChZgjbUkeU9y6t8A9H2Ut9QiTqjA-z1IV8CgUUNa7PvuHYOUgsLipX9BeFYOf4VSpwsmMtWtywIN2LyBU69wjyhMPmEwGOdGWdvGyVJWQ4xULffWEpvlCBBCRSJAQGyIMHPVdYuU7ALzE5dgM_Aodphek1LLAcAx3ZWIAdtowSvKD9GwuPIotC-TFNaa60qCHbsW1YFQS1CJDGxDIUCYbwKGgIqM4__BYhtDIrGtmltQKyjxJJrI3ndKrHaJb4tjDc2dJ1yO_Lom8K8mZfpVM9qg0xIE3aqeBaSFIxiueWzVf4uy0FISgxip0pzw7E4tjepIXkXbI1ZkMG2VtPmwr0wR4fWddPPV-rdklaeNzonguCspC9-JEwTjFQ3nG5yXPrLm5LcovgjIHPylwDqsQiqN2J8ESI9xOQcKJ-JVrSzZwnEhO8iZ4wVhm_Ga7qIk-TDK23JDHRRJAkvy7WYWtCluPIlXK_upU_gN-BAUrC3V81AvHQqWnBeopVaGppFo7QZd9JpoXB_RqqpXGRfXGHptsPhGUR0h-7dYnEFR_MCIV_jNLCwy2U2UDd2TBBODKF5fEPisCoYMiXQrKhhhacZqL5Io5UpWYB9lmH9VFyHwTBFfJuAuYrhcKx_Ag5kNJoBJDRTiMDifBS7MewSSrzeWCoIuiK2Q5BGodsSZAdcbGs5mySwsmQBwQWCqgDObMYzeHMxu-IksLlLKMCVQET5smRdRTkgtJclAvsuB9l4rDkPcVsKCCH8ktxGO6aSPLS4ib2Hc32qNgKASVRZYfyGM6GoN5c9hsa_QVtfa4ANqaqMzJmbJaxcA2FmsHXhaG6UXGqDd32hofLjt1NyUH8DjAIksdA2Ycy5xz3yRZCIIeKHaUR5s9uoQWfZYYMYJfl6o6ohmEXrScGGN_BYgb1GSkX5OcODGDKBVdPEd20IQ62je4pYUJzjtw66MkZUuS2_VRlni1aqNz4JB3sKpAtDyMqYApa-x2v5YU1tdH1BQkYmty16pqE1w4akVZ-rJOQwnJlrY6-1gz2PtjWHQoWju_31E92WYYwoMBSPkEhgCcbTys0FAD6sxu6Mh2UrSh0AZIX3mdXWk2IlmSd7QuoFuNEClwRCiNpokoclMkyvOe7oEFa6xIGvGMGnc2RzkmCyXBjyZgIgussYtl8ZplgcOAiAZzf-sM7-XItKlWAABWituyNyOiL_FtLkGgrpYw4NjJ_iZtoJaVpkGcALwtnrSWv1M9yvMV4wFlkDiyOyaWERidV5s75sA0l_ADPKpMd0_DPh_PN_2luzFs4QMrudBp2KJEE8Jn5Ob0_dk&type=ws&security=tls&sni=ware.tunnelgate.org&fp=qq&alpn=http%2F1.1&path=%2Fws%2Fv1%2Fru&host=ware.tunnelgate.org#%F0%9F%87%B7%F0%9F%87%BA%20%F0%9F%9B%B0%EF%B8%8F%20%D0%9E%D0%B1%D1%85%D0%BE%D0%B4%20%D0%B1%D0%B5%D0%BB.%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%BE%D0%B2%20%2315-2"
  },
  {
    "id": "srv_61",
    "name": "🇵🇱 🛰️ Обход бел. списков #15-3",
    "flag": "🌐",
    "proto": "vless",
    "host": "ru-kzn.tunnelgate.org",
    "port": 443,
    "type": "ws",
    "security": "tls",
    "sni": "ru-kzn.tunnelgate.org",
    "path": "/ws/v1/pl",
    "raw": "vless://028a5a2c-2607-4e8f-804b-cbe731f87d05@ru-kzn.tunnelgate.org:443?encryption=mlkem768x25519plus.native.0rtt.hYkwSqWzlFQb2Ix1APhXoBAbBetuqxVyj3aPkTmEnJIPuSdhHoKwaiykvPcPQzZ3G4gkfssihcQMdEJAbdG64re2gnfGP2JbZYVQB1K_ZiRgXbW0txGPvIY4ZqwGcdzFQlsvewHP_ipVjmdiI3M7VSRGNqhXRId84Ycaa4CTgjMslMiimzm3ZEgukxMOUPGielAsdfByKDq3yMksVVp3sKa6ceu6pbeMj8uANyC_iCdI55wCS_K2dklswmAf4AK-YWAMmekloMpaY4cVroTO3LqwDNyVNDcUifdOm4xjfvARxVfE89lf12aE3nqaPjQmCYu9HMELoWBI2GRsrJdNiXMjowq5ceYwuJpudIdrhoKgqNTKB1SIjGbCHSZStbl8D6UBWIwZ69mkkQQllnGR5zC0e4wDhbGaZMV477gvyImowAibtmddVIwmWgagBsicoixxELTPNYcOJHtElTlBCalAHSZsn2eBlGcxomBCsPIFprJIsyEQSTO_-LJ9mvGNbIOX2bchBcy6eeCJL7PKzDIluaMe7fLOOcKB98fIdic_gnyw3mYAgMF-ztIIqBRnm6VJ0zqfMSl-RrY5_3A_zEKb4WhSBlWiuGBo2mWT4YqhppWoQoqs-ehEPcRj3FEI6-tZP7VTK6vHkjRObebI3am-jZYm8Zi_SSHGX7TPmMwVn4DHBQLO8flCUJCx7AO44acrhMMVMGJtWPO98DOJQ3LCbAGiozUCttqO4La8gaxQkLQhOlt9sCZi06Q4hWxFR4OrFzqj-ohnNBlEJpzHvPBIFUaDmPaUMxvDd6UmlENXwHQKM6p32nEY-cyFmTKWeiekvhkWs1Row_AkmQSOCMuyfUCMAgZaohqeCceoTnidqqeN5XgCm9WUc4wBbgVIBqg_fkhJWcTGZgTBpraXK2BGT2YaYFsAAGi_BHSHT4XLnGN2X2FAHnFrP3KUkriIMQCMPlEQx6Q197Qtm9ySZQQvNbG7AtECi6k5Ees1yfk_tIYhUcs8aowY7cQCHEnBqxkeTEWVtThMVxgbo8e4rTMb1mZQ6-aaeGDFeWpUBRQdmoiABaYBOqQfmgA2IFZJpHKsXvsETQU3iVolFoYMmMtGlsKo_qsY9eJLRdvLdVtUS5FPeYoup3UWEDq0G2eXWAipoCKQVoS_5IRNtbgPGKuO88R0hWef66wYd3dp9AUgpJcHkTxaEZRBDPFd-ABYsWUVlvBmzluaQ0xle_JnAYkoiMqvBwaiPtg8ZlhPlAdoz6zCB5uF0KgEp7xf6jKtClNzhzYW6VcKEkl3Zcuy3DKWFRKeeHNyePdzwLKZE2ZFpZCJoBqWtTs3xHRD-RxA28VMY-WqzZtMV3SCxVyLQilL1Hgzi1A7s9wj_5RGneXKSenCnsYWJXOWGqLIFLWu2fWsgSSZyec24Tg4XAVtraEDABOEBIsvQCeS5WpenSYXWdVbUPsmYKoDCaZ04nMSkoPJIldwTTistEoBe1ZGXYJDslm1WpwlrxdMJrweb7NnoGnNmZwJVGcPFxMMzkhhDbdjpUfShI4zM7co6H1FeNeI_6_7mQOZlfSP-rKZ-SA&type=ws&security=tls&sni=ru-kzn.tunnelgate.org&fp=qq&alpn=http%2F1.1&path=%2Fws%2Fv1%2Fpl&host=ru-kzn.tunnelgate.org#%F0%9F%87%B5%F0%9F%87%B1%20%F0%9F%9B%B0%EF%B8%8F%20%D0%9E%D0%B1%D1%85%D0%BE%D0%B4%20%D0%B1%D0%B5%D0%BB.%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%BE%D0%B2%20%2315-3"
  },
  {
    "id": "srv_62",
    "name": "🇬🇧 🛰️ Обход бел. списков #16-1",
    "flag": "🌐",
    "proto": "vless",
    "host": "46.182.24.15",
    "port": 443,
    "type": "tcp",
    "security": "reality",
    "sni": "46.182.24.15",
    "path": "",
    "raw": "vless://93d0ef0b-7de3-0002-a92b-b2a427e9fe36@46.182.24.15:443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&sni=46.182.24.15&fp=firefox&pbk=V-wRiXvhBx01utmXJbrThJ_DE4tNJfK6mnzo9EB3fVA#%F0%9F%87%AC%F0%9F%87%A7%20%F0%9F%9B%B0%EF%B8%8F%20%D0%9E%D0%B1%D1%85%D0%BE%D0%B4%20%D0%B1%D0%B5%D0%BB.%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%BE%D0%B2%20%2316-1"
  }
],
  proxyDomains: [
    "xpnetsub.space",
    // Discord
    "discord.com",
    "discordapp.com",
    "discord.gg",
    "discordapp.net",
    "discordcdn.com",
    "discord.media",
    "discord.gift",
    "discord.gifts",
    "discord.new",
    "discord.dev",
    "discordstatus.com",
    "dis.gd",
    "discord-activities.com",
    "discordactivities.com",
    // YouTube & Google Video
    "youtube.com",
    "youtu.be",
    "googlevideo.com",
    "ytimg.com",
    "ggpht.com",
    "youtube-nocookie.com",
    "wide-youtube.l.google.com",
    "yt.be",
    "gvt1.com",
    "youtubekids.com",
    "jnn-pa.googleapis.com",
    // Google AI & Ecosystem
    "gemini.google.com",
    "aistudio.google.com",
    "generativelanguage.googleapis.com",
    "alkalimakersuite-pa.googleapis.com",
    "proactivebackend-pa.googleapis.com",
    "bard.google.com",
    "deepmind.google",
    "google.dev",
    "google.ai",
    "accounts.google.com",
    "clients6.google.com",
    "play.google.com",
    "google.com",
    "googleapis.com",
    "gstatic.com",
    "googleusercontent.com",
    // AI Assistants
    "copilot.microsoft.com",
    "grok.com",
    "chatgpt.com",
    "openai.com",
    "oaistatic.com",
    "oaiusercontent.com",
    "sora.com",
    "claude.ai",
    "anthropic.com",
    "deepseek.com",
    "chat.deepseek.com",
    "perplexity.ai",
    "lmarena.ai",
    "poe.com",
    "v0.dev",
    "huggingface.co",
    "cursor.com",
    "cursor.sh",
    "midjourney.com",
    // Twitter / X
    "x.com",
    "twitter.com",
    "twimg.com",
    "t.co",
    "x.ai",
    "tweetdeck.com",
    "pscp.tv",
    "periscope.tv",
    "twitpic.com",
    // Meta / Instagram / Facebook
    "instagram.com",
    "cdninstagram.com",
    "ig.me",
    "facebook.com",
    "fbcdn.net",
    "fbsbx.com",
    "fb.com",
    "fb.me",
    "threads.net",
    "meta.com",
    // Notion & Productivity
    "notion.so",
    "notion.site",
    "notion.new",
    "canva.com",
    // Spotify & Audio
    "spotify.com",
    "spotifycdn.com",
    "scdn.co",
    "spoti.fi",
    "spotify.link",
    "soundcloud.com",
    "sndcdn.com",
    // Content & Media
    "medium.com",
    "kick.com",
    "patreon.com",
    "archive.org",
    "syntaxclient.ru",
    "proton.me",
    "protonmail.com",
    "signal.org",
    // Trackers & Libraries
    "rutracker.org",
    "rutracker.net",
    "rutracker.cc",
    "nnmclub.to",
    "nnm-club.me",
    "flibusta.is",
    "flibusta.site",
    "rutor.info",
    "rutor.is",
    "lostfilm.tv",
    "lostfilm.today",
    "lostfilm.run",
    "kinozal.tv",
    "kinozal.guru",
    "pornolab.net",
    "rezka.ag",
    "hdrezka.ag",
    "hdrezka.cm",
    "hdrezka.me",
    "filmix.biz",
    "filmix.ac",
    "seasonvar.ru",
    // Telegram
    "telegram.org",
    "web.telegram.org",
    "t.me",
    "telegram.me",
    "telesco.pe",
    "tdesktop.com"
  ],
  bypassDomains: [
    "gosuslugi.ru",
    "sber.ru",
    "sberbank.ru",
    "tbank.ru",
    "tinkoff.ru",
    "yandex.ru",
    "ya.ru",
    "vk.com",
    "ozon.ru",
    "wildberries.ru",
    "kinopoisk.ru",
    "dzen.ru",
    "avito.ru",
    "2gis.ru",
    "mos.ru",
    "nalog.gov.ru",
    "rzd.ru"
  ],
  presets: [
    {
      id: "discord",
      name: "Discord",
      domains: [
        "discord.com",
        "discordapp.com",
        "discord.gg",
        "discordapp.net",
        "discordcdn.com",
        "discord.media",
        "discord.gift",
        "discord.gifts",
        "discord.new",
        "discord.dev",
        "discordstatus.com",
        "dis.gd",
        "discord-activities.com",
        "discordactivities.com"
      ]
    },
    {
      id: "youtube",
      name: "YouTube & Видео",
      domains: [
        "youtube.com",
        "youtu.be",
        "googlevideo.com",
        "ytimg.com",
        "ggpht.com",
        "youtube-nocookie.com",
        "wide-youtube.l.google.com",
        "yt.be",
        "gvt1.com",
        "youtubekids.com",
        "jnn-pa.googleapis.com"
      ]
    },
    {
      id: "gemini",
      name: "Google Gemini & AI Studio",
      domains: [
        "gemini.google.com",
        "aistudio.google.com",
        "generativelanguage.googleapis.com",
        "alkalimakersuite-pa.googleapis.com",
        "proactivebackend-pa.googleapis.com",
        "bard.google.com",
        "deepmind.google",
        "google.dev",
        "google.ai",
        "accounts.google.com",
        "clients6.google.com",
        "play.google.com",
        "google.com",
        "googleapis.com",
        "gstatic.com",
        "googleusercontent.com"
      ]
    },
    {
      id: "chatgpt",
      name: "ChatGPT / OpenAI",
      domains: [
        "chatgpt.com",
        "openai.com",
        "oaistatic.com",
        "oaiusercontent.com",
        "sora.com"
      ]
    },
    {
      id: "claude",
      name: "Claude AI",
      domains: [
        "claude.ai",
        "anthropic.com"
      ]
    },
    {
      id: "twitter",
      name: "Twitter / X",
      domains: [
        "x.com",
        "twitter.com",
        "twimg.com",
        "t.co",
        "x.ai",
        "tweetdeck.com",
        "pscp.tv",
        "periscope.tv",
        "twitpic.com"
      ]
    },
    {
      id: "meta",
      name: "Instagram / Threads",
      domains: [
        "instagram.com",
        "cdninstagram.com",
        "ig.me",
        "threads.net",
        "facebook.com",
        "fbcdn.net",
        "fbsbx.com",
        "fb.com",
        "fb.me",
        "meta.com"
      ]
    },
    {
      id: "spotify",
      name: "Spotify",
      domains: [
        "spotify.com",
        "spotifycdn.com",
        "scdn.co",
        "spoti.fi",
        "spotify.link"
      ]
    },
    {
      id: "notion",
      name: "Notion",
      domains: [
        "notion.so",
        "notion.site",
        "notion.new"
      ]
    },
    {
      id: "ai_tools",
      name: "DeepSeek / AI Hub",
      domains: [
        "deepseek.com",
        "chat.deepseek.com",
        "perplexity.ai",
        "lmarena.ai",
        "poe.com",
        "v0.dev",
        "huggingface.co",
        "cursor.com",
        "cursor.sh",
        "midjourney.com"
      ]
    },
    {
      id: "torrents",
      name: "RuTracker & Трекеры",
      domains: [
        "rutracker.org",
        "rutracker.net",
        "rutracker.cc",
        "nnmclub.to",
        "nnm-club.me",
        "flibusta.is",
        "flibusta.site",
        "rutor.info",
        "rutor.is",
        "lostfilm.tv",
        "lostfilm.today",
        "lostfilm.run",
        "kinozal.tv",
        "kinozal.guru",
        "pornolab.net",
        "rezka.ag",
        "hdrezka.ag",
        "hdrezka.cm",
        "hdrezka.me"
      ]
    },
    {
      id: "telegram",
      name: "Telegram Web & App",
      domains: [
        "telegram.org",
        "web.telegram.org",
        "t.me",
        "telegram.me",
        "telesco.pe",
        "tdesktop.com"
      ]
    }
  ]
};

function cleanDomain(d) {
  if (!d) return "";
  let clean = d.trim().toLowerCase();
  clean = clean.replace(/^[a-z]+:\/\//i, "");
  clean = clean.split("/")[0].split("?")[0].split("#")[0];

  if (clean.startsWith("[")) {
    const bracketEnd = clean.indexOf("]");
    if (bracketEnd !== -1) return clean.substring(1, bracketEnd);
  }

  if (clean.indexOf(":") !== clean.lastIndexOf(":")) return clean;

  clean = clean.split(":")[0];
  clean = clean.replace(/^\*\./, "").replace(/^\./, "").replace(/\.$/, "");
  return clean;
}

function safeDecodeB64Utf8(str) {
  if (!str || typeof str !== "string") return "";
  try {
    let s = str.replace(/[\s\r\n]+/g, "").replace(/-/g, "+").replace(/_/g, "/");
    while (s.length % 4 !== 0) s += "=";
    const binary = atob(s);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder("utf-8").decode(bytes);
  } catch(e) {
    try { return atob(str); } catch(err) { return str; }
  }
}

function safeEncodeB64Utf8(str) {
  if (!str) return "";
  try {
    const bytes = new TextEncoder().encode(str);
    let bin = "";
    for (let i = 0; i < bytes.length; i++) {
      bin += String.fromCharCode(bytes[i]);
    }
    return btoa(bin);
  } catch(e) {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch(err) {
      return "";
    }
  }
}

function extractFlag(name, host) {
  if (!name) name = "";
  const match = name.match(/\uD83C[\uDDE6-\uDDFF]{2}/);
  if (match) return match[0];
  const lower = (name + " " + (host || "")).toLowerCase();
  if (lower.includes("uk") || lower.includes("united kingdom") || lower.includes("london") || lower.includes("gb")) return "🇬🇧";
  if (lower.includes("finland") || lower.includes("helsinki")) return "🇫🇮";
  if (lower.includes("latvia") || lower.includes("riga")) return "🇱🇻";
  if (lower.includes("poland") || lower.includes("warsaw")) return "🇵🇱";
  if (lower.includes("france") || lower.includes("paris")) return "🇫🇷";
  if (lower.includes("netherlands") || lower.includes("amsterdam") || lower.includes("holland")) return "🇳🇱";
  if (lower.includes("usa") || lower.includes("united states") || lower.includes("america")) return "🇺🇸";
  if (lower.includes("germany") || lower.includes("frankfurt") || lower.includes("berlin")) return "🇩🇪";
  if (lower.includes("sweden") || lower.includes("stockholm")) return "🇸🇪";
  if (lower.includes("russia") || lower.includes("moscow")) return "🇷🇺";
  if (lower.includes("turkey") || lower.includes("istanbul")) return "🇹🇷";
  if (lower.includes("japan") || lower.includes("tokyo")) return "🇯🇵";
  if (lower.includes("singapore")) return "🇸🇬";
  if (lower.includes("canada") || lower.includes("toronto")) return "🇨🇦";
  return "🌐";
}

function cleanServerName(name) {
  if (!name) return "Server";
  return name.replace(/\uD83C[\uDDE6-\uDDFF]{2}/g, '').replace(/[🎮♾️🤖⚡🚀]/g, '').trim().replace(/\s+/g, ' ');
}

function parseClashYaml(text) {
  if (!text || (!text.includes("proxies:") && !text.includes("Proxy:"))) return [];
  const rawLines = text.split(/\r?\n/);
  let inProxies = false;
  const proxies = [];
  let cur = null;

  for (let rawLine of rawLines) {
    const line = rawLine.trim();
    if (line.startsWith("proxies:") || line === "proxies:" || line.startsWith("Proxy:")) {
      inProxies = true;
      continue;
    }
    if (inProxies && /^[a-zA-Z0-9_-]+:/.test(line) && !line.startsWith("-") && !rawLine.startsWith(" ")) {
      break;
    }
    if (!inProxies) continue;

    if (line.startsWith("- name:") || line.startsWith("- {")) {
      if (cur && (cur.server || cur.host)) proxies.push(cur);
      cur = {};
    }

    if (!cur) continue;

    const clean = line.replace(/^-+\s*/, "");
    const cIdx = clean.indexOf(":");
    if (cIdx !== -1) {
      const k = clean.substring(0, cIdx).trim().toLowerCase();
      let v = clean.substring(cIdx + 1).trim().replace(/^['"]|['"]$/g, "");
      if (k === "name") cur.name = v;
      else if (k === "type") cur.proto = v.toLowerCase();
      else if (k === "server") { cur.server = v; cur.host = v; }
      else if (k === "port") cur.port = parseInt(v, 10);
      else if (k === "uuid" || k === "password") cur.uuid = v;
      else if (k === "flow") cur.flow = v;
      else if (k === "network") cur.type = v.toLowerCase();
      else if (k === "tls") cur.security = (v === "true" || v === "1") ? "tls" : "none";
      else if (k === "servername" || k === "sni") cur.sni = v;
      else if (k === "client-fingerprint" || k === "fingerprint") cur.fp = v;
      else if (k === "public-key" || k === "pbk") { cur.pbk = v; cur.security = "reality"; }
      else if (k === "short-id" || k === "sid") cur.sid = v;
      else if (k === "spider-x" || k === "spx") cur.spx = v;
      else if (k === "path") cur.path = v;
      else if (k === "cipher") cur.cipher = v;
    }
  }
  if (cur && (cur.server || cur.host)) proxies.push(cur);

  return proxies.map((p, idx) => {
    const proto = p.proto || "vless";
    const name = p.name || `Clash Node ${idx + 1}`;
    const host = p.host;
    const port = p.port || 443;
    const sni = p.sni || host;
    const sec = p.security || (p.pbk ? "reality" : (port === 443 ? "tls" : "none"));
    const netType = p.type || "tcp";
    const flag = extractFlag(name, host);

    let raw = "";
    if (proto === "vless") {
      let q = `encryption=none&type=${netType}&security=${sec}&sni=${encodeURIComponent(sni)}`;
      if (p.flow) q += `&flow=${p.flow}`;
      if (p.fp) q += `&fp=${p.fp}`;
      if (sec === "reality" && p.pbk) {
        q += `&pbk=${encodeURIComponent(p.pbk)}`;
        if (p.sid) q += `&sid=${p.sid}`;
        if (p.spx) q += `&spx=${encodeURIComponent(p.spx)}`;
      }
      if (p.path) q += `&path=${encodeURIComponent(p.path)}`;
      raw = `vless://${p.uuid}@${host}:${port}?${q}#${encodeURIComponent(name)}`;
    } else if (proto === "vmess") {
      const vmessObj = {
        v: "2",
        ps: name,
        add: host,
        port: port,
        id: p.uuid,
        aid: p.alterId || 0,
        scy: p.cipher || "auto",
        net: netType,
        type: "none",
        host: p.host || sni,
        path: p.path || "",
        tls: sec === "tls" ? "tls" : "none",
        sni: sni
      };
      raw = `vmess://${safeEncodeB64Utf8(JSON.stringify(vmessObj))}`;
    } else if (proto === "trojan") {
      let q = `type=${netType}&security=${sec}&sni=${encodeURIComponent(sni)}`;
      if (p.fp) q += `&fp=${p.fp}`;
      if (p.path) q += `&path=${encodeURIComponent(p.path)}`;
      raw = `trojan://${encodeURIComponent(p.uuid)}@${host}:${port}?${q}#${encodeURIComponent(name)}`;
    } else if (proto === "shadowsocks" || proto === "ss") {
      const auth = safeEncodeB64Utf8(`${p.cipher || "aes-128-gcm"}:${p.uuid || p.password || ""}`);
      raw = `ss://${auth}@${host}:${port}#${encodeURIComponent(name)}`;
    } else if (proto === "hysteria2" || proto === "hy2") {
      raw = `hy2://${encodeURIComponent(p.uuid || p.password || "")}@${host}:${port}?sni=${encodeURIComponent(sni)}#${encodeURIComponent(name)}`;
    }

    return {
      id: "srv_" + (idx + 1),
      name: name,
      flag: flag,
      proto: (proto === "hysteria2" || proto === "hy2") ? "hy2" : (proto === "ss" ? "shadowsocks" : proto),
      host: host,
      port: port,
      type: netType,
      security: sec,
      sni: sni,
      path: p.path || "",
      raw: raw
    };
  }).filter(s => s.host && s.raw);
}

function parseSingboxJson(text) {
  try {
    const cleanText = text.replace(/^\uFEFF/, "").trim();
    const obj = JSON.parse(cleanText);
    const outbounds = obj.outbounds || [];
    const servers = [];
    outbounds.forEach((ob, idx) => {
      const type = (ob.type || "").toLowerCase();
      if (!["vless", "vmess", "trojan", "shadowsocks", "hysteria2"].includes(type) || !ob.server) {
        return;
      }
      const host = ob.server;
      const port = ob.server_port || (["hysteria2", "vless", "trojan"].includes(type) ? 443 : 8388);
      const name = ob.tag || `Node ${servers.length + 1}`;
      const flag = extractFlag(name, host);
      const netType = ob.transport?.type || ob.network || "tcp";
      const tls = ob.tls || {};
      const reality = tls.reality || {};
      const sec = (reality.enabled || reality.public_key) ? "reality" : (tls.enabled ? "tls" : "none");
      const sni = tls.server_name || host;
      const path = ob.transport?.path || "";

      let raw = "";
      if (type === "vless") {
        let q = `encryption=none&type=${encodeURIComponent(netType)}&security=${encodeURIComponent(sec)}&sni=${encodeURIComponent(sni)}`;
        if (ob.flow) q += `&flow=${encodeURIComponent(ob.flow)}`;
        const fp = tls.utls?.fingerprint || "chrome";
        if (fp) q += `&fp=${encodeURIComponent(fp)}`;
        if (sec === "reality") {
          if (reality.public_key) q += `&pbk=${encodeURIComponent(reality.public_key)}`;
          if (reality.short_id) q += `&sid=${encodeURIComponent(reality.short_id)}`;
          if (reality.spider_x) q += `&spx=${encodeURIComponent(reality.spider_x)}`;
        }
        if (path) q += `&path=${encodeURIComponent(path)}`;
        if (ob.transport?.headers?.Host) q += `&host=${encodeURIComponent(ob.transport.headers.Host)}`;
        raw = `vless://${encodeURIComponent(ob.uuid || "")}@${host}:${port}?${q}#${encodeURIComponent(name)}`;
      } else if (type === "vmess") {
        const vmessObj = {
          v: "2",
          ps: name,
          add: host,
          port: port,
          id: ob.uuid || "",
          aid: ob.alter_id || 0,
          scy: ob.security || "auto",
          net: netType,
          type: "none",
          host: ob.transport?.headers?.Host || sni,
          path: path,
          tls: sec === "tls" ? "tls" : "none",
          sni: sni
        };
        raw = `vmess://${safeEncodeB64Utf8(JSON.stringify(vmessObj))}`;
      } else if (type === "trojan") {
        let q = `type=${encodeURIComponent(netType)}&security=${encodeURIComponent(sec)}&sni=${encodeURIComponent(sni)}`;
        if (tls.utls?.fingerprint) q += `&fp=${encodeURIComponent(tls.utls.fingerprint)}`;
        if (path) q += `&path=${encodeURIComponent(path)}`;
        raw = `trojan://${encodeURIComponent(ob.password || "")}@${host}:${port}?${q}#${encodeURIComponent(name)}`;
      } else if (type === "shadowsocks") {
        const method = ob.method || "aes-128-gcm";
        const auth = safeEncodeB64Utf8(`${method}:${ob.password || ""}`);
        raw = `ss://${auth}@${host}:${port}#${encodeURIComponent(name)}`;
      } else if (type === "hysteria2") {
        raw = `hy2://${encodeURIComponent(ob.password || "")}@${host}:${port}?sni=${encodeURIComponent(sni)}#${encodeURIComponent(name)}`;
      }

      servers.push({
        id: "srv_" + (servers.length + 1),
        name: name,
        flag: flag,
        proto: type === "hysteria2" ? "hy2" : type,
        host: host,
        port: port,
        type: netType,
        security: sec,
        sni: sni,
        path: path,
        raw: raw
      });
    });
    return servers.filter(s => s.host && s.raw);
  } catch(e) {
    return [];
  }
}

function parseSubscriptionText(raw) {
  if (!raw || typeof raw !== "string") return { subInfo: "Нет данных", servers: [] };
  let decoded = raw.trim();

  // Check for Clash YAML first
  if (decoded.includes("proxies:") || decoded.includes("Proxy:")) {
    const clashNodes = parseClashYaml(decoded);
    if (clashNodes.length > 0) {
      return { subInfo: `Clash Подписка (${clashNodes.length} нод)`, servers: clashNodes };
    }
  }

  // Check for Sing-box JSON
  if (decoded.startsWith("{") && decoded.includes("\"outbounds\"")) {
    const sbNodes = parseSingboxJson(decoded);
    if (sbNodes.length > 0) {
      return { subInfo: `Sing-Box Подписка (${sbNodes.length} нод)`, servers: sbNodes };
    }
  }

  if (!decoded.includes("://") || decoded.startsWith("#profile-title") || decoded.startsWith("#announce")) {
    try {
      const b64 = safeDecodeB64Utf8(decoded);
      if (b64.includes("://") || b64.includes("#profile-title") || b64.includes("#announce") || b64.includes("proxies:")) {
        decoded = b64;
      }
    } catch(e) {}
  }

  // Check Clash in decoded base64
  if (decoded.includes("proxies:") || decoded.includes("Proxy:")) {
    const clashNodes = parseClashYaml(decoded);
    if (clashNodes.length > 0) {
      return { subInfo: `Clash Подписка (${clashNodes.length} нод)`, servers: clashNodes };
    }
  }

  const rawLines = decoded.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const servers = [];
  let subInfo = "";

  // Split multiple links if concatenated or comma-separated on a single line
  const lines = [];
  for (const rl of rawLines) {
    if (rl.includes("://")) {
      const parts = rl.match(/[a-zA-Z][a-zA-Z0-9+.-]*:\/\/[^\s,;]+/g);
      if (parts && parts.length > 0) {
        lines.push(...parts);
      } else {
        lines.push(rl);
      }
    } else {
      lines.push(rl);
    }
  }

  for (const line of lines) {
    if (line.startsWith("#profile-title: base64:")) {
      const val = safeDecodeB64Utf8(line.replace("#profile-title: base64:", "").trim());
      if (val) subInfo = val;
      continue;
    }
    if (line.startsWith("#announce: base64:") && !subInfo) {
      const val = safeDecodeB64Utf8(line.replace("#announce: base64:", "").trim());
      if (val) subInfo = val.split("\n")[0].trim();
      continue;
    }
    if (line.startsWith("#")) {
      const hashContent = line.replace(/^#+/, "").trim();
      if ((hashContent.includes("Осталось") || hashContent.includes("дней") || hashContent.includes("д.") || hashContent.includes("Traffic")) && !subInfo) {
        subInfo = hashContent;
      }
      continue;
    }

    if (!line.includes("://")) continue;

    try {
      const hashIdx = line.indexOf("#");
      const urlPart = hashIdx !== -1 ? line.substring(0, hashIdx) : line;
      let rawName = "Server " + (servers.length + 1);
      if (hashIdx !== -1) {
        const hashSegment = line.substring(hashIdx + 1).trim();
        try {
          rawName = decodeURIComponent(hashSegment);
        } catch(e) {
          rawName = hashSegment;
        }
      }

      if (line.startsWith("vmess://")) {
        const b64Json = line.slice(8);
        const jsonStr = safeDecodeB64Utf8(b64Json);
        const obj = JSON.parse(jsonStr);
        let vName = obj.ps || rawName;
        const flag = extractFlag(vName, obj.add);
        servers.push({
          id: "srv_" + (servers.length + 1),
          name: vName,
          flag: flag,
          proto: "vmess",
          host: obj.add || "",
          port: parseInt(obj.port || "443", 10),
          type: obj.net || "tcp",
          security: obj.tls || "none",
          sni: obj.sni || obj.host || obj.add || "",
          path: obj.path || "",
          raw: line
        });
        continue;
      }

      if (line.startsWith("ss://")) {
        let host = "";
        let port = 8388;
        const afterProto = urlPart.slice(5);
        if (afterProto.includes("@")) {
          const parts = afterProto.split("@");
          const hp = parts[1].split(":");
          host = hp[0];
          port = parseInt(hp[1] || "8388", 10);
        } else {
          const dec = safeDecodeB64Utf8(afterProto);
          if (dec.includes("@")) {
            const parts = dec.split("@");
            const hp = parts[1].split(":");
            host = hp[0];
            port = parseInt(hp[1] || "8388", 10);
          }
        }
        if (host) {
          const flag = extractFlag(rawName, host);
          servers.push({
            id: "srv_" + (servers.length + 1),
            name: rawName,
            flag: flag,
            proto: "shadowsocks",
            host: host,
            port: port,
            type: "tcp",
            security: "none",
            sni: host,
            path: "",
            raw: line
          });
          continue;
        }
      }

      const u = new URL(urlPart);
      const proto = u.protocol.replace(":", "").toLowerCase();
      const flag = extractFlag(rawName, u.hostname);

      servers.push({
        id: "srv_" + (servers.length + 1),
        name: rawName,
        flag: flag,
        proto: proto,
        host: u.hostname,
        port: parseInt(u.port || (proto === "hysteria2" || proto === "hy2" || proto === "vless" || proto === "trojan" ? "443" : "80"), 10),
        type: u.searchParams.get("type") || (proto === "hysteria2" || proto === "hy2" ? "udp" : "tcp"),
        security: u.searchParams.get("security") || (proto === "hysteria2" || proto === "hy2" ? "tls" : "none"),
        sni: u.searchParams.get("sni") || u.hostname,
        path: u.searchParams.get("path") || "",
        raw: line
      });
    } catch(err) {
      console.warn("Failed to parse node:", line, err);
    }
  }

  return { subInfo: subInfo || "Подписка активна", servers };
}

if (typeof module !== "undefined" && module.exports) {
const GEMINI_DOMAINS = [
  "gemini.google.com",
  "aistudio.google.com",
  "alkalimakersuite-pa.clients6.google.com",
  "generativelanguage.googleapis.com",
  "makersuite.google.com",
  "bard.google.com",
  "deepmind.google",
  "notebooklm.google.com",
  "aisandbox-pa.googleapis.com",
  "proactivebackend-pa.googleapis.com",
  "cloudaicompanion.googleapis.com",
  "tasks.google.com",
  "tasks.sandbox.google.com",
  "tasks-pa.clients6.google.com"
];

function findUsServer(servers) {
  if (!servers || !servers.length) return null;
  const usAi = servers.find(s => {
    const n = (s.name || "").toLowerCase();
    return (s.flag === "🇺🇸" || n.includes("usa") || n.includes("us ") || n.includes("united states")) &&
           n.includes("ai") && (s.proto || "").toLowerCase() === "vless";
  });
  if (usAi) return usAi;
  const usVless = servers.find(s => {
    const n = (s.name || "").toLowerCase();
    return (s.flag === "🇺🇸" || n.includes("usa") || n.includes("us ") || n.includes("united states")) &&
           (s.proto || "").toLowerCase() === "vless";
  });
  if (usVless) return usVless;
  const usAny = servers.find(s => {
    const n = (s.name || "").toLowerCase();
    return s.flag === "🇺🇸" || n.includes("usa") || n.includes("us ") || n.includes("united states") || (s.host && s.host.toLowerCase().includes("-us-"));
  });
  return usAny || null;
}

  module.exports = { DEFAULT_CONFIG, GEMINI_DOMAINS, findUsServer, cleanDomain, safeDecodeB64Utf8, safeEncodeB64Utf8, extractFlag, cleanServerName, parseSubscriptionText, parseClashYaml, parseSingboxJson };
}
