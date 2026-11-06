# IT ACADEMY

AI·빅데이터 특화 IT 교육기관 홍보 웹사이트 프로젝트입니다.

## 1. 개발 환경

| 구분 | 기술 | 버전 |
|---|---|---|
| Frontend | React / JavaScript / Vite | React 18, Vite 6 |
| Backend | Spring Boot / Java | Spring Boot 3.5.6, Java 21 |
| Database | MySQL | 8.x 권장 |
| Build | npm / Gradle | npm, Gradle 8.14.3 이상 |

프론트엔드는 `.js` 파일만 사용합니다. JSX와 TSX는 사용하지 않습니다.

## 2. 최초 실행 준비

1. Node.js LTS를 설치합니다.
2. JDK 21을 설치합니다.
3. MySQL Server를 실행합니다.
4. MySQL Workbench 또는 CMD에서 `database/createdb.sql`을 실행합니다.
5. `backend/src/main/resources/application.yml`의 DB 계정과 비밀번호를 실제 MySQL 설정에 맞춥니다.
6. Gradle 8.14.3 이상을 설치하거나 IntelliJ IDEA의 Gradle 실행 환경을 사용합니다.

현재 기본 DB 연결 설정은 다음과 같습니다.

- 주소: `jdbc:mysql://localhost:3306/it_academy`
- 계정: `root`
- 비밀번호: `1234`

기본값과 실제 MySQL 계정이 다르면 환경 변수 `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`를 지정하거나 application.yml을 수정해야 합니다.

## 3. 실행 방법

### 방법 A. 실행 파일 사용

프로젝트 루트에서 `start-backend.bat`와 `start-frontend.bat`를 각각 실행합니다.

백엔드는 Java 21과 Gradle이 PATH에 등록되어 있어야 합니다. Gradle이 설치되어 있지 않다면 IntelliJ IDEA에서 `backend` 폴더를 Gradle 프로젝트로 열고 `Tasks > application > bootRun`을 실행합니다.

### 방법 B. CMD에서 직접 실행

백엔드 CMD:

```cmd
cd /d D:\dev\ITEducation\backend
gradle bootRun
```

프론트엔드 CMD:

```cmd
cd /d D:\dev\ITEducation\frontend
npm install
npm run dev
```

두 서버는 서로 다른 터미널에서 실행 상태를 유지해야 합니다.

## 4. 접속 주소

- 웹사이트: http://localhost:5173
- 백엔드: http://localhost:8080
- 공개 교육과정 API: http://localhost:8080/api/courses
- 공개 공지사항 API: http://localhost:8080/api/notices

## 5. 자주 발생하는 실행 오류

| 오류 | 원인 및 조치 |
|---|---|
| `node` 또는 `npm`을 찾을 수 없음 | Node.js LTS 설치 후 CMD를 새로 엽니다. |
| `gradle`을 찾을 수 없음 | Gradle 설치 또는 IntelliJ Gradle Tasks에서 bootRun을 실행합니다. |
| Unsupported class file major version | JDK 21을 설치하고 IntelliJ의 Project SDK와 Gradle JVM을 21로 설정합니다. |
| Communications link failure | MySQL Server 실행 여부, 3306 포트, DB 계정과 비밀번호를 확인합니다. |
| Unknown database 'it_academy' | `database/createdb.sql`을 실행합니다. |
| Port 8080 already in use | 기존 8080 서버를 종료하거나 포트를 변경합니다. |
| Port 5173 already in use | 기존 Vite 서버를 종료합니다. |

## 6. 현재 구현 범위

메인, 기관 소개, 교육과정, 프로젝트, 공지사항 조회, 상담 신청 화면이 포함되어 있습니다. 관리자 화면은 아직 필요한 관리 API가 완성되지 않아 전체 기능 검증 대상이 아닙니다.

## 7. Git 최신화

```cmd
cd /d D:\dev\ITEducation
git switch main
git pull origin main
```

수정 작업 브랜치 적용은 Pull Request 검토 및 병합 후 진행합니다.
