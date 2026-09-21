@echo off
title West VPN Core
cd /d "%~dp0bridge"
cls
echo ===================================================
echo                     WEST VPN
echo ===================================================
echo [i] Starting West Core on 127.0.0.1:19090...
echo [i] Managing Xray from your browser.
echo.
python bridge.py
if errorlevel 1 (
    echo.
    echo [!] Python execution error. Make sure Python is installed.
    pause
)
