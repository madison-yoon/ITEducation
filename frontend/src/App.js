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

const h = React.createElement;

// API 연결에 실패해도 화면을 확인할 수 있도록 준비한 교육과정 기본 데이터입니다.
const courseSeed = [
  { id: 1, title: "AI·머신러닝 실무 개발자 과정", category: "AI", duration: "6개월", recruitmentStatus: "모집 중", summary: "Python과 머신러닝으로 데이터를 분석하고 예측 모델을 구현합니다.", target: "비전공자 및 전공자 모두 수강 가능", curriculum: "Python 기초 → 데이터 처리 → 머신러닝 → 딥러닝 → 영화 추천 프로젝트", skills: "Python · NumPy · Pandas · Scikit-learn · PyTorch" },
  { id: 2, title: "빅데이터 분석 전문가 과정", category: "DATA", duration: "5개월", recruitmentStatus: "모집 예정", summary: "대규모 데이터를 분석하고 의미 있는 인사이트를 시각화합니다.", target: "데이터 분석과 시각화에 관심 있는 사람", curriculum: "Python·SQL → 전처리 → 통계 분석 → 시각화 → 분석 대시보드", skills: "Python · SQL · Pandas · Spark" },
  { id: 3, title: "생성형 AI 서비스 개발 과정", category: "GEN AI", duration: "4개월", recruitmentStatus: "모집 중", summary: "LLM과 RAG를 활용해 실제 문제를 해결하는 AI 서비스를 만듭니다.", target: "생성형 AI를 실제 서비스에 적용하고 싶은 사람", curriculum: "API → LLM → 프롬프트 → 임베딩·RAG → 문서 질의응답", skills: "Python · LLM API · Embedding · RAG" },
  { id: 4, title: "AI 기반 웹 서비스 개발 과정", category: "WEB", duration: "6개월", recruitmentStatus: "모집 마감", summary: "웹 기술과 AI를 연결해 사용 가능한 서비스를 구현합니다.", target: "웹 개발과 AI 연동을 함께 학습하고 싶은 사람", curriculum: "Java → Spring Boot → React → MySQL → AI API 연동", skills: "Java · Spring Boot · React · MySQL" }
];

const projectSeed = [
  { title: "AI 영화 추천 시스템", description: "사용자 선호 데이터 기반 추천 모델", category: "AI · ML" },
  { title: "소비 데이터 분석 대시보드", description: "대규모 소비 패턴 분석과 시각화", category: "BIG DATA" },
  { title: "문서 질의응답 AI 서비스", description: "문서 검색과 생성형 AI 응답 결합", category: "GEN AI" },
  { title: "AI 통합 웹 플랫폼", description: "AI 기능을 연결한 웹 서비스 구현", category: "WEB" }
];

function Header() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const links = [
    ["/about", "소개"],
    ["/courses", "교육과정"],
    ["/projects", "프로젝트"],
    ["/notices", "공지사항"]
  ];

  return h("header", { className: "header" },
    h("div", { className: "container nav" },
      h(Link, { to: "/", className: "brand" }, "IT ", h("b", null, "ACADEMY")),
      h("button", { className: "menu", onClick: function () { setMenuOpen(!menuOpen); } }, "☰"),
      h("nav", { className: menuOpen ? "navlinks show" : "navlinks" },
        links.map(function (item) {
          return h(NavLink, {
            to: item[0],
            key: item[0],
            onClick: function () { setMenuOpen(false); }
          }, item[1]);
        }),
        h(Link, {
          to: "/consultation",
          className: "btn small",
          onClick: function () { setMenuOpen(false); }
        }, "상담 신청")
      )
    )
  );
}

function Layout() {
  return h(React.Fragment, null,
    h(Header),
    h("main", null, h(Outlet)),
    h("footer", { className: "footer" },
      h("div", { className: "container footerrow" },
        h("div", null,
          h("div", { className: "brand" }, "IT ", h("b", null, "ACADEMY")),
          h("p", null, "AI · DATA · ENGINEERING EDUCATION")
        ),
        h("div", null,
          h(Link, { to: "/courses" }, "교육과정"),
          "　",
          h(Link, { to: "/notices" }, "공지사항"),
          "　",
          h(Link, { to: "/consultation" }, "상담 신청")
        ),
        h("small", null, "© 2026 IT ACADEMY · DEMO PROJECT")
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

function Home() {
  const [homeCourses, setHomeCourses] = React.useState(courseSeed);

  React.useEffect(function () {
    api.get("/courses").then(function (response) {
      if (Array.isArray(response.data)) setHomeCourses(response.data);
    }).catch(function () {});
  }, []);

  const journey = [
    ["01", "기초 학습", "핵심 개념과 개발 기초"],
    ["02", "핵심 기술", "과정별 전문 기술 습득"],
    ["03", "실무 프로젝트", "팀 기반 결과물 구현"],
    ["04", "결과물 발표", "완성 결과와 학습 정리"]
  ];

  return h(React.Fragment, null,
    h("section", { className: "hero" },
      h("div", { className: "orb orb1" }),
      h("div", { className: "orb orb2" }),
      h("div", { className: "container heroin" },
        h("span", { className: "eyebrow light" }, "AI · DATA · ENGINEERING"),
        h("h1", null, "AI 시대를 이끄는", h("br"), "실무형 IT 인재 양성"),
        h("p", null, "기초부터 실무 프로젝트까지, AI와 데이터 기술을 직접 구현하며 미래 IT 역량을 완성합니다."),
        h("div", { className: "actions" },
          h(Link, { to: "/courses", className: "btn" }, "교육과정 살펴보기"),
          h(Link, { to: "/consultation", className: "btn ghost" }, "상담 신청하기")
        )
      )
    ),
    h("section", { className: "section" },
      h("div", { className: "container split" },
        h("div", null,
          h("span", { className: "eyebrow" }, "WHY IT ACADEMY"),
          h("h2", null, "배우는 것을 넘어,", h("br"), "직접 만드는 개발 교육")
        ),
        h("p", { className: "lead" }, "기술의 원리를 이해하고 실제 문제를 해결하는 프로젝트 중심 학습을 지향합니다. 비전공자와 전공자 모두 기초부터 단계적으로 성장할 수 있도록 교육 흐름을 설계했습니다.")
      )
    ),
    h("section", { className: "section soft" },
      h("div", { className: "container" },
        h("div", { className: "sectionhead" },
          h("div", null,
            h("span", { className: "eyebrow" }, "OUR PROGRAMS"),
            h("h2", null, "목표에 맞는 AI·IT 교육과정")
          ),
          h(Link, { to: "/courses", className: "more" }, "전체 과정 보기 →")
        ),
        h("div", { className: "grid4" },
          homeCourses.map(function (course) {
            return h(CourseCard, { course: course, key: course.id });
          })
        )
      )
    ),
    h("section", { className: "section" },
      h("div", { className: "container" },
        h("span", { className: "eyebrow" }, "LEARNING JOURNEY"),
        h("h2", null, "기초에서 실무까지 이어지는 학습 흐름"),
        h("div", { className: "grid4 journey" },
          journey.map(function (item) {
            return h("article", { className: "journeycard", key: item[0] },
              h("b", null, item[0]),
              h("h3", null, item[1]),
              h("p", null, item[2])
            );
          })
        )
      )
    ),
    h("section", { className: "projectband" },
      h("div", { className: "container" },
        h("span", { className: "eyebrow light" }, "PROJECT SHOWCASE"),
        h("h2", null, "배운 기술을 결과물로 증명합니다"),
        h("p", null, "기획부터 구현까지 경험하는 교육과정 프로젝트 예시입니다."),
        h("div", { className: "grid4" },
          projectSeed.map(function (project) {
            return h("article", { className: "projectcard", key: project.title },
              h("small", null, project.category),
              h("h3", null, project.title),
              h("p", null, project.description)
            );
          })
        ),
        h("small", null, "※ 프로젝트 사례는 소개용 가상 데이터입니다.")
      )
    ),
    h("section", { className: "cta" },
      h("div", { className: "container ctarow" },
        h("div", null,
          h("span", { className: "eyebrow light" }, "START YOUR NEXT STEP"),
          h("h2", null, "나에게 맞는 교육과정을 찾아보세요."),
          h("p", null, "과정 선택부터 학습 방향까지 상담을 통해 안내합니다.")
        ),
        h(Link, { to: "/consultation", className: "btn white" }, "상담 신청하기 →")
      )
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

    const modules = String(selected.curriculum || "").split("→").map(function (item) { return item.trim(); }).filter(Boolean);
    return h("section", { className: "page course-detail-page" },
      h("div", { className: "container" },
        h("div", { className: "course-detail-hero" },
          h("span", { className: "eyebrow" }, selected.category + " · PRACTICAL PROGRAM"),
          h("span", { className: "course-status-badge" }, selected.recruitmentStatus),
          h("h1", null, selected.title),
          h("p", { className: "lead" }, selected.summary),
          h("p", { className: "course-description" }, "기초 개념을 익힌 뒤 핵심 기술을 직접 적용하고, 마지막에는 팀 단위 결과물을 완성하는 프로젝트 중심 과정입니다."),
          h("div", { className: "course-facts" },
            [["교육 기간", selected.duration], ["교육 대상", selected.target], ["수업 형태", "평일 주간 과정"], ["학습 방식", "이론 + 실습 + 팀 프로젝트"]].map(function (item) {
              return h("div", { key: item[0] }, h("small", null, item[0]), h("strong", null, item[1]));
            })
          ),
          h(Link, { to: "/consultation", className: "btn" }, "이 과정 상담 신청 →")
        ),
        h("div", { className: "course-detail-grid" },
          h("section", { className: "course-detail-block" },
            h("span", { className: "eyebrow" }, "LEARNING ROADMAP"),
            h("h2", null, "단계별 교육 커리큘럼"),
            h("div", { className: "course-module-list" }, modules.map(function (module, index) {
              return h("article", { key: module }, h("b", null, String(index + 1).padStart(2, "0")), h("span", null, module));
            }))
          ),
          h("section", { className: "course-detail-block course-outcomes" },
            h("span", { className: "eyebrow" }, "SKILLS & OUTCOMES"),
            h("h2", null, "주요 학습 기술"),
            h("p", null, selected.skills),
            h("h3", null, "교육 후 기대 역량"),
            h("ul", null, ["핵심 기술을 활용한 기능 구현", "데이터와 서비스 흐름을 이해하는 설계 경험", "팀 프로젝트 결과물 및 발표 자료"].map(function (item) { return h("li", { key: item }, item); }))
          )
        ),
        h("section", { className: "admission-panel" },
          h("div", null, h("span", { className: "eyebrow" }, "ADMISSION GUIDE"), h("h2", null, "모집 및 상담 안내"), h("p", null, "모집 상태와 세부 일정은 운영 상황에 따라 달라질 수 있습니다. 정확한 개강일과 지원 절차는 상담을 통해 확인해 주세요.")),
          h("div", { className: "admission-steps" }, [["01", "상담 신청", "희망 과정과 학습 목표 전달"], ["02", "과정 안내", "교육 일정과 지원 자격 확인"], ["03", "등록 안내", "신청 서류와 등록 절차 확인"]].map(function (item) { return h("article", { key: item[0] }, h("b", null, item[0]), h("strong", null, item[1]), h("span", null, item[2])); }))
        ),
        h("p", { className: "course-demo-note" }, "※ 교육 기간과 모집 상태는 화면 확인을 위한 데모 예시입니다. 실제 운영 정보는 상담을 통해 확인해 주세요.")
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
const previewNotices = [{"id":"demo-1","title":"2026년 11월 AI·머신러닝 실무 개발자 과정 모집 안내","category":"모집 안내","content":"AI·머신러닝 실무 개발자 과정의 교육생 모집을 안내하는 데모 게시글입니다.\n\n모집 상태: 모집 중\n교육 기간: 6개월\n교육 대상: 비전공자 및 전공자\n학습 내용: Python, 데이터 분석, 머신러닝, 딥러닝, 팀 프로젝트\n\n상세 일정과 실제 모집 여부는 상담을 통해 확인해 주세요. 본 게시글의 일정은 화면 확인을 위한 예시 데이터입니다.","createdAt":"2026-11-06T09:00:00","pinned":true},{"id":"demo-2","title":"교육과정 상담 신청 및 진행 절차 안내","category":"운영 안내","content":"상담 신청 페이지에서 희망 과정과 연락 가능한 정보를 입력해 주세요.\n\n1. 온라인 상담 신청\n2. 담당자 신청 내용 확인\n3. 교육 목표와 학습 수준 상담\n4. 과정 및 일정 안내\n5. 등록 절차 안내\n\n실제 운영 시간과 상담 가능 일정은 별도 확인이 필요합니다.","createdAt":"2026-11-05T10:00:00","pinned":false},{"id":"demo-3","title":"AI·머신러닝 과정 프로젝트 주제 공개","category":"교육과정","content":"교육 후반에는 데이터 분석과 모델 구현을 연결하는 팀 프로젝트를 진행하는 예시입니다.\n\n예시 주제: 영화 추천 시스템, 고객 문의 분류, 이미지 데이터 분석\n\n프로젝트는 문제 정의, 데이터 수집 및 정제, 모델 구현, 평가, 결과 발표 순서로 구성됩니다. 실제 과정 운영 내용은 변경될 수 있습니다.","createdAt":"2026-11-04T14:00:00","pinned":false},{"id":"demo-4","title":"팀 프로젝트 포트폴리오 페이지 업데이트","category":"교육 소식","content":"교육과정에서 다룰 수 있는 프로젝트 예시를 포트폴리오 형태로 정리했습니다. AI, 데이터 분석, 생성형 AI, 웹 서비스 분야의 가상 사례를 확인할 수 있습니다.\n\n소개용 데모 콘텐츠이며 실제 수강생 작품이 아닙니다.","createdAt":"2026-11-03T11:00:00","pinned":false},{"id":"demo-5","title":"생성형 AI 서비스 개발 과정 모집 예정 안내","category":"모집 안내","content":"생성형 AI 서비스 개발 과정의 모집 예정 상태를 안내하는 데모 게시글입니다.\n\n주요 학습 주제: LLM API, 프롬프트 설계, 임베딩, 벡터 검색, RAG\n교육 기간 예시: 4개월\n\n모집 일정과 실제 개강 여부는 확정 정보가 아니므로 상담을 통해 확인해 주세요.","createdAt":"2026-11-02T09:30:00","pinned":false},{"id":"demo-6","title":"교육생 프로젝트 발표회 운영 예시","category":"교육 소식","content":"과정 마지막 단계에서 팀별 프로젝트 발표와 결과물 시연을 진행하는 운영 예시입니다.\n\n발표 구성: 프로젝트 배경, 해결하려는 문제, 기술 구조, 구현 기능, 테스트 결과, 회고\n\n실제 발표 일정은 과정별로 다르게 운영될 수 있습니다.","createdAt":"2026-10-30T13:00:00","pinned":false},{"id":"demo-7","title":"홈페이지 이용 및 상담 신청 안내","category":"공지","content":"홈페이지에서 교육기관 소개, 교육과정, 프로젝트 사례, 공지사항을 확인할 수 있습니다. 상담 신청은 상단 메뉴의 상담 신청 페이지에서 접수할 수 있습니다.\n\n본 사이트는 IT ACADEMY 교육기관 소개용 데모 프로젝트입니다.","createdAt":"2026-10-28T09:00:00","pinned":false}];

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

function Projects() {
  const [category, setCategory] = React.useState("전체");
  const [selected, setSelected] = React.useState(null);
  const categories = ["전체", "AI · WEB", "DATA", "GEN AI", "AI · DATA", "WEB"];
  const projects = [
    { id: 1, title: "AI 영화 추천 플랫폼", category: "AI · WEB", period: "6주", team: "4명", description: "사용자 취향과 영화 메타데이터를 결합해 개인화 추천을 제공하는 웹 서비스", stack: ["Python", "Scikit-learn", "Spring Boot", "React", "MySQL"], problem: "사용자가 수많은 작품 중 취향에 맞는 영화를 찾기 어렵습니다.", solution: "장르·평점·선호 이력을 정리하고 유사도 기반 추천 로직과 검색 화면을 연결합니다.", features: ["회원별 선호 장르 설정", "영화 검색 및 상세 정보", "추천 결과와 찜 목록", "관리자 데이터 관리"], result: "추천 결과 화면과 데이터 흐름을 포함한 서비스형 포트폴리오를 완성합니다." },
    { id: 2, title: "소비 데이터 인사이트 대시보드", category: "DATA", period: "4주", team: "3명", description: "거래 데이터를 정제하고 소비 패턴을 분석해 시각화하는 데이터 분석 프로젝트", stack: ["Python", "Pandas", "SQL", "Plotly"], problem: "원시 거래 데이터만으로는 소비 패턴과 주요 변화 요인을 파악하기 어렵습니다.", solution: "결측치와 이상치를 처리하고 기간·지역·카테고리별 지표를 구성합니다.", features: ["데이터 정제 파이프라인", "월별·카테고리별 추이", "고객 세그먼트 비교", "분석 결과 리포트"], result: "분석 과정과 의사결정 근거를 설명할 수 있는 대시보드를 구성합니다." },
    { id: 3, title: "사내 문서 AI 검색 도우미", category: "GEN AI", period: "5주", team: "4명", description: "업로드한 문서를 검색하고 근거 문단을 바탕으로 답변하는 RAG 서비스", stack: ["Python", "LLM API", "Embedding", "Vector DB"], problem: "여러 문서에 흩어진 정보를 사람이 직접 찾아야 해 응답 시간이 길어집니다.", solution: "문서를 분할·임베딩하고 검색된 문맥을 LLM에 전달하는 RAG 흐름을 구현합니다.", features: ["문서 업로드와 텍스트 추출", "질문 기반 유사 문단 검색", "출처 문서 표시", "대화 기록 관리"], result: "검색 근거를 확인할 수 있는 문서 질의응답 프로토타입을 제작합니다." },
    { id: 4, title: "지역 상권 데이터 분석", category: "DATA", period: "4주", team: "3명", description: "상권별 유동 인구와 업종 데이터를 분석해 입지 판단 자료를 제공합니다.", stack: ["Python", "Pandas", "SQL", "지도 시각화"], problem: "상권 선택 시 여러 지표를 따로 확인해야 하므로 비교가 번거롭습니다.", solution: "상권·업종·기간 기준으로 데이터를 통합하고 핵심 지표를 시각화합니다.", features: ["상권별 지표 비교", "업종 분포 분석", "기간별 변화 확인", "요약 리포트"], result: "데이터에 근거한 상권 비교 화면을 완성합니다." },
    { id: 5, title: "스마트 학습 관리 서비스", category: "WEB", period: "6주", team: "4명", description: "학습 일정과 진도, 과제 제출 현황을 통합 관리하는 웹 애플리케이션", stack: ["Java", "Spring Boot", "React", "MySQL"], problem: "학습 일정과 과제 상태가 분산되어 진행 상황을 한눈에 보기 어렵습니다.", solution: "사용자·과정·과제 데이터를 설계하고 역할별 화면과 API를 구현합니다.", features: ["회원 및 권한 관리", "과정별 학습 일정", "과제 제출과 상태 관리", "진도 현황 대시보드"], result: "실제 운영 흐름을 갖춘 풀스택 웹 프로젝트를 구성합니다." },
    { id: 6, title: "고객 문의 자동 분류 시스템", category: "AI · DATA", period: "5주", team: "3명", description: "문의 텍스트를 유형별로 분류하고 담당 업무를 추천하는 NLP 프로젝트", stack: ["Python", "Scikit-learn", "FastAPI", "React"], problem: "반복 문의가 누적되면 유형 확인과 분배에 시간이 소요됩니다.", solution: "문의 텍스트를 전처리하고 분류 모델을 학습해 결과를 업무 화면에 표시합니다.", features: ["문의 텍스트 입력", "유형별 자동 분류", "분류 신뢰도 표시", "분류 결과 통계"], result: "텍스트 분류 모델과 웹 화면을 연결한 AI 응용 사례를 완성합니다." }
  ];
  const visible = projects.filter(function (project) { return category === "전체" || project.category === category; });
  const current = projects.find(function (project) { return project.id === selected; });
  return h("section", { className: "page projects-page" },
    h("div", { className: "container" },
      h("div", { className: "project-intro" },
        h("span", { className: "eyebrow" }, "PROJECT SHOWCASE · DEMO PORTFOLIO"),
        h("h1", null, "배운 기술을 실제 결과물로 연결합니다."),
        h("p", { className: "lead" }, "문제 정의부터 데이터 설계, 개발, 테스트와 발표까지 팀 프로젝트의 전체 과정을 경험합니다."),
        h("div", { className: "project-metrics" },
          [["06", "프로젝트 사례"], ["03–06", "프로젝트 기간(주)"], ["03–04", "팀 구성 예시(명)"]].map(function (item) {
            return h("div", { key: item[1] }, h("strong", null, item[0]), h("span", null, item[1]));
          })
        )
      ),
      h("div", { className: "project-filter" }, categories.map(function (item) {
        return h("button", { type: "button", key: item, className: category === item ? "active" : "", onClick: function () { setCategory(item); } }, item);
      })),
      h("div", { className: "project-showcase-grid" }, visible.map(function (project) {
        return h("article", { className: "project-showcase-card", key: project.id },
          h("div", { className: "project-visual project-visual-" + (project.id % 4) }, h("span", null, project.category), h("b", null, String(project.id).padStart(2, "0")), h("i", null, "BUILD · TEST · PRESENT")),
          h("div", { className: "project-showcase-content" },
            h("div", { className: "project-meta" }, h("span", null, project.period), h("span", null, "팀 " + project.team)),
            h("h2", null, project.title), h("p", null, project.description),
            h("div", { className: "project-stack" }, project.stack.map(function (item) { return h("span", { key: item }, item); })),
            h("button", { type: "button", className: "project-more", onClick: function () { setSelected(project.id); } }, "프로젝트 상세 보기 →")
          )
        );
      })),
      h("p", { className: "project-note" }, "※ 위 프로젝트는 교육과정 소개를 위한 가상 포트폴리오 예시이며 실제 수강생 작품이나 취업 성과가 아닙니다."),
      current ? h("div", { className: "project-detail-overlay", role: "dialog", "aria-modal": "true" },
        h("article", { className: "project-detail-panel" },
          h("button", { type: "button", className: "project-detail-close", onClick: function () { setSelected(null); } }, "×"),
          h("span", { className: "eyebrow" }, current.category + " · " + current.period),
          h("h2", null, current.title), h("p", { className: "lead" }, current.description),
          h("div", { className: "project-detail-columns" },
            h("section", null, h("h3", null, "문제 정의"), h("p", null, current.problem)),
            h("section", null, h("h3", null, "해결 접근"), h("p", null, current.solution)),
            h("section", null, h("h3", null, "주요 기능"), h("ul", null, current.features.map(function (item) { return h("li", { key: item }, item); }))),
            h("section", null, h("h3", null, "기대 결과물"), h("p", null, current.result))
          ),
          h("div", { className: "project-stack" }, current.stack.map(function (item) { return h("span", { key: item }, item); })),
          h(Link, { to: "/consultation", className: "btn", onClick: function () { setSelected(null); } }, "관련 교육과정 상담하기")
        )
      ) : null
    )
  );
}
function About() {
  const items = [
    ["01", "실전 중심", "직접 만들고 검증하는 학습"],
    ["02", "기초부터", "단계적으로 쌓는 기술 역량"],
    ["03", "협업 경험", "팀 프로젝트와 코드 리뷰"],
    ["04", "결과물", "완성한 프로젝트 발표"]
  ];

  return h("section", { className: "page" },
    h("div", { className: "container" },
      h("span", { className: "eyebrow" }, "ABOUT IT ACADEMY"),
      h("h1", null, "기술을 이해하고, 가능성을 구현합니다."),
      h("p", { className: "lead" }, "IT ACADEMY는 AI와 데이터 기술을 중심으로 기초 학습부터 실무 프로젝트까지 연결하는 교육기관 콘셉트의 프로젝트 웹사이트입니다."),
      h("div", { className: "grid4 journey" },
        items.map(function (item) {
          return h("article", { className: "journeycard", key: item[0] },
            h("b", null, item[0]),
            h("h3", null, item[1]),
            h("p", null, item[2])
          );
        })
      )
    )
  );
}

function App() {
  return h(BrowserRouter, { basename: import.meta.env.BASE_URL },
    h(Routes, null,
      h(Route, { element: h(Layout) },
        h(Route, { path: "/", element: h(Home) }),
        h(Route, { path: "/about", element: h(About) }),
        h(Route, { path: "/courses", element: h(Courses) }),
        h(Route, { path: "/courses/:id", element: h(Courses) }),
        h(Route, { path: "/projects", element: h(Projects) }),
        h(Route, { path: "/consultation", element: h(Consultation) }),
        h(Route, { path: "/notices", element: h(Notices) }),
        h(Route, { path: "/notices/:id", element: h(NoticeDetail) })
      ),
      h(Route, { path: "/admin/*", element: h(AdminApp) })
    )
  );
}

export default App;
