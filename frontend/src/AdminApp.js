import React from "react";
import { useNavigate } from "react-router-dom";
import api from "./api.js";
import "./admin.css";

const h = React.createElement;

const emptyCourse = {
  title: "", category: "AI", summary: "", description: "", target: "",
  duration: "", recruitmentStatus: "모집 정보 확인", imageUrl: "",
  curriculum: "", skills: "", featured: false, operatingInfoVerified: false
};

const emptyNotice = { title: "", category: "공지", content: "", status: "게시 중", pinned: false };

function AdminApp() {
  const navigate = useNavigate();
  const [admin, setAdmin] = React.useState(null);
  const [checked, setChecked] = React.useState(false);
  const [tab, setTab] = React.useState("dashboard");
  const [loginForm, setLoginForm] = React.useState({ loginId: "", password: "" });
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [dashboard, setDashboard] = React.useState(null);
  const [courses, setCourses] = React.useState([]);
  const [courseForm, setCourseForm] = React.useState(emptyCourse);
  const [editingCourse, setEditingCourse] = React.useState(null);
  const [notices, setNotices] = React.useState([]);
  const [noticeForm, setNoticeForm] = React.useState(emptyNotice);
  const [editingNotice, setEditingNotice] = React.useState(null);
  const [inquiries, setInquiries] = React.useState({ content: [], totalPages: 0, number: 0 });
  const [keyword, setKeyword] = React.useState("");
  const [inquiryStatus, setInquiryStatus] = React.useState("");
  const [selectedInquiry, setSelectedInquiry] = React.useState(null);
  const [accounts, setAccounts] = React.useState([]);
  const [accountForm, setAccountForm] = React.useState({ loginId: "", password: "", name: "", role: "ADMIN" });

  React.useEffect(function () {
    api.get("/admin/me")
      .then(function (response) { setAdmin(response.data); })
      .catch(function () { setAdmin(null); })
      .finally(function () { setChecked(true); });
  }, []);

  React.useEffect(function () {
    if (!admin) return;
    setError("");
    setMessage("");
    if (tab === "dashboard") loadDashboard();
    if (tab === "courses") loadCourses();
    if (tab === "notices") loadNotices();
    if (tab === "inquiries") loadInquiries(0);
    if (tab === "accounts" && admin.role === "SUPER_ADMIN") loadAccounts();
  }, [admin, tab]);

  async function loadDashboard() {
    try {
      const response = await api.get("/admin/dashboard");
      setDashboard(response.data);
    } catch (requestError) { showError(requestError); }
  }

  async function loadCourses() {
    try {
      const response = await api.get("/admin/courses");
      setCourses(response.data);
    } catch (requestError) { showError(requestError); }
  }

  async function loadNotices() {
    try {
      const response = await api.get("/admin/notices");
      setNotices(response.data);
    } catch (requestError) { showError(requestError); }
  }

  async function loadInquiries(page) {
    try {
      const response = await api.get("/admin/inquiries", {
        params: { keyword: keyword, status: inquiryStatus, page: page, size: 10 }
      });
      setInquiries(response.data);
    } catch (requestError) { showError(requestError); }
  }

  async function loadAccounts() {
    try {
      const response = await api.get("/admin/accounts");
      setAccounts(response.data);
    } catch (requestError) { showError(requestError); }
  }

  function showError(requestError) {
    const data = requestError.response && requestError.response.data;
    setError(data && data.message ? data.message : "요청을 처리하지 못했습니다. 서버 상태를 확인해 주세요.");
  }

  async function submitLogin(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const body = new URLSearchParams();
      body.set("loginId", loginForm.loginId);
      body.set("password", loginForm.password);
      await api.post("/admin/login", body, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });
      const response = await api.get("/admin/me");
      setAdmin(response.data);
    } catch (requestError) {
      showError(requestError);
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    try {
      await api.post("/admin/logout");
    } catch (requestError) {
      showError(requestError);
      return;
    }
    setAdmin(null);
    setTab("dashboard");
    navigate("/admin");
  }

  function changeCourse(name, value) {
    setCourseForm(function (old) { return Object.assign({}, old, { [name]: value }); });
  }

  function startCourseEdit(course) {
    setEditingCourse(course.id);
    setCourseForm(Object.assign({}, emptyCourse, course));
    setError("");
    setMessage("");
  }

  async function saveCourse(event) {
    event.preventDefault();
    setBusy(true);
    try {
      if (editingCourse) {
        await api.put("/admin/courses/" + editingCourse, courseForm);
        setMessage("교육과정을 수정했습니다.");
      } else {
        await api.post("/admin/courses", courseForm);
        setMessage("교육과정을 등록했습니다.");
      }
      setCourseForm(emptyCourse);
      setEditingCourse(null);
      await loadCourses();
    } catch (requestError) { showError(requestError); }
    finally { setBusy(false); }
  }

  async function deleteCourse(id) {
    if (!window.confirm("이 교육과정을 삭제하시겠습니까?")) return;
    try {
      await api.delete("/admin/courses/" + id);
      setMessage("교육과정을 삭제했습니다.");
      await loadCourses();
    } catch (requestError) { showError(requestError); }
  }

  function changeNotice(name, value) {
    setNoticeForm(function (old) { return Object.assign({}, old, { [name]: value }); });
  }

  function startNoticeEdit(notice) {
    setEditingNotice(notice.id);
    setNoticeForm({ title: notice.title, category: notice.category || "공지", content: notice.content, status: notice.status, pinned: Boolean(notice.pinned) });
  }

  async function saveNotice(event) {
    event.preventDefault();
    setBusy(true);
    try {
      if (editingNotice) {
        await api.put("/admin/notices/" + editingNotice, noticeForm);
        setMessage("공지사항을 수정했습니다.");
      } else {
        await api.post("/admin/notices", noticeForm);
        setMessage("공지사항을 등록했습니다.");
      }
      setNoticeForm(emptyNotice);
      setEditingNotice(null);
      await loadNotices();
    } catch (requestError) { showError(requestError); }
    finally { setBusy(false); }
  }

  async function deleteNotice(id) {
    if (!window.confirm("이 공지사항을 삭제하시겠습니까?")) return;
    try {
      await api.delete("/admin/notices/" + id);
      setMessage("공지사항을 삭제했습니다.");
      await loadNotices();
    } catch (requestError) { showError(requestError); }
  }

  async function saveInquiry(event) {
    event.preventDefault();
    if (!selectedInquiry) return;
    try {
      await api.patch("/admin/inquiries/" + selectedInquiry.id, {
        status: selectedInquiry.status,
        adminMemo: selectedInquiry.adminMemo || ""
      });
      setMessage("상담 내역을 저장했습니다.");
      setSelectedInquiry(null);
      await loadInquiries(inquiries.number || 0);
    } catch (requestError) { showError(requestError); }
  }

  async function deleteInquiry(id) {
    if (!window.confirm("상담 신청 내역을 삭제하시겠습니까?")) return;
    try {
      await api.delete("/admin/inquiries/" + id);
      setSelectedInquiry(null);
      setMessage("상담 내역을 삭제했습니다.");
      await loadInquiries(inquiries.number || 0);
    } catch (requestError) { showError(requestError); }
  }

  async function createAccount(event) {
    event.preventDefault();
    setBusy(true);
    try {
      await api.post("/admin/accounts", accountForm);
      setAccountForm({ loginId: "", password: "", name: "", role: "ADMIN" });
      setMessage("관리자 계정을 생성했습니다.");
      await loadAccounts();
    } catch (requestError) { showError(requestError); }
    finally { setBusy(false); }
  }

  async function changeAccountRole(account, role) {
    try {
      await api.patch("/admin/accounts/" + account.id + "/role", { role: role });
      setMessage("관리자 권한을 변경했습니다.");
      await loadAccounts();
    } catch (requestError) { showError(requestError); }
  }

  async function deleteAccount(account) {
    if (!window.confirm(account.loginId + " 계정을 삭제하시겠습니까?")) return;
    try {
      await api.delete("/admin/accounts/" + account.id);
      setMessage("관리자 계정을 삭제했습니다.");
      await loadAccounts();
    } catch (requestError) { showError(requestError); }
  }

  function field(label, value, onChange, type, placeholder) {
    return h("label", { className: "admin-field" }, label,
      h("input", {
        type: type || "text",
        value: value || "",
        placeholder: placeholder || "",
        onChange: function (event) { onChange(event.target.value); },
        required: label.indexOf("*") >= 0
      })
    );
  }

  function area(label, value, onChange, rows) {
    return h("label", { className: "admin-field" }, label,
      h("textarea", {
        rows: rows || 3,
        value: value || "",
        onChange: function (event) { onChange(event.target.value); }
      })
    );
  }

  function selectField(label, value, options, onChange) {
    return h("label", { className: "admin-field" }, label,
      h("select", {
        value: value || "",
        onChange: function (event) { onChange(event.target.value); }
      }, options.map(function (option) {
        return h("option", { key: option, value: option }, option);
      }))
    );
  }

  function renderDashboard() {
    if (!dashboard) return h("p", null, "현황을 불러오는 중입니다.");
    const stats = [
      ["전체 교육과정", dashboard.courseCount],
      ["모집 중 과정", dashboard.openCourseCount],
      ["신규 상담", dashboard.newInquiryCount],
      ["상담 진행", dashboard.inProgressInquiryCount],
      ["상담 완료", dashboard.completedInquiryCount],
      ["전체 상담", dashboard.inquiryCount],
      ["게시 중 공지", dashboard.publishedNoticeCount]
    ];
    return h(React.Fragment, null,
      h("div", { className: "admin-stats" }, stats.map(function (item) {
        return h("article", { key: item[0] }, h("small", null, item[0]), h("strong", null, item[1]));
      })),
      h("section", { className: "admin-panel" },
        h("h2", null, "최근 상담 신청"),
        h("div", { className: "admin-table-wrap" },
          h("table", null,
            h("thead", null, h("tr", null,
              ["접수일", "신청자", "연락처", "희망 과정", "상태"].map(function (name) {
                return h("th", { key: name }, name);
              })
            )),
            h("tbody", null, (dashboard.recentInquiries || []).map(function (item) {
              return h("tr", { key: item.id },
                h("td", null, String(item.createdAt || "").replace("T", " ").slice(0, 16)),
                h("td", null, item.name),
                h("td", null, item.phone),
                h("td", null, item.courseTitle),
                h("td", null, item.status)
              );
            }))
          )
        )
      )
    );
  }

  function renderCourses() {
    return h("div", { className: "admin-columns" },
      h("section", { className: "admin-panel" },
        h("h2", null, editingCourse ? "교육과정 수정" : "교육과정 등록"),
        h("form", { onSubmit: saveCourse, className: "admin-form" },
          field("과정명 *", courseForm.title, function (v) { changeCourse("title", v); }),
          selectField("분야", courseForm.category, ["AI", "DATA", "GEN AI", "WEB"], function (v) { changeCourse("category", v); }),
          field("교육 기간", courseForm.duration, function (v) { changeCourse("duration", v); }, "text", "예: 6개월"),
          selectField("모집 상태", courseForm.recruitmentStatus, ["모집 정보 확인", "모집 중", "모집 예정", "모집 마감"], function (v) { changeCourse("recruitmentStatus", v); }),
          h("label", { className: "admin-check" },
            h("input", { type: "checkbox", checked: !!courseForm.operatingInfoVerified, onChange: function (e) { changeCourse("operatingInfoVerified", e.target.checked); } }),
            " 모집·지원 정보 확인 완료"
          ),
          h("p", { className: "admin-form-hint" }, "개강 일정, 지원 대상, 모집 상태 등 공개할 운영 정보가 확인된 뒤에만 체크하세요."),
          field("대상", courseForm.target, function (v) { changeCourse("target", v); }),
          field("이미지 경로", courseForm.imageUrl, function (v) { changeCourse("imageUrl", v); }, "text", "/images/course-ai.png"),
          area("한 줄 소개", courseForm.summary, function (v) { changeCourse("summary", v); }, 2),
          area("상세 설명", courseForm.description, function (v) { changeCourse("description", v); }, 3),
          area("커리큘럼", courseForm.curriculum, function (v) { changeCourse("curriculum", v); }, 3),
          area("주요 기술", courseForm.skills, function (v) { changeCourse("skills", v); }, 2),
          h("label", { className: "admin-check" },
            h("input", { type: "checkbox", checked: !!courseForm.featured, onChange: function (e) { changeCourse("featured", e.target.checked); } }),
            " 대표 과정으로 표시"
          ),
          h("div", { className: "admin-actions" },
            h("button", { className: "admin-primary", disabled: busy }, editingCourse ? "수정 저장" : "과정 등록"),
            editingCourse ? h("button", { type: "button", className: "admin-secondary", onClick: function () { setEditingCourse(null); setCourseForm(emptyCourse); } }, "취소") : null
          )
        )
      ),
      h("section", { className: "admin-panel" },
        h("h2", null, "등록된 교육과정"),
        h("div", { className: "admin-list" }, courses.map(function (course) {
          return h("article", { key: course.id },
            h("div", null, h("b", null, course.title), h("small", null, course.category + " · " + course.duration + " · " + course.recruitmentStatus)),
            h("div", { className: "admin-actions" },
              h("button", { className: "admin-secondary", onClick: function () { startCourseEdit(course); } }, "수정"),
              h("button", { className: "admin-danger", onClick: function () { deleteCourse(course.id); } }, "삭제")
            )
          );
        }))
      )
    );
  }

  function renderNotices() {
    return h("div", { className: "admin-columns" },
      h("section", { className: "admin-panel" },
        h("h2", null, editingNotice ? "공지사항 수정" : "공지사항 등록"),
        h("form", { onSubmit: saveNotice, className: "admin-form" },
          field("제목 *", noticeForm.title, function (v) { changeNotice("title", v); }),
          selectField("공지 분류", noticeForm.category, ["공지", "모집 안내", "교육과정", "교육 소식", "운영 안내"], function (v) { changeNotice("category", v); }),
          selectField("게시 상태", noticeForm.status, ["게시 중", "비공개"], function (v) { changeNotice("status", v); }),
          area("내용 *", noticeForm.content, function (v) { changeNotice("content", v); }, 9),
          h("label", { className: "admin-check" },
            h("input", {
              type: "checkbox",
              checked: Boolean(noticeForm.pinned),
              onChange: function (event) { changeNotice("pinned", event.target.checked); }
            }),
            h("span", null, "중요 공지로 상단 고정")
          ),
          h("div", { className: "admin-actions" },
            h("button", { className: "admin-primary", disabled: busy }, editingNotice ? "수정 저장" : "공지 등록"),
            editingNotice ? h("button", { type: "button", className: "admin-secondary", onClick: function () { setEditingNotice(null); setNoticeForm(emptyNotice); } }, "취소") : null
          )
        )
      ),
      h("section", { className: "admin-panel" },
        h("h2", null, "공지사항 목록"),
        h("div", { className: "admin-list" }, notices.map(function (notice) {
          return h("article", { key: notice.id },
            h("div", null,
              h("b", null, notice.pinned ? "중요 · " + notice.title : notice.title),
              h("small", null, (notice.category || "공지") + " · " + notice.status + " · " + String(notice.createdAt || "").slice(0, 10))
            ),
            h("div", { className: "admin-actions" },
              h("button", { className: "admin-secondary", onClick: function () { startNoticeEdit(notice); } }, "수정"),
              h("button", { className: "admin-danger", onClick: function () { deleteNotice(notice.id); } }, "삭제")
            )
          );
        }))
      )
    );
  }

  function renderInquiries() {
    return h(React.Fragment, null,
      h("section", { className: "admin-panel" },
        h("div", { className: "admin-toolbar" },
          h("input", { value: keyword, placeholder: "이름·연락처·과정 검색", onChange: function (e) { setKeyword(e.target.value); } }),
          h("select", { value: inquiryStatus, onChange: function (e) { setInquiryStatus(e.target.value); } },
            ["", "접수", "상담 진행", "상담 완료"].map(function (value) {
              return h("option", { key: value || "all", value: value }, value || "전체 상태");
            })
          ),
          h("button", { className: "admin-primary", onClick: function () { loadInquiries(0); } }, "검색")
        ),
        h("div", { className: "admin-table-wrap" },
          h("table", null,
            h("thead", null, h("tr", null, ["접수일", "신청자", "연락처", "이메일", "교육과정", "상태", "관리"].map(function (name) {
              return h("th", { key: name }, name);
            }))),
            h("tbody", null, (inquiries.content || []).map(function (item) {
              return h("tr", { key: item.id },
                h("td", null, String(item.createdAt || "").replace("T", " ").slice(0, 16)),
                h("td", null, item.name),
                h("td", null, item.phone),
                h("td", null, item.email || "-"),
                h("td", null, item.courseTitle),
                h("td", null, item.status),
                h("td", null, h("button", { className: "admin-secondary", onClick: function () { setSelectedInquiry(item); } }, "상세"))
              );
            }))
          )
        ),
        h("div", { className: "admin-pagination" },
          h("button", { className: "admin-secondary", disabled: !inquiries.number, onClick: function () { loadInquiries(inquiries.number - 1); } }, "이전"),
          h("span", null, (inquiries.number || 0) + 1, " / ", Math.max(inquiries.totalPages || 1, 1)),
          h("button", { className: "admin-secondary", disabled: (inquiries.number || 0) + 1 >= (inquiries.totalPages || 1), onClick: function () { loadInquiries(inquiries.number + 1); } }, "다음")
        )
      ),
      selectedInquiry ? h("section", { className: "admin-panel admin-detail" },
        h("div", { className: "admin-panel-head" },
          h("h2", null, "상담 상세"),
          h("button", { className: "admin-secondary", onClick: function () { setSelectedInquiry(null); } }, "닫기")
        ),
        h("p", null, "신청자: ", selectedInquiry.name, " / ", selectedInquiry.phone),
        h("p", null, "이메일: ", selectedInquiry.email || "-"),
        h("p", null, "희망 과정: ", selectedInquiry.courseTitle),
        h("p", null, "희망 일정: ", selectedInquiry.preferredDate || "-", " / ", selectedInquiry.preferredPeriod || "-"),
        h("p", { className: "admin-message" }, selectedInquiry.message),
        h("form", { onSubmit: saveInquiry, className: "admin-form" },
          selectField("상담 상태", selectedInquiry.status, ["접수", "상담 진행", "상담 완료"], function (v) {
            setSelectedInquiry(Object.assign({}, selectedInquiry, { status: v }));
          }),
          area("내부 메모", selectedInquiry.adminMemo, function (v) {
            setSelectedInquiry(Object.assign({}, selectedInquiry, { adminMemo: v }));
          }, 3),
          h("div", { className: "admin-actions" },
            h("button", { className: "admin-primary" }, "변경 사항 저장"),
            h("button", { type: "button", className: "admin-danger", onClick: function () { deleteInquiry(selectedInquiry.id); } }, "신청 삭제")
          )
        )
      ) : null
    );
  }

  function renderAccounts() {
    return h("div", { className: "admin-columns" },
      h("section", { className: "admin-panel" },
        h("h2", null, "관리자 계정 생성"),
        h("form", { onSubmit: createAccount, className: "admin-form" },
          field("로그인 아이디 *", accountForm.loginId, function (v) { setAccountForm(Object.assign({}, accountForm, { loginId: v })); }),
          field("이름 *", accountForm.name, function (v) { setAccountForm(Object.assign({}, accountForm, { name: v })); }),
          field("초기 비밀번호 *", accountForm.password, function (v) { setAccountForm(Object.assign({}, accountForm, { password: v })); }, "password"),
          selectField("권한", accountForm.role, ["ADMIN", "SUPER_ADMIN"], function (v) { setAccountForm(Object.assign({}, accountForm, { role: v })); }),
          h("button", { className: "admin-primary", disabled: busy }, "계정 생성")
        )
      ),
      h("section", { className: "admin-panel" },
        h("h2", null, "관리자 계정 목록"),
        h("div", { className: "admin-list" }, accounts.map(function (account) {
          return h("article", { key: account.id },
            h("div", null, h("b", null, account.name), h("small", null, account.loginId)),
            h("div", { className: "admin-actions" },
              h("select", { value: account.role, onChange: function (e) { changeAccountRole(account, e.target.value); } },
                h("option", { value: "ADMIN" }, "일반 관리자"),
                h("option", { value: "SUPER_ADMIN" }, "최고 관리자")
              ),
              h("button", { className: "admin-danger", onClick: function () { deleteAccount(account); } }, "삭제")
            )
          );
        }))
      )
    );
  }

  if (!checked) {
    return h("div", { className: "admin-loading" }, "관리자 인증을 확인하고 있습니다.");
  }

  if (!admin) {
    return h("div", { className: "admin-login-page" },
      h("form", { className: "admin-login-card", onSubmit: submitLogin },
        h("span", { className: "admin-kicker" }, "IT ACADEMY"),
        h("h1", null, "관리자 로그인"),
        h("p", null, "관리자 계정으로 로그인해 주세요."),
        field("아이디 *", loginForm.loginId, function (v) { setLoginForm(Object.assign({}, loginForm, { loginId: v })); }),
        field("비밀번호 *", loginForm.password, function (v) { setLoginForm(Object.assign({}, loginForm, { password: v })); }, "password"),
        error ? h("p", { className: "admin-error" }, error) : null,
        h("button", { className: "admin-primary admin-login-button", disabled: busy }, busy ? "로그인 중..." : "로그인"),
        h("button", { type: "button", className: "admin-text-button", onClick: function () { navigate("/"); } }, "홈페이지로 돌아가기")
      )
    );
  }

  const tabs = [
    ["dashboard", "대시보드"],
    ["courses", "교육과정 관리"],
    ["inquiries", "상담 신청 관리"],
    ["notices", "공지사항 관리"]
  ];
  if (admin.role === "SUPER_ADMIN") tabs.push(["accounts", "관리자 계정 관리"]);

  const titles = {
    dashboard: "운영 현황",
    courses: "교육과정 관리",
    inquiries: "상담 신청 관리",
    notices: "공지사항 관리",
    accounts: "관리자 계정 관리"
  };

  let contentView = renderDashboard();
  if (tab === "courses") contentView = renderCourses();
  if (tab === "inquiries") contentView = renderInquiries();
  if (tab === "notices") contentView = renderNotices();
  if (tab === "accounts" && admin.role === "SUPER_ADMIN") contentView = renderAccounts();

  return h("div", { className: "admin-shell" },
    h("aside", { className: "admin-sidebar" },
      h("div", null, h("b", null, "IT ACADEMY"), h("small", null, "ADMIN CONSOLE")),
      h("nav", null, tabs.map(function (item) {
        return h("button", {
          key: item[0],
          className: tab === item[0] ? "active" : "",
          onClick: function () { setTab(item[0]); setSelectedInquiry(null); }
        }, item[1]);
      })),
      h("div", { className: "admin-sidebar-bottom" },
        h("span", null, admin.name, " · ", admin.role === "SUPER_ADMIN" ? "최고 관리자" : "일반 관리자"),
        h("button", { onClick: logout }, "로그아웃"),
        h("button", { onClick: function () { navigate("/"); } }, "사이트 보기")
      )
    ),
    h("main", { className: "admin-main" },
      h("header", { className: "admin-topbar" },
        h("div", null, h("small", null, "ADMINISTRATION"), h("h1", null, titles[tab] || "운영 현황")),
        h("span", null, "IT ACADEMY")
      ),
      error ? h("div", { className: "admin-alert error" }, error) : null,
      message ? h("div", { className: "admin-alert success" }, message) : null,
      contentView
    )
  );
}

export default AdminApp;
