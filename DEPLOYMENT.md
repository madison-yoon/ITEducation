# IT ACADEMY 전체 서비스 배포

이 프로젝트는 React 정적 파일, Spring Boot API, MySQL을 Docker Compose로 실행합니다. Caddy가 외부 HTTPS 연결을 받고 프론트엔드 컨테이너로 전달합니다. 프론트엔드 Nginx는 `/api` 요청을 백엔드로 전달합니다.

## 1. 필요한 서버 환경

- Docker Engine 및 Docker Compose Plugin이 설치된 Linux 서버
- 외부에서 접근 가능한 도메인
- 도메인의 DNS A 레코드가 서버 공인 IP를 가리키는 설정
- 서버 방화벽에서 TCP 80, 443 및 UDP 443 허용

## 2. 환경 변수 설정

프로젝트 루트에서 실행합니다.

```bash
cp .env.example .env
```

`.env` 파일에서 다음 항목을 실제 운영 값으로 변경합니다.

| 변수 | 용도 |
|---|---|
| DOMAIN | 서비스 도메인 |
| DB_USERNAME | MySQL 서비스 계정 |
| DB_PASSWORD | MySQL 서비스 계정 비밀번호 |
| DB_ROOT_PASSWORD | MySQL root 비밀번호 |
| ADMIN_INITIAL_LOGIN_ID | 최초 최고 관리자 아이디 |
| ADMIN_INITIAL_PASSWORD | 최초 최고 관리자 비밀번호 |
| ADMIN_INITIAL_NAME | 최초 최고 관리자 표시 이름 |
| CORS_ALLOWED_ORIGINS | 허용할 웹사이트 출처 |

관리자 비밀번호는 12자 이상의 고유한 값으로 설정합니다. DB 비밀번호와 관리자 비밀번호를 서로 다르게 설정합니다. `.env` 파일은 Git에 커밋하지 않습니다.

최초 관리자 계정은 데이터베이스에 관리자 계정이 한 개도 없을 때만 생성됩니다. 이미 관리자 계정이 존재하면 환경 변수 변경으로 계정 비밀번호가 초기화되지 않습니다.

## 3. 서비스 시작

```bash
docker compose config
docker compose up -d --build
docker compose ps
docker compose logs -f backend
```

MySQL 상태가 healthy가 된 뒤 백엔드가 시작됩니다. 최초 실행 시 이미지와 의존성 다운로드로 시간이 걸릴 수 있습니다.

## 4. 접속 주소

- 공개 웹사이트: `https://설정한-도메인`
- 관리자 페이지: `https://설정한-도메인/admin`
- API: `https://설정한-도메인/api`

## 5. 운영 기능 확인

1. 공개 메인 화면과 교육과정 목록을 확인합니다.
2. 공지사항 목록과 상세 화면을 확인합니다.
3. 상담 신청을 제출하고 접수 번호를 확인합니다.
4. 관리자 계정으로 로그인합니다.
5. 대시보드의 상담 현황이 DB 데이터와 일치하는지 확인합니다.
6. 교육과정을 등록·수정·삭제하고 공개 화면에 반영되는지 확인합니다.
7. 상담 신청 상태와 내부 메모를 변경합니다.
8. 공지사항을 게시 및 비공개 처리하고 방문자 화면 노출 여부를 확인합니다.
9. 최고 관리자 계정에서 일반 관리자 계정을 생성하고 권한별 접근을 확인합니다.
10. 서버를 재시작한 뒤 DB 데이터가 유지되는지 확인합니다.

## 6. 업데이트 및 운영 명령

```bash
# 로그
docker compose logs -f

# 서비스 재시작
docker compose restart

# main 최신 코드 반영 및 재빌드
git pull origin main
docker compose up -d --build

# 서비스 중지 (DB 데이터 볼륨 유지)
docker compose down
```

`docker compose down -v`는 MySQL 데이터를 삭제하므로 운영 중 실행하지 않습니다.

## 7. 보안 및 운영 주의 사항

- 관리자 로그인은 Spring Security 세션과 BCrypt 비밀번호 해시를 사용합니다.
- 관리자 변경 요청은 세션 CSRF 토큰 검증을 통과해야 합니다.
- 세션 쿠키는 운영 프로필에서 Secure, HttpOnly, SameSite 설정을 사용합니다.
- 일반 관리자는 교육과정·상담·공지사항을 관리할 수 있습니다.
- 관리자 계정 생성과 권한 변경은 최고 관리자만 수행할 수 있습니다.
- 마지막 최고 관리자 계정은 권한 강등 및 삭제할 수 없습니다.
- 공개 서비스 전에는 개인정보 보관 기간, 삭제 요청 처리, 백업·복구 절차, 접근 로그 정책을 확정해야 합니다.
- 현재 JPA 스키마 관리는 `ddl-auto: update`를 사용합니다. 엄격한 운영 스키마 이력 관리가 필요하면 Flyway 또는 Liquibase를 도입해야 합니다.
- 이 저장소의 코드만으로 서버, 도메인, DNS가 자동 생성되지는 않습니다. 외부 서버와 도메인 설정은 별도로 필요합니다.
