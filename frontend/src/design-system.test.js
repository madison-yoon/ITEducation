import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("./site.css", import.meta.url), "utf8");
const legacy = readFileSync(new URL("./design-system.css", import.meta.url), "utf8");
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const favicon = readFileSync(new URL("../public/favicon.svg", import.meta.url), "utf8");
const entry = readFileSync(new URL("./main.js", import.meta.url), "utf8");

test("the Korean webfont is loaded from a pinned Pretendard stylesheet", function () {
  assert.match(html, /orioncactus\/pretendard@v1\.3\.9/);
  assert.match(html, /pretendardvariable-dynamic-subset\.min\.css/);
  assert.match(css, /"Pretendard Variable"/);
});

test("the approved academy palette uses forest green, warm ivory and orange", function () {
  for (const token of [
    "--site-paper", "--site-paper-2", "--site-surface", "--site-ink",
    "--site-muted", "--site-line", "--site-brand", "--site-accent", "--site-accent-strong"
  ]) {
    assert.ok(css.includes(token + ":"), "missing token: " + token);
  }
  assert.match(css, /--site-paper:\s*#f2ede4/);
  assert.match(css, /--site-ink:\s*#182a22/);
  assert.match(css, /--site-brand:\s*#174738/);
  assert.match(css, /--site-accent:\s*#e8753a/);
  assert.match(css, /font-family:\s*var\(--site-font\)/);
  assert.match(css, /line-height:\s*1\.65/);
});

test("the approved home composition is present in the same section order", function () {
  const selectors = [
    ".academy-hero-backdrop", ".academy-hero-image", ".academy-feature-strip",
    ".academy-program-section", ".academy-course-grid", ".academy-project-showcase",
    ".academy-home-information", ".academy-home-consultation", ".academy-final-cta"
  ];
  for (const selector of selectors) assert.ok(css.includes(selector), "missing composition selector: " + selector);
  assert.match(entry, /design-system\.css[\s\S]*site\.css/);
});

test("the public design system owns every public route while admin styles remain available", function () {
  for (const selector of [
    ".academy-site-header", ".academy-subpage-hero", ".academy-project-grid",
    ".program-page", ".program-detail-page", ".notice-page", ".notice-detail",
    ".consultation-page", ".academy-site-footer"
  ]) assert.ok(css.includes(selector), "missing public selector: " + selector);
  for (const selector of [".admin-shell", ".admin-sidebar", ".admin-panel"]) {
    assert.ok(legacy.includes(selector), "missing retained admin selector: " + selector);
  }
});

test("responsive, keyboard-focus and reduced-motion rules are present", function () {
  assert.match(css, /@media\s*\(max-width:\s*800px\)/);
  assert.match(css, /@media\s*\(max-width:\s*560px\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /min-height:\s*48px/);
});

test("the favicon is the same flat orange A mark used by the academy brand", function () {
  assert.match(favicon, /viewBox="0 0 64 64"/);
  assert.match(favicon, /#102b23/);
  assert.match(favicon, /#f1a16e/);
  assert.doesNotMatch(favicon, /linearGradient|radialGradient/);
  assert.match(html, /favicon\.svg/);
});

test("Korean document metadata remains UTF-8 and accessible", function () {
  assert.match(html, /<html lang="ko">/);
  assert.match(html, /<meta charset="UTF-8"/i);
  assert.match(html, /name="viewport"/);
  assert.match(html, /name="description"/);
});
