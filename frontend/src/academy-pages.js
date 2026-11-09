import React from "react";
import { Link } from "react-router-dom";
import api from "./api.js";

const h = React.createElement;

const courseFallback = [
  { id: 1, title: "AI·머신러닝 실무 개발자 과정", category: "AI", duration: "운영 정보 확인", recruitmentStatus: "모집 정보 확인", summary: "데이터 분석부터 모델 평가와 서비스 적용까지 학습합니다." },
  { id: 2, title: "빅데이터 분석 전문가 과정", category: "DATA", duration: "운영 정보 확인", recruitmentStatus: "모집 정보 확인", summary: "데이터 수집·정제·분석·시각화를 하나의 흐름으로 연결합니다." },
  { id: 3, title: "생성형 AI 서비스 개발 과정", category: "GEN AI", duration: "운영 정보 확인", recruitmentStatus: "모집 정보 확인", summary: "LLM, 임베딩, 검색 증강 생성으로 AI 서비스를 설계합니다." },
  { id: 4, title: "AI 기반 웹 서비스 개발 과정", category: "WEB", duration: "운영 정보 확인", recruitmentStatus: "모집 정보 확인", summary: "프론트엔드·백엔드·데이터베이스를 연결해 서비스를 구현합니다." }
];

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

const learningSteps = [
  ["01", "문제 정의", "사용자와 해결할 문제를 조사하고 요구사항을 문서로 고정합니다.", "요구사항 명세 · 사용자 흐름"],
  ["02", "기초 원리", "문법과 프레임워크를 암기하는 데서 멈추지 않고 작동 원리를 실습합니다.", "개념 노트 · 단계별 과제"],
  ["03", "AI 협업", "AI가 만든 결과를 읽고 근거를 확인하며 직접 수정하는 습관을 훈련합니다.", "프롬프트 기록 · 변경 이력"],
  ["04", "제품 구현", "화면·서버·데이터를 연결하고 실제 사용자 흐름을 완성합니다.", "통합 기능 · API · DB"],
  ["05", "검증과 발표", "테스트와 리뷰로 품질을 확인하고 결과와 한계를 설명합니다.", "테스트 리포트 · 시연 · 회고"]
];

const assessment = [
  ["문제 정의와 요구사항", 15, "사용자·문제·완료 조건이 명확한가"],
  ["설계와 데이터 구조", 15, "화면 흐름·API·데이터 모델이 일관적인가"],
  ["구현과 코드 품질", 20, "기능이 동작하고 변경하기 쉬운 구조인가"],
  ["테스트와 신뢰성", 20, "핵심 시나리오·예외·보안 조건을 검증했는가"],
  ["사용성·접근성", 10, "누구나 이해하고 사용할 수 있는가"],
  ["협업과 버전 관리", 10, "이슈·브랜치·리뷰·작업 기록이 남아 있는가"],
  ["문서와 발표", 10, "설치·실행·시연·한계를 재현 가능하게 설명하는가"]
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

function CoursePreview(props) {
  const course = props.course;
  return h("article", { className: "academy-course-card" },
    h("div", { className: "academy-course-top" },
      h("span", { className: "academy-course-code" }, String(course.category || "PROGRAM").toUpperCase()),
      h("span", { className: "academy-status" }, course.recruitmentStatus || "과정 안내")
    ),
    h("h3", null, course.title),
    h("p", null, course.summary || course.description || "기초 개념부터 프로젝트까지 단계적으로 학습합니다."),
    h("div", { className: "academy-course-foot" },
      h("span", null, course.duration || "교육 기간 상담"),
      h(Link, { to: "/courses/" + course.id }, "과정 구조 보기")
    )
  );
}

function FloatingWindow(props) {
  return h("div", { className: "academy-float-window " + props.className },
    h("div", { className: "academy-window-head" },
      h("span", null, props.label),
      h("span", { className: "academy-window-dots" }, "•••")
    ),
    props.children
  );
}

export function AcademyHome() {
  const [courses, setCourses] = React.useState(courseFallback);

  React.useEffect(function () {
    let active = true;
    api.get("/courses").then(function (response) {
      if (active && Array.isArray(response.data) && response.data.length) setCourses(response.data);
    }).catch(function () {});
    return function () { active = false; };
  }, []);

  return h(React.Fragment, null,
    h("section", { className: "academy-hero" },
      h("div", { className: "academy-hero-noise", "aria-hidden": "true" }),
      h("div", { className: "container academy-hero-layout" },
        h("div", { className: "academy-hero-copy" },
          h("div", { className: "academy-hero-kicker" },
            h("span", { className: "academy-live-dot" }),
            "ENGINEERING EDUCATION · BUILT FOR THE AI ERA"
          ),
          h("h1", null,
            "AI를 사용하는 사람에서",
            h("br"),
            h("span", null, "AI로 결과를 만드는 개발자로.")
          ),
          h("p", null, "기초 원리를 이해하고, AI와 협업하며, 실제로 작동하는 제품을 완성합니다. IT ACADEMY는 문제 정의부터 구현·검증·발표까지 연결하는 프로젝트 중심 학습을 설계합니다."),
          h("div", { className: "academy-hero-actions" },
            h(Link, { to: "/courses", className: "academy-button primary" }, "교육과정 탐색", h("span", null, "↗")),
            h(Link, { to: "/consultation", className: "academy-button secondary" }, "학습 방향 상담")
          ),
          h("div", { className: "academy-hero-proof" },
            h("div", null, h("b", null, "원리"), h("span", null, "WHY BEFORE HOW")),
            h("div", null, h("b", null, "실습"), h("span", null, "BUILD WITH PURPOSE")),
            h("div", null, h("b", null, "검증"), h("span", null, "TEST WHAT YOU BUILD"))
          )
        ),
        h("div", { className: "academy-hero-visual", "aria-hidden": "true" },
          h("div", { className: "academy-visual-grid" }),
          h("div", { className: "academy-orbit orbit-a" }),
          h("div", { className: "academy-orbit orbit-b" }),
          h("div", { className: "academy-orbit orbit-c" }),
          h("div", { className: "academy-cube-scene" },
            h("div", { className: "academy-cube" },
              h("div", { className: "cube-face cube-front" }, h("small", null, "IT"), h("strong", null, "BUILD"), h("span", null, "01 / CREATE")),
              h("div", { className: "cube-face cube-back" }, h("strong", null, "DATA")),
              h("div", { className: "cube-face cube-right" }, h("strong", null, "AI")),
              h("div", { className: "cube-face cube-left" }, h("strong", null, "CODE")),
              h("div", { className: "cube-face cube-top" }, h("strong", null, "IDEA")),
              h("div", { className: "cube-face cube-bottom" }, h("strong", null, "SHIP"))
            )
          ),
          h(FloatingWindow, { className: "float-top", label: "BUILD PIPELINE" },
            h("div", { className: "academy-pipeline" },
              h("span", null, "PLAN"), h("i", null, "→"), h("span", null, "BUILD"), h("i", null, "→"), h("span", null, "VERIFY")
            )
          ),
          h(FloatingWindow, { className: "float-bottom", label: "QUALITY SIGNAL" },
            h("div", { className: "academy-quality-line" }, h("b", null, "TEST"), h("span", null, "PASS"), h("i", null)),
            h("div", { className: "academy-quality-line" }, h("b", null, "REVIEW"), h("span", null, "CHECKED"), h("i", null))
          ),
          h("span", { className: "academy-visual-caption" }, "LEARN · BUILD · VALIDATE")
        )
      ),
      h("div", { className: "academy-hero-bottom" },
        h("div", { className: "container academy-hero-bottom-inner" },
          h("span", null, "FROM FIRST PRINCIPLE"),
          h("i", null),
          h("span", null, "TO WORKING PRODUCT"),
          h("i", null),
          h("span", null, "WITH PROVABLE QUALITY")
        )
      )
    ),

    h("section", { className: "academy-truth-strip" },
      h("div", { className: "container academy-truth-grid" },
        h("div", null, h("strong", null, "01"), h("b", null, "이해"), h("span", null, "코드가 왜 동작하는지 설명합니다.")),
        h("div", null, h("strong", null, "02"), h("b", null, "구현"), h("span", null, "기능을 작은 단위로 완성합니다.")),
        h("div", null, h("strong", null, "03"), h("b", null, "검증"), h("span", null, "테스트와 근거로 품질을 확인합니다.")),
        h("div", null, h("strong", null, "04"), h("b", null, "공유"), h("span", null, "문서와 발표로 결과를 전달합니다."))
      )
    ),

    h("section", { className: "academy-section academy-method-section" },
      h("div", { className: "container" },
        h(SectionHeading, {
          label: "LEARNING SYSTEM",
          title: "수업은 지식 전달에서 끝나지 않습니다.",
          description: "학습자가 직접 설명하고, 만들고, 오류를 수정하고, 결과를 증명하는 순서로 수업을 설계합니다."
        }),
        h("div", { className: "academy-method-grid" },
          learningSteps.map(function (item, index) {
            return h("article", { className: "academy-method-card", key: item[0] },
              h("div", { className: "academy-method-number" }, item[0]),
              h("div", { className: "academy-method-marker" }, index === 2 ? "AI × HUMAN" : "LEARNING PHASE"),
              h("h3", null, item[1]),
              h("p", null, item[2]),
              h("div", { className: "academy-method-output" }, h("span", null, "OUTPUT"), h("b", null, item[3]))
            );
          })
        )
      )
    ),

    h("section", { className: "academy-section academy-program-section" },
      h("div", { className: "container" },
        h("div", { className: "academy-section-header-row" },
          h(SectionHeading, {
            label: "PROGRAM ARCHITECTURE",
            title: "관심 분야를 전문 역량으로 연결합니다.",
            description: "각 과정은 핵심 기술 학습과 실습 과제, 통합 프로젝트, 결과 검증으로 이어집니다."
          }),
          h(Link, { to: "/courses", className: "academy-text-link" }, "전체 교육과정 보기 ↗")
        ),
        h("div", { className: "academy-course-grid" },
          courses.slice(0, 4).map(function (course) {
            return h(CoursePreview, { course: course, key: course.id });
          })
        ),
        h("p", { className: "academy-data-note" }, "※ 표시된 커리큘럼은 교육 설계 예시입니다. 개강일·기간·정원·교육비·지원 자격은 운영기관 확인 후 공개됩니다.")
      )
    ),

    h("section", { className: "academy-vibe-section" },
      h("div", { className: "container academy-vibe-layout" },
        h("div", { className: "academy-vibe-copy" },
          h(Eyebrow, { light: true }, "VIBE CODING, WITH ENGINEERING DISCIPLINE"),
          h("h2", null, "AI가 코드를 작성해도, 품질에 대한 책임은 개발자에게 있습니다."),
          h("p", null, "프롬프트를 잘 쓰는 것만으로는 제품이 완성되지 않습니다. 생성된 코드의 구조를 읽고, 보안과 예외를 점검하고, 테스트를 통과시키고, 왜 그렇게 구현했는지 설명할 수 있어야 합니다."),
          h("div", { className: "academy-vibe-points" },
            h("div", null, h("b", null, "01"), h("span", null, "요구사항을 작업 단위로 나누기")),
            h("div", null, h("b", null, "02"), h("span", null, "AI 생성 코드의 흐름과 의존성 읽기")),
            h("div", null, h("b", null, "03"), h("span", null, "테스트·리뷰·보안으로 결과 검증하기"))
          ),
          h(Link, { to: "/projects", className: "academy-button light-button" }, "프로젝트 평가 기준 보기", h("span", null, "↗"))
        ),
        h("div", { className: "academy-vibe-console" },
          h("div", { className: "academy-console-top" },
            h("span", null, "AI-ASSISTED DEVELOPMENT"),
            h("b", null, "WORKFLOW / 05")
          ),
          h("div", { className: "academy-console-code" },
            h("div", { className: "academy-code-line muted" }, h("span", null, "01"), " // AI가 만든 결과를 그대로 제출하지 않는다."),
            h("div", { className: "academy-code-line" }, h("span", null, "02"), h("b", null, "const"), " requirement = ", h("em", null, "understand(problem);")),
            h("div", { className: "academy-code-line" }, h("span", null, "03"), h("b", null, "const"), " draft = ", h("em", null, "collaborateWithAI();")),
            h("div", { className: "academy-code-line active" }, h("span", null, "04"), h("b", null, "const"), " quality = ", h("em", null, "verify(draft);")),
            h("div", { className: "academy-code-line" }, h("span", null, "05"), h("b", null, "const"), " release = ", h("em", null, "document(quality);"))
          ),
          h("div", { className: "academy-console-checks" },
            h("div", null, h("span", { className: "check-mark" }, "✓"), h("span", null, "요구사항 추적"), h("b", null, "TRACEABLE")),
            h("div", null, h("span", { className: "check-mark" }, "✓"), h("span", null, "테스트 증거"), h("b", null, "VERIFIED")),
            h("div", null, h("span", { className: "check-mark" }, "✓"), h("span", null, "사람의 코드 리뷰"), h("b", null, "REVIEWED"))
          )
        )
      )
    ),

    h("section", { className: "academy-section academy-project-section" },
      h("div", { className: "container" },
        h("div", { className: "academy-section-header-row" },
          h(SectionHeading, {
            label: "CAPSTONE & PORTFOLIO",
            title: "작품이 아니라, 문제 해결 과정을 보여줍니다.",
            description: "프로젝트 결과 화면뿐 아니라 요구사항, 설계, 코드, 테스트, 협업 기록까지 포트폴리오의 근거로 정리합니다."
          }),
          h(Link, { to: "/projects", className: "academy-text-link" }, "프로젝트 갤러리 ↗")
        ),
        h("div", { className: "academy-feature-projects" },
          projectFallback.slice(0, 3).map(function (project, index) {
            return h(Link, { to: "/projects", className: "academy-feature-project", key: project.id },
              h("div", { className: "academy-feature-art art-" + (index + 1), "aria-hidden": "true" },
                h("div", { className: "feature-art-glass" }),
                h("div", { className: "feature-art-orbit" }),
                h("span", null, "0" + project.id)
              ),
              h("div", { className: "academy-feature-project-copy" },
                h("small", null, project.category + " · " + project.duration),
                h("h3", null, project.title),
                h("p", null, project.description),
                h("span", null, "프로젝트 설계 보기 ↗")
              )
            );
          })
        ),
        h("p", { className: "academy-data-note" }, "※ 표시된 프로젝트는 교육 설계 예시입니다. 실제 수강생 작품·운영 실적·취업 성과로 오인되지 않도록 구분합니다.")
      )
    ),

    h("section", { className: "academy-assessment-section" },
      h("div", { className: "container academy-assessment-layout" },
        h("div", null,
          h(Eyebrow, { light: true }, "TRANSPARENT PROJECT REVIEW"),
          h("h2", null, "좋은 프로젝트는 작동하는 화면만으로 평가하지 않습니다."),
          h("p", null, "평가 기준을 미리 공개하고 결과물과 개발 과정을 함께 확인하도록 설계합니다. 아래 배점은 교육 프로젝트에 적용할 수 있는 공통 평가안입니다.")
        ),
        h("div", { className: "academy-assessment-card" },
          h("div", { className: "academy-assessment-card-head" }, h("span", null, "PROJECT SCORE FRAMEWORK"), h("b", null, "100 PTS")),
          assessment.map(function (item) {
            return h("div", { className: "academy-score-row", key: item[0] },
              h("div", { className: "academy-score-label" }, h("b", null, item[0]), h("strong", null, item[1] + "점")),
              h("div", { className: "academy-score-track" }, h("span", { style: { width: item[1] + "%" } })),
              h("small", null, item[2])
            );
          }),
          h("p", { className: "academy-assessment-note" }, "평가표는 프로젝트 유형과 교육 운영 방침에 따라 조정할 수 있습니다.")
        )
      )
    ),

    h("section", { className: "academy-final-cta" },
      h("div", { className: "container academy-final-cta-inner" },
        h("div", null,
          h(Eyebrow, { light: true }, "DESIGN YOUR NEXT STEP"),
          h("h2", null, "지금의 수준보다, 다음에 만들 수 있는 결과를 설계합니다."),
          h("p", null, "현재 경험과 목표를 바탕으로 적합한 과정과 준비 순서를 확인하세요.")
        ),
        h(Link, { to: "/consultation", className: "academy-button primary" }, "교육 상담 시작하기", h("span", null, "↗"))
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
    let active = true;
    api.get("/projects").then(function (response) {
      if (active && Array.isArray(response.data) && response.data.length) setProjects(response.data);
    }).catch(function () {
      // API가 준비되지 않은 로컬 환경에서는 동일한 교육 설계 예시를 표시합니다.
    }).finally(function () {
      if (active) setLoading(false);
    });
    return function () { active = false; };
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
        h("div", { className: "academy-project-orb", "aria-hidden": "true" },
          h("div", { className: "project-orb-ring ring-one" }),
          h("div", { className: "project-orb-ring ring-two" }),
          h("div", { className: "project-orb-core" }, h("b", null, "BUILD"), h("span", null, "WITH EVIDENCE"))
        )
      )
    ),
    h("div", { className: "container academy-projects-content" },
      h("div", { className: "academy-project-summary" },
        h("div", null, h("strong", null, String(projects.length).padStart(2, "0")), h("span", null, "교육 설계 사례")),
        h("div", null, h("strong", null, "100"), h("span", null, "점 평가 프레임워크")),
        h("div", null, h("strong", null, "E2E"), h("span", null, "기획부터 검증까지")),
        h("p", null, loading ? "프로젝트 정보를 불러오고 있습니다." : "※ 모든 프로젝트는 교육 설계를 위한 예시입니다.")
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
          return h("article", { className: "academy-project-card", key: project.id || project.title },
            h("button", { type: "button", className: "academy-project-open", onClick: function (event) { triggerRef.current = event.currentTarget; setSelected(project); }, "aria-haspopup": "dialog", "aria-label": project.title + " 상세 보기" },
              h("div", { className: "academy-project-art project-art-" + ((index % 6) + 1), "aria-hidden": "true" },
                h("div", { className: "project-art-grid" }),
                h("div", { className: "project-art-object" }),
                h("span", null, String(project.id || index + 1).padStart(2, "0")),
                h("small", null, (project.category || "PROJECT").toUpperCase())
              ),
              h("div", { className: "academy-project-card-body" },
                h("div", { className: "academy-project-meta" }, h("span", null, project.category), h("span", null, project.duration || "프로젝트 실습")),
                h("h2", null, project.title),
                h("p", null, project.description),
                h("div", { className: "academy-project-stack" }, (project.stack || []).slice(0, 4).map(function (tech) { return h("span", { key: tech }, tech); })),
                h("div", { className: "academy-project-card-foot" }, h("span", null, "설계 · 구현 · 테스트"), h("b", null, "상세 보기 ↗"))
              )
            )
          );
        })
      ),
      h("p", { className: "academy-honesty-note" }, "실제 수강생 작품, 수상 이력, 취업률로 오인되지 않도록 예시 프로젝트임을 명시합니다. 운영기관의 검증된 실적 자료가 확보되면 해당 자료와 구분해 게시할 수 있습니다."),
      h("section", { className: "academy-review-framework" },
        h(SectionHeading, { label: "HOW WE REVIEW", title: "프로젝트 심사 기준", description: "완성 화면만 보는 평가를 피하고 과정의 타당성과 결과의 신뢰성을 함께 확인합니다." }),
        h("div", { className: "academy-review-grid" },
          assessment.map(function (item, index) {
            return h("article", { key: item[0] },
              h("span", null, "0" + (index + 1)),
              h("div", null, h("h3", null, item[0]), h("p", null, item[2])),
              h("strong", null, item[1] + "점")
            );
          })
        ),
        h("div", { className: "academy-review-footnote" }, "총점 100점 · 프로젝트 유형과 난이도에 따라 평가 세부 항목은 조정할 수 있습니다.")
      ),
      h("section", { className: "academy-project-cta" },
        h("div", null, h("h2", null, "프로젝트를 통해 어떤 역량을 증명할지 설계하세요."), h("p", null, "관심 분야와 목표에 맞는 교육과정을 상담에서 확인할 수 있습니다.")),
        h(Link, { to: "/consultation", className: "academy-button primary" }, "교육과정 상담", h("span", null, "↗"))
      )
    ),
    selected ? h("div", { className: "academy-project-modal-backdrop", role: "presentation", onMouseDown: function (event) { if (event.target === event.currentTarget) setSelected(null); } },
      h("article", { ref: dialogRef, className: "academy-project-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "academy-project-modal-title", "aria-describedby": "academy-project-modal-description", tabIndex: -1 },
        h("button", { type: "button", className: "academy-modal-close", onClick: function () { setSelected(null); }, "aria-label": "상세 창 닫기" }, "×"),
        h(Eyebrow, null, (selected.category || "PROJECT") + " · " + (selected.duration || "CAPSTONE")),
        h("h2", { id: "academy-project-modal-title" }, selected.title),
        h("p", { id: "academy-project-modal-description", className: "academy-modal-lead" }, selected.description),
        h("div", { className: "academy-modal-facts" },
          h("div", null, h("small", null, "PROJECT PERIOD"), h("b", null, selected.duration || "과정별 상이")),
          h("div", null, h("small", null, "TEAM SIZE"), h("b", null, selected.teamSize || selected.team || "운영안에 따라 편성")),
          h("div", null, h("small", null, "PROJECT TYPE"), h("b", null, "교육 설계 예시"))
        ),
        h("div", { className: "academy-modal-section-grid" },
          h("section", null, h("h3", null, "01 · 문제 정의"), h("p", null, selected.problem || "사용자 문제와 해결 목표를 정의합니다.")),
          h("section", null, h("h3", null, "02 · 해결 접근"), h("p", null, selected.solution || "데이터·기술·사용자 흐름을 고려해 구현합니다.")),
          h("section", null, h("h3", null, "03 · 주요 기능"), h("ul", null, (selected.features || []).map(function (item) { return h("li", { key: item }, item); }))),
          h("section", null, h("h3", null, "04 · 평가 포인트"), h("ul", null, (selected.evaluationPoints || []).map(function (item) { return h("li", { key: item }, item); })))
        ),
        h("div", { className: "academy-modal-deliverables" },
          h("h3", null, "제출 산출물"),
          h("div", null, (selected.deliverables || []).map(function (item) { return h("span", { key: item }, item); }))
        ),
        h("div", { className: "academy-modal-stack" },
          h("h3", null, "기술 스택"),
          h("div", null, (selected.stack || []).map(function (item) { return h("span", { key: item }, item); }))
        ),
        h("div", { className: "academy-modal-result" }, h("b", null, "EXPECTED OUTCOME"), h("p", null, selected.result || "구현 결과와 검증 근거를 포트폴리오로 정리합니다.")),
        h(Link, { to: "/consultation", className: "academy-button primary", onClick: function () { setSelected(null); } }, "관련 교육과정 상담하기", h("span", null, "↗"))
      )
    ) : null
  );
}
