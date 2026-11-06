# IT ACADEMY 전체 서비스 배포

이 프로젝트는 React 정적 파일, Spring Boot API, MySQL을 Docker Compose로 실행합니다. Caddy가 외부 HTTPS 연결을 받고 프론트엔드 컨테이너로 전달합니다. 프론트엔드 Nginx는 `/api` 요청을 백엔드로 전달하므로 브라우저에서 별도 API 도메인을 설정할 필요가 없습니다.

## 1. 필요한 서버 환경

- Docker Engine 및 Docker Compose Plugin이 설치된 Linux 서버
- 외부에서 접근 가능한 도메인
- 도메인의 DNS A 레코드가 서버 공인 IP를 가리키는 설정
- 서버 방화벽에서 TCP 80, 443 및 UDP 443 허용

## 2. 환경 변수 설정

저장소를 서버에 내려받은 뒤 프로젝트 루트에서 실행합니다.

```bash
cp .env.example .env
```

`.env` 파일에서 `DOMAIN`, `DB_USERNAME`, `DB_PASSWORD`, `DB_ROOT_PASSWORD`를 실제 값으로 변경합니다. 비밀번호는 서로 다르게 설정하고 외부에 공유하지 않습니다. `.env`는 Git에 커밋하지 않습니다.

`CORS_ALLOWED_ORIGINS`에는 실제 접속 도메인을 입력합니다. 예: `https://academy.example.com`.

## 3. 서비스 시작

프로젝트 루트에서 실행합니다.

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f backend
```

최초 실행 시 MySQL 데이터베이스가 생성됩니다. 백엔드는 DB 상태가 healthy가 된 뒤 시작합니다. 첫 빌드는 의존성 다운로드 때문에 시간이 걸릴 수 있습니다.

## 4. 접속 및 확인

- 웹사이트: `https://설정한-도메인`
- API 경로: `https://설정한-도메인/api`

확인 순서:

1. 도메인 접속 시 메인 화면이 표시되는지 확인합니다.
2. 새로고침 후 `/courses`, `/notices` 등 하위 주소가 열리는지 확인합니다.
3. 개발자 도구 Network에서 `/api/courses`, `/api/notices` 요청이 성공하는지 확인합니다.
4. 상담 신청을 제출하고 DB에 저장되는지 확인합니다.
5. 서버 재시작 후에도 데이터가 유지되는지 확인합니다.

## 5. 운영 명령

```bash
# 로그 확인
docker compose logs -f

# 서비스 재시작
docker compose restart

# 코드 갱신 후 재빌드
git pull origin main
docker compose up -d --build

# 서비스 중지 (DB 데이터 볼륨은 유지)
docker compose down
```

데이터까지 삭제하는 `docker compose down -v`는 실행하지 않습니다. MySQL 데이터가 삭제됩니다.

## 6. 주의 사항

- 실제 서버, 도메인, DNS, 방화벽, 환경 변수 설정은 서버 운영자가 수행해야 합니다.
- 관리자 초기 계정 생성 및 관리자 로그인은 별도 초기 데이터 설정 여부를 확인한 뒤 사용해야 합니다.
- 현재 JPA 설정은 `ddl-auto: update`입니다. 운영 데이터베이스의 스키마 변경을 엄격하게 관리하려면 추후 마이그레이션 도구를 도입해야 합니다.
- 공개 서비스 전에는 관리자 계정 초기화, CSRF 보호, 개인정보 보관·삭제 정책, 백업 및 복구 절차를 별도로 점검해야 합니다.
- 이 저장소 변경만으로 외부 서버가 자동 생성되거나 도메인이 발급되지는 않습니다.
