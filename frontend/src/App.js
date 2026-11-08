import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  Outlet,
  useParams,
  useNavigate
} from "react-router-dom";
import api from "./api.js";
import AdminApp from "./AdminApp.js";
import { AcademyHome, AcademyAbout, AcademyProjects } from "./academy-pages.js";

const h = React.createElement;

// API 연결에 실패해도 화면을 확인할 수 있도록 준비한 교육과정 기본 데이터입니다.
const courseSeed = [
  { id: 1, title: "AI·머신러닝 실무 개발자 과정", category: "AI", duration: "6개월", recruitmentStatus: "모집 중", summary: "Python과 머신러닝으로 데이터를 분석하고 예측 모델을 구현합니다.", target: "비전공자 및 전공자 모두 수강 가능", curriculum: "Python 기초 → 데이터 처리 → 머신러닝 → 딥러닝 → 영화 추천 프로젝트", skills: "Python · NumPy · Pandas · Scikit-learn · PyTorch" },
  { id: 2, title: "빅데이터 분석 전문가 과정", category: "DATA", duration: "5개월", recruitmentStatus: "모집 예정", summary: "대규모 데이터를 분석하고 의미 있는 인사이트를 시각화합니다.", target: "데이터 분석과 시각화에 관심 있는 사람", curriculum: "Python·SQL → 전처리 → 통계 분석 → 시각화 → 분석 대시보드", skills: "Python · SQL · Pandas · Spark" },
  { id: 3, title: "생성형 AI 서비스 개발 과정", category: "GEN AI", duration: "4개월", recruitmentStatus: "모집 중", summary: "LLM과 RAG를 활용해 실제 문제를 해결하는 AI 서비스를 만듭니다.", target: "생성형 AI를 실제 서비스에 적용하고 싶은 사람", curriculum: "API → LLM → 프롬프트 → 임베딩·RAG → 문서 질의응답", skills: "Python · LLM API · Embedding · RAG" },
  { id: 4, title: "AI 기반 웹 서비스 개발 과정", category: "WEB", duration: "6개월", recruitmentStatus: "모집 마감", summary: "웹 기술과 AI를 연결해 사용 가능한 서비스를 구현합니다.", target: "웹 개발과 AI 연동을 함께 학습하고 싶은 사람", curriculum: "Java → Spring Boot → React → MySQL → AI API 연동", skills: "Java · Spring Boot · React · MySQL" }
];


 
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
      { question: "교육 일정과 비용은 확정되어 있나요?", answer: "이 페이지의 일정은 데모 데이터입니다. 실제 개강일, 교육비, 지원 제도 및 모집 인원은 운영기관 확인이 필요합니다." }
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
    faqs:[{question:"통계 전공 지식이 필요한가요?",answer:"기초 통계 개념부터 다루도록 구성했습니다. 수학적 배경과 학습 난이도는 상담에서 확인할 수 있습니다."},{question:"프로젝트 결과물은 무엇인가요?",answer:"분석용 SQL, 전처리 코드, 대시보드와 분석 보고서를 결과물로 정리합니다."},{question:"모집 일정은 확정인가요?",answer:"화면 구성용 데모 일정입니다. 실제 일정과 비용은 운영기관 확인이 필요합니다."}]
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
  const links = [
    ["/about", "교육 철학"],
    ["/courses", "교육과정"],
    ["/projects", "프로젝트"],
    ["/notices", "공지사항"]
  ];

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
          onClick: function () { setMenuOpen(!menuOpen); }
        }, menuOpen ? "×" : "☰"),
        h("nav", { className: menuOpen ? "navlinks show academy-navlinks" : "navlinks academy-navlinks", "aria-label": "주요 메뉴" },
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
    h("main", { id: "main-content" }, h(Outlet)),
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
  return h("article", { className: "course" },
    h("div", { className: "coursehead" },
      h("span", { className: "number" }, String(course.id).padStart(2, "0")),
      h("span", { className: "status" }, course.recruitmentStatus)
    ),
    h("small", { className: "eyebrow" }, course.category),
    h("h3", null, course.title),
    h("p", null, course.summary),
    h("div", { className: "coursefoot" },
      h("b", null, course.duration),
      h(Link, { to: "/courses/" + course.id }, "자세히 보기 →")
    )
  );
}

function Courses() {
  const params = useParams();
  const [items, setItems] = React.useState(courseSeed);
  const [keyword, setKeyword] = React.useState("");
  const [category, setCategory] = React.useState("전체");

  React.useEffect(function () {
    api.get("/courses")
      .then(function (response) {
        if (Array.isArray(response.data) && response.data.length > 0) {
          setItems(response.data);
        }
      })
      .catch(function () {});
  }, []);

  if (params.id) {
    const selected = items.find(function (item) {
      return String(item.id) === params.id;
    });

    if (!selected) {
      return h("section", { className: "page" },
        h("div", { className: "container" }, h("h1", null, "과정을 찾을 수 없습니다."))
      );
    }

    const detailData = courseDetailData[selected.id] || courseDetailData[1];
    const modules = detailData.modules;
    const benefits = detailData.benefits;
    const faqs = detailData.faqs;

    return h("section", { className: "course-detail-page" },
      h("div", { className: "course-detail-hero" },
        h("div", { className: "container course-detail-hero-inner" },
          h("span", { className: "eyebrow light" }, selected.category + " PROGRAM · LEARNING PATH"),
          h("span", { className: "course-status-pill" }, selected.recruitmentStatus || "모집 안내"),
          h("h1", null, selected.title),
          h("p", null, detailData.intro),
          h("div", { className: "course-detail-tags" },
            h("span", null, "교육 기간 " + selected.duration),
            h("span", null, "프로젝트 중심 실습"),
            h("span", null, "전공 무관 지원 가능")
          ),
          h("div", { className: "actions" },
            h(Link, { to: "/consultation", className: "btn" }, "과정 상담 신청하기"),
            h(Link, { to: "/courses", className: "btn ghost" }, "전체 과정 보기")
          )
        )
      ),
      h("div", { className: "container course-detail-content" },
        h("section", { className: "course-recruit-panel" },
          h("div", null,
            h("span", { className: "eyebrow" }, "RECRUITMENT GUIDE"),
            h("h2", null, "모집 안내"),
            h("p", null, "모집 일정과 정원은 운영기관이 확정한 최신 공지를 기준으로 안내합니다. 확인되지 않은 날짜나 인원은 임의로 표시하지 않습니다.")
          ),
          h("div", { className: "recruit-facts" },
            h("article", null, h("small", null, "모집 기간"), h("b", null, detailData.recruitPeriod)),
            h("article", null, h("small", null, "개강 예정"), h("b", null, detailData.startDate)),
            h("article", null, h("small", null, "교육 방식"), h("b", null, "오프라인 · 프로젝트 실습")),
            h("article", null, h("small", null, "교육 대상"), h("b", null, selected.target))
          )
        ),
        h("section", { className: "course-detail-section" },
          h("div", { className: "course-section-heading" },
            h("span", { className: "eyebrow" }, "WHAT YOU WILL LEARN"),
            h("h2", null, "과정 소개"),
            h("p", null, detailData.description)
          ),
          h("div", { className: "course-outcomes" },
            detailData.outcomes.map(function (item, index) {
              return h("article", { key: item.title },
                h("span", null, "0" + (index + 1)),
                h("h3", null, item.title),
                h("p", null, item.description)
              );
            })
          )
        ),
        h("section", { className: "course-detail-section curriculum-section" },
          h("div", { className: "course-section-heading" },
            h("span", { className: "eyebrow" }, "LEARNING ROADMAP"),
            h("h2", null, "단계별 커리큘럼"),
            h("p", null, "기초 개념부터 팀 프로젝트 발표까지 순서대로 경험합니다.")
          ),
          h("div", { className: "curriculum-list" },
            modules.map(function (item, index) {
              return h("article", { className: "curriculum-item", key: item.title },
                h("span", { className: "curriculum-number" }, "STEP 0" + (index + 1)),
                h("div", null,
                  h("h3", null, item.title),
                  h("p", null, item.description),
                  h("small", null, item.tools)
                )
              );
            })
          )
        ),
        h("section", { className: "course-detail-section" },
          h("div", { className: "course-section-heading" },
            h("span", { className: "eyebrow" }, "PROJECT PORTFOLIO"),
            h("h2", null, "직접 완성하는 프로젝트"),
            h("p", null, "학습한 기술을 연결해 동작하는 결과물로 구현합니다.")
          ),
          h("div", { className: "course-project-feature" },
            h("div", null,
              h("small", null, "FINAL TEAM PROJECT"),
              h("h3", null, detailData.projectTitle),
              h("p", null, detailData.projectDescription)
            ),
            h("div", { className: "project-deliverables" },
              detailData.deliverables.map(function (item) {
                return h("span", { key: item }, item);
              })
            )
          )
        ),
        h("section", { className: "course-detail-section academy-course-quality" },
          h("div", { className: "course-section-heading" },
            h("span", { className: "eyebrow" }, "LEARNING QUALITY & AI COLLABORATION"),
            h("h2", null, "수업과 프로젝트의 완성도를 확인하는 기준"),
            h("p", null, "코드를 많이 작성하는 것보다 요구사항을 이해하고, 선택한 기술을 설명하고, 핵심 기능을 검증하는 능력을 중요하게 다룹니다.")
          ),
          h("div", { className: "academy-course-quality-grid" },
            [
              ["01", "개념 이해", "주요 개념과 데이터 흐름을 자신의 언어로 설명하고 작은 실습으로 확인합니다."],
              ["02", "직접 구현", "AI 도구를 보조적으로 활용하되 핵심 로직과 코드 변경 이유를 직접 이해합니다."],
              ["03", "품질 검증", "정상·오류·경계 조건을 테스트하고 보안과 접근성의 기본 요구를 점검합니다."],
              ["04", "결과 설명", "README, API 명세, 테스트 결과, 발표 자료로 구현 과정과 한계를 전달합니다."]
            ].map(function (item) {
              return h("article", { key: item[0] },
                h("b", null, item[0]),
                h("h3", null, item[1]),
                h("p", null, item[2])
              );
            })
          ),
          h("div", { className: "academy-course-ai-note" },
            h("b", null, "AI 활용 원칙"),
            " AI가 생성한 코드도 제출 전 검토 대상입니다. 요구사항 추적, 직접 설명, 코드 리뷰, 테스트 결과를 확인하는 방식으로 학습하도록 설계합니다."
          )
        ),
        h("section", { className: "course-detail-section" },
          h("div", { className: "course-section-heading" },
            h("span", { className: "eyebrow" }, "STUDENT SUPPORT"),
            h("h2", null, "학습 지원 및 제공 항목")
          ),
          h("div", { className: "course-benefits" },
            benefits.map(function (item) {
              return h("article", { key: item.title },
                h("h3", null, item.title),
                h("p", null, item.description)
              );
            })
          )
        ),
        h("section", { className: "course-detail-section course-process-section" },
          h("div", { className: "course-section-heading" },
            h("span", { className: "eyebrow" }, "HOW TO APPLY"),
            h("h2", null, "수강 신청 절차")
          ),
          h("div", { className: "application-steps" },
            [["01", "상담 신청", "관심 과정과 학습 목표를 남겨주세요."], ["02", "상담 및 과정 안내", "교육 내용과 참여 조건을 확인합니다."], ["03", "지원 절차 확인", "필요 서류와 등록 절차를 안내받습니다."], ["04", "개강 준비", "학습 환경과 사전 준비 사항을 확인합니다."]].map(function (item) {
              return h("article", { key: item[0] },
                h("b", null, item[0]),
                h("h3", null, item[1]),
                h("p", null, item[2])
              );
            })
          )
        ),
        h("section", { className: "course-detail-section" },
          h("div", { className: "course-section-heading" },
            h("span", { className: "eyebrow" }, "FAQ"),
            h("h2", null, "자주 묻는 질문")
          ),
          h("div", { className: "course-faq-list" },
            faqs.map(function (item) {
              return h("details", { key: item.question },
                h("summary", null, item.question),
                h("p", null, item.answer)
              );
            })
          )
        ),
        h("section", { className: "course-final-cta" },
          h("div", null,
            h("span", { className: "eyebrow light" }, "YOUR NEXT CHAPTER STARTS HERE"),
            h("h2", null, "나에게 맞는 과정인지 먼저 상담해 보세요."),
            h("p", null, "커리큘럼, 학습 난이도, 준비 사항을 차근차근 안내합니다.")
          ),
          h(Link, { to: "/consultation", className: "btn white" }, "무료 상담 신청하기")
        )
      )
    );
  }

  const filtered = items.filter(function (course) {
    const categoryMatches = category === "전체" || course.category === category;
    const keywordMatches = course.title.toLowerCase().includes(keyword.toLowerCase());
    return categoryMatches && keywordMatches;
  });

  return h("section", { className: "page" },
    h("div", { className: "container" },
      h("span", { className: "eyebrow" }, "OUR PROGRAMS"),
      h("h1", null, "교육과정"),
      h("p", { className: "lead" }, "관심 분야와 목표에 맞는 전문 교육과정을 선택하세요."),
      h("div", { className: "filters" },
        h("input", {
          placeholder: "과정명 검색",
          value: keyword,
          onChange: function (event) { setKeyword(event.target.value); }
        }),
        h("select", {
          value: category,
          onChange: function (event) { setCategory(event.target.value); }
        },
          ["전체", "AI", "DATA", "GEN AI", "WEB"].map(function (value) {
            return h("option", { key: value, value: value }, value);
          })
        )
      ),
      h("div", { className: "grid4" },
        filtered.map(function (course) {
          return h(CourseCard, { course: course, key: course.id });
        })
      )
    )
  );
}

function Consultation() {
  const navigate = useNavigate();
  const [form, setForm] = React.useState({
    name: "", phone: "", email: "", courseTitle: "",
    preferredDate: "", preferredPeriod: "오전", message: "",
    privacyConsent: false, marketingConsent: false
  });
  const [error, setError] = React.useState("");
  const [receipt, setReceipt] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  function updateField(name, value) {
    setForm(function (previous) {
      return Object.assign({}, previous, { [name]: value });
    });
  }

  async function submitForm(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await api.post("/inquiries", form);
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
      h("div", null,
        h("span", { className: "eyebrow" }, "CONSULTATION"),
        h("h1", null, "교육과정 상담 신청"),
        h("p", { className: "lead" }, "희망 과정과 문의 내용을 남겨주시면 안내해 드립니다.")
      ),
      h("form", { className: "form", onSubmit: submitForm },
        h("label", null, "이름 *",
          h("input", { required: true, value: form.name, onChange: function (e) { updateField("name", e.target.value); } })
        ),
        h("label", null, "연락처 *",
          h("input", { required: true, value: form.phone, placeholder: "010-0000-0000", onChange: function (e) { updateField("phone", e.target.value); } })
        ),
        h("label", null, "이메일",
          h("input", { type: "email", value: form.email, onChange: function (e) { updateField("email", e.target.value); } })
        ),
        h("label", null, "희망 교육과정 *",
          h("select", { required: true, value: form.courseTitle, onChange: function (e) { updateField("courseTitle", e.target.value); } },
            h("option", { value: "" }, "과정을 선택하세요"),
            courseSeed.map(function (course) {
              return h("option", { key: course.id, value: course.title }, course.title);
            })
          )
        ),
        h("div", { className: "two" },
          h("label", null, "상담 희망 날짜",
            h("input", { type: "date", value: form.preferredDate, onChange: function (e) { updateField("preferredDate", e.target.value); } })
          ),
          h("label", null, "상담 희망 시간대",
            h("select", { value: form.preferredPeriod, onChange: function (e) { updateField("preferredPeriod", e.target.value); } },
              ["오전", "오후"].map(function (value) {
                return h("option", { key: value, value: value }, value);
              })
            )
          )
        ),
        h("label", null, "문의 내용 *",
          h("textarea", { required: true, rows: 5, value: form.message, onChange: function (e) { updateField("message", e.target.value); } })
        ),
        h("label", { className: "checkrow" },
          h("input", { type: "checkbox", checked: form.privacyConsent, onChange: function (e) { updateField("privacyConsent", e.target.checked); } }),
          " 개인정보 수집 및 이용 동의 (필수)"
        ),
        h("label", { className: "checkrow" },
          h("input", { type: "checkbox", checked: form.marketingConsent, onChange: function (e) { updateField("marketingConsent", e.target.checked); } }),
          " 마케팅 수신 동의 (선택)"
        ),
        error ? h("p", { className: "error" }, error) : null,
        h("button", { className: "btn full", disabled: submitting || !form.privacyConsent },
          submitting ? "신청 처리 중..." : "상담 신청하기"
        )
      )
    )
  );
}

function formatNoticeDate(value) {
  if (!value) return "날짜 정보 없음";
  return String(value).replace("T", " ").slice(0, 10).replace(/-/g, ".");
}

const isStaticPreview = import.meta.env.VITE_STATIC_PREVIEW === "true";

// GitHub Pages는 백엔드 없이 화면을 공개하므로 미리보기 전용 안내를 사용합니다.
const previewNotices = [
  {
    id: "demo-1", title: "2026 겨울학기 AI·IT 교육과정 모집 안내", category: "모집 안내",
    content: "AI·머신러닝, 빅데이터 분석, 생성형 AI 서비스, 웹 서비스 개발 과정의 데모 모집 안내입니다. 과정별 일정과 지원 조건은 과정 상세 페이지에서 확인할 수 있으며, 실제 운영 정보는 상담을 통해 확인해 주세요.",
    createdAt: "2026-11-06T09:00:00", pinned: true
  },
  {
    id: "demo-2", title: "AI·머신러닝 실무 개발 과정 커리큘럼 공개", category: "교육과정",
    content: "Python 기초부터 데이터 전처리, 머신러닝, 딥러닝, 팀 프로젝트까지 이어지는 학습 로드맵을 공개합니다. 프로젝트 예시는 학습 결과물의 형태를 설명하기 위한 데모 콘텐츠입니다.",
    createdAt: "2026-11-05T10:00:00", pinned: false
  },
  {
    id: "demo-3", title: "교육과정 선택을 위한 온라인 설명회 안내", category: "모집 안내",
    content: "관심 분야별 교육과정 구성과 프로젝트 진행 방식을 소개하는 설명회 예시 안내입니다. 일정과 참여 링크는 실제 운영 시 별도 공지됩니다.",
    createdAt: "2026-11-04T14:00:00", pinned: false
  },
  {
    id: "demo-4", title: "수강 신청 전 확인해야 할 준비 사항", category: "공지",
    content: "관심 과정의 교육 목표와 주차별 커리큘럼을 확인하고, 본인의 학습 가능 시간과 노트북 사용 환경을 점검해 주세요. 선수 지식이 필요한 과정은 상담 단계에서 안내합니다.",
    createdAt: "2026-11-03T09:30:00", pinned: false
  },
  {
    id: "demo-5", title: "팀 프로젝트 결과물 및 포트폴리오 구성 소개", category: "교육 소식",
    content: "팀 프로젝트는 문제 정의, 역할 분담, 기능 구현, 테스트, 결과 발표 순서로 진행하는 것을 기본 방향으로 합니다. 결과물 예시는 프로젝트 페이지에서 확인할 수 있습니다.",
    createdAt: "2026-11-02T11:00:00", pinned: false
  },
  {
    id: "demo-6", title: "IT ACADEMY 홈페이지 이용 안내", category: "운영 안내",
    content: "교육과정에서 과정별 정보를 확인하고, 프로젝트에서 결과물 예시를 살펴볼 수 있습니다. 궁금한 점은 상담 신청 페이지를 통해 문의하는 데모 흐름으로 구성되어 있습니다.",
    createdAt: "2026-11-01T09:00:00", pinned: false
  }
];

function Notices() {
  const [items, setItems] = React.useState([]);
  const [keyword, setKeyword] = React.useState("");
  const [category, setCategory] = React.useState("전체");
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const categories = ["전체", "공지", "모집 안내", "교육과정", "교육 소식", "운영 안내"];
  const pageSize = 8;

  async function loadNotices() {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/notices");
      setItems(Array.isArray(response.data) && response.data.length > 0 ? response.data : previewNotices);
    } catch (requestError) {
      setItems(previewNotices);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(function () {
    loadNotices();
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
          h("p", { className: "lead" }, "교육과정 운영 소식부터 새로운 모집 안내까지, IT ACADEMY의 최신 소식을 확인하세요.")
        ),
        h("div", { className: "notice-heading-mark" }, "NEWS", h("b", null, " & NOTICE"))
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
        h("button", { type: "button", className: "btn", onClick: loadNotices }, "다시 불러오기")
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
          h("small", null, formatNoticeDate(pinnedNotice.createdAt))
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
              h("time", null, formatNoticeDate(notice.createdAt)),
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

  async function loadNotice() {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/notices/" + params.id);
      setNotice(response.data);
    } catch (requestError) {
      const preview = previewNotices.find(function (item) { return String(item.id) === String(params.id); });
      if (preview) setNotice(preview);
      else setError("해당 공지사항을 찾을 수 없거나 현재 공개되지 않은 게시글입니다.");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(function () {
    loadNotice();
  }, [params.id]);

  return h("section", { className: "page notice-detail-page" },
    h("div", { className: "container" },
      h("button", { className: "notice-back", onClick: function () { navigate("/notices"); } }, "← 공지사항 목록"),
      loading ? h("div", { className: "notice-state" }, "공지사항을 불러오는 중입니다.") :
      error ? h("div", { className: "notice-state error-state" },
        h("h2", null, "게시글을 확인할 수 없습니다."),
        h("p", null, error),
        h("button", { className: "btn", onClick: loadNotice }, "다시 시도")
      ) : h("article", { className: "notice-detail" },
        h("div", { className: "notice-detail-meta" },
          h("span", { className: "notice-tag" }, notice.category || "공지"),
          notice.pinned ? h("b", { className: "notice-pin" }, "중요 공지") : null,
          h("time", null, formatNoticeDate(notice.createdAt))
        ),
        h("h1", null, notice.title),
        h("div", { className: "notice-detail-divider" }),
        h("div", { className: "notice-content" }, notice.content),
        h("div", { className: "notice-detail-footer" },
          h("span", null, "IT ACADEMY"),
          h("button", { className: "btn ghost", onClick: function () { navigate("/notices"); } }, "목록으로 돌아가기")
        )
      )
    )
  );
}

function App() {
  return h(BrowserRouter, { basename: import.meta.env.BASE_URL },
    h(Routes, null,
      h(Route, { element: h(Layout) },
        h(Route, { path: "/", element: h(AcademyHome) }),
        h(Route, { path: "/about", element: h(AcademyAbout) }),
        h(Route, { path: "/courses", element: h(Courses) }),
        h(Route, { path: "/courses/:id", element: h(Courses) }),
        h(Route, { path: "/projects", element: h(AcademyProjects) }),
        h(Route, { path: "/consultation", element: h(Consultation) }),
        h(Route, { path: "/notices", element: h(Notices) }),
        h(Route, { path: "/notices/:id", element: h(NoticeDetail) })
      ),
      h(Route, { path: "/admin/*", element: h(AdminApp) })
    )
  );
}

export default App;
