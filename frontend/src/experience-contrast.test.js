import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("./site.css", import.meta.url), "utf8");

function luminance(hex) {
  const raw = hex.replace("#", "");
  const values = [0, 2, 4].map(function (index) {
    const channel = parseInt(raw.slice(index, index + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  return values[0] * .2126 + values[1] * .7152 + values[2] * .0722;
}

function contrastRatio(foreground, background) {
  const pair = [luminance(foreground), luminance(background)].sort(function (a, b) { return b - a; });
  return (pair[0] + .05) / (pair[1] + .05);
}

test("brand text and core surfaces meet WCAG AA for normal text", function () {
  const combinations = [
    ["#176b68", "#edf2f1"],
    ["#52696d", "#edf2f1"],
    ["#52696d", "#fbfdfc"],
    ["#f4f7f5", "#172c31"],
    ["#dfe98a", "#172c31"],
    ["#ffffff", "#176b68"]
  ];
  for (const [foreground, background] of combinations) {
    assert.ok(
      contrastRatio(foreground, background) >= 4.5,
      foreground + " on " + background + " must meet 4.5:1"
    );
  }
});

test("each notice category has its own high-contrast foreground and background", function () {
  const pairs = [
    ["#754a12", "#f4e9c8"],
    ["#24547a", "#e1edf5"],
    ["#4f497b", "#eceaf6"],
    ["#17635b", "#dceee9"]
  ];
  for (const [foreground, background] of pairs) {
    assert.ok(contrastRatio(foreground, background) >= 4.5);
  }
  for (const selector of [
    ".notice-tag--recruitment", ".notice-tag--program",
    ".notice-tag--news", ".notice-tag--operations", ".notice-tag--default"
  ]) {
    assert.ok(css.includes(selector), "missing semantic notice color: " + selector);
  }
});

test("course and notice text use the same paper-and-ink system with visible focus", function () {
  assert.match(css, /\.program-header h1[\s\S]{0,120}font-size/);
  assert.match(css, /\.notice-detail h1[\s\S]{0,120}font-size/);
  assert.match(css, /\.notice-detail-return[\s\S]{0,150}text-decoration:\s*underline/);
  assert.match(css, /:focus-visible[\s\S]{0,100}outline:\s*3px\s+solid/);
  assert.doesNotMatch(css, /linear-gradient\(|radial-gradient\(/);
});
