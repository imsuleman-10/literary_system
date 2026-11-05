@echo off
echo ========================================================
echo   Pushing Literary System to GitHub (imsuleman-10)
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Adding files and checking git status...
git add .
git commit -m "Update: Literary System MERN Portal" 2>nul
git branch -M main

echo [2/3] Setting remote origin...
git remote set-url origin https://github.com/imsuleman-10/literary_system.git

echo [3/3] Pushing to branch main...
git push -u origin main

echo.
echo ========================================================
echo   Done! Check your repository on GitHub.
echo ========================================================
pause

