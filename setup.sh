#!/bin/bash

# InventoryPOS Setup Script for macOS/Linux

echo "=========================================="
echo "InventoryPOS - Setup Script"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it from https://nodejs.org"
    exit 1
fi

echo "✓ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✓ npm found: $(npm --version)"

# Setup Backend
echo ""
echo "Installing Backend Dependencies..."
cd backend
npm install

if [ $? -ne 0 ]; then
    echo "❌ Backend setup failed"
    exit 1
fi

echo "✓ Backend dependencies installed"
cd ..

# Setup Frontend
echo ""
echo "Installing Frontend Dependencies..."
cd frontend
npm install

if [ $? -ne 0 ]; then
    echo "❌ Frontend setup failed"
    exit 1
fi

echo "✓ Frontend dependencies installed"
cd ..

echo ""
echo "=========================================="
echo "✓ Setup Complete!"
echo "=========================================="
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then visit: http://localhost:3000"
echo ""
echo "For more details, see QUICKSTART.md"
