#!/usr/bin/env bash
# ==============================================================================
# West VPN Client - Service Stopper (Linux)
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CORE_DIR="$SCRIPT_DIR/core"
PID_FILE="$CORE_DIR/west_service.pid"

echo "[*] Stopping West VPN Service..."

# 1. Try graceful shutdown via HTTP API
if command -v curl >/dev/null 2>&1; then
    curl -s -m 1 -X POST http://127.0.0.1:10850/shutdown >/dev/null 2>&1 || true
fi

# 2. Check and stop PID from PID_FILE
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE" 2>/dev/null || true)
    if [ -n "$PID" ] && kill -0 "$PID" 2>/dev/null; then
        kill "$PID" 2>/dev/null || true
        for i in $(seq 1 15); do
            if ! kill -0 "$PID" 2>/dev/null; then
                break
            fi
            sleep 0.1
        done
        if kill -0 "$PID" 2>/dev/null; then
            kill -9 "$PID" 2>/dev/null || true
        fi
    fi
    rm -f "$PID_FILE"
fi

# 3. Clean up any lingering python west_service or xray processes with active_config.json
pkill -f "python.*west_service.py" 2>/dev/null || true
pkill -f "xray.*active_config.json" 2>/dev/null || true

# 4. Wait for ports to clear
sleep 0.5
echo "[OK] West VPN Service stopped."
