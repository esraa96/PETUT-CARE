@echo off
echo Starting Petut App Development Server...
echo.

echo Checking if node_modules exists...
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
) else (
    echo Dependencies already installed.
)

echo.
echo Starting development server...
echo The app will open in your browser at http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev