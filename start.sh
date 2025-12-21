#!/bin/bash

# CityPulse Quick Start Script for Linux/Mac

echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║     🌆 CityPulse - Civic Issue Reporting Platform    ║"
echo "║                 QUICK START SCRIPT                    ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Install dependencies if not already done
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    echo "✅ Backend dependencies installed"
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install --legacy-peer-deps
    cd ..
    echo "✅ Frontend dependencies installed"
fi

echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║              STARTING SERVERS                         ║"
echo "║  Backend:  http://localhost:5000                      ║"
echo "║  Frontend: http://localhost:3000                      ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# Start backend in background
(cd backend && npm run dev) &
BACKEND_PID=$!
echo "✅ Backend server started (PID: $BACKEND_PID)"

# Wait a bit for backend to start
sleep 3

# Start frontend in foreground
(cd frontend && npm run dev) &
FRONTEND_PID=$!
echo "✅ Frontend server started (PID: $FRONTEND_PID)"

echo ""
echo "📝 Instructions:"
echo "   - Backend running on http://localhost:5000"
echo "   - Frontend will open on http://localhost:3000"
echo "   - Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait
