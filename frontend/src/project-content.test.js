import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const projectPage = readFileSync(new URL("./academy-pages.js", import.meta.url), "utf8");
const app = readFileSync(new URL("./App.js", import.meta.url), "utf8");
const css = readFileSync(new URL("./design-system.css", import.meta.url), "utf8");
const root = new URL("../public/images/projects/", import.meta.url);
const artworkFiles = [
  "ai-movie-recommender.svg",
  "consumer-data-insights.svg",
  "rag-document-assistant.svg",
  "customer-voc-analytics.svg",
  "learning-operations-platform.svg",
  "vibe-coding-quality.svg"
];

test("all project and homepage artwork files use the new editorial palette", function () {
  const palette = ["#172c31", "#176b68", "#fbfdfc"];
  for (const file of artworkFiles) {
    assert.ok(existsSync(new URL(file, root)), "missing " + file);
    const svg = readFileSync(new URL(file, root), "utf8");
    assert.match(svg, /<svg[^>]+viewBox="0 0 900 560"/);
    for (const color of palette) assert.ok(svg.toLowerCase().includes(color), file + " missing " + color);
    assert.doesNotMatch(svg, /linearGradient|radialGradient|feGaussianBlur/i, file + " still uses the old glass/glow treatment");
  }
});

test("the same project illustration is used in featured and gallery image components", function () {
  assert.match(projectPage, /academy-feature-image/);
  assert.match(projectPage, /academy-project-image/);
  assert.match(projectPage, /projectArtwork/);
  assert.match(projectPage, /getProjectArtwork\(project\)/);
  assert.match(css, /\.academy-feature-image,/);
  assert.match(css, /\.academy-project-image/);
});

test("project blueprints include architecture, steps, completion and risk controls", function () {
  for (const phrase of ["projectBlueprints", "architecture:", "workflow:", "completion:", "controls:", "getProjectBlueprint"]) {
    assert.ok(projectPage.includes(phrase), "missing " + phrase);
  }
  assert.match(projectPage, /academy-modal-workflow-grid/);
  assert.match(projectPage, /완료 기준/);
  assert.match(projectPage, /데이터·품질 통제/);
  assert.match(projectPage, /academy-project-card-focus/);
});

test("course modules explain practice, evidence and an observable completion check", function () {
  assert.match(app, /확인할 내용/);
  assert.match(app, /validation:/);
  assert.match(app, /동일한 평가 데이터에서 Precision@K/);
  assert.match(app, /서버 요청 단위로 권한이 검증/);
});

test("the about page states concrete learning completion criteria", function () {
  assert.match(projectPage, /DEFINITION OF DONE/);
  assert.match(projectPage, /academy-about-completion-grid/);
  assert.match(projectPage, /다음 단계로 넘어가기 전에 확인하는 기준/);
});
