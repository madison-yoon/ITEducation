import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("./site.css", import.meta.url), "utf8");
const legacy = readFileSync(new URL("./design-system.css", import.meta.url), "utf8");
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const entry = readFileSync(new URL("./main.js", import.meta.url), "utf8");

test("the Korean webfont is loaded from a pinned Pretendard stylesheet", function () {
  assert.match(html, /orioncactus\/pretendard@v1\.3\.9/);
  assert.match(html, /pretendardvariable-dynamic-subset\.min\.css/);
  assert.match(css, /"Pretendard Variable"/);
});

test("the prospectus uses one coherent palette and typography scale", function () {
  for (const token of [
    "--site-paper", "--site-paper-2", "--site-surface", "--site-ink",
    "--site-muted", "--site-line", "--site-brand", "--site-signal",
    "--site-program-ai", "--site-program-data", "--site-program-genai", "--site-program-web"
  ]) {
    assert.ok(css.includes(token + ":"), "missing token: " + token);
  }
  assert.match(css, /font-family:\s*var\(--site-font\)/);
  assert.match(css, /line-height:\s*1\.65/);
  assert.match(css, /Pretendard Variable/);
  assert.doesNotMatch(css, /linear-gradient\(|radial-gradient\(/);
  assert.doesNotMatch(css, /transition:\s*all/);
});

test("the unified prospectus stylesheet owns all public routes while admin styles remain available", function () {
  for (const selector of [
    ".academy-site-header", ".academy-hero", ".academy-project-grid",
    ".program-page", ".program-detail-page", ".notice-page", ".notice-detail",
    ".consultation-page", ".academy-site-footer"
  ]) {
    assert.ok(css.includes(selector), "missing public selector: " + selector);
  }
  for (const selector of [".admin-shell", ".admin-sidebar", ".admin-panel"]) {
    assert.ok(legacy.includes(selector), "missing retained admin selector: " + selector);
  }
  assert.match(entry, /design-system\.css[\s\S]*site\.css/);
});

test("responsive, keyboard-focus and reduced-motion rules are present", function () {
  assert.match(css, /@media\s*\(max-width:\s*760px\)/);
  assert.match(css, /@media\s*\(max-width:\s*420px\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /\.site-button[\s\S]{0,100}min-height:\s*48px/);
});

test("the public theme has no inherited 3D scene or gradient residue", function () {
  assert.match(css, /\.academy-scene[\s\S]{0,120}display:\s*none/);
  assert.doesNotMatch(css, /linear-gradient\(|radial-gradient\(/);
});

test("Korean document metadata remains UTF-8 and accessible", function () {
  assert.match(html, /<html lang="ko">/);
  assert.match(html, /<meta charset="UTF-8"/i);
  assert.match(html, /name="viewport"/);
  assert.match(html, /name="description"/);
  assert.match(html, /favicon\.svg/);
});
