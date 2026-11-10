# 구현 계획 — IT ACADEMY 전체 공개 사이트 재설계

## 작업 순서

1. 테스트 우선: 공지 가상 데이터 없음, 100점 평가표 없음, 과정 placeholder 문구 제거, 정적 상담 폼 비노출, 카테고리 태그 구분, favicon 식별자 테스트를 추가해 RED를 확인한다.
2. 과정 데이터 보강: course-catalog.js에 각 과정의 적합 대상/학습 목표/대표 결과 필드를 추가하되 운영 사실은 생성하지 않는다.
3. 공개 페이지 구조: App.js의 과정 목록·상세, 상담, 공지 목록·상세 markup을 새 한국어 콘텐츠 구조로 변경한다. API와 폼 계약을 보존한다.
4. 교육 홈·프로젝트: academy-pages.js에서 100점 평가표를 제거하고 학습자 관점의 학습 산출물 흐름으로 바꾼다. 프로젝트 예시 사실표시를 유지한다.
5. 디자인 시스템: main.js에서 새 site.css를 최종 공개 스타일로 로드한다. site.css는 공개 영역의 모든 주요 route를 단일 토큰/컴포넌트 체계로 완전히 정의한다. 관리자 기존 스타일은 회귀되지 않는지 별도 확인한다.
6. 파비콘: frontend/public/favicon.svg 및 index.html 메타 색상/설명을 새 아이덴티티로 일치시킨다.
7. 테스트: 단위 테스트와 Playwright 경로별 테스트를 새 UI 기준으로 갱신한다. 1440px·390px 스크린샷을 모든 핵심 route에서 저장한다.
8. 검토: 실제 브라우저 렌더링 스크린샷을 직접 열어 타이포, 페이지별 밀도, 색, 모바일/데스크톱, empty/error 상태를 리뷰하고 수정한다.
9. 최종: full Build Check, PR 리뷰, merge, GitHub Pages deploy run, 배포 artifact/commit까지 확인한다.

## 변경 파일 예정

- frontend/src/App.js
- frontend/src/academy-pages.js
- frontend/src/course-catalog.js
- frontend/src/preview-content.js
- frontend/src/preview-content.test.js
- frontend/src/site-content.test.js
- frontend/src/main.js
- frontend/src/site.css (신규)
- frontend/public/favicon.svg
- frontend/index.html
- frontend/e2e/public-site.spec.js
- frontend/src/design-system.test.js
- README.md
- docs/FINAL_SUBMISSION_AUDIT_2026-11.md

## 검증 명령

- cd frontend && npm ci && npm test && npm run build
- Playwright Chromium E2E in GitHub Actions using the real /ITEducation/ base path.
- gradle clean test build --no-daemon via the existing CI job.
- docker compose config --quiet && docker compose build.
