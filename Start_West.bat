@echo off
title West VPN Core
cd /d "%~dp0bridge"
cls
echo ===================================================
echo                     WEST VPN
echo ===================================================
if not exist "%~dp0bin\xraycore.exe" if not exist "%~dp0bin\xray.exe" (
    echo [i] Pervyj zapusk: zagruzka yadra Xray Core...
    powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://github.com/XTLS/Xray-core/releases/download/v1.8.24/Xray-windows-64.zip' -OutFile '%~dp0bin\xray.zip'; Expand-Archive -Path '%~dp0bin\xray.zip' -DestinationPath '%~dp0bin' -Force; Remove-Item '%~dp0bin\xray.zip'"
)
echo [i] Starting West Core on 127.0.0.1:19090...
echo [i] Managing Xray from your browser.
echo.
python bridge.py
if errorlevel 1 (
    echo.
    echo [!] Python execution error. Make sure Python is installed.
    pause
)
