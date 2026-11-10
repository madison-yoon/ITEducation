import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { courseCatalog } from "./course-catalog.js";
import { previewNotices } from "./preview-content.js";

const app = readFileSync(new URL("./App.js", import.meta.url), "utf8");
const academy = readFileSync(new URL("./academy-pages.js", import.meta.url), "utf8");
const css = readFileSync(new URL("./site.css", import.meta.url), "utf8");
const favicon = readFileSync(new URL("../public/favicon.svg", import.meta.url), "utf8");

test("course catalogue gives prospective learners a fit, goal and tangible outcome", function () {
  assert.equal(courseCatalog.length, 4);
  courseCatalog.forEach(function (course) {
    assert.ok(course.audience && course.audience.length > 12, course.title + " audience");
    assert.ok(course.learningGoal && course.learningGoal.length > 18, course.title + " learning goal");
    assert.ok(course.outcome && course.outcome.length > 12, course.title + " outcome");
    assert.equal(course.duration, undefined, "do not invent course duration");
    assert.equal(course.recruitmentStatus, undefined, "do not imply recruitment status");
  });
});

test("course list and course detail use the prospectus layout rather than legacy card placeholders", function () {
  for (const token of [
    "program-page", "program-header", "program-filters", "program-list",
    "program-card", "program-card-audience", "program-card-outcome",
    "program-detail-page", "program-detail-hero", "program-curriculum",
    "program-module", "program-operations-note"
  ]) {
    assert.ok(app.includes(token), "missing program UI: " + token);
    assert.ok(css.includes("." + token), "missing program style: ." + token);
  }
  assert.doesNotMatch(app, /className: "course-path-selector"/);
  assert.doesNotMatch(app, /course\.duration\)/);
  assert.doesNotMatch(app, /course\.recruitmentStatus/);
});

test("home and project pages do not present an invented 100-point academy assessment", function () {
  assert.doesNotMatch(academy, /PROJECT SCORE FRAMEWORK/);
  assert.doesNotMatch(academy, /100 PTS/);
  assert.doesNotMatch(academy, /academy-review-framework/);
  assert.match(academy, /academy-feature-strip/);
  assert.match(academy, /academy-project-feature/);
});

test("static preview never publishes fabricated notices as operational news", function () {
  assert.deepEqual(previewNotices, []);
  assert.match(app, /게시된 공지사항이 없습니다/);
  assert.match(app, /previewNotices/);
  assert.doesNotMatch(app, /2026년 11월 교육과정 운영 및 상담 안내/);
});

test("notice categories have distinct semantic classes and notice content is parsed into blocks", function () {
  assert.match(app, /getNoticeCategoryClass/);
  assert.match(app, /renderNoticeContent/);
  for (const token of [
    "notice-tag--operations", "notice-tag--recruitment",
    "notice-tag--program", "notice-tag--news", "notice-tag--default",
    "notice-column-category", "notice-column-title", "notice-column-date",
    "notice-detail-return"
  ]) {
    assert.ok(css.includes("." + token), "missing notice design: ." + token);
  }
});

test("static preview does not show a personal-data form that cannot submit", function () {
  assert.match(app, /consultation-preview-unavailable/);
  assert.match(app, /이 미리보기에서는 상담 신청 내용을 저장하지 않습니다/);
  assert.match(css, /\.consultation-preview-unavailable/);
});

test("the consultation form remains available in the connected service mode", function () {
  assert.match(app, /className: "consultation-form"/);
  assert.match(app, /api\.post\("\/inquiries"/);
  assert.match(app, /name: "privacyConsent"/);
  assert.match(app, /name: "courseTitle"/);
});

test("the new favicon is a flat, legible academy mark rather than a gradient text tile", function () {
  assert.match(favicon, /viewBox="0 0 64 64"/);
  assert.match(favicon, /<path/);
  assert.doesNotMatch(favicon, /linearGradient|radialGradient/);
  assert.match(css, /--site-brand/);
});
