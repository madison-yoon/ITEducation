import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { courseCatalog } from "./course-catalog.js";
import { previewNotices } from "./preview-content.js";

const app = readFileSync(new URL("./App.js", import.meta.url), "utf8");
const academy = readFileSync(new URL("./academy-pages.js", import.meta.url), "utf8");
const css = readFileSync(new URL("./site.css", import.meta.url), "utf8");
const readme = readFileSync(new URL("../../README.md", import.meta.url), "utf8");

test("homepage, course routes and consultation share one complete prospectus catalogue", function () {
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

test("static consultation preview does not collect personal information without a working backend", function () {
  assert.match(app, /consultation-preview-unavailable/);
  assert.match(app, /이 미리보기에서는 상담 신청 내용을 저장하지 않습니다/);
  assert.match(css, /\.consultation-preview-unavailable/);
  assert.match(app, /className: "consultation-form"/);
  assert.match(app, /api\.post\("\/inquiries"/);
  assert.match(app, /name: "privacyConsent"/);
  assert.match(app, /name: "courseTitle"/);
});

test("home and project pages present learning outputs instead of invented academy grading", function () {
  assert.match(academy, /PORTFOLIO EVIDENCE/);
  assert.match(academy, /academy-learning-outcomes/);
  assert.match(academy, /학습 결과물/);
  assert.doesNotMatch(academy, /PROJECT SCORE FRAMEWORK/);
  assert.doesNotMatch(academy, /100 PTS/);
  assert.doesNotMatch(academy, /academy-review-framework/);
  assert.doesNotMatch(academy, /총점 100점/);
});

test("static preview contains no fabricated operational notice examples", function () {
  assert.deepEqual(previewNotices, []);
  assert.match(app, /게시된 공지사항이 없습니다/);
  assert.doesNotMatch(app, /2026년 11월 교육과정 운영 및 상담 안내/);
});

test("notice categories have distinct visual identities and readable paragraph/list content", function () {
  assert.match(app, /getNoticeCategoryClass/);
  assert.match(app, /renderNoticeContent/);
  for (const token of [
    "notice-tag--operations", "notice-tag--recruitment",
    "notice-tag--program", "notice-tag--news", "notice-tag--default",
    "notice-column-category", "notice-column-title", "notice-column-date",
    "notice-detail-return"
  ]) {
    assert.ok(css.includes("." + token), "missing notice style: " + token);
  }
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
});
