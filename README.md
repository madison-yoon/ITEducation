# IT ACADEMY

AI·데이터·소프트웨어 교육기관의 교육 철학, 교육과정, 프로젝트 운영 방식과 상담 흐름을 소개하는 반응형 웹 서비스입니다.

단순한 홍보 페이지를 넘어 **학습 목표 → 교육과정 → 프로젝트 산출물 → 평가 기준 → 상담**으로 이어지는 정보 구조를 제공합니다. AI 코딩 도구를 사용하는 환경에서도 문제 정의, 설계, 코드 이해, 테스트, 문서화가 중요하다는 교육 원칙을 핵심 메시지로 삼았습니다.

> **구현 범위 안내**  
> 실제 기관의 연락처·주소·교육비·모집 일정·정원·취업률·수강생 성과가 확인되지 않은 경우 이를 임의로 만들지 않습니다. 소개된 6개 프로젝트는 교육 설계를 설명하기 위한 예시이며 실제 수강생 포트폴리오가 아닙니다.

## 1. 주요 경험

| 영역 | 제공 기능 |
|---|---|
| 메인 | 3D 그래픽 기반 브랜드 히어로, 교육 방법론, AI 협업 원칙, 프로젝트 심사 기준 |
| 교육 철학 | 원리 중심·프로젝트 중심·책임 있는 AI 활용·피드백 반복 구조 |
| 교육과정 | 과정 검색·분야 필터, 분야별 선택 가이드, 상세 커리큘럼, 학습 성과, 프로젝트 산출물, FAQ, 운영정보 검증 공개 |
| 프로젝트 | 6개 분야별 전용 이미지, 분야 필터, 상세 모달, 문제 정의, 해결 접근, 기술 스택, 산출물, 평가 포인트와 포트폴리오 증거 안내 |
| 공지사항 | 공개 게시물, 분류·검색, 중요 공지, 상세 조회 |
| 상담 | 사전 준비 가이드, 진행 절차, 필수·선택 입력 정보 안내, 서버 입력 검증, 개인정보 동의, 접수 번호 발급 |
| 관리자 | 대시보드, 과정·공지·상담 관리, 관리자 권한 관리 |

## 2. 기술 구성

| 구분 | 기술 |
|---|---|
| 프론트엔드 | React 18, JavaScript, Vite 6 |
| 화면 스타일 | CSS3, 반응형 레이아웃, CSS 3D transform, 접근성 고려 |
| 백엔드 | Spring Boot 3.5.6, Java 21 |
| 데이터 접근 | Spring Data JPA, Hibernate |
| 데이터베이스 | MySQL 8.x |
| 보안 | Spring Security, 세션 인증, BCrypt, CSRF, 역할 기반 권한 |
| 테스트 | Node 내장 test, Playwright Chromium, JUnit 5, Spring Boot Test, MockMvc, H2 |
| 배포 | Docker Compose, Nginx, Caddy HTTPS, GitHub Actions |

프론트엔드는 .js 파일만 사용합니다. JSX, TSX, TypeScript는 사용하지 않으며 화면 요소는 React.createElement()로 작성합니다.

## 3. 시스템 구조

~~~text
Visitor / Administrator
          |
          v
React 18 + JavaScript
          |
          | /api (Axios, session cookie, CSRF)
          v
Spring Boot REST API
          |
          +-- Controller : 요청·응답·입력 검증
          +-- Service    : 업무 규칙·중복 신청 검증
          +-- Repository : DB 조회·검색·페이지 처리
          +-- Entity     : Course / Notice / Inquiry / Admin
          |
          v
        MySQL
~~~

공개 사이트와 관리자 화면은 같은 React 앱에서 제공하되, 관리자 API는 서버의 인증·권한 검사를 통과해야 사용할 수 있습니다. 공개 조회 API와 관리자 변경 API는 보안 경계를 분리합니다.

## 4. 로컬 개발 환경

필수 도구는 Node.js 20 이상, JDK 21, MySQL 8.x, Gradle 8.14.3 이상입니다.

### 데이터베이스

1. MySQL 서버를 실행합니다.
2. database/createdb.sql을 실행해 it_academy 데이터베이스를 생성합니다.
3. 기본 DB 계정과 실제 로컬 계정이 다르면 DB_URL, DB_USERNAME, DB_PASSWORD 환경 변수를 설정합니다.

기본 로컬 DB 연결은 localhost:3306 / it_academy / root / 1234입니다. 이 값은 개발 편의를 위한 기본값입니다. 운영 환경에서는 별도 비밀번호와 환경 변수를 사용합니다.

### 최초 관리자 생성

관리자 계정은 공개 회원가입으로 만들지 않습니다. DB에 관리자가 한 명도 없을 때만 환경 변수로 지정한 최초 계정을 최고 관리자로 생성합니다.

CMD 창에서 실행합니다. 비밀번호는 12자 이상의 고유한 값으로 바꿉니다.

~~~cmd
set ADMIN_INITIAL_LOGIN_ID=siteadmin
set ADMIN_INITIAL_PASSWORD=여기에_12자_이상의_고유_비밀번호
set ADMIN_INITIAL_NAME=최고 관리자
cd /d D:\dev\ITEducation\backend
gradle bootRun
~~~

최초 계정 생성 이후 환경 변수 변경만으로 기존 계정 비밀번호가 바뀌지는 않습니다.

### 애플리케이션 실행

백엔드와 프론트엔드를 각각 별도 CMD 창에서 실행합니다.

백엔드:

~~~cmd
cd /d D:\dev\ITEducation\backend
gradle bootRun
~~~

프론트엔드:

~~~cmd
cd /d D:\dev\ITEducation\frontend
npm ci
npm run dev
~~~

### 접속 주소

| 대상 | 주소 |
|---|---|
| 공개 웹사이트 | http://localhost:5173 |
| 관리자 로그인 | http://localhost:5173/admin |
| 백엔드 | http://localhost:8080 |
| 교육과정 API | http://localhost:8080/api/courses |
| 프로젝트 API | http://localhost:8080/api/projects |
| 공지사항 API | http://localhost:8080/api/notices |
| 상담 API | http://localhost:8080/api/inquiries |

Vite 개발 서버는 /api 요청을 백엔드 8080 포트로 프록시합니다.

## 5. API 개요

| Method | Endpoint | 접근 | 기능 |
|---|---|---|---|
| GET | /api/courses | 공개 | 공개 교육과정 목록 |
| GET | /api/courses/{id} | 공개 | 교육과정 단건 조회 |
| GET | /api/projects | 공개 | 프로젝트 설계 사례 |
| GET | /api/notices | 공개 | 게시 중인 공지 목록 |
| GET | /api/notices/{id} | 공개 | 게시 중 공지 상세 |
| POST | /api/inquiries | 공개·CSRF | 상담 신청 |
| GET | /api/csrf | 공개 | CSRF 토큰 발급 |
| GET, POST, PUT, DELETE | /api/admin/courses | 관리자 | 교육과정 관리 |
| GET, POST, PUT, DELETE | /api/admin/notices | 관리자 | 공지사항 관리 |
| GET, PATCH, DELETE | /api/admin/inquiries | 관리자 | 상담 신청 관리 |
| GET, POST, PATCH, DELETE | /api/admin/accounts | 최고 관리자 | 관리자 계정 관리 |

관리자 API 권한과 상담 입력값은 서버에서 다시 검증합니다. 교육과정의 모집 상태·기간·지원 대상은 관리자가 운영정보 확인을 완료하기 전까지 공개 API에서 확인 필요 상태로 표시합니다.

## 6. 프로젝트 평가 기준

| 평가 영역 | 배점 |
|---|---:|
| 문제 정의와 요구사항 | 15 |
| 설계와 데이터 구조 | 15 |
| 구현과 코드 품질 | 20 |
| 테스트와 신뢰성 | 20 |
| 사용성과 접근성 | 10 |
| 협업과 버전 관리 | 10 |
| 문서와 발표 | 10 |
| **합계** | **100** |

점수표는 이 프로젝트에서 제안하는 평가 모델입니다. 실제 교육기관의 공식 심사표나 인증된 평가 기준으로 표시하지 않습니다.

## 7. 테스트와 빌드

프론트엔드:

~~~cmd
cd /d D:\dev\ITEducation\frontend
npm ci
npm test
npm run build
~~~

백엔드:

~~~cmd
cd /d D:\dev\ITEducation\backend
gradle clean test build
~~~

통합 테스트는 공개 API, 관리자 인증·권한, CSRF, 프로젝트 응답 구조, 상담 입력 검증, 개인정보 동의 및 중복 접수 동작을 확인합니다.

GitHub Actions는 Chromium 브라우저 회귀 테스트 6개도 실행합니다. GitHub Pages의 실제 `/ITEducation/` 경로를 재현해 메인·과정 탐색, 공지 상세, 프로젝트 모달의 Escape·포커스 복원, 정적 미리보기 상담 접수 차단, 404 화면, 360px 가로 넘침을 검사합니다. 실패 시 스크린샷과 Trace를 7일간 보관합니다.

로컬에서 브라우저 테스트를 실행하려면 다음 명령을 사용합니다.

~~~cmd
npm install --no-save --no-package-lock @playwright/test
npx playwright install chromium
set GITHUB_PAGES=true
set VITE_STATIC_PREVIEW=true
npm run build
npx playwright test --config=playwright.config.js
~~~

실제 브라우저·실서비스 DB·운영 서버 환경 검증은 별도 수행해야 합니다.

## 8. 정적 미리보기와 실제 서비스 구분

GitHub Pages는 프론트엔드 정적 호스팅입니다. 백엔드와 데이터베이스가 자동으로 함께 실행되는 환경이 아닙니다.

- 정적 미리보기는 화면과 탐색 흐름을 확인하기 위한 안내 데이터를 표시합니다.
- 정적 미리보기에서 상담 신청은 실제 저장되지 않으며 화면에서 이를 안내합니다.
- 실제 공지사항은 API 연결이 실패하면 가짜 운영 공지로 대체하지 않고 오류 상태를 표시합니다.
- 실제 상담 접수와 관리자 기능은 백엔드가 연결된 서비스 환경에서 확인해야 합니다.

전체 서버 배포는 DEPLOYMENT.md를 참고합니다.

## 9. 심사 및 시연 자료

- [교육 설계와 AI 협업 원칙](docs/EDUCATION_DESIGN.md)
- [시스템 구조·품질·테스트 기준](docs/PROJECT_QUALITY.md)
- [전체 사이트 UX·코드 품질 감사](docs/UX_AUDIT_2026-11.md)
- [최종 제출 전 콘텐츠·기능 점검](docs/FINAL_SUBMISSION_AUDIT_2026-11.md)
- [프로젝트 발표 및 시연 순서](docs/PRESENTATION_GUIDE.md)
