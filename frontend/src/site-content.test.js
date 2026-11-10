import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const app = readFileSync(new URL("./App.js", import.meta.url), "utf8");
const academy = readFileSync(new URL("./academy-pages.js", import.meta.url), "utf8");
const experience = readFileSync(new URL("./experience.css", import.meta.url), "utf8");
const readme = readFileSync(new URL("../../README.md", import.meta.url), "utf8");

test("course list explains four learning paths and their concrete outputs", function () {
  assert.match(app, /FIND YOUR LEARNING PATH/);
  assert.match(app, /데이터로 예측하고 추천하기/);
  assert.match(app, /데이터에서 의사결정 근거 찾기/);
  assert.match(app, /문서와 지식을 AI 서비스로 연결하기/);
  assert.match(app, /화면부터 서버까지 서비스 구현하기/);
  assert.match(app, /대표 학습 산출물/);
  assert.match(experience, /\.course-path-grid/);
  assert.match(experience, /@media \(max-width: 680px\)/);
});

test("consultation page explains preparation, process and the information collected", function () {
  assert.match(app, /BEFORE YOU APPLY/);
  assert.match(app, /관심 분야/);
  assert.match(app, /현재 경험/);
  assert.match(app, /학습 여건/);
  assert.match(app, /목표 결과/);
  assert.match(app, /HOW IT WORKS/);
  assert.match(app, /입력 정보 안내/);
  assert.match(app, /개인정보 처리 주체/);
  assert.match(experience, /\.consultation-preparation/);
  assert.match(experience, /\.consultation-privacy-detail/);
});

test("home page presents portfolio evidence without implying unverified test results", function () {
  assert.match(academy, /PORTFOLIO EVIDENCE/);
  assert.match(academy, /문제와 요구사항/);
  assert.match(academy, /설계와 데이터/);
  assert.match(academy, /구현과 변경/);
  assert.match(academy, /테스트와 품질/);
  assert.match(academy, /배포와 회고/);
  assert.match(academy, /REQUIRED/);
  assert.doesNotMatch(academy, /"TRACEABLE"|"VERIFIED"|"REVIEWED"/);
  assert.doesNotMatch(academy, /h\("span", null, "PASS"\)/);
  assert.doesNotMatch(academy, /h\("span", null, "CHECKED"\)/);
});

test("static preview notices are visibly distinguished from live operational notices", function () {
  assert.match(app, /isStaticPreview \? h\("p", \{ className: "notice-preview-disclaimer", role: "note" \}/);
  assert.match(app, /시연용 예시 게시물/);
  assert.match(app, /실제 운영 공지가 아닙니다/);
  assert.match(app, /notice-preview-disclaimer/);
});

test("all six project illustrations referenced by the portfolio are present", function () {
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
    assert.ok(
      existsSync(new URL("../public/images/projects/" + asset, import.meta.url)),
      "missing published asset: " + asset
    );
  });
});

test("final submission audit is linked from the project README", function () {
  assert.match(readme, /docs\/FINAL_SUBMISSION_AUDIT_2026-11\.md/);
});
