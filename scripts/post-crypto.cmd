@echo off
setlocal
cd /d "%~dp0\.."
chcp 65001 >nul

if not "%~1"=="" goto :run

echo.
echo Usage:
echo   scripts\post-crypto.cmd encrypt "post.md"
echo   scripts\post-crypto.cmd decrypt "post.md"
echo   scripts\post-crypto.cmd "post.md"
echo.
echo Or drag a .md file onto this .cmd to auto encrypt/decrypt.
echo.
pause
exit /b 1

:run
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0post-crypto.ps1" %*
set ERR=%ERRORLEVEL%
echo.
if not "%ERR%"=="0" echo Failed with exit code %ERR%.
pause
exit /b %ERR%
