@echo off
title AI Interview Evaluator - Local Server
color 0A

echo ========================================================
echo       Starting AI Interview Evaluator Locally...
echo ========================================================
echo.

:: 1. Navigate to project root
cd /d "%~dp0"

:: 2. Ensure dependencies are in place
if not exist "server\node_modules" (
  echo [Setup] Installing backend dependencies...
  cd server && npm install && cd ..
)

if not exist "client\node_modules" (
  echo [Setup] Installing frontend dependencies...
  cd client && npm install && cd ..
)

:: 3. Kill any zombie processes on port 5000 or 5173
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000 "') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173 "') do taskkill /f /pid %%a >nul 2>&1

:: 4. Start Backend Server
echo [1/2] Starting AI Backend Server on http://localhost:5000...
start "AI-Interview-Backend" /min cmd /c "cd /d "%~dp0server" && node server.js"

:: 5. Wait 2 seconds for backend to initialize
timeout /t 2 /nobreak >nul

:: 6. Start Frontend Vite Server
echo [2/2] Starting Frontend Studio on http://localhost:5173...
start "AI-Interview-Frontend" /min cmd /c "cd /d "%~dp0client" && npm run dev"

:: 7. Wait 2 seconds for Vite
timeout /t 2 /nobreak >nul

:: 8. Automatically launch browser
echo.
echo ========================================================
echo   🚀 AI Interview Evaluator is Live!
echo   Opening: http://localhost:5173
echo ========================================================
start http://localhost:5173

echo.
echo Press any key to stop both servers and exit...
pause >nul

:: Cleanup on exit
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000 "') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173 "') do taskkill /f /pid %%a >nul 2>&1
echo Servers stopped safely.
timeout /t 1 /nobreak >nul
