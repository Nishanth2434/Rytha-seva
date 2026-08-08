@echo off
echo ===================================================
echo   Starting KrishiMitra AI - Local Full Stack App
echo ===================================================
echo.
echo [1/2] Starting Django REST Backend on http://localhost:8000 ...
start "KrishiMitra Backend" cmd /k "cd /d %~dp0backend && .\venv\Scripts\python.exe manage.py runserver 8000"

echo [2/2] Starting Vite Frontend on http://localhost:5173 ...
start "KrishiMitra Frontend" cmd /k "cd /d %~dp0 && npx.cmd vite --port 5173"

echo.
echo Both servers started!
echo Frontend URL: http://localhost:5173/
echo Django API URL: http://localhost:8000/api/
echo Django Admin:  http://localhost:8000/admin/ (User: admin / Pass: admin123)
echo ===================================================
