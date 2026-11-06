@echo off
chcp 65001 > nul
cd /d "%~dp0backend"

echo [1/3] Java 확인
where java > nul 2> nul
if errorlevel 1 (
  echo Java JDK 21이 설치되어 있지 않거나 PATH에 등록되지 않았습니다.
  echo IntelliJ의 Project SDK와 Gradle JVM을 JDK 21로 설정하세요.
  pause
  exit /b 1
)
java -version

echo [2/3] Gradle 확인
where gradle > nul 2> nul
if errorlevel 1 (
  echo Gradle 명령을 찾을 수 없습니다.
  echo IntelliJ IDEA에서 backend 폴더를 Gradle 프로젝트로 열고
  echo Gradle Tasks ^> application ^> bootRun을 실행하세요.
  pause
  exit /b 1
)

echo [3/3] Spring Boot 실행
call gradle bootRun
pause
