const pageDefinitions = [
  {
    matches: function (pathname) { return pathname === "/"; },
    title: "홈",
    description: "IT ACADEMY의 AI·데이터·소프트웨어 교육 방향과 교육과정을 확인하세요."
  },
  {
    matches: function (pathname) { return pathname === "/about"; },
    title: "교육 철학",
    description: "원리 중심 학습, 프로젝트 실습, 책임 있는 AI 활용과 품질 검증 원칙을 소개합니다."
  },
  {
    matches: function (pathname) { return pathname === "/courses"; },
    title: "교육과정",
    description: "AI·데이터·생성형 AI·웹 서비스 교육과정의 학습 목표와 커리큘럼을 확인하세요."
  },
  {
    matches: function (pathname) { return /^\/courses\/[^/]+$/.test(pathname); },
    title: "교육과정 상세",
    description: "교육과정의 학습 단계, 실습 내용, 프로젝트 산출물과 안내 사항을 확인하세요."
  },
  {
    matches: function (pathname) { return pathname === "/projects"; },
    title: "프로젝트",
    description: "교육 설계 프로젝트의 문제 정의, 해결 접근, 기술 구성과 평가 기준을 확인하세요."
  },
  {
    matches: function (pathname) { return pathname === "/consultation"; },
    title: "교육 상담 신청",
    description: "희망 교육과정과 학습 목표에 대한 상담 안내를 확인하세요."
  },
  {
    matches: function (pathname) { return pathname === "/notices"; },
    title: "공지사항",
    description: "IT ACADEMY의 공지와 운영 안내를 확인하세요."
  },
  {
    matches: function (pathname) { return /^\/notices\/[^/]+$/.test(pathname); },
    title: "공지사항 상세",
    description: "IT ACADEMY 공지사항의 상세 내용을 확인하세요."
  },
  {
    matches: function (pathname) { return /^\/admin(?:\/|$)/.test(pathname); },
    title: "관리자",
    description: "IT ACADEMY 관리자 전용 운영 화면입니다."
  }
];

export function getPageMetadata(pathname) {
  const normalizedPath = pathname === "/" ? "/" : String(pathname || "/").replace(/\/+$/, "");
  return pageDefinitions.find(function (page) { return page.matches(normalizedPath); }) || {
    title: "페이지를 찾을 수 없습니다",
    description: "요청한 페이지를 찾을 수 없습니다. 메인 페이지에서 원하는 정보를 다시 찾아보세요."
  };
}

export function getScrollAction(navigationType, savedPosition) {
  if (navigationType !== "POP") {
    return { mode: "top", top: 0 };
  }

  const parsedPosition = Number(savedPosition);
  return {
    mode: "restore",
    top: Number.isFinite(parsedPosition) ? Math.max(0, parsedPosition) : 0
  };
}
