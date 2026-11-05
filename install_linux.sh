#!/usr/bin/env bash
# ==============================================================================
# West VPN Client - Automated Setup & Installer for Linux
# ==============================================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CORE_DIR="$SCRIPT_DIR/core"

echo "=========================================================="
echo "    West VPN Client - Linux Environment Installer         "
echo "=========================================================="

# 1. Check Python 3
if ! command -v python3 >/dev/null 2>&1; then
    echo "[!] python3 is not installed. Please install it first:"
    echo "    Ubuntu/Debian : sudo apt update && sudo apt install -y python3 python3-pip python3-psutil curl unzip"
    echo "    Arch/Manjaro  : sudo pacman -S python python-pip python-psutil curl unzip"
    echo "    Fedora/RHEL   : sudo dnf install -y python3 python3-pip python3-psutil curl unzip"
    exit 1
fi
echo "[+] Python 3 detected: $(python3 --version)"

# 2. Check / Install psutil
if ! python3 -c "import psutil" >/dev/null 2>&1; then
    echo "[*] Installing Python 'psutil' module..."
    if command -v pip3 >/dev/null 2>&1; then
        pip3 install --user psutil || python3 -m pip install --user psutil || true
    fi
fi

if python3 -c "import psutil" >/dev/null 2>&1; then
    echo "[+] Python 'psutil' is ready."
else
    echo "[WARN] Could not install psutil automatically. Please run:"
    echo "       sudo apt install python3-psutil  (or pip3 install --user psutil)"
fi

# 3. Check / Download Xray Core for Linux
XRAY_BIN="$CORE_DIR/xray"
if [ ! -f "$XRAY_BIN" ] && ! command -v xray >/dev/null 2>&1 && [ ! -f "/usr/local/bin/xray" ]; then
    echo "[*] Native Xray binary not found. Preparing automatic download..."

    UNAME_ARCH="$(uname -m)"
    case "$UNAME_ARCH" in
        x86_64|amd64)
            XRAY_ZIP="Xray-linux-64.zip"
            ;;
        aarch64|arm64)
            XRAY_ZIP="Xray-linux-arm64-v8a.zip"
            ;;
        armv7l|armhf)
            XRAY_ZIP="Xray-linux-arm32-v7a.zip"
            ;;
        *)
            echo "[WARN] Unknown architecture ($UNAME_ARCH). Defaulting to Xray-linux-64.zip"
            XRAY_ZIP="Xray-linux-64.zip"
            ;;
    esac

    DOWNLOAD_URL="https://github.com/XTLS/Xray-core/releases/latest/download/$XRAY_ZIP"
    TMP_ZIP="/tmp/$XRAY_ZIP"

    echo "[*] Downloading $XRAY_ZIP from official XTLS repository..."
    if command -v curl >/dev/null 2>&1; then
        curl -fSL "$DOWNLOAD_URL" -o "$TMP_ZIP"
    elif command -v wget >/dev/null 2>&1; then
        wget -q --show-progress "$DOWNLOAD_URL" -O "$TMP_ZIP"
    else
        echo "[ERROR] Neither curl nor wget was found. Install curl or wget to download Xray."
        exit 1
    fi

    if command -v unzip >/dev/null 2>&1; then
        echo "[*] Extracting Xray binary to $CORE_DIR..."
        unzip -o -q "$TMP_ZIP" xray geoip.dat geosite.dat -d "$CORE_DIR" || unzip -o -q "$TMP_ZIP" xray -d "$CORE_DIR"
        rm -f "$TMP_ZIP"
        chmod +x "$XRAY_BIN"
        echo "[+] Xray binary successfully installed: $XRAY_BIN"
    else
        echo "[ERROR] 'unzip' is not installed. Please install unzip and re-run this script."
        exit 1
    fi
else
    if [ -f "$XRAY_BIN" ]; then
        chmod +x "$XRAY_BIN"
        echo "[+] Local Xray binary detected: $XRAY_BIN"
    else
        echo "[+] System Xray binary detected: $(command -v xray || echo '/usr/local/bin/xray')"
    fi
fi

# 4. Set execution permissions for all shell scripts
chmod +x "$SCRIPT_DIR/start_service.sh" 2>/dev/null || true
chmod +x "$SCRIPT_DIR/stop_service.sh" 2>/dev/null || true
chmod +x "$SCRIPT_DIR/restart.sh" 2>/dev/null || true
chmod +x "$SCRIPT_DIR/install_linux.sh" 2>/dev/null || true
echo "[+] Script execution permissions set."

# 5. Configure systemd user unit (optional daemon)
SYSTEMD_USER_DIR="$HOME/.config/systemd/user"
mkdir -p "$SYSTEMD_USER_DIR"
TARGET_SERVICE="$SYSTEMD_USER_DIR/west-client.service"

cat <<EOF > "$TARGET_SERVICE"
[Unit]
Description=West VPN Client Background Service
After=network.target network-online.target
Wants=network-online.target

[Service]
Type=simple
WorkingDirectory=$CORE_DIR
ExecStart=$(command -v python3) $CORE_DIR/west_service.py
Restart=on-failure
RestartSec=3
KillMode=mixed
TimeoutStopSec=5

[Install]
WantedBy=default.target
EOF

if command -v systemctl >/dev/null 2>&1; then
    systemctl --user daemon-reload 2>/dev/null || true
    echo "[+] Systemd user unit created: $TARGET_SERVICE"
fi

echo ""
echo "=========================================================="
echo "    [SUCCESS] West VPN Client is fully installed on Linux!"
echo "=========================================================="
echo ""
echo "Управление службой ядра:"
echo "  1) Ручной запуск:      ./start_service.sh"
echo "  2) Остановка:          ./stop_service.sh"
echo "  3) Перезапуск:         ./restart.sh"
echo ""
echo "Запуск как фоновый демон systemd (автозагрузка):"
echo "  systemctl --user enable --now west-client"
echo "  systemctl --user status west-client"
echo ""
echo "Установка расширения в браузер:"
echo "  • Chromium / Chrome / Brave / Cent / Vivaldi:"
echo "    chrome://extensions -> Режим разработчика -> Загрузить распакованное -> выберите эту папку"
echo "  • LibreWolf / Firefox:"
echo "    Перетащите файл west-vpn-client.xpi в окно браузера"
echo ""
