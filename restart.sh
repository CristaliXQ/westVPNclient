#!/usr/bin/env bash
# ==============================================================================
# West VPN Client - Service Restarter (Linux)
# ==============================================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

"$SCRIPT_DIR/stop_service.sh"
sleep 1
"$SCRIPT_DIR/start_service.sh"
