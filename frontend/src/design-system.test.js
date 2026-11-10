import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("./design-system.css", import.meta.url), "utf8");
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const entry = readFileSync(new URL("./main.js", import.meta.url), "utf8");

test("the Korean webfont is loaded from a pinned Pretendard stylesheet", function () {
  assert.match(html, /orioncactus\/pretendard@v1\.3\.9/);
  assert.match(html, /pretendardvariable-dynamic-subset\.min\.css/);
  assert.match(css, /"Pretendard Variable"/);
});

test("the application uses one shared palette and typography scale", function () {
  for (const token of ["--site-paper", "--site-surface", "--site-ink", "--site-muted", "--site-line", "--site-accent", "--site-forest"]) {
    assert.match(css, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*:"));
  }
  assert.match(css, /font-family:\s*var\(--site-font\)/);
  assert.match(css, /letter-spacing:\s*-\.0(12|15)em/);
  assert.doesNotMatch(css, /letter-spacing:\s*-\.0(7|8)\d*em/);
});

test("public routes and the admin console share the system styles", function () {
  for (const selector of [
    ".academy-site-header", ".academy-hero", ".academy-subpage-hero",
    ".academy-project-grid", ".course-detail-hero", ".course-path-grid",
    ".notice-page", ".notice-detail", ".formwrap", ".admin-shell",
    ".admin-sidebar", ".admin-panel", ".academy-site-footer"
  ]) {
    assert.ok(css.includes(selector), "missing design-system selector: " + selector);
  }
  assert.match(entry, /design-system\.css/);
  assert.doesNotMatch(entry, /design-refresh\.css/);
});

test("responsive, keyboard-focus and reduced-motion rules are present", function () {
  assert.match(css, /@media\s*\(max-width:\s*650px\)/);
  assert.match(css, /@media\s*\(max-width:\s*380px\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /min-height:\s*44px/);
});

test("Korean document metadata remains UTF-8 and accessible", function () {
  assert.match(html, /<html lang="ko">/);
  assert.match(html, /<meta charset="UTF-8"/i);
  assert.match(html, /name="viewport"/);
});
