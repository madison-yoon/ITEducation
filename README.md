# IT ACADEMY

AI·빅데이터 특화 IT 교육기관 홍보 웹사이트 프로젝트입니다.

## 1. 기술 구성

| 구분 | 기술 |
|---|---|
| 프론트엔드 | React 18, JavaScript, Vite 6 |
| 백엔드 | Spring Boot 3.5.6, Java 21 |
| 데이터베이스 | MySQL 8.x |
| 인증 | Spring Security 세션 로그인, BCrypt, CSRF |
| 배포 | Docker Compose, Nginx, Caddy HTTPS |

프론트엔드는 JavaScript `.js` 파일만 사용합니다. JSX, TSX, TypeScript는 사용하지 않습니다.

## 2. 로컬 실행 준비

1. Node.js LTS를 설치합니다.
2. JDK 21을 설치합니다.
3. MySQL Server를 실행합니다.
4. `database/createdb.sql`을 실행해 `it_academy` 데이터베이스를 생성합니다.
5. `backend/src/main/resources/application.yml`의 기본 DB 계정과 실제 MySQL 계정이 다르면 `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` 환경 변수를 설정합니다.
6. Gradle 8.14.3 이상을 설치하거나 IntelliJ의 Gradle 실행 환경을 사용합니다.

기본 DB 연결은 `localhost:3306 / it_academy / root / 1234`입니다. 실제 로컬 DB 설정에 맞춰 변경할 수 있습니다.

## 3. 최초 최고 관리자 생성

관리자 계정은 공개 회원가입으로 만들지 않습니다. 데이터베이스에 관리자가 한 명도 없을 때만 환경 변수로 지정한 최초 계정을 최고 관리자로 생성합니다.

백엔드를 실행할 CMD 창에서 다음 명령을 실행합니다. 비밀번호는 12자 이상의 고유한 값으로 바꿉니다.

```cmd
set ADMIN_INITIAL_LOGIN_ID=siteadmin
set ADMIN_INITIAL_PASSWORD=여기에_12자_이상의_고유_비밀번호
set ADMIN_INITIAL_NAME=최고 관리자
cd /d D:\dev\ITEducation\backend
gradle bootRun
```

최초 계정이 생성된 이후에는 환경 변수 값을 바꿔도 기존 계정 비밀번호가 변경되지 않습니다. 비밀번호는 관리자 계정 관리 정책에 따라 별도로 관리합니다.

## 4. 실행 방법

백엔드와 프론트엔드를 각각 별도 CMD 창에서 실행합니다.

백엔드:

```cmd
cd /d D:\dev\ITEducation\backend
gradle bootRun
```

프론트엔드:

```cmd
cd /d D:\dev\ITEducation\frontend
npm install
npm run dev
```

## 5. 접속 주소

- 공개 웹사이트: http://localhost:5173
- 관리자 로그인: http://localhost:5173/admin
- 백엔드: http://localhost:8080
- 교육과정 API: http://localhost:8080/api/courses
- 공지사항 API: http://localhost:8080/api/notices
- 상담 신청 API: http://localhost:8080/api/inquiries

Vite 개발 서버가 `/api` 요청을 백엔드 8080 포트로 전달합니다. 프론트엔드 코드는 기본적으로 동일 출처의 `/api` 경로를 사용합니다.

## 6. 구현 기능

### 방문자
- 기관 소개 및 메인 페이지
- DB 기반 교육과정 목록과 상세 조회
- 교육과정명 및 분야 검색
- 프로젝트 소개
- 게시 중인 공지사항 목록 및 상세 조회
- 상담 신청 및 필수 개인정보 동의 확인
- 진행 중인 동일 연락처 상담의 중복 신청 제한

### 관리자
- 세션 기반 로그인 및 로그아웃
- 관리자 본인 및 권한 확인
- 대시보드 운영 현황
- 교육과정 등록·조회·수정·삭제 및 모집 상태 관리
- 상담 신청 검색·상세 조회·상태 변경·내부 메모·삭제
- 공지사항 등록·조회·수정·삭제 및 공개 여부 관리
- 최고 관리자 전용 관리자 계정 생성·권한 변경·삭제
- 마지막 최고 관리자 권한 강등 및 삭제 방지
- 상태 변경 요청에 대한 CSRF 검증

## 7. 배포

전체 배포는 프로젝트 루트의 `DEPLOYMENT.md`를 참고합니다.

Docker Compose는 MySQL, Spring Boot, React/Nginx, Caddy를 실행합니다. 실제 도메인, DNS, 서버 방화벽, 환경 변수 설정은 배포 서버에서 완료해야 합니다.

## 8. Git 작업

```cmd
git switch main
git pull origin main
```

기능 수정은 별도 브랜치에서 진행하고 Pull Request 검토 후 main에 병합합니다.
