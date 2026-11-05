#!/usr/bin/env bash
# ==============================================================================
# West VPN Client - Background Service Starter (Linux)
# ==============================================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CORE_DIR="$SCRIPT_DIR/core"
PID_FILE="$CORE_DIR/west_service.pid"
LOG_FILE="$CORE_DIR/west_service.log"

check_port_open() {
    local port="$1"
    python3 -c "import socket; s = socket.socket(); s.settimeout(0.2); exit(0 if s.connect_ex(('127.0.0.1', $port)) == 0 else 1)" 2>/dev/null
}

# 1. Check Python 3
if ! command -v python3 >/dev/null 2>&1; then
    echo "[ERROR] python3 not found. Please install Python 3 (e.g. sudo apt install python3)."
    exit 1
fi

# 2. Check if already running on port 10850
if check_port_open 10850; then
    echo "[INFO] West VPN Service is already running on port 10850."
    exit 0
fi

# 3. Check for psutil
if ! python3 -c "import psutil" >/dev/null 2>&1; then
    echo "[WARN] Python package 'psutil' is not installed. Recommended: pip3 install --user psutil"
fi

# 4. Check for Xray binary
XRAY_FOUND=0
if [ -f "$CORE_DIR/xray" ] || [ -f "$CORE_DIR/xraycore" ]; then
    XRAY_FOUND=1
    chmod +x "$CORE_DIR/xray" 2>/dev/null || true
    chmod +x "$CORE_DIR/xraycore" 2>/dev/null || true
elif command -v xray >/dev/null 2>&1 || command -v xraycore >/dev/null 2>&1; then
    XRAY_FOUND=1
elif [ -f "/usr/local/bin/xray" ] || [ -f "/usr/bin/xray" ] || [ -f "$HOME/.local/bin/xray" ]; then
    XRAY_FOUND=1
fi

if [ "$XRAY_FOUND" -eq 0 ]; then
    echo "[WARN] Native Linux Xray binary not detected."
    echo "       Run './install_linux.sh' to automatically download and configure Xray-core for Linux."
fi

# 5. Start West Service in the background
echo "[*] Starting West VPN Service..."
cd "$CORE_DIR"
nohup python3 "$CORE_DIR/west_service.py" > "$LOG_FILE" 2>&1 &
SERVICE_PID=$!
echo "$SERVICE_PID" > "$PID_FILE"

# 6. Wait up to 3.5 seconds for API port to bind
SUCCESS=0
for i in $(seq 1 35); do
    if check_port_open 10850; then
        SUCCESS=1
        break
    fi
    sleep 0.1
done

if [ "$SUCCESS" -eq 1 ]; then
    echo "[OK] West VPN Service started successfully! (PID: $SERVICE_PID)"
    echo "     - API Status : http://127.0.0.1:10850/status"
    echo "     - Main SOCKS5: 127.0.0.1:10818"
    echo "     - Main HTTP  : 127.0.0.1:10819"
    echo "     - US Gemini  : 127.0.0.1:10820 (SOCKS5), 127.0.0.1:10821 (HTTP)"
    echo "     - Logs       : $LOG_FILE"
else
    echo "[WARN] West VPN Service started (PID: $SERVICE_PID), but port 10850 did not respond immediately."
    echo "       Check log file: $LOG_FILE"
fi
