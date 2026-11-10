import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  Outlet,
  useParams,
  useNavigate,
  useLocation,
  useNavigationType
} from "react-router-dom";
import { getPageMetadata, getScrollAction, formatNoticeDate } from "./navigation.js";
import api from "./api.js";
import { courseCatalog as courseSeed } from "./course-catalog.js";
import { previewNotices } from "./preview-content.js";
import AdminApp from "./AdminApp.js";
import { AcademyHome, AcademyAbout, AcademyProjects, AcademyScene } from "./academy-pages.js";

const h = React.createElement;




 
// 과정 상세 소개용 콘텐츠입니다. 일정과 혜택은 실제 운영 정보가 아닌 데모 데이터입니다.
const courseDetailData = {
  1: {
    intro: "데이터를 읽고 모델을 학습시키는 기초부터 실제 서비스에 적용하는 과정까지 경험합니다. 코딩 경험이 많지 않은 학습자도 Python 기초부터 순서대로 따라올 수 있도록 구성한 실습 중심 프로그램입니다.",
    description: "Python으로 데이터를 다루는 방법을 익힌 뒤 통계와 머신러닝의 핵심 원리를 학습합니다. 이후 모델 성능을 평가하고 개선하는 과정을 반복하며, 마지막에는 영화 추천 서비스를 주제로 데이터 수집·전처리·모델링·결과 시각화를 연결한 팀 프로젝트를 완성합니다.",
    recruitPeriod: "운영기관 공지 확인",
    startDate: "상담 시 최신 일정 안내",
    outcomes: [
      { title: "데이터 분석 기초", description: "Python과 Pandas로 데이터를 정리하고 분석 결과를 표와 그래프로 표현합니다." },
      { title: "예측 모델 구현", description: "분류·회귀·군집화 알고리즘을 적용하고 성능 지표를 비교합니다." },
      { title: "AI 서비스 프로젝트", description: "추천 모델을 웹 화면과 연결해 사용자 흐름이 있는 결과물을 만듭니다." }
    ],
    modules: [
      { title: "Python 프로그래밍 기초", description: "변수, 조건문, 반복문, 함수와 자료구조를 실습합니다.", tools: "Python · Jupyter Notebook" },
      { title: "데이터 수집과 전처리", description: "CSV와 공개 데이터를 불러오고 결측치·이상치를 처리합니다.", tools: "NumPy · Pandas · Matplotlib" },
      { title: "통계와 머신러닝", description: "학습·검증 데이터 분리와 주요 알고리즘, 평가 지표를 익힙니다.", tools: "Scikit-learn · Statistics" },
      { title: "딥러닝 기초", description: "신경망의 구조와 학습 과정을 이해하고 간단한 모델을 구현합니다.", tools: "PyTorch · Neural Network" },
      { title: "팀 프로젝트와 발표", description: "영화 추천 모델을 구현하고 결과를 정리해 시연·발표합니다.", tools: "Recommendation · Git · Presentation" }
    ],
    projectTitle: "취향 데이터를 활용한 AI 영화 추천 서비스",
    projectDescription: "영화 장르와 사용자 선호 데이터를 분석해 추천 결과를 제공하는 서비스입니다. 데이터 전처리, 추천 로직, 결과 시각화, 사용 화면을 역할별로 나누어 구현합니다.",
    deliverables: ["데이터 분석 노트북", "추천 모델", "성능 평가 보고서", "서비스 시연 화면"],
    benefits: [
      { title: "단계별 실습 자료", description: "기초 문법부터 프로젝트까지 학습 흐름에 맞춘 예제와 실습 과제를 제공합니다." },
      { title: "코드 리뷰와 피드백", description: "작성한 코드의 동작 원리와 개선 방향을 점검하는 리뷰 시간을 운영하는 콘셉트입니다." },
      { title: "포트폴리오 정리", description: "프로젝트 README, 기능 설명, 발표 자료를 정리해 결과물을 설명할 수 있도록 돕습니다." }
    ],
    faqs: [
      { question: "프로그래밍을 처음 배우는 사람도 신청할 수 있나요?", answer: "과정은 Python 기초부터 시작하도록 설계했습니다. 다만 학습 시간과 실습 과제가 필요하므로 상담에서 현재 수준과 학습 가능 시간을 함께 확인하는 것을 권장합니다." },
      { question: "수료 후 어떤 결과물을 만들 수 있나요?", answer: "데이터 분석 노트북, 머신러닝 모델, 평가 보고서, 추천 서비스 시연 화면을 포트폴리오 형태로 정리하는 것을 목표로 합니다." },
      { question: "교육 일정과 비용은 확정되어 있나요?", answer: "확인되지 않은 일정이나 비용은 이 화면에 임의로 표시하지 않습니다. 실제 개강일, 교육비, 지원 제도 및 모집 인원은 운영기관의 최신 공지로 확인해 주세요." }
    ]
  },
  2: {
    intro: "데이터를 수집하고 정리하는 단계부터 분석 결과를 시각화하고 대시보드로 전달하는 과정까지 학습합니다.",
    description: "SQL과 Python을 활용해 데이터를 추출·정제하고 기초 통계와 탐색적 데이터 분석을 수행합니다. 분석 목적에 맞는 시각화를 설계하고 결과를 대시보드 형태로 구성하는 프로젝트를 진행합니다.",
    recruitPeriod: "운영기관 공지 확인", startDate: "상담 시 최신 일정 안내",
    outcomes: [{title:"데이터 추출",description:"SQL로 필요한 데이터를 조회하고 구조를 이해합니다."},{title:"분석과 해석",description:"통계와 탐색적 분석으로 데이터의 특징을 설명합니다."},{title:"시각화 전달",description:"핵심 지표를 대시보드로 구성하고 분석 내용을 발표합니다."}],
    modules: [{title:"Python과 SQL",description:"분석 환경과 데이터베이스 기초를 익힙니다.",tools:"Python · SQL"},{title:"데이터 전처리",description:"결측치와 이상치를 처리하고 분석용 데이터를 구성합니다.",tools:"Pandas · NumPy"},{title:"통계 분석",description:"기술통계와 상관관계 등 분석 기초를 학습합니다.",tools:"Statistics"},{title:"데이터 시각화",description:"분석 결과를 목적에 맞는 차트와 대시보드로 표현합니다.",tools:"Matplotlib · Seaborn · BI"},{title:"분석 프로젝트",description:"주제를 정해 데이터 분석 보고서와 대시보드를 완성합니다.",tools:"SQL · Dashboard · Git"}],
    projectTitle:"소비 패턴 분석 대시보드",projectDescription:"가상의 소비 데이터를 바탕으로 기간·지역·카테고리별 추세를 분석하고 주요 지표를 시각화합니다.",deliverables:["SQL 분석 쿼리","전처리 노트북","대시보드","분석 보고서"],
    benefits:[{title:"분석 실습 데이터",description:"학습 단계에 맞춘 예제 데이터를 사용해 반복 실습합니다."},{title:"시각화 피드백",description:"차트 선택과 정보 전달 방식에 대한 피드백을 제공합니다."},{title:"결과 보고서 구성",description:"분석 목적과 근거, 결론을 연결해 보고서로 정리합니다."}],
    faqs:[{question:"통계 전공 지식이 필요한가요?",answer:"기초 통계 개념부터 다루도록 구성했습니다. 수학적 배경과 학습 난이도는 상담에서 확인할 수 있습니다."},{question:"프로젝트 결과물은 무엇인가요?",answer:"분석용 SQL, 전처리 코드, 대시보드와 분석 보고서를 결과물로 정리합니다."},{question:"모집 일정은 확정인가요?",answer:"확인되지 않은 일정이나 비용은 이 화면에 임의로 표시하지 않습니다. 실제 일정과 비용은 운영기관의 최신 공지로 확인해 주세요."}]
  },
  3: {
    intro: "대규모 언어 모델의 기본 개념을 이해하고 API와 검색 기술을 결합해 실용적인 생성형 AI 서비스를 구현합니다.",
    description: "프롬프트 설계, 임베딩, 벡터 검색, RAG 구조를 단계적으로 학습합니다. 문서 기반 질의응답 서비스를 주제로 데이터 준비부터 검색·응답 흐름과 간단한 사용자 화면까지 구현합니다.",
    recruitPeriod: "운영기관 공지 확인", startDate: "상담 시 최신 일정 안내",
    outcomes:[{title:"LLM 활용",description:"모델 API와 프롬프트를 사용해 입력에 맞는 응답을 생성합니다."},{title:"검색 증강 생성",description:"문서를 분할하고 임베딩·검색을 통해 근거 기반 응답을 구성합니다."},{title:"AI 서비스 연결",description:"질의응답 흐름을 사용자 화면과 연결해 시연합니다."}],
    modules:[{title:"Python과 API 기초",description:"HTTP 요청과 JSON 데이터 처리 방식을 익힙니다.",tools:"Python · REST API"},{title:"LLM과 프롬프트",description:"모델의 입력·출력 구조와 프롬프트 설계를 학습합니다.",tools:"LLM API · Prompt Engineering"},{title:"임베딩과 벡터 검색",description:"텍스트 임베딩과 유사도 검색의 기본 원리를 익힙니다.",tools:"Embedding · Vector Search"},{title:"RAG 파이프라인",description:"문서 분할, 검색, 컨텍스트 구성, 응답 생성을 연결합니다.",tools:"RAG · Retrieval"},{title:"서비스 프로젝트",description:"문서 질의응답 서비스를 구현하고 품질을 점검합니다.",tools:"Python · API · Web UI"}],
    projectTitle:"내부 문서 검색·질의응답 AI 도우미",projectDescription:"샘플 문서를 등록하고 사용자의 질문과 관련된 내용을 검색해 출처 문맥과 함께 답변하는 데모 서비스를 만듭니다.",deliverables:["문서 전처리 모듈","검색 파이프라인","질의응답 API","시연 화면"],
    benefits:[{title:"서비스 설계 실습",description:"모델 호출에 그치지 않고 입력·검색·응답 흐름을 구조화합니다."},{title:"응답 품질 점검",description:"질문 유형별 테스트와 근거 문맥 확인 방법을 학습합니다."},{title:"프로젝트 문서화",description:"구성도와 API 사용법, 실행 방법을 문서로 정리합니다."}],
    faqs:[{question:"AI 모델을 직접 학습시키나요?",answer:"핵심은 사전 학습된 모델 API와 검색 구조를 활용하는 서비스 구현입니다. 모델 자체의 대규모 사전 학습 과정은 범위에 포함하지 않습니다."},{question:"Python 기초가 필요한가요?",answer:"Python 기초와 API 요청 개념을 먼저 다루지만 실습 진도가 빠를 수 있어 사전 학습 여부를 상담에서 확인하는 것이 좋습니다."},{question:"API 사용료가 발생하나요?",answer:"실제 운영 시 외부 API 제공자의 요금 정책에 따라 비용이 발생할 수 있습니다. 데모 운영 조건은 별도 확인이 필요합니다."}]
  },
  4: {
    intro: "웹 애플리케이션의 화면과 서버, 데이터베이스를 연결하고 AI API까지 연동하는 풀스택 개발 흐름을 경험합니다.",
    description: "Java와 Spring Boot로 서버 기능과 데이터 처리를 구현하고 React로 사용자 화면을 구성합니다. 데이터베이스 설계, API 연동, 로그인과 게시판 등 서비스의 기본 기능을 연결해 팀 프로젝트를 완성합니다.",
    recruitPeriod: "운영기관 공지 확인", startDate: "상담 시 최신 일정 안내",
    outcomes:[{title:"백엔드 개발",description:"Spring Boot로 API와 비즈니스 로직을 구현합니다."},{title:"프론트엔드 개발",description:"React로 화면과 사용자 상호작용을 구성합니다."},{title:"서비스 통합",description:"DB와 API를 연결하고 테스트 가능한 웹 서비스를 완성합니다."}],
    modules:[{title:"Java 프로그래밍",description:"객체지향 기초와 예외 처리, 컬렉션을 학습합니다.",tools:"Java"},{title:"Spring Boot와 DB",description:"REST API와 데이터베이스 연동을 구현합니다.",tools:"Spring Boot · MySQL · JPA"},{title:"React 화면 개발",description:"컴포넌트와 상태, 라우팅을 사용해 화면을 만듭니다.",tools:"React · JavaScript · CSS"},{title:"인증과 서비스 기능",description:"로그인과 게시판 등 기본 서비스 기능을 연결합니다.",tools:"Session · REST API"},{title:"팀 프로젝트",description:"기획부터 배포 가능한 형태의 결과물 정리까지 진행합니다.",tools:"Git · Testing · Documentation"}],
    projectTitle:"AI 기능을 연결한 교육·업무 웹 플랫폼",projectDescription:"사용자 인증, 데이터 등록·조회, 검색 기능을 갖춘 웹 서비스를 만들고 외부 AI API를 연결하는 프로젝트입니다.",deliverables:["화면 설계서","REST API","DB 스키마","통합 웹 서비스"],
    benefits:[{title:"기능 단위 실습",description:"프론트엔드와 백엔드의 역할을 나누어 기능을 단계적으로 구현합니다."},{title:"협업 도구 경험",description:"Git 브랜치와 코드 리뷰, 이슈 기반 협업 흐름을 익힙니다."},{title:"통합 프로젝트",description:"API 명세와 실행 문서를 포함한 팀 프로젝트 결과물을 정리합니다."}],
    faqs:[{question:"Java와 JavaScript를 모두 배우나요?",answer:"서버 개발은 Java와 Spring Boot를 사용하고 화면 개발은 JavaScript와 React를 사용하는 구성입니다."},{question:"개발 경험이 없어도 가능한가요?",answer:"기초부터 시작하는 구성이지만 학습량이 많을 수 있습니다. 현재 수준과 주당 학습 가능 시간을 상담에서 확인해 주세요."},{question:"실제 배포까지 진행하나요?",answer:"프로젝트 범위와 운영 환경에 따라 달라집니다. 데모 과정에서는 로컬 통합과 배포 준비 문서화를 기본 목표로 설정했습니다."}]
  }
};

function Header() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const location = useLocation();
  const links = [
    ["/about", "교육 철학"],
    ["/courses", "교육과정"],
    ["/projects", "프로젝트"],
    ["/notices", "공지사항"]
  ];

  React.useEffect(function () {
    setMenuOpen(false);
  }, [location.pathname]);

  React.useEffect(function () {
    function closeMenuOnEscape(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", closeMenuOnEscape);
    return function () { window.removeEventListener("keydown", closeMenuOnEscape); };
  }, []);

  return h(React.Fragment, null,
    h("a", { href: "#main-content", className: "skip-link" }, "본문 바로가기"),
    h("header", { className: "header academy-site-header" },
      h("div", { className: "container nav" },
        h(Link, { to: "/", className: "brand academy-brand", "aria-label": "IT ACADEMY 홈" },
          h("span", { className: "academy-brand-symbol", "aria-hidden": "true" }, "IT"),
          h("span", { className: "academy-brand-copy" },
            h("b", null, "ACADEMY"),
            h("small", null, "AI · DATA · ENGINEERING")
          )
        ),
        h("button", {
          type: "button",
          className: "menu academy-menu-button",
          "aria-label": menuOpen ? "메뉴 닫기" : "메뉴 열기",
          "aria-expanded": menuOpen,
          "aria-controls": "academy-main-navigation",
          onClick: function () { setMenuOpen(function (open) { return !open; }); }
        }, menuOpen ? "×" : "☰"),
        h("nav", { id: "academy-main-navigation", className: menuOpen ? "navlinks show academy-navlinks" : "navlinks academy-navlinks", "aria-label": "주요 메뉴" },
          links.map(function (item) {
            return h(NavLink, {
              to: item[0],
              key: item[0],
              onClick: function () { setMenuOpen(false); }
            }, item[1]);
          }),
          h(Link, {
            to: "/consultation",
            className: "btn small academy-header-cta",
            onClick: function () { setMenuOpen(false); }
          }, "교육 상담 ↗")
        )
      )
    )
  );
}

function Layout() {
  return h(React.Fragment, null,
    h(Header),
    h("main", { id: "main-content", tabIndex: -1 }, h(Outlet)),
    h("footer", { className: "footer academy-site-footer" },
      h("div", { className: "container academy-footer-main" },
        h("div", null,
          h(Link, { to: "/", className: "brand academy-brand footer-brand" },
            h("span", { className: "academy-brand-symbol", "aria-hidden": "true" }, "IT"),
            h("span", { className: "academy-brand-copy" },
              h("b", null, "ACADEMY"),
              h("small", null, "AI · DATA · ENGINEERING")
            )
          ),
          h("p", null, "기술을 이해하고, 문제를 해결하며, 결과를 검증하는 교육"),
          h("small", null, "LEARN THE PRINCIPLE. BUILD THE PRODUCT. PROVE THE QUALITY.")
        ),
        h("div", { className: "academy-footer-links" },
          h("b", null, "EXPLORE"),
          h(Link, { to: "/about" }, "교육 철학"),
          h(Link, { to: "/courses" }, "교육과정"),
          h(Link, { to: "/projects" }, "프로젝트 심사 기준"),
          h(Link, { to: "/notices" }, "공지사항")
        ),
        h("div", { className: "academy-footer-links" },
          h("b", null, "CONTACT"),
          h(Link, { to: "/consultation" }, "교육 상담 신청"),
          h("span", null, "운영 일정·정원·교육비는 최신 공지 기준")
        )
      ),
      h("div", { className: "container academy-footer-bottom" },
        h("span", null, "© " + new Date().getFullYear() + " IT ACADEMY"),
        h("span", null, "교육기관의 실제 연락처·주소·운영 실적은 확인된 정보만 게시합니다.")
      )
    )
  );
}

function CourseCard(props) {
  const course = props.course;
  const guide = courseSeed.find(function (item) { return String(item.id) === String(course.id); }) || {};
  const audience = course.audience || guide.audience || "과정의 학습 범위와 준비 내용은 상세 안내에서 확인해 주세요.";
  const outcome = course.outcome || guide.outcome || "실습 결과와 구현 과정을 정리하는 프로젝트";
  const learningGoal = course.learningGoal || guide.learningGoal || course.skills || "과정별 주요 기술과 실습";
  const category = String(course.category || "PROGRAM").toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return h("article", { className: "program-card", "data-category": category },
    h("div", { className: "program-card-rail" },
      h("span", { className: "program-card-index" }, String(course.id).padStart(2, "0")),
      h("span", { className: "program-card-field" }, course.category)
    ),
    h("div", { className: "program-card-body" },
      h("h2", null, course.title),
      h("p", { className: "program-card-summary" }, course.summary || course.description),
      h("div", { className: "program-card-details" },
        h("div", { className: "program-card-detail" },
          h("b", null, "이런 관심에 맞습니다"),
          h("p", { className: "program-card-audience" }, audience)
        ),
        h("div", { className: "program-card-detail" },
          h("b", null, "학습 방향"),
          h("p", null, learningGoal)
        ),
        h("div", { className: "program-card-detail program-card-outcome" },
          h("b", null, "대표 결과물 예시"),
          h("p", { className: "program-card-result" }, outcome)
        )
      ),
      h("div", { className: "program-card-footer" },
        h("span", { className: "program-card-skills" }, course.skills || guide.skills),
        h(Link, { to: "/courses/" + course.id, className: "program-card-link" }, "과정 자세히 보기")
      )
    )
  );
}


// 관리자에서 추가한 교육과정도 상세 페이지에서 일관된 구조로 설명할 수 있도록
// 등록된 과정명·소개·커리큘럼·기술 정보를 기반으로 기본 상세 구성을 만듭니다.
function buildCourseDetailData(course) {
  const modules = String(course.curriculum || "")
    .split(/→|\r?\n|;/)
    .map(function (value) { return value.trim(); })
    .filter(Boolean)
    .map(function (title, index) {
      return {
        title: title,
        description: "이 단계의 핵심 개념을 이해하고 작은 실습으로 동작을 확인한 뒤 다음 단계의 입력으로 연결합니다.",
        tools: course.skills || "과정별 주요 기술"
      };
    });

  if (modules.length === 0) {
    modules.push({
      title: "핵심 개념과 기초 실습",
      description: "과정의 기본 개념과 개발 환경을 익히고 작은 기능을 직접 구현합니다.",
      tools: course.skills || "과정별 주요 기술"
    });
  }

  modules.push({
    title: "통합 프로젝트와 결과 검증",
    description: "학습한 내용을 연결해 프로젝트를 구현하고 테스트·문서·발표 자료로 결과를 정리합니다.",
    tools: "Git · Testing · Documentation"
  });

  return {
    intro: course.description || course.summary || "등록된 교육과정의 목표와 학습 범위를 안내합니다.",
    description: course.description || course.summary || "단계별 실습과 프로젝트를 통해 과정의 핵심 역량을 학습합니다.",
    recruitPeriod: "운영기관 공지 확인",
    startDate: "상담 시 최신 일정 안내",
    outcomes: [
      { title: "핵심 개념 이해", description: "과정의 주요 개념과 기술이 문제 해결에 어떻게 활용되는지 설명합니다." },
      { title: "기능 단위 구현", description: "작은 기능부터 직접 구현하고 실행 결과와 오류 원인을 확인합니다." },
      { title: "프로젝트 검증", description: "테스트와 문서화를 통해 프로젝트의 동작과 구현 근거를 제시합니다." }
    ],
    modules: modules,
    projectTitle: (course.title || "교육과정") + " 통합 프로젝트",
    projectDescription: "과정에서 학습한 기술을 연결해 실제 사용 흐름을 갖춘 결과물을 구현하고, 요구사항·설계·테스트·시연 자료를 함께 정리합니다.",
    deliverables: ["요구사항 정의서", "핵심 기능 구현", "테스트 결과", "README 및 시연 자료"],
    benefits: [
      { title: "단계별 학습 산출물", description: "개념 노트와 실습 결과를 누적해 학습 진행 상황과 이해도를 확인합니다." },
      { title: "코드 리뷰 기준", description: "이름·구조·오류 처리·보안·가독성 관점에서 구현 내용을 점검하도록 설계합니다." },
      { title: "포트폴리오 문서", description: "문제 정의, 기술 선택, 주요 기능, 테스트 결과와 한계를 문서로 설명합니다." }
    ],
    faqs: [
      { question: "프로그래밍 경험이 없어도 가능한가요?", answer: "과정별 선수 지식과 실습 난이도가 다릅니다. 상세 커리큘럼을 확인하고 현재 경험과 주당 학습 가능 시간을 상담에서 함께 점검해 주세요." },
      { question: "프로젝트 결과물은 무엇인가요?", answer: "과정별 주제에 맞는 작동 결과물과 요구사항·설계·테스트·실행 안내 문서를 정리하는 것을 목표로 합니다." },
      { question: "모집 일정과 교육비는 확정되어 있나요?", answer: "이 화면에는 확인되지 않은 일정이나 비용을 임의로 표시하지 않습니다. 운영기관의 최신 공지와 상담 안내를 기준으로 확인해 주세요." }
    ]
  };
}

function Courses() {
  const params = useParams();
  const [items, setItems] = React.useState(isStaticPreview ? courseSeed : []);
  const [keyword, setKeyword] = React.useState("");
  const [category, setCategory] = React.useState("전체");
  const [coursesLoading, setCoursesLoading] = React.useState(!isStaticPreview);
  const [coursesError, setCoursesError] = React.useState("");
  const [reloadCount, setReloadCount] = React.useState(0);

  React.useEffect(function () {
    if (isStaticPreview) {
      setItems(courseSeed);
      setCoursesLoading(false);
      return undefined;
    }
    const controller = new AbortController();
    setCoursesLoading(true);
    setCoursesError("");
    api.get("/courses", { signal: controller.signal }).then(function (response) {
      if (!Array.isArray(response.data)) throw new Error("교육과정 응답 형식이 올바르지 않습니다.");
      setItems(response.data);
    }).catch(function (requestError) {
      if (requestError.code !== "ERR_CANCELED") {
        setItems([]);
        setCoursesError(requestError.message || "교육과정 정보를 불러오지 못했습니다.");
      }
    }).finally(function () {
      if (!controller.signal.aborted) setCoursesLoading(false);
    });
    return function () { controller.abort(); };
  }, [reloadCount]);

  function retryCourses() {
    setReloadCount(function (count) { return count + 1; });
  }

  if (params.id) {
    const selected = items.find(function (item) {
      return String(item.id) === params.id;
    });

    if (!selected && coursesLoading) {
      return h("section", { className: "program-detail-page" },
        h("div", { className: "site-container program-state", role: "status" }, "교육과정 정보를 불러오고 있습니다.")
      );
    }
    if (!selected && coursesError) {
      return h("section", { className: "program-detail-page" },
        h("div", { className: "site-container program-state", role: "alert" },
          h("h1", null, "교육과정 정보를 불러오지 못했습니다."),
          h("p", null, coursesError),
          h("button", { type: "button", className: "site-button", onClick: retryCourses }, "다시 불러오기"),
          h(Link, { to: "/courses", className: "site-text-link" }, "교육과정 목록")
        )
      );
    }
    if (!selected) {
      return h("section", { className: "program-detail-page" },
        h("div", { className: "site-container program-state" },
          h("h1", null, "과정을 찾을 수 없습니다."),
          h("p", null, "과정이 삭제되었거나 현재 공개되지 않았습니다."),
          h(Link, { to: "/courses", className: "site-button" }, "전체 교육과정 보기")
        )
      );
    }

    const detailData = courseDetailData[selected.id] || buildCourseDetailData(selected);
    const courseGuide = courseSeed.find(function (item) { return String(item.id) === String(selected.id); }) || {};
    const audience = selected.audience || courseGuide.audience || "현재 경험과 학습 목표를 상담에서 함께 확인합니다.";
    const learningGoal = selected.learningGoal || courseGuide.learningGoal || selected.skills || "과정의 주요 개념과 실습 범위";
    const outcome = selected.outcome || courseGuide.outcome || detailData.projectTitle;
    const moduleEvidence = {
      1: [
            [
                  "함수·조건문·반복문으로 작은 문제를 구현하고 입력과 출력의 흐름을 직접 추적합니다.",
                  "실습 노트북, 문제 풀이 코드, 개념 설명",
                  "빈 입력·잘못된 자료형·경계값을 포함한 테스트 예시를 통과하고 각 함수의 역할을 설명합니다."
            ],
            [
                  "원천 데이터의 구조를 파악하고 결측·중복·이상치를 처리한 뒤 전처리 규칙을 기록합니다.",
                  "데이터 사전, 전처리 코드, 품질 점검표",
                  "전처리 전후 행 수와 결측 비율을 비교하고 제거·대체 기준을 재현할 수 있습니다."
            ],
            [
                  "기준 모델을 먼저 만들고 학습·검증 데이터를 분리해 분류·회귀 지표를 비교합니다.",
                  "베이스라인 모델, 평가 지표표, 오분류 사례",
                  "데이터 누수를 점검하고 Accuracy만이 아니라 문제에 맞는 F1·Precision·Recall 또는 MAE를 제시합니다."
            ],
            [
                  "간단한 신경망을 학습시키고 학습 곡선과 과적합 징후를 비교합니다.",
                  "학습 노트북, 손실 곡선, 모델 실험 기록",
                  "랜덤 시드와 데이터 분할을 기록하고 학습·검증 손실 차이와 개선 실험을 설명합니다."
            ],
            [
                  "추천 결과를 서비스 화면과 연결하고 기준 모델과 개선 결과를 비교해 발표합니다.",
                  "추천 모델, API 명세, 성능 보고서, 시연 자료",
                  "동일한 평가 데이터에서 Precision@K·Recall@K 등 Top-K 지표를 비교하고 신규 사용자·빈 결과를 테스트합니다."
            ]
      ],
      2: [
            [
                  "테이블 관계를 파악하고 필터·조인·집계 쿼리로 분석용 데이터를 추출합니다.",
                  "SQL 쿼리 모음, 데이터 추출 결과",
                  "조건·조인 키·집계 단위를 설명하고 중복 조인으로 행 수가 부풀지 않는지 확인합니다."
            ],
            [
                  "자료형·결측·중복·이상치를 점검하고 재현 가능한 전처리 절차를 작성합니다.",
                  "데이터 품질 보고서, 전처리 코드",
                  "결측·중복 처리 전후 건수와 기준을 남기고 원본을 다시 불러와 같은 결과를 재현합니다."
            ],
            [
                  "분포·상관·그룹별 차이를 분석하고 지표가 의미하는 범위를 해석합니다.",
                  "탐색적 분석 노트북, 지표 정의서",
                  "표본 수와 기준 기간을 함께 제시하고 상관관계를 인과관계로 단정하지 않습니다."
            ],
            [
                  "분석 목적에 맞는 차트를 선택하고 필터와 요약 지표가 있는 대시보드를 구성합니다.",
                  "차트 설계 근거, 대시보드 화면",
                  "필터를 바꿨을 때 요약 지표가 일관되게 갱신되고 축·단위·범례가 오해를 만들지 않습니다."
            ],
            [
                  "분석 질문·근거 데이터·핵심 인사이트·한계를 연결해 의사결정 보고서를 발표합니다.",
                  "분석 보고서, 대시보드, 발표 자료",
                  "보고서 수치가 SQL 결과와 일치하고 데이터 출처·기준일·표본 범위·한계를 포함합니다."
            ]
      ],
      3: [
            [
                  "HTTP 요청과 JSON 응답을 다루고 정상·오류 응답을 구분하는 API 호출 흐름을 구현합니다.",
                  "API 호출 코드, 요청·응답 예시",
                  "성공·4xx·5xx·시간 초과 응답을 구분하고 키나 토큰을 로그와 코드에 하드코딩하지 않습니다."
            ],
            [
                  "역할과 출력 형식을 분명히 한 프롬프트를 작성하고 질문 유형별 결과를 비교합니다.",
                  "프롬프트 버전, 평가 질문 세트, 결과 비교표",
                  "동일한 질문 세트로 버전을 비교하고 금지 출력·잘못된 형식·근거 없는 응답 사례를 기록합니다."
            ],
            [
                  "문서를 청크로 분리해 임베딩하고 검색 결과의 유사도와 누락 사례를 확인합니다.",
                  "청킹 규칙, 검색 샘플, 임베딩 실험 기록",
                  "각 청크에 문서 ID·버전·원문 위치를 보존하고 Top-K 검색 결과를 질문별로 점검합니다."
            ],
            [
                  "검색 문맥을 생성 모델에 전달하고 답변에 근거 출처를 연결하며 검색 실패를 점검합니다.",
                  "RAG 파이프라인, 출처 연결 사례, 실패 분석",
                  "답변의 주장과 원문 근거가 연결되고 근거가 없을 때 추측하지 않도록 실패 응답을 검증합니다."
            ],
            [
                  "질문 데이터셋으로 응답 근거·정확성·지연·비용을 측정하고 서비스를 시연합니다.",
                  "평가 데이터셋, 품질 리포트, API 문서, 시연 자료",
                  "검색 적합도·근거 일치·응답 시간·토큰 비용을 같은 평가 세트로 반복 측정합니다."
            ]
      ],
      4: [
            [
                  "객체·메서드·컬렉션·예외 처리의 역할을 이해하고 작은 콘솔 프로그램을 작성합니다.",
                  "Java 실습 코드, 단위 실행 결과",
                  "클래스의 책임과 메서드 입력·출력을 설명하고 null·빈 값·잘못된 입력을 처리합니다."
            ],
            [
                  "도메인과 테이블을 설계하고 Spring API와 JPA로 조회·등록·수정 흐름을 연결합니다.",
                  "ERD, 엔티티·리포지토리, API 명세",
                  "요청 DTO 검증, 트랜잭션 범위, 제약 조건, 성공·오류 응답이 API 계약과 일치합니다."
            ],
            [
                  "컴포넌트와 상태를 나누고 폼·목록·상세 화면을 라우팅으로 연결합니다.",
                  "화면 구성도, React 화면, 사용자 흐름",
                  "로딩·빈 결과·오류·성공 상태가 구분되고 폼 입력과 서버 응답이 일관되게 반영됩니다."
            ],
            [
                  "로그인·권한·입력 검증·CSRF를 적용하고 정상·비정상 접근을 테스트합니다.",
                  "권한표, 보안 테스트 케이스, 오류 응답",
                  "화면의 버튼 노출뿐 아니라 서버 요청 단위로 권한이 검증되고 세션·CSRF 오류를 확인합니다."
            ],
            [
                  "프론트·백엔드·DB를 통합하고 설치·실행·테스트·발표 자료까지 정리합니다.",
                  "통합 웹 서비스, 테스트 결과, README, 발표 자료",
                  "주요 사용자 흐름을 E2E로 재현하고 환경 설정·실행 명령·테스트 결과를 문서만으로 따라 할 수 있습니다."
            ]
      ]
};
    const modules = (detailData.modules || []).map(function (item, index) {
      const evidence = moduleEvidence[selected.id] && moduleEvidence[selected.id][index];
      return Object.assign({}, item, {
        practice: evidence ? evidence[0] : item.description,
        evidence: evidence ? evidence[1] : "실습 코드, 실행 결과, 개선 기록",
        validation: evidence ? evidence[2] : "정상·오류·경계 조건을 재현하고 구현 이유를 설명합니다."
      });
    });
    const faqs = detailData.faqs || [];

    return h("section", { className: "program-detail-page" },
      h("header", { className: "program-detail-hero" },
        h("div", { className: "site-container" },
          h(Link, { to: "/courses", className: "program-back-link" }, "← 전체 교육과정"),
          h("p", { className: "program-detail-field" }, selected.category || "교육과정"),
          h("h1", null, selected.title),
          h("p", { className: "program-detail-lead" }, detailData.intro || selected.summary),
          h("div", { className: "program-detail-summary" },
            h("article", null,
              h("b", null, "이런 관심에 맞습니다"),
              h("p", null, audience)
            ),
            h("article", null,
              h("b", null, "학습 방향"),
              h("p", null, learningGoal)
            ),
            h("article", null,
              h("b", null, "대표 결과물 예시"),
              h("p", null, outcome)
            )
          ),
          h(Link, { to: "/consultation", className: "site-button site-button--light" }, "이 과정 상담 안내")
        )
      ),
      h("div", { className: "site-container program-detail-content" },
        h("section", { className: "program-section program-overview" },
          h("div", { className: "program-section-heading" },
            h("p", { className: "program-section-index" }, "01 / 학습 내용"),
            h("h2", null, "어떤 내용을 배우나요?"),
            h("p", null, detailData.description)
          ),
          h("div", { className: "program-outcomes" },
            (detailData.outcomes || []).map(function (item, index) {
              return h("article", { className: "program-outcome", key: item.title },
                h("span", null, "0" + (index + 1)),
                h("h3", null, item.title),
                h("p", null, item.description)
              );
            })
          )
        ),
        h("section", { className: "program-section program-curriculum" },
          h("div", { className: "program-section-heading" },
            h("p", { className: "program-section-index" }, "02 / 학습 순서"),
            h("h2", null, "기초부터 프로젝트까지"),
            h("p", null, "학습 주제와 실습, 정리할 자료를 단계별로 연결했습니다. 실제 운영 시 세부 순서와 범위는 확정 교육 계획을 따릅니다.")
          ),
          h("div", { className: "program-modules" },
            modules.map(function (item, index) {
              return h("article", { className: "program-module", key: item.title },
                h("div", { className: "program-module-index" }, "STEP", h("b", null, String(index + 1).padStart(2, "0"))),
                h("div", { className: "program-module-body" },
                  h("h3", null, item.title),
                  h("p", { className: "program-module-description" }, item.description),
                  h("p", { className: "program-module-tools" }, "사용 기술: " + item.tools),
                  h("div", { className: "program-module-evidence" },
                    h("div", null, h("b", null, "직접 해볼 실습"), h("p", null, item.practice)),
                    h("div", null, h("b", null, "남기는 결과"), h("p", null, item.evidence)),
                    h("div", null, h("b", null, "확인할 내용"), h("p", null, item.validation))
                  )
                )
              );
            })
          )
        ),
        h("section", { className: "program-section program-project" },
          h("div", { className: "program-section-heading" },
            h("p", { className: "program-section-index" }, "03 / 프로젝트 예시"),
            h("h2", null, detailData.projectTitle),
            h("p", null, detailData.projectDescription)
          ),
          h("div", { className: "program-project-deliverables" },
            h("b", null, "정리할 수 있는 자료"),
            h("ul", null, (detailData.deliverables || []).map(function (item) {
              return h("li", { key: item }, item);
            }))
          )
        ),
        h("section", { className: "program-section program-working-method" },
          h("p", { className: "program-section-index" }, "04 / 학습 방법"),
          h("h2", null, "코드를 이해하고, 직접 구현하고, 결과를 설명합니다."),
          h("div", { className: "program-method-grid" },
            [
              ["이해", "핵심 개념과 데이터 흐름을 자신의 말로 설명합니다."],
              ["실습", "작은 기능부터 직접 구현하고 실패 원인을 확인합니다."],
              ["검증", "정상·오류·경계 조건을 테스트하고 기록합니다."],
              ["정리", "README와 시연 자료로 선택과 한계를 전달합니다."]
            ].map(function (item) {
              return h("article", { key: item[0] }, h("h3", null, item[0]), h("p", null, item[1]));
            })
          )
        ),
        h("section", { className: "program-section program-faq" },
          h("div", { className: "program-section-heading" },
            h("p", { className: "program-section-index" }, "05 / 자주 묻는 질문"),
            h("h2", null, "과정을 알아보기 전에")
          ),
          h("div", { className: "program-faq-list" },
            faqs.map(function (item) {
              return h("details", { key: item.question },
                h("summary", null, item.question),
                h("p", null, item.answer)
              );
            })
          )
        ),
        h("section", { className: "program-operations-note" },
          h("div", null,
            h("p", { className: "program-section-index" }, "운영 안내"),
            h("h2", null, "모집·일정·교육비는 확인된 공지로 안내합니다."),
            h("p", null, "이 사이트에 표시된 과정 구성은 학습 내용을 설명하기 위한 설계 예시입니다. 실제 개강일, 교육 기간, 수업 방식, 정원, 교육비와 지원 자격은 운영기관이 확인한 정보가 공지되기 전까지 확정된 것으로 안내하지 않습니다.")
          ),
          h("div", { className: "program-operations-links" },
            h(Link, { to: "/notices", className: "site-text-link" }, "공지사항 확인"),
            h(Link, { to: "/consultation", className: "site-button" }, "상담 안내 보기")
          )
        )
      )
    );
  }

  const normalizedKeyword = keyword.trim().toLocaleLowerCase("ko-KR");
  const filtered = items.filter(function (course) {
    const categoryMatches = category === "전체" || course.category === category;
    const guide = courseSeed.find(function (item) { return String(item.id) === String(course.id); }) || {};
    const searchableText = [
      course.title, course.category, course.summary, course.description, course.skills,
      course.audience, course.learningGoal, course.outcome, guide.audience, guide.learningGoal, guide.outcome
    ].filter(Boolean).join(" ").toLocaleLowerCase("ko-KR");
    return categoryMatches && (!normalizedKeyword || searchableText.includes(normalizedKeyword));
  });

  const categories = [
    ["전체", "전체 분야"],
    ["AI", "AI·머신러닝"],
    ["DATA", "데이터 분석"],
    ["GEN AI", "생성형 AI"],
    ["WEB", "웹 서비스"]
  ];

  return h("section", { className: "program-page" },
    h("div", { className: "site-container" },
      h("header", { className: "program-header" },
        h("p", { className: "program-section-index" }, "IT ACADEMY · 교육과정 안내"),
        h("h1", null, "무엇을 배우고, 무엇을 만들 수 있을까요?"),
        h("p", null, "관심 있는 분야와 만들고 싶은 결과를 기준으로 과정을 비교해 보세요. 각 과정의 학습 목표와 프로젝트 예시를 확인할 수 있습니다.")
      ),
      h("div", { className: "program-toolbar" },
        h("div", { className: "program-filters", role: "group", "aria-label": "교육과정 분야" },
          categories.map(function (item) {
            return h("button", {
              type: "button",
              key: item[0],
              className: category === item[0] ? "program-filter is-active" : "program-filter",
              "aria-pressed": category === item[0],
              onClick: function () { setCategory(item[0]); }
            }, item[1]);
          })
        ),
        h("label", { className: "program-search" },
          h("span", { className: "sr-only" }, "교육과정 검색"),
          h("input", {
            type: "search",
            placeholder: "과정명이나 기술 검색",
            value: keyword,
            onChange: function (event) { setKeyword(event.target.value); }
          }),
          h("span", { "aria-hidden": "true" }, "검색")
        )
      ),
      h("div", { className: "program-results-summary", "aria-live": "polite" },
        h("span", null, category === "전체" ? "전체 교육 분야" : categories.find(function (item) { return item[0] === category; })[1]),
        h("b", null, String(filtered.length) + "개 과정")
      ),
      coursesError
        ? h("div", { className: "program-state", role: "alert" },
            h("h2", null, "교육과정 정보를 불러오지 못했습니다."),
            h("p", null, coursesError),
            h("button", { type: "button", className: "site-button", onClick: retryCourses }, "다시 불러오기")
          )
        : coursesLoading
        ? h("div", { className: "program-state", role: "status" }, "교육과정을 불러오고 있습니다.")
        : filtered.length
        ? h("div", { className: "program-list" },
            filtered.map(function (course) {
              return h(CourseCard, { course: course, key: course.id });
            })
          )
        : h("div", { className: "program-state program-state--empty" },
            h("h2", null, items.length ? "검색 결과가 없습니다." : "현재 공개된 교육과정이 없습니다."),
            h("p", null, items.length ? "검색어를 바꾸거나 다른 분야를 선택해 주세요." : "운영기관에서 확정한 교육과정이 등록되면 이곳에서 안내합니다."),
            items.length ? h("button", { type: "button", className: "site-text-link", onClick: function () { setKeyword(""); setCategory("전체"); } }, "검색 조건 초기화") : null
          ),
      h("p", { className: "program-disclosure" }, "이 페이지의 학습 구성은 교육 설계 예시입니다. 실제 모집 여부·개강일·교육 기간·정원·교육비·지원 자격은 운영기관이 확인한 공지사항을 기준으로 안내합니다.")
    )
  );
}

function Consultation() {
  const navigate = useNavigate();
  const [availableCourses, setAvailableCourses] = React.useState(isStaticPreview ? courseSeed : []);
  const [courseLoading, setCourseLoading] = React.useState(!isStaticPreview);
  const [courseError, setCourseError] = React.useState("");
  const [form, setForm] = React.useState({
    name: "", phone: "", email: "", courseTitle: "",
    preferredDate: "", preferredPeriod: "오전", message: "",
    privacyConsent: false, marketingConsent: false
  });
  const [error, setError] = React.useState("");
  const [receipt, setReceipt] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(function () {
    if (isStaticPreview) return undefined;

    const controller = new AbortController();
    api.get("/courses", { signal: controller.signal })
      .then(function (response) {
        const courseList = Array.isArray(response.data) ? response.data : [];
        setAvailableCourses(courseList);
        setCourseError(courseList.length ? "" : "현재 신청 가능한 교육과정이 등록되지 않았습니다.");
      })
      .catch(function (requestError) {
        if (requestError.code === "ERR_CANCELED") return;
        setAvailableCourses([]);
        setCourseError("교육과정 정보를 불러오지 못했습니다. 백엔드 연결을 확인해 주세요.");
      })
      .finally(function () {
        if (!controller.signal.aborted) setCourseLoading(false);
      });

    return function () { controller.abort(); };
  }, []);

  function updateField(name, value) {
    setForm(function (previous) {
      return Object.assign({}, previous, { [name]: value });
    });
  }

  async function submitForm(event) {
    event.preventDefault();
    setError("");
    if (isStaticPreview) {
      setError("온라인 접수 서버에 연결할 수 없습니다.");
      return;
    }
    if (!availableCourses.some(function (course) { return course.title === form.courseTitle; })) {
      setError("서버에서 제공하는 교육과정을 선택해 주세요.");
      return;
    }
    if (form.preferredDate && form.preferredDate < getTodayLocalDate()) {
      setError("상담 희망 날짜는 오늘 이후로 선택해 주세요.");
      return;
    }
    setSubmitting(true);

    try {
      const payload = Object.assign({}, form, {
        email: form.email.trim() || null,
        preferredDate: form.preferredDate || null,
        preferredPeriod: form.preferredPeriod || null
      });
      const response = await api.post("/inquiries", payload);
      setReceipt(response.data.receiptNo);
    } catch (requestError) {
      const message = requestError.response && requestError.response.data
        ? requestError.response.data.message
        : "백엔드 서버 연결을 확인해 주세요.";
      setError(message || "상담 신청에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  if (receipt) {
    return h("section", { className: "page" },
      h("div", { className: "container success" },
        h("div", { className: "check" }, "✓"),
        h("span", { className: "eyebrow" }, "APPLICATION COMPLETE"),
        h("h1", null, "상담 신청이 접수되었습니다."),
        h("p", null, "접수 번호"),
        h("strong", null, receipt),
        h("button", { className: "btn", onClick: function () { navigate("/"); } }, "메인으로 이동")
      )
    );
  }

  return h("section", { className: "page" },
    h("div", { className: "container formwrap" },
      h("div", { className: "consultation-side" },
        h("div", { className: "consultation-intro" },
          h("div", null,
            h("span", { className: "eyebrow" }, "CONSULTATION"),
            h("h1", null, "교육과정 상담 신청"),
            h("p", { className: "lead" }, "희망 과정과 현재 경험, 학습 목표를 남겨주시면 적합한 학습 방향을 안내합니다."),
            h("div", { className: "consultation-visual-caption" }, "YOUR NEXT STEP STARTS HERE")
          ),
          h(AcademyScene, { variant: "consultation" })
        ),
        h("section", { className: "consultation-preparation", "aria-labelledby": "consultation-preparation-title" },
          h("span", { className: "eyebrow" }, "BEFORE YOU APPLY"),
          h("h2", { id: "consultation-preparation-title" }, "상담 전에 정리하면 좋은 네 가지"),
          h("div", { className: "consultation-prep-list" },
            [
              ["01", "관심 분야", "AI·데이터·생성형 AI·웹 중 관심 있는 주제와 해결하고 싶은 문제"],
              ["02", "현재 경험", "사용해 본 언어와 도구, 완료한 실습이나 프로젝트"],
              ["03", "학습 여건", "주당 학습 가능 시간과 참여 형태에 관한 조건"],
              ["04", "목표 결과", "완성하고 싶은 프로젝트와 확보하고 싶은 기술 역량"]
            ].map(function (item) {
              return h("article", { key: item[0] },
                h("b", null, item[0]),
                h("div", null, h("strong", null, item[1]), h("p", null, item[2]))
              );
            })
          )
        ),
        h("section", { className: "consultation-process", "aria-labelledby": "consultation-process-title" },
          h("span", { className: "eyebrow" }, "HOW IT WORKS"),
          h("h2", { id: "consultation-process-title" }, "상담 진행 흐름"),
          h("ol", null,
            h("li", null, h("b", null, "01"), h("span", null, "희망 과정과 문의 내용을 작성합니다.")),
            h("li", null, h("b", null, "02"), h("span", null, "연락 가능한 정보와 상담 희망 조건을 확인합니다.")),
            h("li", null, h("b", null, "03"), h("span", null, "실제 운영 서버에서 접수된 신청을 운영 담당자가 확인합니다."))
          )
        )
      ),
      h("form", { className: "form", onSubmit: submitForm },
        h("label", null, "이름 *",
          h("input", { required: true, name: "name", autoComplete: "name", maxLength: 40, value: form.name, onChange: function (e) { updateField("name", e.target.value); } })
        ),
        h("label", null, "연락처 *",
          h("input", { required: true, name: "phone", type: "tel", inputMode: "tel", autoComplete: "tel", maxLength: 20, pattern: "[0-9+() -]{9,20}", value: form.phone, placeholder: "010-0000-0000", onChange: function (e) { updateField("phone", e.target.value); } })
        ),
        h("label", null, "이메일",
          h("input", { type: "email", name: "email", autoComplete: "email", inputMode: "email", maxLength: 120, value: form.email, onChange: function (e) { updateField("email", e.target.value); } })
        ),
        h("label", null, "희망 교육과정 *",
          h("select", { required: true, name: "courseTitle", "aria-label": "희망 교육과정", "aria-describedby": courseError ? "consultation-course-error" : undefined, disabled: courseLoading || availableCourses.length === 0, value: form.courseTitle, onChange: function (e) { updateField("courseTitle", e.target.value); } },
            h("option", { value: "", disabled: true }, courseLoading ? "교육과정 불러오는 중..." : "과정을 선택하세요"),
            availableCourses.map(function (course) {
              return h("option", { key: course.id, value: course.title }, course.title);
            })
          ),
          courseError ? h("small", { id: "consultation-course-error", className: "form-help error-text", role: "status" }, courseError) : null
        ),
        h("div", { className: "two" },
          h("label", null, "상담 희망 날짜",
            h("input", { type: "date", name: "preferredDate", min: getTodayLocalDate(), value: form.preferredDate, onChange: function (e) { updateField("preferredDate", e.target.value); } })
          ),
          h("label", null, "상담 희망 시간대",
            h("select", { name: "preferredPeriod", "aria-label": "상담 희망 시간대", value: form.preferredPeriod, onChange: function (e) { updateField("preferredPeriod", e.target.value); } },
              ["오전", "오후"].map(function (value) {
                return h("option", { key: value, value: value }, value);
              })
            )
          )
        ),
        h("label", null, "문의 내용 *",
          h("textarea", { required: true, name: "message", minLength: 10, maxLength: 2000, rows: 6, value: form.message, onChange: function (e) { updateField("message", e.target.value); } })
        ),
        h("section", { className: "consultation-privacy-detail", "aria-labelledby": "consultation-privacy-title" },
          h("h2", { id: "consultation-privacy-title" }, "입력 정보 안내"),
          h("dl", null,
            h("div", null, h("dt", null, "필수 입력"), h("dd", null, "이름, 연락처, 희망 교육과정, 문의 내용")),
            h("div", null, h("dt", null, "선택 입력"), h("dd", null, "이메일, 희망 날짜와 시간대, 마케팅 수신 동의"))
          ),
          h("p", null, "실제 접수 운영 전에는 운영기관의 개인정보 처리 주체, 수집·이용 목적, 보유 기간, 파기 기준과 문의처를 확정해 별도 안내해야 합니다. 확인되지 않은 정책 정보는 임의로 기재하지 않습니다.")
        ),
        h("label", { className: "checkrow" },
          h("input", { type: "checkbox", name: "privacyConsent", required: true, checked: form.privacyConsent, onChange: function (e) { updateField("privacyConsent", e.target.checked); } }),
          " 개인정보 수집 및 이용 동의 (필수)"
        ),
        h("label", { className: "checkrow" },
          h("input", { type: "checkbox", checked: form.marketingConsent, onChange: function (e) { updateField("marketingConsent", e.target.checked); } }),
          " 마케팅 수신 동의 (선택)"
        ),
        error ? h("p", { className: "error", role: "alert", "aria-live": "assertive" }, error) : null,
        h("button", { className: "btn full", disabled: submitting || !form.privacyConsent || courseLoading || availableCourses.length === 0 },
          submitting ? "신청 처리 중..." : "상담 신청하기"
        )
      )
    )
  );
}

function getTodayLocalDate() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
}

const isStaticPreview = import.meta.env.VITE_STATIC_PREVIEW === "true";

function Notices() {
  const [items, setItems] = React.useState([]);
  const [keyword, setKeyword] = React.useState("");
  const [category, setCategory] = React.useState("전체");
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const categories = ["전체", "공지", "모집 안내", "교육과정", "교육 소식", "운영 안내"];
  const pageSize = 8;

  async function loadNotices(signal) {
    setLoading(true);
    setError("");
    try {
      if (isStaticPreview) {
        setItems(previewNotices);
        return;
      }
      const response = await api.get("/notices", signal ? { signal: signal } : undefined);
      if (!signal || !signal.aborted) {
        setItems(Array.isArray(response.data) ? response.data : []);
      }
    } catch (requestError) {
      if (signal && signal.aborted) return;
      setItems([]);
      setError(
        requestError.response && requestError.response.data && requestError.response.data.message
          ? requestError.response.data.message
          : "공지사항 서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요."
      );
    } finally {
      if (!signal || !signal.aborted) setLoading(false);
    }
  }

  React.useEffect(function () {
    const controller = new AbortController();
    loadNotices(controller.signal);
    return function () { controller.abort(); };
  }, []);

  const normalizedKeyword = keyword.trim().toLowerCase();
  const filtered = items.filter(function (notice) {
    const title = String(notice.title || "").toLowerCase();
    const content = String(notice.content || "").toLowerCase();
    const categoryMatches = category === "전체" || (notice.category || "공지") === category;
    const keywordMatches = !normalizedKeyword || title.includes(normalizedKeyword) || content.includes(normalizedKeyword);
    return categoryMatches && keywordMatches;
  }).sort(function (a, b) {
    if (Boolean(a.pinned) !== Boolean(b.pinned)) return a.pinned ? -1 : 1;
    return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
  });

  const pinnedNotice = filtered.find(function (notice) { return Boolean(notice.pinned); });
  const listItems = pinnedNotice ? filtered.filter(function (notice) { return String(notice.id) !== String(pinnedNotice.id); }) : filtered;
  const totalPages = Math.max(1, Math.ceil(listItems.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleItems = listItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function changeKeyword(value) {
    setKeyword(value);
    setPage(1);
  }

  function changeCategory(value) {
    setCategory(value);
    setPage(1);
  }

  return h("section", { className: "page notice-page" },
    h("div", { className: "container" },
      h("div", { className: "notice-heading" },
        h("div", null,
          h("span", { className: "eyebrow" }, "NOTICE"),
          h("h1", null, "IT ACADEMY 소식"),
          h("p", { className: "lead" }, "교육과정 운영 소식부터 새로운 모집 안내까지, IT ACADEMY의 최신 소식을 확인하세요."),
          isStaticPreview ? h("p", { className: "notice-preview-disclaimer", role: "note" }, "시연용 예시 게시물입니다. 실제 모집 일정과 운영 공지는 정식 서비스의 최신 게시글을 확인해 주세요.") : null
        ),
        h("div", { className: "notice-heading-visual" },
          h("div", { className: "notice-heading-mark" }, "NEWS", h("b", null, " & NOTICE")),
          h(AcademyScene, { variant: "notices" })
        )
      ),
      h("div", { className: "notice-toolbar" },
        h("div", { className: "notice-categories", role: "group", "aria-label": "공지사항 분류" },
          categories.map(function (value) {
            return h("button", {
              type: "button",
              key: value,
              className: category === value ? "notice-category active" : "notice-category",
              onClick: function () { changeCategory(value); }
            }, value);
          })
        ),
        h("label", { className: "notice-search" },
          h("span", { className: "sr-only" }, "공지사항 검색"),
          h("input", {
            type: "search",
            placeholder: "제목 또는 내용 검색",
            value: keyword,
            onChange: function (event) { changeKeyword(event.target.value); }
          }),
          h("span", { "aria-hidden": "true" }, "⌕")
        )
      ),
      h("div", { className: "notice-summary" },
        h("span", null, "TOTAL ", h("b", null, loading ? "—" : filtered.length)),
        h("span", null, "최신 공지사항을 확인하세요")
      ),
      loading ? h("div", { className: "notice-skeleton", "aria-label": "공지사항 불러오는 중" },
        [1, 2, 3, 4].map(function (value) {
          return h("div", { className: "notice-skeleton-row", key: value },
            h("i", null), h("div", null, h("b", null), h("span", null)), h("em", null)
          );
        })
      ) : error ? h("div", { className: "notice-state error-state" },
        h("div", { className: "notice-state-icon" }, "!"),
        h("h2", null, "공지사항을 불러오지 못했습니다."),
        h("p", null, error),
        h("button", { type: "button", className: "btn", onClick: function () { loadNotices(); } }, "다시 불러오기")
      ) : filtered.length === 0 ? h("div", { className: "notice-state" },
        h("div", { className: "notice-state-icon" }, "⌕"),
        h("h2", null, items.length ? "검색 결과가 없습니다." : "등록된 공지사항이 없습니다."),
        h("p", null, items.length ? "다른 검색어 또는 분류를 선택해 주세요." : "새로운 소식이 등록되면 이곳에서 확인할 수 있습니다."),
        items.length ? h("button", { type: "button", className: "btn ghost", onClick: function () { changeKeyword(""); changeCategory("전체"); } }, "검색 초기화") : null
      ) : h(React.Fragment, null,
        pinnedNotice ? h(Link, { to: "/notices/" + pinnedNotice.id, className: "notice-featured" },
          h("div", { className: "notice-featured-label" }, h("span", null, "IMPORTANT NOTICE"), h("b", null, "중요 공지")),
          h("div", { className: "notice-featured-body" },
            h("div", null,
              h("span", { className: "notice-tag featured-tag" }, pinnedNotice.category || "공지"),
              h("h2", null, pinnedNotice.title),
              h("p", null, String(pinnedNotice.content || "").replace(/\s+/g, " ").slice(0, 125))
            ),
            h("span", { className: "notice-featured-arrow" }, "→")
          ),
          pinnedNotice.createdAt ? h("small", null, formatNoticeDate(pinnedNotice.createdAt)) : null
        ) : null,
        h("div", { className: "notice-list" },
          h("div", { className: "notice-list-head" },
            h("span", null, "분류"),
            h("span", null, "제목"),
            h("span", null, "등록일"),
            h("span", null, " ")
          ),
          visibleItems.map(function (notice) {
            return h(Link, { key: notice.id, to: "/notices/" + notice.id, className: notice.pinned ? "notice-row pinned" : "notice-row" },
              h("span", { className: "notice-tag" }, notice.category || "공지"),
              h("span", { className: "notice-row-title" },
                notice.pinned ? h("b", { className: "notice-pin" }, "중요") : null,
                h("strong", null, notice.title)
              ),
              notice.createdAt ? h("time", null, formatNoticeDate(notice.createdAt)) : null,
              h("span", { className: "notice-row-arrow", "aria-hidden": "true" }, "→")
            );
          })
        ),
        totalPages > 1 ? h("nav", { className: "notice-pagination", "aria-label": "공지사항 페이지" },
          h("button", { type: "button", disabled: currentPage === 1, onClick: function () { setPage(currentPage - 1); } }, "이전"),
          Array.from({ length: totalPages }, function (_, index) {
            const number = index + 1;
            return h("button", {
              type: "button",
              key: number,
              className: currentPage === number ? "active" : "",
              "aria-current": currentPage === number ? "page" : undefined,
              onClick: function () { setPage(number); }
            }, String(number));
          }),
          h("button", { type: "button", disabled: currentPage === totalPages, onClick: function () { setPage(currentPage + 1); } }, "다음")
        ) : null
      )
    )
  );
}

function NoticeDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  async function loadNotice(signal) {
    setLoading(true);
    setError("");
    try {
      if (isStaticPreview) {
        const preview = previewNotices.find(function (item) {
          return String(item.id) === String(params.id);
        });
        if (preview) setNotice(preview);
        else setError("공지사항을 찾을 수 없습니다.");
        return;
      }
      const response = await api.get("/notices/" + params.id, signal ? { signal: signal } : undefined);
      if (!signal || !signal.aborted) setNotice(response.data);
    } catch (requestError) {
      if (signal && signal.aborted) return;
      setError(
        requestError.response && requestError.response.status === 404
          ? "해당 공지사항을 찾을 수 없거나 현재 공개되지 않은 게시글입니다."
          : "공지사항 상세 정보를 불러오지 못했습니다. 다시 시도해 주세요."
      );
    } finally {
      if (!signal || !signal.aborted) setLoading(false);
    }
  }

  React.useEffect(function () {
    const controller = new AbortController();
    loadNotice(controller.signal);
    return function () { controller.abort(); };
  }, [params.id]);

  return h("section", { className: "page notice-detail-page" },
    h("div", { className: "container" },
      h("button", { type: "button", className: "notice-back", onClick: function () { navigate("/notices"); } }, "← 공지사항 목록"),
      loading ? h("div", { className: "notice-state" }, "공지사항을 불러오는 중입니다.") :
      error ? h("div", { className: "notice-state error-state", role: "alert", "aria-live": "assertive" },
        h("h2", null, "게시글을 확인할 수 없습니다."),
        h("p", null, error),
        h("button", { className: "btn", onClick: function () { loadNotice(); } }, "다시 시도")
      ) : h("article", { className: "notice-detail" },
        isStaticPreview ? h("p", { className: "notice-preview-disclaimer", role: "note" }, "시연용 예시 게시물 · 실제 운영 공지가 아닙니다.") : null,
        h("div", { className: "notice-detail-meta" },
          h("span", { className: "notice-tag" }, notice.category || "공지"),
          notice.pinned ? h("b", { className: "notice-pin" }, "중요 공지") : null,
          notice.createdAt ? h("time", null, formatNoticeDate(notice.createdAt)) : null
        ),
        h("div", { className: "notice-detail-title-row" },
          h("h1", null, notice.title),
          h(AcademyScene, { variant: "notice-detail" })
        ),
        h("div", { className: "notice-detail-divider" }),
        h("div", { className: "notice-content" }, notice.content),
        h("div", { className: "notice-detail-footer" },
          h("span", null, "IT ACADEMY"),
          h("button", { type: "button", className: "btn notice-back-action", onClick: function () { navigate("/notices"); } }, "목록으로 돌아가기")
        )
      )
    )
  );
}


function RouteEffects() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const scrollPositions = React.useRef({});
  const [showBackToTop, setShowBackToTop] = React.useState(false);

  React.useEffect(function () {
    const previousMode = window.history.scrollRestoration;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    return function () {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = previousMode || "auto";
      }
    };
  }, []);

  React.useEffect(function () {
    function saveScrollPosition() {
      const top = window.scrollY || window.pageYOffset || 0;
      scrollPositions.current[location.key] = top;
      setShowBackToTop(top > 520 && !location.pathname.startsWith("/admin"));
    }

    saveScrollPosition();
    window.addEventListener("scroll", saveScrollPosition, { passive: true });
    return function () {
      window.removeEventListener("scroll", saveScrollPosition);
    };
  }, [location.key, location.pathname]);

  React.useLayoutEffect(function () {
    const metadata = getPageMetadata(location.pathname);
    document.title = metadata.title + " | IT ACADEMY";

    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", metadata.description);

    const scrollAction = getScrollAction(
      navigationType,
      scrollPositions.current[location.key]
    );

    if (location.hash) {
      let targetId = location.hash.slice(1);
      try {
        targetId = decodeURIComponent(targetId);
      } catch (error) {
        // 잘못된 해시 문자열은 원문 ID로 조회합니다.
      }
      window.requestAnimationFrame(function () {
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ block: "start" });
          if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        } else {
          window.scrollTo(0, 0);
        }
      });
    } else {
      window.scrollTo(0, scrollAction.top);
      const main = document.getElementById("main-content");
      if (main) main.focus({ preventScroll: true });
    }

    const announcer = document.getElementById("route-announcer");
    if (announcer) announcer.textContent = metadata.title;
  }, [location.key, location.pathname, location.hash, navigationType]);

  function scrollToTop() {
    const reducedMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: reducedMotion ? "auto" : "smooth"
    });
  }

  return h(React.Fragment, null,
    h("div", {
      id: "route-announcer",
      className: "sr-only",
      "aria-live": "polite",
      "aria-atomic": "true"
    }),
    showBackToTop ? h("button", {
      type: "button",
      className: "back-to-top",
      onClick: scrollToTop,
      "aria-label": "페이지 맨 위로 이동"
    },
      h("span", { "aria-hidden": "true" }, "↑"),
      h("span", null, "맨 위로")
    ) : null
  );
}

function NotFound() {
  return h("section", { className: "page not-found-page" },
    h("div", { className: "container not-found-content" },
      h("span", { className: "eyebrow" }, "ERROR 404"),
      h("h1", null, "페이지를 찾을 수 없습니다."),
      h("p", { className: "lead" }, "주소가 변경되었거나 공개되지 않은 페이지일 수 있습니다."),
      h("div", { className: "not-found-actions" },
        h(Link, { to: "/", className: "btn" }, "메인 페이지로 이동"),
        h(Link, { to: "/courses", className: "btn ghost" }, "교육과정 살펴보기")
      )
    )
  );
}

function App() {
  return h(BrowserRouter, { basename: import.meta.env.BASE_URL },
    h(RouteEffects),
    h(Routes, null,
      h(Route, { element: h(Layout) },
        h(Route, { path: "/", element: h(AcademyHome) }),
        h(Route, { path: "/about", element: h(AcademyAbout) }),
        h(Route, { path: "/courses", element: h(Courses) }),
        h(Route, { path: "/courses/:id", element: h(Courses) }),
        h(Route, { path: "/projects", element: h(AcademyProjects) }),
        h(Route, { path: "/consultation", element: h(Consultation) }),
        h(Route, { path: "/notices", element: h(Notices) }),
        h(Route, { path: "/notices/:id", element: h(NoticeDetail) }),
        h(Route, { path: "*", element: h(NotFound) })
      ),
      h(Route, { path: "/admin/*", element: h(AdminApp) })
    )
  );
}

export default App;
