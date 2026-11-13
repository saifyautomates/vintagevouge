@echo off
title Vintage Vogue India - Development Server
echo ============================================================
echo   VINTAGE VOGUE INDIA (@vintagevoguee_in)
echo   Starting E-Commerce Dev Server on Port 1234...
echo ============================================================
echo.

cd /d "%~dp0"

echo [1/2] Verifying dependencies...
if not exist "node_modules" (
    echo Installing npm dependencies...
    call npm install
)

echo.
echo [2/2] Launching server at http://localhost:1234...
echo Opening browser...
start http://localhost:1234

echo.
echo Server is running! Press Ctrl+C in this window to stop.
echo ============================================================
call npm run dev -- --port 1234 --host
pause

