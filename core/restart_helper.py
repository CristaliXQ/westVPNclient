import subprocess
import os
import sys

_dll_dir = os.path.join(os.path.dirname(sys.executable), "DLLs")
if os.path.exists(_dll_dir) and hasattr(os, "add_dll_directory"):
    try:
        os.add_dll_directory(_dll_dir)
    except Exception:
        pass

import json
import time

CREATION_FLAGS = 0x08000000 if os.name == "nt" else 0

def terminate_west_xray():
    core_dir = os.path.dirname(os.path.abspath(__file__))
    real_core_dir = os.path.realpath(core_dir).lower()
    state_file = os.path.join(core_dir, "state.json")
    xray_pids = set()

    # 1. State file check
    if os.path.exists(state_file):
        try:
            with open(state_file, "r", encoding="utf-8") as f:
                st = json.load(f)
                saved_pid = st.get("pid")
                if saved_pid and isinstance(saved_pid, int):
                    xray_pids.add(saved_pid)
        except Exception:
            pass

    # 2. Port owner inspection (10818, 10819, 10820, 10821)
    try:
        import psutil
        for conn in psutil.net_connections(kind='tcp'):
            if conn.laddr and conn.laddr.port in (10818, 10819, 10820, 10821):
                if conn.pid:
                    xray_pids.add(conn.pid)
    except Exception:
        pass

    # 3. Fast psutil check with name filtering
    psutil_ok = False
    try:
        import psutil
        for p in psutil.process_iter(['pid', 'name']):
            try:
                name = (p.info.get('name') or '').lower()
                if name in ('xraycore.exe', 'xray.exe'):
                    xray_pids.add(p.pid)
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                pass
        psutil_ok = True
    except Exception:
        psutil_ok = False

    # 4. PowerShell fallback only if psutil failed or is unavailable
    if not psutil_ok and not xray_pids:
        try:
            ps_cmd = [
                "powershell", "-NoProfile", "-Command",
                "Get-CimInstance Win32_Process | Where-Object { ($_.Name -like '*xray*') -and ($_.CommandLine -like '*active_config.json*') } | Select-Object -ExpandProperty ProcessId"
            ]
            res = subprocess.run(ps_cmd, capture_output=True, text=True, timeout=5, creationflags=CREATION_FLAGS)
            for line in res.stdout.split():
                if line.strip().isdigit():
                    xray_pids.add(int(line.strip()))
        except Exception:
            pass

    # STRICT SAFETY: Ensure every PID targeted is an xraycore process running active_config.json or inside West Client
    for pid in list(xray_pids):
        try:
            is_safe = False
            try:
                import psutil
                proc = psutil.Process(pid)
                name = proc.name().lower()
                if name not in ('xraycore.exe', 'xray.exe'):
                    continue
                exe_path = os.path.realpath(proc.exe() or "").lower()
                cmd = " ".join(proc.cmdline() or []).lower()
                if (real_core_dir in exe_path) or ("active_config.json" in cmd) or ("west client" in exe_path) or ("west client" in cmd):
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

            if not is_safe:
                continue

            print(f"Stopping West Client xraycore PID {pid}...")
            try:
                import psutil
                proc = psutil.Process(pid)
                proc.terminate()
                try:
                    proc.wait(timeout=1.0)
                except (psutil.TimeoutExpired, Exception):
                    proc.kill()
            except psutil.NoSuchProcess:
                pass
            except Exception:
                subprocess.run(["taskkill", "/F", "/PID", str(pid)], capture_output=True, creationflags=CREATION_FLAGS)
        except Exception:
            pass

def is_port_listening(port, host="127.0.0.1"):
    import socket
    try:
        s = socket.create_connection((host, port), timeout=0.15)
        s.close()
        return True
    except Exception:
        return False

def can_bind_port(port, host="127.0.0.1"):
    import socket
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 0)
        s.bind((host, port))
        s.close()
        return True
    except OSError:
        return False

def restart_west_service():
    # 1. Terminate West Client's own xraycore first
    terminate_west_xray()

    # 2. Query for any pythonw.exe or python.exe running west_service via psutil first
    pids = []
    my_pid = os.getpid()
    psutil_found = False
    try:
        import psutil
        for p in psutil.process_iter(['pid', 'name']):
            try:
                name = (p.info.get('name') or '').lower()
                if name in ('pythonw.exe', 'python.exe'):
                    cmd = " ".join(p.cmdline() or []).lower()
                    if "west_service" in cmd and p.pid != my_pid:
                        pids.append(p.pid)
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                pass
        psutil_found = True
    except Exception:
        psutil_found = False

    if not psutil_found:
        ps_cmd = [
            "powershell", "-NoProfile", "-Command",
            "Get-CimInstance Win32_Process | Where-Object { ($_.Name -eq 'pythonw.exe' -or $_.Name -eq 'python.exe') -and $_.CommandLine -like '*west_service*' } | Select-Object -ExpandProperty ProcessId"
        ]
        try:
            res = subprocess.run(ps_cmd, capture_output=True, text=True, creationflags=CREATION_FLAGS)
            pids = [int(p.strip()) for p in res.stdout.split() if p.strip().isdigit() and int(p.strip()) != my_pid]
        except Exception:
            pids = []

    for pid in pids:
        print(f"Stopping old service PID {pid}...")
        try:
            import psutil
            p = psutil.Process(pid)
            p.terminate()
            try:
                p.wait(timeout=1.0)
            except Exception:
                p.kill()
        except Exception:
            subprocess.run(["taskkill", "/F", "/PID", str(pid)], capture_output=True, creationflags=CREATION_FLAGS)

    # 3. Wait for ports 10850 and 10818 to release and become freely bindable
    deadline = time.time() + 3.0
    while time.time() < deadline:
        if can_bind_port(10850) and can_bind_port(10818):
            break
        time.sleep(0.05)

    # 4. Start the new service
    core_dir = os.path.dirname(os.path.abspath(__file__))
    service_script = os.path.join(core_dir, "west_service.py")
    creation_flags = 0x08000000 if os.name == "nt" else 0
    pythonw_exe = sys.executable.replace("python.exe", "pythonw.exe") if "python.exe" in sys.executable.lower() else "pythonw.exe"
    if not os.path.exists(pythonw_exe):
        pythonw_exe = "pythonw.exe"

    subprocess.Popen(
        [pythonw_exe, service_script],
        cwd=core_dir,
        creationflags=creation_flags,
        stdin=subprocess.DEVNULL,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )

    # 5. Wait for new service to respond on port 10850
    deadline = time.time() + 5.0
    while time.time() < deadline:
        if is_port_listening(10850):
            break
        time.sleep(0.05)

    print("West Service restarted successfully on port 10850.")

if __name__ == "__main__":
    restart_west_service()
