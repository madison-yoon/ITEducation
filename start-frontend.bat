@echo off
chcp 65001 > nul
cd /d "%~dp0frontend"

echo [1/3] Node.js 확인
where node > nul 2> nul
if errorlevel 1 (
  echo Node.js가 설치되어 있지 않습니다. Node.js LTS를 설치한 뒤 다시 실행하세요.
  pause
  exit /b 1
)
where npm > nul 2> nul
if errorlevel 1 (
  echo npm을 찾을 수 없습니다. Node.js LTS 설치를 확인하세요.
  pause
  exit /b 1
)

echo [2/3] 패키지 설치 확인
if not exist "node_modules" (
  call npm install
  if errorlevel 1 (
    echo 패키지 설치에 실패했습니다.
    pause
    exit /b 1
  )
)

echo [3/3] 프론트엔드 실행
echo 브라우저 주소: http://localhost:5173
call npm run dev
pause
