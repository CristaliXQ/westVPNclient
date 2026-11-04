@echo off
chcp 65001 >nul
cd /d "%~dp0core"
start "" pythonw.exe restart_helper.py
