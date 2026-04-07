@echo off
echo ============================================
echo  Interview Assistant - Windows Setup
echo ============================================
echo.

echo [1/3] Installing Node dependencies...
npm install
if errorlevel 1 (
  echo ERROR: npm install failed. Make sure Node.js is installed from https://nodejs.org
  pause
  exit /b 1
)

echo.
echo [2/3] Checking for SoX (needed for voice recording)...
where sox >nul 2>&1
if errorlevel 1 (
  echo SoX not found.
  echo.
  echo Please install SoX for Windows:
  echo   1. Go to: https://sourceforge.net/projects/sox/files/sox/
  echo   2. Download the latest .exe installer
  echo   3. Install it - make sure "Add to PATH" is checked
  echo   4. Restart this setup script
  echo.
  echo NOTE: If you skip SoX, you can still use TYPE mode to paste questions.
  echo.
) else (
  echo SoX found! Voice recording will work.
)

echo.
echo [3/3] Setup complete!
echo.
echo To start the app, run:  npm start
echo Or double-click:        START.bat
echo.
pause
