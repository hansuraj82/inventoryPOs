@echo off
REM InventoryPOS Setup Script for Windows

echo.
echo ==========================================
echo InventoryPOS - Setup Script (Windows)
echo ==========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install it from https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✓ Node.js found: %NODE_VERSION%

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✓ npm found: %NPM_VERSION%

REM Setup Backend
echo.
echo Installing Backend Dependencies...
cd backend
call npm install

if %errorlevel% neq 0 (
    echo ❌ Backend setup failed
    pause
    exit /b 1
)

echo ✓ Backend dependencies installed
cd ..

REM Setup Frontend
echo.
echo Installing Frontend Dependencies...
cd frontend
call npm install

if %errorlevel% neq 0 (
    echo ❌ Frontend setup failed
    pause
    exit /b 1
)

echo ✓ Frontend dependencies installed
cd ..

echo.
echo ==========================================
echo ✓ Setup Complete!
echo ==========================================
echo.
echo To start the application:
echo.
echo PowerShell/Command Line 1 (Backend):
echo   cd backend
echo   npm run dev
echo.
echo PowerShell/Command Line 2 (Frontend):
echo   cd frontend
echo   npm run dev
echo.
echo Then visit: http://localhost:3000
echo.
echo For more details, see QUICKSTART.md
echo.
pause
