@echo off
REM CityPulse Quick Start Script for Windows

echo.
echo ╔═══════════════════════════════════════════════════════╗
echo ║     🌆 CityPulse - Civic Issue Reporting Platform    ║
echo ║                 QUICK START SCRIPT                    ║
echo ╚═══════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo    Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found: $(node --version)
echo.

REM Install dependencies if not already done
if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend
    call npm install
    cd ..
    echo ✅ Backend dependencies installed
)

if not exist "frontend\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd frontend
    call npm install --legacy-peer-deps
    cd ..
    echo ✅ Frontend dependencies installed
)

echo.
echo ╔═══════════════════════════════════════════════════════╗
echo ║              STARTING SERVERS                         ║
echo ║  Backend:  http://localhost:5000                      ║
echo ║  Frontend: http://localhost:3000                      ║
echo ╚═══════════════════════════════════════════════════════╝
echo.

REM Start backend in new window
start "CityPulse Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak

REM Start frontend in new window
start "CityPulse Frontend" cmd /k "cd frontend && npm run dev"

echo ✅ Servers starting... Check the new windows that opened.
echo.
echo 📝 Instructions:
echo    - Backend will run on http://localhost:5000
echo    - Frontend will open on http://localhost:3000
echo    - Press Ctrl+C in terminal to stop servers
echo.
pause
