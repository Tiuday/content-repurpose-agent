@echo off
cd /d "%~dp0"
start "" cmd /k "uvicorn server:app --reload --port 8000"
cd /d "%~dp0frontend"
start "" cmd /k "npm run dev"
