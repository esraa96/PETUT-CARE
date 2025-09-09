@echo off
echo Starting security fixes for Petut App...
echo.

echo 1. Checking for vulnerabilities...
npm audit

echo.
echo 2. Attempting to fix vulnerabilities automatically...
npm audit fix

echo.
echo 3. Checking for outdated packages...
npm outdated

echo.
echo 4. Updating packages to latest versions...
npm update

echo.
echo 5. Installing any missing dependencies...
npm install

echo.
echo 6. Final vulnerability check...
npm audit

echo.
echo Security fixes completed!
echo Please review the output above for any remaining issues.
echo.
pause