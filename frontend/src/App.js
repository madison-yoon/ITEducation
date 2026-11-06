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

    return h("section", { className: "page" },
      h("div", { className: "container" },
        h("span", { className: "eyebrow" }, selected.category),
        h("h1", null, selected.title),
        h("p", { className: "lead" }, selected.summary),
        h("div", { className: "detail" },
          h("h3", null, "교육 대상"), h("p", null, selected.target),
          h("h3", null, "교육 기간"), h("p", null, selected.duration),
          h("h3", null, "단계별 커리큘럼"), h("p", null, selected.curriculum),
          h("h3", null, "주요 기술"), h("p", null, selected.skills),
          h(Link, { to: "/consultation", className: "btn" }, "이 과정 상담 신청")
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
      setItems(Array.isArray(response.data) ? response.data : []);
    } catch (requestError) {
      setError("공지사항을 불러오지 못했습니다. 서버 연결 상태를 확인한 뒤 다시 시도해 주세요.");
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
      setError("해당 공지사항을 찾을 수 없거나 현재 공개되지 않은 게시글입니다.");
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
  return h("section", { className: "page" },
    h("div", { className: "container" },
      h("span", { className: "eyebrow" }, "PROJECT SHOWCASE"),
      h("h1", null, "교육과정 프로젝트"),
      h("p", { className: "lead" }, "각 교육과정에서 구현하는 프로젝트 예시입니다."),
      h("div", { className: "grid4" },
        projectSeed.map(function (project) {
          return h("article", { className: "projectcard lightcard", key: project.title },
            h("small", null, project.category),
            h("h3", null, project.title),
            h("p", null, project.description)
          );
        })
      )
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
  return h(BrowserRouter, null,
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
