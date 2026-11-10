import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { courseCatalog } from "./course-catalog.js";
import { previewNotices } from "./preview-content.js";

const app = readFileSync(new URL("./App.js", import.meta.url), "utf8");
const academy = readFileSync(new URL("./academy-pages.js", import.meta.url), "utf8");
const css = readFileSync(new URL("./site.css", import.meta.url), "utf8");
const readme = readFileSync(new URL("../../README.md", import.meta.url), "utf8");

test("homepage, course routes and consultation share one complete course catalogue", function () {
  assert.equal(courseCatalog.length, 4);
  assert.deepEqual(courseCatalog.map(function (course) { return course.id; }), [1, 2, 3, 4]);
  for (const course of courseCatalog) {
    assert.ok(course.title && course.summary && course.audience && course.learningGoal && course.outcome);
    assert.equal(course.duration, undefined);
    assert.equal(course.recruitmentStatus, undefined);
  }
  assert.match(app, /courseCatalog as courseSeed/);
  assert.match(academy, /courseCatalog as courseFallback/);
  assert.doesNotMatch(app, /course\.duration/);
  assert.doesNotMatch(academy, /course\.duration/);
});

test("the home page follows the approved hero, course, project, notice and CTA sequence", function () {
  for (const selector of [
    "academy-hero", "academy-feature-strip", "academy-program-section",
    "academy-course-grid", "academy-project-showcase", "academy-project-feature",
    "academy-project-side-list", "academy-feature-image", "academy-home-information",
    "academy-home-notices", "academy-home-consultation", "academy-final-cta"
  ]) assert.ok(academy.includes(selector), "missing homepage section: " + selector);
  assert.match(academy, /IT로 만드는/);
  assert.match(academy, /당신의 새로운 시작/);
  assert.match(academy, /MOMO 영화 리뷰 커뮤니티/);
  assert.match(academy, /const relatedProjects = projectFallback\.slice\(1, 4\)/);
  assert.match(academy, /교육 설계 예시/);
  assert.match(academy, /소비 데이터 인사이트 랩/);
  assert.match(academy, /근거 중심 사내 문서 AI/);
  assert.match(academy, /고객 VOC 분류·분석 시스템/);
  assert.match(academy, /images\/academy-hero\.webp/);
  assert.doesNotMatch(academy.slice(academy.indexOf('const featuredProject'), academy.indexOf('const relatedProjects')), /IT ACADEMY 통합 플랫폼|AI 로또 분석기|날씨 생활 도우미/);
  assert.doesNotMatch(academy, /PROJECT SCORE FRAMEWORK|100 PTS|TRACEABLE|VERIFIED|REVIEWED/);
});

test("course list and detail answer learner-fit, learning-goal and tangible-outcome questions", function () {
  for (const token of [
    "program-page", "program-header", "program-filters", "program-list",
    "program-card", "program-card-audience", "program-card-outcome",
    "program-detail-page", "program-detail-hero", "program-curriculum",
    "program-module", "program-operations-note"
  ]) {
    assert.ok(app.includes(token), "missing course UI: " + token);
    assert.ok(css.includes("." + token), "missing course style: ." + token);
  }
  assert.match(app, /이런 관심에 맞습니다/);
  assert.match(app, /대표 결과물 예시/);
  assert.match(app, /모집·일정·교육비는 확인된 공지로 안내합니다/);
  assert.doesNotMatch(app, /FIND YOUR LEARNING PATH/);
  assert.doesNotMatch(app, /운영기관 공지 확인/);
  assert.doesNotMatch(app, /모집 정보 확인/);
});

test("consultation form is available in preview and submits to the existing backend API", function () {
  const consultation = app.slice(app.indexOf("function Consultation()"), app.indexOf("function getTodayLocalDate()"));
  assert.doesNotMatch(consultation, /consultation-preview-unavailable|이 미리보기에서는 상담 신청 내용을 저장하지 않습니다/);
  assert.doesNotMatch(consultation, /if \(isStaticPreview\)/);
  assert.match(consultation, /className: "consultation-form"/);
  assert.match(consultation, /api\.post\("\/inquiries"/);
  assert.match(consultation, /name: "privacyConsent"/);
  assert.match(consultation, /name: "courseTitle"/);
  assert.match(consultation, /React\.useState\(courseSeed\)/);
});

test("home and project pages do not present an invented academy grading framework", function () {
  assert.doesNotMatch(academy, /PROJECT SCORE FRAMEWORK/);
  assert.doesNotMatch(academy, /100 PTS/);
  assert.doesNotMatch(academy, /academy-review-framework/);
  assert.match(academy, /MOMO 영화 리뷰 커뮤니티/);
  assert.match(academy, /교육 설계 예시/);
});

test("homepage and course routes use the same four approved course photography assets", function () {
  assert.match(academy, /photo-1753613648137-602c669cbe07/);
  assert.match(academy, /photo-1666875753105-c63a6f3bdc86/);
  assert.match(academy, /photo-1754039985001-ccafee437736/);
  assert.match(academy, /photo-1775519520461-6b6e068d9250/);
  assert.match(app, /photo-1753613648137-602c669cbe07/);
  assert.match(app, /photo-1666875753105-c63a6f3bdc86/);
  assert.match(app, /photo-1754039985001-ccafee437736/);
  assert.match(app, /photo-1775519520461-6b6e068d9250/);
});

test("static preview provides searchable sample notices without inventing recruitment dates", function () {
  assert.equal(previewNotices.length, 7);
  assert.ok(previewNotices.every(function (notice) { return notice.isDemo && notice.title && notice.content.length > 80; }));
  assert.equal(previewNotices.filter(function (notice) { return notice.pinned; }).length, 1);
  assert.match(app, /setItems\(previewNotices\)/);
  assert.match(app, /일부 게시물은 화면 구성과 기능 확인을 위한 예시 데이터입니다/);
  assert.doesNotMatch(previewNotices.map(function (notice) { return notice.content; }).join(" "), /확정 개강일|확정 교육비|모집 정원/);
});

test("notice categories have distinct visual identities and readable paragraph/list content", function () {
  assert.match(app, /getNoticeCategoryClass/);
  assert.match(app, /renderNoticeContent/);
  for (const token of [
    "notice-tag--operations", "notice-tag--recruitment",
    "notice-tag--program", "notice-tag--news", "notice-tag--default",
    "notice-column-category", "notice-column-title", "notice-column-date",
    "notice-detail-return"
  ]) assert.ok(css.includes("." + token), "missing notice style: " + token);
  assert.match(app, /공지사항 목록으로/);
});

test("project artwork remains mapped and available for every example", function () {
  const assets = [
    "ai-movie-recommender.svg",
    "consumer-data-insights.svg",
    "rag-document-assistant.svg",
    "customer-voc-analytics.svg",
    "learning-operations-platform.svg",
    "vibe-coding-quality.svg"
  ];
  assets.forEach(function (asset) {
    assert.ok(academy.includes(asset), "missing project mapping: " + asset);
    assert.ok(existsSync(new URL("../public/images/projects/" + asset, import.meta.url)), "missing asset: " + asset);
  });
});

test("final submission audit is linked from the project README", function () {
  assert.match(readme, /docs\/FINAL_SUBMISSION_AUDIT_2026-11\.md/);
  assert.match(readme, /소비 데이터 분석·사내 문서 RAG·고객 VOC 분류/);
  assert.doesNotMatch(readme, /AI 로또 분석기|날씨 생활 도우미|IT ACADEMY 통합 플랫폼/);
  assert.match(readme, /academy-hero\.webp/);
  assert.doesNotMatch(readme, /Pexels 이미지 CDN/);
});
