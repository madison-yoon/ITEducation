# IT ACADEMY

AI·데이터·소프트웨어 교육과정과 프로젝트 사례, 공지사항 및 상담 안내를 제공하는 반응형 교육기관 웹사이트입니다.

**공개 사이트:** https://madison-yoon.github.io/ITEducation/

## 브랜드와 화면 구성

사이트는 확정된 메인 구성안인 **짙은 포레스트 그린 · 웜 아이보리 · 오렌지 포인트**를 기준으로 구성합니다. Pretendard Variable을 한국어 기본 글꼴로 사용하며, 상단 내비게이션·버튼·카드·태그·입력·포커스 표현을 모든 공개 페이지에서 공유합니다.

홈페이지 흐름은 다음 순서입니다.

1. 사진과 기술 오버레이를 결합한 메인 히어로, 교육과정·프로젝트 행동 버튼
2. 네 가지 교육 특징 안내
3. 이미지형 교육과정 카드 네 개
4. MOMO 대표 프로젝트와 IT ACADEMY·AI 로또 분석기·날씨 생활 도우미 사례
5. 공지사항과 상담 안내
6. 하단 CTA 및 공통 푸터

교육과정 목록/상세, 프로젝트 갤러리/상세, 기관 소개, 공지 목록/상세, 상담 안내도 같은 디자인 시스템을 사용합니다.

## 콘텐츠·운영 정보 원칙

- 교육과정의 학습 대상·목표·커리큘럼·결과물은 학습 내용을 설명하는 자료입니다. 실제 개강일, 기간, 정원, 교육비, 지원 자격은 운영기관이 확인한 공지로만 안내합니다.
- 실제 운영 공지가 연결되지 않은 GitHub Pages 미리보기에는 가상 공지를 게시하지 않습니다. 공개 공지가 없으면 빈 상태를 표시합니다.
- GitHub Pages 미리보기에는 실제 저장 서버가 없으므로 개인정보 상담 신청 폼을 노출하지 않습니다. 실제 서비스 모드의 상담 API와 폼 검증은 유지합니다.
- 프로젝트 평가 규정으로 확인되지 않은 100점 배점표는 공개 사이트에서 제거했습니다.
- 강사 이력, 취업률, 수강생 성과, 공식 연락처처럼 확인되지 않은 운영 사실을 임의로 만들지 않습니다.

## 기술 구성

- Frontend: React 18, JavaScript, React Router, Vite
- UI: CSS design tokens, responsive layout, Pretendard Variable
- Backend: Spring Boot (기존 API 계약 유지)
- Test: Node.js built-in test runner, Playwright Chromium
- CI: GitHub Actions frontend/backend/build/browser checks

## 페이지

| 경로 | 목적 |
|---|---|
| / | 교육기관 메인 랜딩 페이지 |
| /about | 교육 방향과 학습 원칙 |
| /courses | 분야 필터·검색이 가능한 교육과정 목록 |
| /courses/:id | 학습 목표·단계별 커리큘럼·프로젝트 예시 |
| /projects | 프로젝트 사례와 상세 설계 |
| /notices | 실제 운영 공지 목록 |
| /notices/:id | 공지 상세 및 목록 복귀 |
| /consultation | 상담 준비·절차·운영 환경 안내 |

## 로컬 실행

frontend 디렉터리에서 npm ci 후 npm run dev를 실행합니다.

프론트엔드 테스트 및 프로덕션 빌드는 npm test와 npm run build를 사용합니다.

백엔드 및 Docker 실행 방법은 루트의 docker-compose.yml, 백엔드 설정과 배포 문서를 확인하세요.

## 프로젝트 구조

- frontend/public/favicon.svg
- frontend/public/images/projects/
- frontend/src/App.js
- frontend/src/academy-pages.js
- frontend/src/course-catalog.js
- frontend/src/preview-content.js
- frontend/src/site.css
- frontend/src/design-system.css
- frontend/src/*.test.js
- frontend/e2e/public-site.spec.js
- docs/redesign/
- docs/FINAL_SUBMISSION_AUDIT_2026-11.md

## 이미지 출처

- 메인 히어로 및 교육과정 카드: Unsplash 이미지 CDN (각 이미지 URL은 academy-pages.js 및 App.js에 지정)
- 상담 카드 및 CTA 배경: Pexels 이미지 CDN (원본 사진 URL은 academy-pages.js와 site.css에 지정)
- 프로젝트 갤러리: 저장소의 자체 SVG 이미지

외부 이미지 제공처의 이용 조건을 준수하며, 외부 이미지가 차단되어도 핵심 정보와 링크는 접근할 수 있도록 대체 배경색과 대체 텍스트를 제공합니다.

## 검증

CI의 Build Check는 프론트엔드 단위 테스트, 백엔드 테스트·빌드, Docker 구성·이미지 빌드, Chromium 공개 페이지 회귀 테스트를 실행합니다. 브라우저 테스트는 데스크톱·모바일 화면을 캡처하고 360/390/768/1024/1440px에서 가로 넘침을 검사합니다.
