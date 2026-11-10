import React from "react";
import { Link } from "react-router-dom";
import api from "./api.js";
import { courseCatalog as courseFallback } from "./course-catalog.js";
import { previewNotices } from "./preview-content.js";

const h = React.createElement;


const projectFallback = [
  {
    id: 1, title: "AI 영화 추천 플랫폼", category: "AI · WEB", duration: "6주", teamSize: "4명",
    description: "사용자 선호와 작품 메타데이터를 분석해 설명 가능한 추천 결과를 제공하는 서비스입니다.",
    problem: "사용자는 방대한 작품 중 취향에 맞는 영화를 찾기 어렵고 추천 이유도 확인하기 어렵습니다.",
    solution: "장르·평점·선호 이력을 정제하고 콘텐츠 유사도와 사용자 피드백을 결합한 추천 흐름을 설계합니다.",
    features: ["데이터 수집·정제 파이프라인", "콘텐츠 기반 추천과 유사 작품 탐색", "추천 근거와 사용자 피드백 기록", "모델 평가 리포트와 운영자 화면"],
    stack: ["Python", "Pandas", "Scikit-learn", "Spring Boot", "React", "MySQL"],
    result: "데이터셋 설명, 추천 로직, 성능 비교표, 테스트 결과, 시연 가능한 웹 서비스",
    deliverables: ["데이터 사전", "추천 모델", "평가 보고서", "API 명세", "시연 영상"],
    evaluationPoints: ["추천 품질과 평가 지표의 타당성", "데이터 누수 및 편향 점검", "API·화면 통합 테스트"]
  },
  {
    id: 2, title: "소비 데이터 인사이트 랩", category: "DATA", duration: "4주", teamSize: "3명",
    description: "원천 데이터를 정제하고 핵심 지표를 정의해 의사결정용 대시보드로 전달합니다.",
    problem: "흩어진 거래 데이터만으로는 기간별 변화와 고객군별 차이를 빠르게 파악하기 어렵습니다.",
    solution: "분석 질문을 먼저 정의하고 데이터 품질을 점검한 뒤 SQL·Python 기반 분석과 시각화를 연결합니다.",
    features: ["결측·중복·이상치 처리 규칙", "지표 정의서와 SQL 분석 쿼리", "기간·지역·상품군별 대시보드", "분석 결과와 한계가 포함된 리포트"],
    stack: ["Python", "SQL", "Pandas", "NumPy", "Power BI"],
    result: "재현 가능한 분석 코드, 지표 정의서, 대시보드, 인사이트 보고서",
    deliverables: ["데이터 품질 보고서", "SQL 스크립트", "대시보드", "최종 분석서"],
    evaluationPoints: ["분석 질문과 지표 간 정합성", "전처리 근거와 재현성", "시각화의 전달력"]
  },
  {
    id: 3, title: "근거 중심 사내 문서 AI", category: "GEN AI", duration: "5주", teamSize: "4명",
    description: "문서 검색 결과와 출처를 함께 제시하는 RAG 기반 질의응답 서비스를 구현합니다.",
    problem: "문서가 여러 공간에 분산되어 있어 필요한 정보를 찾는 시간이 길고 답변 근거를 추적하기 어렵습니다.",
    solution: "문서 파싱·청킹·임베딩·검색·응답 생성 단계를 분리하고 검색 결과의 출처를 화면에 표시합니다.",
    features: ["문서 등록과 텍스트 추출", "청크·메타데이터 관리", "질문별 검색 결과와 출처 표시", "정답셋 기반 응답 품질 평가"],
    stack: ["Python", "LLM API", "Embedding", "Vector Search", "FastAPI"],
    result: "문서 처리 파이프라인, 검색 API, 출처 표시 UI, 품질 평가셋",
    deliverables: ["시스템 구성도", "프롬프트·검색 설정", "평가 데이터셋", "API 문서"],
    evaluationPoints: ["검색 적합도와 근거 일치도", "환각 대응과 안전한 거절", "비용·지연 시간 관리"]
  },
  {
    id: 4, title: "고객 VOC 분류·분석 시스템", category: "DATA", duration: "5주", teamSize: "3명",
    description: "고객 의견을 분류하고 반복 이슈와 우선 대응 대상을 파악하는 NLP 프로젝트입니다.",
    problem: "자유 형식의 고객 의견이 누적되면 담당자가 유형을 분류하고 주요 이슈를 찾는 데 시간이 듭니다.",
    solution: "텍스트 전처리, 라벨 기준 수립, 분류 모델 비교, 신뢰도 기반 검토 흐름을 구현합니다.",
    features: ["라벨 체계와 데이터셋 버전 관리", "기준 모델과 개선 모델 비교", "분류 신뢰도와 검토 대기열", "오분류 사례 분석과 재학습 기록"],
    stack: ["Python", "Scikit-learn", "NLP", "FastAPI", "React"],
    result: "분류 모델, 오분류 분석표, 검토용 업무 화면, 모델 카드",
    deliverables: ["라벨 가이드", "학습 노트북", "혼동 행렬", "모델 카드"],
    evaluationPoints: ["클래스 불균형과 평가 지표", "오분류 원인 분석", "사람의 검토 절차 설계"]
  },
  {
    id: 5, title: "학습 운영 통합 플랫폼", category: "WEB", duration: "6주", teamSize: "4명",
    description: "사용자·과정·과제·공지 데이터를 연결해 학습 운영 흐름을 관리하는 웹 서비스입니다.",
    problem: "학습 일정과 제출 상태가 여러 도구에 나뉘면 학습자와 운영자 모두 진행 상황을 놓치기 쉽습니다.",
    solution: "역할과 권한을 정의하고 관계형 데이터 모델, API 계약, 반응형 화면을 순서대로 구현합니다.",
    features: ["세션 기반 인증과 역할별 권한", "과정·과제·공지 CRUD", "상태 변경 이력과 검색", "통합 테스트와 배포 구성"],
    stack: ["Java", "Spring Boot", "JPA", "React", "MySQL", "Docker"],
    result: "권한이 분리된 웹 서비스, DB 설계서, API 문서, 테스트 결과",
    deliverables: ["요구사항 명세", "ERD", "API 명세", "테스트 케이스", "배포 문서"],
    evaluationPoints: ["도메인·DB 모델의 일관성", "권한·입력값 검증", "통합 테스트와 운영 문서"]
  },
  {
    id: 6, title: "Vibe Coding 품질 검증 워크벤치", category: "VIBE CODING", duration: "4주", teamSize: "3~4명",
    description: "AI 코딩 도구를 활용하되 생성 코드의 근거·검증·수정 이력을 함께 관리하는 프로젝트입니다.",
    problem: "AI가 만든 코드는 빠르게 동작할 수 있지만 요구사항 누락, 보안 취약점, 이해하지 못한 코드가 남을 수 있습니다.",
    solution: "요구사항을 작업 단위로 나누고 AI 프롬프트·생성 결과·사람의 수정·테스트 증거를 하나의 흐름으로 기록합니다.",
    features: ["요구사항과 작업 티켓 연결", "AI 사용 로그와 코드 변경 근거", "정적 검사·테스트 결과 수집", "리뷰 체크리스트와 위험도 대시보드"],
    stack: ["JavaScript", "React", "Node.js", "Git", "Playwright", "GitHub Actions"],
    result: "AI 협업 개발 프로세스, 품질 대시보드, 재현 가능한 테스트 보고서",
    deliverables: ["작업 분해표", "AI 사용 기록", "코드 리뷰 기록", "테스트 리포트", "회고 문서"],
    evaluationPoints: ["요구사항 추적 가능성", "AI 생성 코드 이해·검증", "테스트·보안·문서 증거"]
  }
];


const projectBlueprints = {
  1: {
    focus: "추천 후보 생성 · 추천 이유 설명 · 오프라인 품질 비교",
    architecture: "작품 메타데이터 정규화 → 사용자 선호 이벤트 집계 → 콘텐츠 특성 벡터·유사도 계산 → 추천 API → 설명 가능한 추천 카드",
    workflow: [
      ["01", "데이터 기준 정리", "작품 ID·장르·키워드·평점·사용자 반응을 공통 스키마로 정규화합니다."],
      ["02", "기준 추천기 구현", "인기도 기반 기준선과 콘텐츠 유사도 기반 추천기를 각각 구현합니다."],
      ["03", "후보와 설명 생성", "유사 장르·키워드·선호 이력을 추천 이유로 연결하고 중복 후보를 제거합니다."],
      ["04", "API와 화면 통합", "페이지네이션, 빈 결과, 신규 사용자 상태까지 추천 API와 화면에 연결합니다."],
      ["05", "오프라인 평가", "학습·평가 분리 기준을 고정하고 Precision@K·Recall@K·Hit Rate를 비교합니다."]
    ],
    completion: ["동일 입력에서 동일한 추천 결과를 재현할 수 있음", "기준선과 개선 모델의 평가 지표를 같은 데이터 분할로 비교함", "각 추천 카드에서 추천 근거를 사용자가 확인할 수 있음", "신규 사용자·선호 정보 부족·빈 결과가 예외 없이 처리됨"],
    controls: ["시간 기준 또는 사용자 기준으로 학습·평가 데이터 누수를 차단", "인기 작품 쏠림을 확인하고 장르 다양성·중복 제한을 적용", "추천 점수만으로 품질을 단정하지 않고 오프라인 지표와 시나리오 검증을 함께 기록"]
  },
  2: {
    focus: "데이터 품질 진단 · 지표 정의 · 근거가 남는 대시보드",
    architecture: "원천 CSV·테이블 → SQL 추출 → Python 전처리·프로파일링 → 지표 마트 → 대시보드·분석 보고서",
    workflow: [
      ["01", "분석 질문 구체화", "대상 사용자와 의사결정 질문을 정하고 지표의 분자·분모·집계 단위를 정의합니다."],
      ["02", "원천 데이터 점검", "자료형·결측·중복·이상치·기간 범위를 프로파일링하고 정제 규칙을 기록합니다."],
      ["03", "SQL 분석 재현", "필터·조인·집계 쿼리를 분리해 분석 테이블을 만들고 원천 건수와 대조합니다."],
      ["04", "패턴과 차이 분석", "기간·지역·상품군별 분포를 비교하고 평균뿐 아니라 표본 수와 분산도 함께 확인합니다."],
      ["05", "대시보드와 보고", "핵심 지표, 필터, 데이터 기준일, 해석과 한계를 한 화면과 보고서로 연결합니다."]
    ],
    completion: ["모든 지표에 정의·단위·기준 기간·출처가 명시됨", "전처리 전후 행 수와 결측·중복 처리 내역이 재현됨", "대시보드 숫자가 검증용 SQL 결과와 일치함", "표본이 적거나 비교가 부적절한 구간은 해석 제한을 표시함"],
    controls: ["개인정보는 분석 목적에 필요한 최소 컬럼만 사용하고 식별자는 제거·가명화", "이상치를 자동 삭제하지 않고 업무 맥락과 원본을 확인", "상관관계를 인과관계로 표현하지 않고 표본 범위와 데이터 기준일을 공개"]
  },
  3: {
    focus: "문서 파이프라인 · 근거 검색 · 출처가 연결된 응답",
    architecture: "문서 등록 → 파싱·청킹·메타데이터 → 임베딩·벡터 검색 → 검색 문맥 검증 → LLM 응답·인용 UI",
    workflow: [
      ["01", "문서 입력 설계", "지원 파일 형식, 문서 버전, 접근 권한, 삭제·갱신 정책을 정의합니다."],
      ["02", "청킹과 인덱싱", "제목·문단 구조를 보존해 청크를 만들고 원문 위치와 문서 ID를 메타데이터로 저장합니다."],
      ["03", "검색 성능 점검", "질문별 정답 문서 세트를 만들고 Top-K 적합도와 누락 사례를 분석합니다."],
      ["04", "근거 기반 생성", "검색 문맥을 제한된 형식으로 전달하고 인용 출처·문서 위치를 답변에 연결합니다."],
      ["05", "실패와 비용 평가", "근거 부족, 권한 없음, 문서 미검색, API 오류를 구분하고 지연·토큰 비용을 측정합니다."]
    ],
    completion: ["답변의 핵심 주장마다 원문 문서와 위치를 추적할 수 있음", "검색 결과가 없거나 근거가 약하면 추측 대신 한계를 표시함", "권한이 없는 문서가 검색·응답에 노출되지 않음", "질문 평가 세트로 검색 적합도·근거 일치·응답 실패를 반복 측정함"],
    controls: ["문서 내용에 포함된 프롬프트 지시를 신뢰하지 않는 간접 프롬프트 인젝션 방어", "문서 ACL을 검색 단계에서 적용하고 응답 후처리에도 재확인", "문서 버전·삭제·캐시 만료를 관리하며 민감 정보 로그 저장을 제한"]
  },
  4: {
    focus: "VOC 라벨 체계 · 분류 모델 비교 · 사람이 검토하는 운영 흐름",
    architecture: "문의 원문 → 개인정보 비식별화 → 라벨링 데이터셋 → TF-IDF·분류 기준선 → 검토 대기열·이슈 대시보드",
    workflow: [
      ["01", "분류 체계 합의", "상위 카테고리와 세부 라벨, 다중 라벨 여부, 애매한 사례의 판정 규칙을 정의합니다."],
      ["02", "데이터셋 구축", "중복·개인정보를 정리하고 라벨 근거와 데이터 버전을 기록합니다."],
      ["03", "기준 모델 비교", "다수 클래스 기준선과 TF-IDF 기반 모델을 먼저 만들고 클래스별 성능을 비교합니다."],
      ["04", "검토 화면 구현", "예측 라벨·신뢰도·원문 일부·검토 상태를 보여주고 사람이 수정한 이력을 남깁니다."],
      ["05", "오류 분석 반복", "혼동 행렬과 오분류 샘플을 확인해 라벨 정의·데이터·모델 중 개선 원인을 구분합니다."]
    ],
    completion: ["라벨별 정의와 포함·제외 예시가 문서화됨", "정확도뿐 아니라 Macro F1·클래스별 Recall을 함께 보고함", "낮은 신뢰도와 미등록 유형이 사람 검토로 전달됨", "개인정보 비식별화와 수정 이력이 테스트됨"],
    controls: ["희소 라벨과 클래스 불균형을 숨기지 않고 표본 수를 공개", "감정·불만의 강도를 확정적 사실로 추론하지 않도록 검토 단계 유지", "원문 접근 권한·보유 기간·삭제 정책을 데이터 파이프라인에 반영"]
  },
  5: {
    focus: "역할·권한 모델 · 운영 CRUD · 상태 이력과 통합 테스트",
    architecture: "요구사항·역할 정의 → 관계형 DB·ERD → Spring Boot API·인증 → React 화면 → 통합·배포 검증",
    workflow: [
      ["01", "사용자 흐름 정의", "학습자·강사·운영자의 작업을 구분하고 화면별 권한과 완료 조건을 명세합니다."],
      ["02", "데이터 모델 설계", "회원·과정·과제·공지·제출 상태의 관계와 제약 조건을 ERD로 정리합니다."],
      ["03", "서버 기능 구현", "DTO 검증, 서비스 규칙, 트랜잭션, 권한 검사, 오류 응답을 API 계약에 맞춥니다."],
      ["04", "화면과 상태 연결", "목록·상세·작성 폼을 컴포넌트로 나누고 로딩·빈 상태·오류·저장 성공을 처리합니다."],
      ["05", "권한·통합 검증", "역할별 접근 시나리오와 CRUD·중복 제출·동시 수정 조건을 테스트하고 실행 문서를 남깁니다."]
    ],
    completion: ["비인가 역할의 조회·수정·삭제 요청이 서버에서 차단됨", "필수값·중복·참조 관계가 DB와 API 양쪽에서 검증됨", "목록·상세·등록·수정·삭제 흐름의 통합 테스트가 통과함", "설치·환경변수·실행·테스트 절차가 README에 재현 가능하게 기록됨"],
    controls: ["버튼 숨김만으로 권한을 처리하지 않고 서버 요청마다 인가 검사", "삭제·상태 변경·중복 요청의 트랜잭션과 제약 조건 검토", "개인정보와 비밀값은 로그·화면·테스트 fixture에 노출하지 않음"]
  },
  6: {
    focus: "요구사항 추적 · AI 변경 검토 · 테스트 증거 자동 수집",
    architecture: "요구사항 티켓 → AI 작업 지시·생성 diff → 정적 검사·테스트 → 사람 리뷰 → 머지 승인 기록",
    workflow: [
      ["01", "작업 단위 고정", "각 요구사항에 완료 조건·영향 파일·위험 수준을 붙이고 작게 분해합니다."],
      ["02", "AI 작업 기록", "프롬프트·생성 diff·사용 모델·수정 이유를 작업 ID와 연결합니다."],
      ["03", "자동 검사 실행", "lint·type/build·unit·browser test를 단계별로 실행하고 결과를 수집합니다."],
      ["04", "사람 리뷰 수행", "보안·접근성·성능·오류 처리와 요구사항 누락을 검토하고 수정 의견을 기록합니다."],
      ["05", "승인과 회고", "필수 검사가 통과된 변경만 머지하고 미해결 위험과 후속 작업을 남깁니다."]
    ],
    completion: ["요구사항마다 코드 변경과 테스트 증거가 연결됨", "AI 생성 코드의 핵심 흐름과 외부 의존성을 담당자가 설명할 수 있음", "필수 검사 실패 시 머지가 차단되거나 명시적 예외 승인이 기록됨", "보안·접근성·성능 위험과 잔여 작업이 보고서에 남음"],
    controls: ["시크릿·개인정보·실제 운영 데이터가 프롬프트와 로그에 포함되지 않게 제한", "AI 출력의 라이선스·의존성·명령 실행 부작용을 검토", "테스트 통과를 곧바로 제품 안전성이나 정확성의 보증으로 표현하지 않음"]
  }
};

function getProjectBlueprint(project) {
  const id = Number(project && project.id);
  return projectBlueprints[id] || {
    focus: "문제 정의 · 구현 · 검증 · 결과 문서화",
    architecture: "요구사항 → 데이터·화면 설계 → 기능 구현 → 테스트 → 결과 정리",
    workflow: [
      ["01", "문제 정의", "사용자와 해결 범위를 구체화합니다."],
      ["02", "설계", "데이터와 화면·API 구조를 정리합니다."],
      ["03", "구현", "핵심 기능을 작은 단위로 완성합니다."],
      ["04", "검증", "정상·오류·경계 조건을 확인합니다."],
      ["05", "공유", "실행 방법과 한계를 문서로 남깁니다."]
    ],
    completion: ["요구사항과 구현 기능이 연결됨", "핵심 시나리오를 재현할 수 있음", "테스트 결과와 미해결 항목이 기록됨"],
    controls: ["데이터 출처와 사용 권한을 확인", "개인정보와 비밀값을 보호", "검증하지 않은 성과를 사실처럼 게시하지 않음"]
  };
}

const projectArtwork = {
  1: import.meta.env.BASE_URL + "images/projects/ai-movie-recommender.svg",
  2: import.meta.env.BASE_URL + "images/projects/consumer-data-insights.svg",
  3: import.meta.env.BASE_URL + "images/projects/rag-document-assistant.svg",
  4: import.meta.env.BASE_URL + "images/projects/customer-voc-analytics.svg",
  5: import.meta.env.BASE_URL + "images/projects/learning-operations-platform.svg",
  6: import.meta.env.BASE_URL + "images/projects/vibe-coding-quality.svg"
};

function getProjectArtwork(project) {
  const title = String(project && project.title || "").toLowerCase();
  if (title.includes("영화") || title.includes("movie")) return projectArtwork[1];
  if (title.includes("소비") || title.includes("insight") || title.includes("인사이트")) return projectArtwork[2];
  if (title.includes("문서") || title.includes("rag") || title.includes("document")) return projectArtwork[3];
  if (title.includes("voc") || title.includes("고객") || title.includes("의견")) return projectArtwork[4];
  if (title.includes("학습 운영") || title.includes("운영 플랫폼") || title.includes("learning")) return projectArtwork[5];
  if (title.includes("vibe") || title.includes("품질 검증") || title.includes("코딩 품질")) return projectArtwork[6];
  return projectArtwork[Number(project && project.id)] || "";
}

const learningSteps = [
  ["01", "문제 정의", "대상 사용자와 사용 맥락을 구분하고, 해결할 문제·제외 범위·완료 조건을 요구사항으로 기록합니다.", "문제 정의서 · 사용자 시나리오 · 요구사항 목록"],
  ["02", "기초 원리", "문법을 따라 치는 데서 멈추지 않고 입력·처리·출력과 데이터 흐름을 추적하며 정상·오류 사례를 직접 실험합니다.", "개념 설명 · 직접 작성한 실습 코드 · 오류 기록"],
  ["03", "AI 협업", "작업을 작게 나눠 AI에 요청하고 생성 결과의 의존성·보안·라이선스·누락을 검토한 뒤 변경 이유를 남깁니다.", "작업 프롬프트 · 코드 리뷰 · 변경 근거"],
  ["04", "제품 구현", "화면·API·데이터 모델의 계약을 먼저 맞추고 기능을 통합하며 로딩·빈 상태·오류 상태까지 구현합니다.", "화면 흐름 · API 명세 · ERD · 통합 기능"],
  ["05", "검증과 발표", "단위·통합·브라우저 시나리오를 실행하고 접근성·보안·성능의 기본 위험을 확인한 뒤 남은 한계를 설명합니다.", "테스트 케이스 · 실행 결과 · README · 시연 · 회고"]
];

function Eyebrow(props) {
  return h("span", { className: props.light ? "academy-eyebrow is-light" : "academy-eyebrow" }, props.children);
}

function SectionHeading(props) {
  return h("div", { className: "academy-section-heading" },
    h(Eyebrow, null, props.label),
    h("h2", null, props.title),
    props.description ? h("p", null, props.description) : null
  );
}

const courseArtworks = {
  1: {
    label: "AI · 머신러닝",
    image: "https://images.unsplash.com/photo-1759752394243-9a1592d13f14?auto=format&fit=crop&w=900&q=82",
    alt: "노트북으로 코드를 살펴보는 학습 공간"
  },
  2: {
    label: "데이터 분석",
    image: "https://images.unsplash.com/photo-1763568258586-da55ea292766?auto=format&fit=crop&w=900&q=82",
    alt: "데이터 그래프가 표시된 개발 화면"
  },
  3: {
    label: "생성형 AI",
    image: "https://images.unsplash.com/photo-1774901128283-64c62117216a?auto=format&fit=crop&w=900&q=82",
    alt: "코드 편집기와 터미널 화면"
  },
  4: {
    label: "웹 서비스",
    image: "https://images.unsplash.com/photo-1695668548342-c0c1ad479aee?auto=format&fit=crop&w=900&q=82",
    alt: "서버 인프라 장비"
  }
};

function CoursePreview(props) {
  const course = props.course;
  const guide = courseFallback.find(function (item) { return String(item.id) === String(course.id); }) || {};
  const artwork = courseArtworks[Number(course.id)] || courseArtworks[1];

  return h("article", { className: "academy-course-card", "data-category": String(course.category || guide.category || "program").toLowerCase() },
    h(Link, { to: "/courses/" + course.id, className: "academy-course-link" },
      h("div", { className: "academy-course-art" },
        h("img", { src: artwork.image, alt: artwork.alt, loading: "lazy", decoding: "async" }),
        h("span", { className: "academy-course-tag" }, artwork.label)
      ),
      h("div", { className: "academy-course-body" },
        h("h3", null, course.title),
        h("p", null, course.summary || guide.summary),
        h("span", { className: "academy-course-more" }, "자세히 보기", h("b", { "aria-hidden": "true" }, "→"))
      )
    )
  );
}function FloatingWindow(props) {
  return h("div", { className: "academy-float-window " + props.className },
    h("div", { className: "academy-window-head" },
      h("span", null, props.label),
      h("span", { className: "academy-window-dots" }, "•••")
    ),
    props.children
  );
}

export function AcademyScene(props) {
  const variant = props.variant || "default";
  return h("div", {
    className: "academy-scene academy-scene-" + variant,
    "aria-hidden": "true"
  },
    h("div", { className: "academy-scene-grid" }),
    h("div", { className: "academy-scene-glow" }),
    h("div", { className: "academy-scene-orbit orbit-one" }),
    h("div", { className: "academy-scene-orbit orbit-two" }),
    h("div", { className: "academy-scene-orbit orbit-three" }),
    h("div", { className: "academy-scene-cube-stage" },
      h("div", { className: "academy-scene-cube" },
        h("div", { className: "academy-scene-face face-front" }, h("b", null, "IT"), h("span", null, "BUILD")),
        h("div", { className: "academy-scene-face face-back" }, h("b", null, "DATA")),
        h("div", { className: "academy-scene-face face-right" }, h("b", null, "AI")),
        h("div", { className: "academy-scene-face face-left" }, h("b", null, "CODE")),
        h("div", { className: "academy-scene-face face-top" }, h("b", null, "IDEA")),
        h("div", { className: "academy-scene-face face-bottom" }, h("b", null, "SHIP"))
      )
    ),
    h("div", { className: "academy-scene-chip chip-top" }, "SYSTEM / 01"),
    h("div", { className: "academy-scene-chip chip-bottom" }, "DESIGN · BUILD · VERIFY"),
    h("span", { className: "academy-scene-particle particle-one" }),
    h("span", { className: "academy-scene-particle particle-two" }),
    h("span", { className: "academy-scene-particle particle-three" })
  );
}

export function AcademyHome() {
  const [courses, setCourses] = React.useState(courseFallback);
  const [notices, setNotices] = React.useState(previewNotices);
  const [noticeLoading, setNoticeLoading] = React.useState(false);

  React.useEffect(function () {
    const controller = new AbortController();
    api.get("/courses", { signal: controller.signal }).then(function (response) {
      if (Array.isArray(response.data) && response.data.length) setCourses(response.data);
    }).catch(function (requestError) {
      if (requestError.code !== "ERR_CANCELED") {
        // 공개 미리보기에서는 과정 카탈로그를 유지합니다.
      }
    });
    return function () { controller.abort(); };
  }, []);

  React.useEffect(function () {
    if (previewNotices.length) {
      setNotices(previewNotices);
      return undefined;
    }
    const controller = new AbortController();
    setNoticeLoading(!window.location.hostname.endsWith("github.io"));
    if (!window.location.hostname.endsWith("github.io")) {
      api.get("/notices", { signal: controller.signal }).then(function (response) {
        if (Array.isArray(response.data)) setNotices(response.data.slice(0, 4));
      }).catch(function () {
        setNotices([]);
      }).finally(function () {
        if (!controller.signal.aborted) setNoticeLoading(false);
      });
    }
    return function () { controller.abort(); };
  }, []);

  const featuredProjects = [
    {
      id: "momo",
      title: "MOMO 영화 리뷰 커뮤니티",
      category: "웹 서비스",
      description: "영화 탐색과 리뷰 작성, 좋아요·싫어요 반응을 연결한 영화 커뮤니티 프로젝트입니다.",
      stack: "React · Spring Boot · JPA · MySQL",
      image: projectArtwork[1],
      link: "https://github.com/madison-yoon/MOMO",
      linkLabel: "MOMO 프로젝트 보기"
    },
    {
      id: "academy",
      title: "IT ACADEMY 통합 플랫폼",
      category: "교육 플랫폼",
      description: "교육과정, 프로젝트, 공지와 상담 안내를 하나의 웹 경험으로 연결합니다.",
      stack: "React · Spring Boot",
      image: projectArtwork[5],
      link: "https://github.com/madison-yoon/ITEducation"
    },
    {
      id: "lotto",
      title: "AI 로또 분석기",
      category: "데이터·AI",
      description: "회차 데이터 수집과 통계 분석, 여러 예측 모델의 성능 비교를 실험합니다.",
      stack: "Python · Pandas · Scikit-learn",
      image: projectArtwork[2]
    },
    {
      id: "weather",
      title: "날씨 생활 도우미",
      category: "API 연동",
      description: "외부 날씨 API를 연결해 지역별 현재 기상과 예보 정보를 보여줍니다.",
      stack: "React · REST API",
      image: projectArtwork[4]
    }
  ];

  const categoryLabel = function (value) {
    const labels = { "AI": "AI · 머신러닝", "DATA": "데이터 분석", "GEN AI": "생성형 AI", "WEB": "웹 서비스" };
    return labels[value] || value || "교육과정";
  };

  return h(React.Fragment, null,
    h("section", { className: "academy-hero" },
      h("div", { className: "academy-hero-backdrop", "aria-hidden": "true" }),
      h("div", { className: "container academy-hero-layout" },
        h("div", { className: "academy-hero-copy" },
          h("p", { className: "academy-hero-kicker" }, "AI와 함께하는 더 나은 미래"),
          h("h1", null,
            "IT로 만드는",
            h("br"),
            h("span", null, "당신의 새로운 시작")
          ),
          h("p", { className: "academy-hero-description" }, "실무에서 활용되는 기술을 기초부터 프로젝트까지 연결해 학습합니다. 관심 분야와 현재 경험에 맞는 학습 경로를 확인해 보세요."),
          h("div", { className: "academy-hero-actions" },
            h(Link, { to: "/courses", className: "academy-button primary" }, "교육과정 보기", h("span", { "aria-hidden": "true" }, "→")),
            h(Link, { to: "/projects", className: "academy-button secondary" }, "프로젝트 알아보기", h("span", { "aria-hidden": "true" }, "›"))
          )
        ),
        h("div", { className: "academy-hero-visual", "aria-label": "노트북으로 개발을 공부하는 학습 공간" },
          h("img", {
            className: "academy-hero-image",
            src: "https://images.unsplash.com/photo-1759752394243-9a1592d13f14?auto=format&fit=crop&w=1800&q=86",
            alt: "노트북 화면에서 코드를 살펴보는 학습자",
            fetchPriority: "high"
          }),
          h("div", { className: "academy-hologram academy-hologram-code", "aria-hidden": "true" },
            h("span", null, "CODE / 01"),
            h("b", null, "function buildFuture()"),
            h("i", null, "const skill = learn( );"),
            h("i", null, "return create(idea);")
          ),
          h("div", { className: "academy-hologram academy-hologram-future", "aria-hidden": "true" },
            h("span", null, "✧"),
            h("b", null, "Build Your Future")
          ),
          h("div", { className: "academy-hologram academy-hologram-chart", "aria-hidden": "true" },
            h("span", null, "LEARNING PROGRESS"),
            h("div", null, [32, 48, 58, 78, 92].map(function (height, index) {
              return h("i", { key: index, style: { height: height + "%" } });
            }))
          )
        )
      ),
      h("div", { className: "academy-feature-strip" },
        h("div", { className: "container academy-feature-strip-grid" },
          [
            ["커리큘럼 설계", "분야별 기초부터 실습까지", "academy-icon-cap"],
            ["기술 중심 학습", "개념과 구현을 함께 이해", "academy-icon-people"],
            ["프로젝트 경험", "작동하는 결과물과 기록", "academy-icon-building"],
            ["상담 안내", "선수 지식과 운영 정보 확인", "academy-icon-headset"]
          ].map(function (item, index) {
            return h("article", { className: "academy-feature-item", key: item[0] },
              h("span", { className: "academy-feature-icon " + item[2], "aria-hidden": "true" },
                index === 0 ? h("svg", { viewBox: "0 0 32 32" },
                  h("path", { d: "M3 12 16 5l13 7-13 7L3 12Z" }),
                  h("path", { d: "M8 16v7c4 4 12 4 16 0v-7M29 13v9" })
                ) : index === 1 ? h("svg", { viewBox: "0 0 32 32" },
                  h("circle", { cx: "11", cy: "10", r: "4" }),
                  h("circle", { cx: "23", cy: "11", r: "3" }),
                  h("path", { d: "M3 27c0-5 3-8 8-8s8 3 8 8M20 20c5-2 9 1 9 6" })
                ) : index === 2 ? h("svg", { viewBox: "0 0 32 32" },
                  h("path", { d: "M4 27h24M7 27V10h7v17M18 27V5h7v22M20 9h3M20 14h3M9 14h3M9 19h3" })
                ) : h("svg", { viewBox: "0 0 32 32" },
                  h("path", { d: "M5 17v-2a11 11 0 0 1 22 0v2M5 17h4v8H7a2 2 0 0 1-2-2zM27 17h-4v8h2a2 2 0 0 0 2-2zM23 26c-2 3-5 3-8 3" })
                )
              ),
              h("div", null,
                h("h3", null, item[0]),
                h("p", null, item[1])
              )
            );
          })
        )
      )
    ),

    h("section", { className: "academy-program-section" },
      h("div", { className: "container academy-program-layout" },
        h("div", { className: "academy-program-intro" },
          h("p", { className: "academy-section-label" }, "IT ACADEMY"),
          h("h2", null, "다양한 교육과정으로", h("br"), "당신의 성장을 시작하세요"),
          h("p", null, "기초부터 실무까지, 관심 분야와 현재 경험을 기준으로 학습할 과정을 살펴보세요."),
          h(Link, { to: "/courses", className: "academy-section-button" }, "전체 과정 보기", h("span", null, "→"))
        ),
        h("div", { className: "academy-course-grid" },
          courses.slice(0, 4).map(function (course) {
            return h(CoursePreview, { course: course, key: course.id });
          })
        )
      )
    ),

    h("section", { className: "academy-project-showcase" },
      h("div", { className: "container academy-project-showcase-layout" },
        h("div", { className: "academy-showcase-intro" },
          h("p", { className: "academy-section-label" }, "OUR PROJECTS"),
          h("h2", null, "실무를 경험하는", h("br"), "특별한 프로젝트"),
          h("p", null, "배운 것을 직접 구현하고, 결과와 개발 과정을 함께 정리하는 프로젝트 사례를 만나보세요."),
          h(Link, { to: "/projects", className: "academy-section-button" }, "프로젝트 더보기", h("span", null, "→"))
        ),
        h("a", { className: "academy-project-feature", href: featuredProjects[0].link, target: "_blank", rel: "noopener noreferrer" },
          h("div", { className: "academy-project-feature-image" },
            h("img", { src: featuredProjects[0].image, alt: "", loading: "lazy", decoding: "async" }),
            h("span", null, "대표 프로젝트")
          ),
          h("div", { className: "academy-project-feature-copy" },
            h("span", null, "MOVIE REVIEW COMMUNITY"),
            h("h3", null, featuredProjects[0].title),
            h("p", null, featuredProjects[0].description),
            h("small", null, featuredProjects[0].stack),
            h("b", null, "프로젝트 보기 →")
          )
        ),
        h("div", { className: "academy-project-side-list" },
          featuredProjects.slice(1).map(function (project) {
            return h("article", { className: "academy-project-side-item", key: project.id },
              h("div", { className: "academy-project-side-image" },
                h("img", { src: project.image, alt: "", loading: "lazy", decoding: "async" })
              ),
              h("div", null,
                h("span", null, project.category),
                h("h3", null, project.title),
                h("p", null, project.description)
              ),
              h(Link, { to: "/projects", "aria-label": project.title + " 사례 더 보기" }, "→")
            );
          })
        )
      )
    ),

    h("section", { className: "academy-home-information" },
      h("div", { className: "container academy-home-information-grid" },
        h("section", { className: "academy-home-notices" },
          h("div", { className: "academy-home-card-heading" },
            h("h2", null, "공지사항"),
            h(Link, { to: "/notices" }, "더보기 →")
          ),
          noticeLoading ? h("p", { className: "academy-home-empty", role: "status" }, "공지사항을 확인하고 있습니다.") :
          notices.length ? h("ul", null, notices.slice(0, 4).map(function (notice) {
            return h("li", { key: notice.id },
              h(Link, { to: "/notices/" + notice.id },
                h("span", { className: "academy-home-notice-dot", "aria-hidden": "true" }),
                h("strong", null, notice.title),
                h("time", null, notice.createdAt ? new Date(notice.createdAt).toLocaleDateString("ko-KR") : "")
              )
            );
          })) : h("div", { className: "academy-home-empty" },
            h("p", null, "현재 공개된 공지사항이 없습니다."),
            h("span", null, "확정된 운영 안내가 등록되면 이곳에서 확인할 수 있습니다."),
            h(Link, { to: "/notices" }, "공지사항 확인 →")
          )
        ),
        h("section", { className: "academy-home-consultation" },
          h("div", null,
            h("p", { className: "academy-section-label" }, "상담 안내"),
            h("h2", null, "관심 분야에 맞는", h("br"), "학습 방향을 확인하세요"),
            h("p", null, "과정별 학습 범위와 선수 지식, 실제 운영 조건을 확인할 수 있습니다."),
            h(Link, { to: "/consultation", className: "academy-section-button" }, "상담 안내 보기", h("span", null, "→"))
          ),
          h("img", {
            src: "https://images.pexels.com/photos/7709145/pexels-photo-7709145.jpeg?auto=compress&dpr=1&h=750&w=1260",
            alt: "헤드셋을 착용하고 상담 업무를 하는 사람",
            loading: "lazy",
            decoding: "async"
          })
        )
      )
    ),

    h("section", { className: "academy-final-cta" },
      h("div", { className: "container academy-final-cta-inner" },
        h("div", null,
          h("p", { className: "academy-section-label" }, "IT ACADEMY"),
          h("h2", null, "IT ACADEMY와 함께하세요"),
          h("p", null, "지금 관심 있는 기술과 앞으로 만들고 싶은 결과부터 살펴보세요.")
        ),
        h(Link, { to: "/courses", className: "academy-button primary" }, "교육과정 보기", h("span", null, "→"))
      )
    )
  );
}

export function AcademyAbout() {
  const principles = [
    ["01", "원리 중심", "문법과 도구의 사용법을 익히는 데서 끝나지 않습니다. 개념이 문제 해결에 어떤 역할을 하는지 설명하고 작은 실습으로 확인합니다.", ["핵심 개념 노트", "직접 작성하는 코드", "오류 원인 기록"]],
    ["02", "프로젝트 중심", "기능 목록을 받아 구현하는 방식이 아닙니다. 사용자와 문제를 정의하고 요구사항·화면·데이터·API를 연결해 결과를 완성합니다.", ["요구사항 명세", "화면·DB·API 설계", "통합 결과물"]],
    ["03", "AI 책임 활용", "AI 도구는 학습과 개발을 돕는 조력자입니다. 생성 결과를 이해하고 검증하며 사용 범위와 수정 근거를 기록하는 습관을 기릅니다.", ["AI 사용 기록", "코드 리뷰", "테스트 증거"]],
    ["04", "피드백 반복", "한 번에 완성하는 것을 목표로 하지 않습니다. 동작 확인, 피드백, 수정, 회고를 반복하며 결과물의 품질을 높입니다.", ["단계별 점검", "개선 이력", "회고 문서"]]
  ];

  return h("section", { className: "academy-subpage" },
    h("div", { className: "academy-subpage-hero" },
      h("div", { className: "container academy-subpage-hero-grid" },
        h("div", null,
          h(Eyebrow, { light: true }, "ABOUT IT ACADEMY"),
          h("h1", null, "교육의 결과는", h("br"), h("span", null, "설명할 수 있는 실력"), "이어야 합니다."),
          h("p", null, "IT ACADEMY는 AI·데이터·소프트웨어 기술을 실제 문제 해결 역량으로 연결하는 교육 경험을 설계합니다. 학습자는 코드를 작성하는 것에서 한 걸음 더 나아가 설계 이유와 검증 결과를 설명하는 개발자로 성장하는 것을 목표로 합니다.")
        ),
        h("div", { className: "academy-about-visual", "aria-hidden": "true" },
          h("div", { className: "about-visual-ring" }),
          h("div", { className: "about-visual-core" }, h("b", null, "THINK"), h("span", null, "BUILD"), h("i", null, "PROVE")),
          h("span", { className: "about-visual-label label-one" }, "ENGINEERING"),
          h("span", { className: "about-visual-label label-two" }, "AI LITERACY")
        )
      )
    ),
    h("div", { className: "container academy-about-content" },
      h(SectionHeading, {
        label: "EDUCATION PRINCIPLES",
        title: "교육 설계의 네 가지 기준",
        description: "기술 변화에 흔들리지 않는 학습 기준을 세우고 각 단계의 산출물로 진도를 확인합니다."
      }),
      h("div", { className: "academy-principle-grid" },
        principles.map(function (item) {
          return h("article", { className: "academy-principle-card", key: item[0] },
            h("span", null, item[0]),
            h("h2", null, item[1]),
            h("p", null, item[2]),
            h("ul", null, item[3].map(function (output) { return h("li", { key: output }, output); }))
          );
        })
      ),
      h("section", { className: "academy-education-loop" },
        h(SectionHeading, { label: "FEEDBACK LOOP", title: "학습을 결과물로 바꾸는 반복 구조", description: "각 단계의 산출물은 다음 단계의 입력이 됩니다. 이해하지 못한 채 다음 단원으로 넘어가지 않도록 점검 기준을 둡니다." }),
        h("div", { className: "academy-loop-grid" },
          learningSteps.map(function (step, index) {
            return h("article", { key: step[0] },
              h("b", null, step[0]),
              h("h3", null, step[1]),
              h("p", null, step[2]),
              h("small", null, "산출물: " + step[3]),
              index < learningSteps.length - 1 ? h("span", { className: "academy-loop-arrow", "aria-hidden": "true" }, "→") : null
            );
          })
        )
      ),
      h("section", { className: "academy-ai-policy" },
        h("div", null,
          h(Eyebrow, null, "RESPONSIBLE AI COLLABORATION"),
          h("h2", null, "AI 활용을 금지하거나 무조건 신뢰하지 않습니다."),
          h("p", null, "AI 도구를 사용한 작업은 사용 목적, 핵심 프롬프트, 생성 결과의 수정 사항, 검증 방법을 기록하도록 설계합니다. 학습자는 제출한 코드의 주요 흐름과 의존성을 직접 설명할 수 있어야 합니다.")
        ),
        h("div", { className: "academy-policy-checklist" },
          ["요구사항과 AI 사용 범위 기록", "생성 코드의 출처·라이선스 확인", "입력값·권한·개인정보 위험 점검", "핵심 기능의 자동·수동 테스트", "직접 설명할 수 없는 코드는 제출 전 재검토"].map(function (item, index) {
            return h("div", { key: item }, h("b", null, "0" + (index + 1)), h("span", null, item));
          })
        )
      ),
      h("section", { className: "academy-about-completion" },
        h(SectionHeading, {
          label: "DEFINITION OF DONE",
          title: "다음 단계로 넘어가기 전에 확인하는 기준",
          description: "학습을 완료했다고 판단하는 기준을 결과물 중심으로 공개합니다. 아래 항목은 교육 설계를 위한 점검 프레임이며, 개별 운영 과정의 제공 범위는 상담과 확정 공지에서 확인해야 합니다."
        }),
        h("div", { className: "academy-about-completion-grid" },
          [
            ["01", "설명할 수 있는가", "핵심 개념, 데이터 흐름, 선택한 기술의 역할을 자신의 언어로 설명합니다."],
            ["02", "다시 실행할 수 있는가", "설치·실행 절차와 입력 데이터를 정리해 다른 환경에서도 결과를 재현합니다."],
            ["03", "실패를 다루는가", "빈 값·잘못된 입력·권한 오류·외부 API 실패 등 정상 밖의 조건을 확인합니다."],
            ["04", "근거를 남겼는가", "요구사항, 코드 변경, 테스트 결과, 수정 이유가 서로 연결되어 있습니다."],
            ["05", "한계를 아는가", "미구현 범위, 데이터의 한계, 측정하지 못한 품질을 결과와 구분해 설명합니다."]
          ].map(function (item) {
            return h("article", { key: item[0] },
              h("span", null, item[0]),
              h("h3", null, item[1]),
              h("p", null, item[2])
            );
          })
        )
      ),
      h("section", { className: "academy-about-cta" },
        h("div", null, h("h2", null, "학습 목표와 현재 수준을 먼저 점검하세요."), h("p", null, "상담을 통해 과정의 선수 지식과 실습 범위, 준비 방향을 확인할 수 있습니다.")),
        h(Link, { to: "/consultation", className: "academy-button primary" }, "상담 신청", h("span", null, "↗"))
      )
    )
  );
}

export function AcademyProjects() {
  const [category, setCategory] = React.useState("전체");
  const [projects, setProjects] = React.useState(projectFallback);
  const [selected, setSelected] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const dialogRef = React.useRef(null);
  const triggerRef = React.useRef(null);

  React.useEffect(function () {
    const controller = new AbortController();
    api.get("/projects", { signal: controller.signal }).then(function (response) {
      if (Array.isArray(response.data) && response.data.length) setProjects(response.data);
    }).catch(function (requestError) {
      if (requestError.code !== "ERR_CANCELED") {
        // API가 준비되지 않은 환경에서는 교육 설계 예시를 유지합니다.
      }
    }).finally(function () {
      if (!controller.signal.aborted) setLoading(false);
    });
    return function () { controller.abort(); };
  }, []);

  React.useEffect(function () {
    if (!selected) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const dialog = dialogRef.current;
    const focusable = dialog
      ? Array.from(dialog.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ))
      : [];

    if (focusable.length) focusable[0].focus();

    function manageDialogKeyboard(event) {
      if (event.key === "Escape") {
        setSelected(null);
        return;
      }

      if (event.key !== "Tab" || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", manageDialogKeyboard);
    return function () {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", manageDialogKeyboard);
      if (triggerRef.current && triggerRef.current.isConnected) {
        triggerRef.current.focus({ preventScroll: true });
      }
    };
  }, [selected]);

  const categories = ["전체"].concat(Array.from(new Set(projects.map(function (item) { return item.category; }))));
  const visible = projects.filter(function (item) { return category === "전체" || item.category === category; });

  return h("section", { className: "academy-subpage academy-projects-page" },
    h("div", { className: "academy-projects-hero" },
      h("div", { className: "container academy-projects-hero-inner" },
        h("div", null,
          h(Eyebrow, { light: true }, "CAPSTONE PROJECT STUDIO"),
          h("h1", null, "결과물보다 먼저,", h("br"), h("span", null, "문제 해결의 증거"), "를 만듭니다."),
          h("p", null, "프로젝트는 포트폴리오를 채우기 위한 과제가 아닙니다. 실제 사용자 문제를 정의하고, 기술적 선택을 설명하고, 테스트 결과로 완성도를 증명하는 종합 실습입니다.")
        ),
        h(AcademyScene, { variant: "projects" })
      )
    ),
    h("div", { className: "container academy-projects-content" },
      h("div", { className: "academy-project-summary" },
        h("div", null,
          h("strong", null, String(projects.length).padStart(2, "0")),
          h("span", null, "프로젝트 설계 사례")
        ),
        h("p", null, loading ? "프로젝트 정보를 불러오고 있습니다." : "아래 프로젝트는 학습 흐름을 설명하기 위한 예시입니다. 실제 수강생 결과물이나 운영 실적이 아닙니다.")
      ),
      h("div", { className: "academy-project-toolbar" },
        h("div", { className: "academy-project-filters", role: "group", "aria-label": "프로젝트 분야 필터" },
          categories.map(function (item) {
            return h("button", {
              type: "button",
              key: item,
              className: category === item ? "active" : "",
              "aria-pressed": category === item,
              onClick: function () { setCategory(item); }
            }, item);
          })
        ),
        h("span", { className: "academy-project-count" }, String(visible.length).padStart(2, "0") + " PROJECTS")
      ),
      h("div", { className: "academy-project-grid" },
        visible.map(function (project, index) {
          const artwork = getProjectArtwork(project);
          const blueprint = getProjectBlueprint(project);
          return h("article", { className: "academy-project-card", key: project.id || project.title },
            h("button", { type: "button", className: "academy-project-open", onClick: function (event) { triggerRef.current = event.currentTarget; setSelected(project); }, "aria-haspopup": "dialog", "aria-label": project.title + " 상세 보기" },
              h("div", { className: "academy-project-art project-art-" + ((index % 6) + 1) + (artwork ? " has-project-image" : ""), "aria-hidden": "true" },
                artwork ? h("img", { className: "academy-project-image", src: artwork, alt: "", loading: "lazy" }) : null,
                h("div", { className: "project-art-grid" }),
                h("div", { className: "project-art-object" }),
                h("span", null, String(project.id || index + 1).padStart(2, "0")),
                h("small", null, (project.category || "PROJECT").toUpperCase())
              ),
              h("div", { className: "academy-project-card-body" },
                h("div", { className: "academy-project-meta" }, h("span", null, project.category), h("span", null, "교육 설계 예시")),
                h("h2", null, project.title),
                h("p", null, project.description),
                h("p", { className: "academy-project-card-focus" }, blueprint.focus),
                h("div", { className: "academy-project-stack" }, (project.stack || []).slice(0, 4).map(function (tech) { return h("span", { key: tech }, tech); })),
                h("div", { className: "academy-project-card-foot" }, h("span", null, "설계 · 구현 · 테스트"), h("b", null, "상세 보기 ↗"))
              )
            )
          );
        })
      ),
      h("p", { className: "academy-honesty-note" }, "실제 수강생 작품, 수상 이력, 취업률로 오인되지 않도록 예시 프로젝트임을 명시합니다. 운영기관의 검증된 실적 자료가 확보되면 해당 자료와 구분해 게시할 수 있습니다."),
      h("section", { className: "academy-project-learning" },
        h("div", null,
          h("span", { className: "academy-eyebrow" }, "프로젝트 학습 흐름"),
          h("h2", null, "작은 단계로 완성하고, 과정을 설명합니다."),
          h("p", null, "프로젝트별 세부 방법은 다르지만 문제를 이해하고 설계한 뒤 구현·검증·정리하는 흐름을 공통으로 연습합니다.")
        ),
        h("ol", null,
          [
            ["문제 이해", "누가 어떤 상황에서 어려움을 겪는지 구체화합니다."],
            ["구현 설계", "데이터, 화면, 기능의 범위와 완료 조건을 정리합니다."],
            ["기능 구현", "작은 단위로 만들고 실행하면서 통합합니다."],
            ["검증과 정리", "오류와 한계를 확인하고 실행·시연 자료로 정리합니다."]
          ].map(function (step, index) {
            return h("li", { key: step[0] },
              h("span", null, "0" + (index + 1)),
              h("div", null, h("h3", null, step[0]), h("p", null, step[1]))
            );
          })
        )
      ),
      h("section", { className: "academy-project-cta" },
        h("div", null, h("h2", null, "프로젝트를 통해 어떤 역량을 증명할지 설계하세요."), h("p", null, "관심 분야와 목표에 맞는 교육과정을 상담에서 확인할 수 있습니다.")),
        h(Link, { to: "/consultation", className: "academy-button primary" }, "교육과정 상담", h("span", null, "↗"))
      )
    ),
    selected ? h("div", { className: "academy-project-modal-backdrop", role: "presentation", onMouseDown: function (event) { if (event.target === event.currentTarget) setSelected(null); } },
      h("article", { ref: dialogRef, className: "academy-project-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "academy-project-modal-title", "aria-describedby": "academy-project-modal-description", tabIndex: -1 },
        h("button", { type: "button", className: "academy-modal-close", onClick: function () { setSelected(null); }, "aria-label": "상세 창 닫기" }, "×"),
        h("p", { className: "academy-modal-kicker" }, (selected.category || "프로젝트") + " · 교육 설계 예시"),
        getProjectArtwork(selected) ? h("div", { className: "academy-modal-art" },
          h("img", { src: getProjectArtwork(selected), alt: "", loading: "lazy" })
        ) : null,
        h("h2", { id: "academy-project-modal-title" }, selected.title),
        h("p", { id: "academy-project-modal-description", className: "academy-modal-lead" }, selected.description),
        h("div", { className: "academy-modal-facts" },
          h("div", null, h("small", null, "프로젝트 분야"), h("b", null, selected.category || "교육 설계 예시")),
          h("div", null, h("small", null, "사례 성격"), h("b", null, "교육 설계 예시")),
          h("div", null, h("small", null, "학습 초점"), h("b", null, getProjectBlueprint(selected).focus))
        ),
        h("div", { className: "academy-modal-section-grid" },
          h("section", null, h("h3", null, "01 · 해결할 문제"), h("p", null, selected.problem || "사용자 문제와 해결 목표를 정의합니다.")),
          h("section", null, h("h3", null, "02 · 설계 접근"), h("p", null, selected.solution || "데이터·기술·사용자 흐름을 고려해 구현합니다.")),
          h("section", null, h("h3", null, "03 · 주요 기능"), h("ul", null, (selected.features || []).map(function (item) { return h("li", { key: item }, item); }))),
          h("section", null, h("h3", null, "04 · 평가 포인트"), h("ul", null, (selected.evaluationPoints || []).map(function (item) { return h("li", { key: item }, item); })))
        ),
        h("section", { className: "academy-modal-workflow" },
          h("h3", null, "구현 흐름"),
          h("p", { className: "academy-modal-architecture" }, getProjectBlueprint(selected).architecture),
          h("div", { className: "academy-modal-workflow-grid" },
            getProjectBlueprint(selected).workflow.map(function (step) {
              return h("article", { key: step[0] },
                h("span", null, step[0]),
                h("b", null, step[1]),
                h("p", null, step[2])
              );
            })
          )
        ),
        h("div", { className: "academy-modal-section-grid academy-modal-review-grid" },
          h("section", null,
            h("h3", null, "완료 기준"),
            h("ul", null, getProjectBlueprint(selected).completion.map(function (item) { return h("li", { key: item }, item); }))
          ),
          h("section", null,
            h("h3", null, "데이터·품질 통제"),
            h("ul", null, getProjectBlueprint(selected).controls.map(function (item) { return h("li", { key: item }, item); }))
          )
        ),
        h("div", { className: "academy-modal-deliverables" },
          h("h3", null, "제출 산출물"),
          h("div", null, (selected.deliverables || []).map(function (item) { return h("span", { key: item }, item); }))
        ),
        h("div", { className: "academy-modal-stack" },
          h("h3", null, "기술 스택"),
          h("div", null, (selected.stack || []).map(function (item) { return h("span", { key: item }, item); }))
        ),
        h("div", { className: "academy-modal-result" }, h("b", null, "학습 결과 예시"), h("p", null, selected.result || "구현 결과와 검증 근거를 포트폴리오로 정리합니다.")),
        h(Link, { to: "/consultation", className: "academy-button primary", onClick: function () { setSelected(null); } }, "관련 교육과정 상담하기", h("span", null, "↗"))
      )
    ) : null
  );
}
