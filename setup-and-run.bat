@echo off
echo ============================================
echo   MERN Record Portal - Setup Script
echo ============================================
echo.

echo [1/3] Installing backend packages...
cd /d c:\Users\Suleman\Desktop\mern-record-portal
call npm install
echo Backend packages done!
echo.

echo [2/3] Installing frontend packages...
cd client
call npm install
cd ..
echo Frontend packages done!
echo.

echo [3/3] All done! Starting development server...
echo.
echo Backend will run at: http://localhost:5000
echo Frontend will run at: http://localhost:5173
echo.
echo Login with:
echo   Email:    sulemanzaheer09@gmail.com
echo   Password: Samual123@
echo.
echo ============================================
npm run dev

