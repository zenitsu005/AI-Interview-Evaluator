@echo off
title AI Interview Evaluator Launcher
echo ========================================================
echo       Starting AI Interview Evaluator...
echo ========================================================
echo.

cd /d "%~dp0server"
echo [1/2] Launching Backend Server on port 5000...
start "AI Interview Evaluator - Backend" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

cd /d "%~dp0client"
echo [2/2] Launching Frontend on port 5173...
start "AI Interview Evaluator - Frontend" cmd /k "npm run dev"

echo.
echo ========================================================
echo  App is starting!
echo  Open your browser at: http://localhost:5173
echo ========================================================
echo.
pause
