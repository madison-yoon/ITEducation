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

test("core body and heading text meet WCAG AA on warm ivory surfaces", function () {
  const pairs = [
    ["#182a22", "#f2ede4"],
    ["#174738", "#f2ede4"],
    ["#5c6a60", "#f2ede4"],
    ["#5c6a60", "#fffdf9"],
    ["#f4f3eb", "#102b23"],
    ["#f0a16e", "#102b23"],
    ["#102b23", "#e8753a"]
  ];
  for (const [foreground, background] of pairs) {
    assert.ok(contrastRatio(foreground, background) >= 4.5, foreground + " on " + background + " must meet 4.5:1");
  }
});

test("each notice category has a distinct high-contrast semantic colour", function () {
  const pairs = [
    ["#7a3b18", "#fae8d9"],
    ["#1c4b39", "#e1eee1"],
    ["#4a4d72", "#eaeaf4"],
    ["#27556d", "#e1edf2"]
  ];
  for (const [foreground, background] of pairs) {
    assert.ok(contrastRatio(foreground, background) >= 4.5);
  }
  for (const selector of [
    ".notice-tag--recruitment", ".notice-tag--program",
    ".notice-tag--news", ".notice-tag--operations", ".notice-tag--default"
  ]) assert.ok(css.includes(selector), "missing semantic notice colour: " + selector);
});

test("photo overlays, buttons, and focus treatments are present without hiding text", function () {
  assert.match(css, /\.academy-hero-backdrop[\s\S]{0,180}linear-gradient/);
  assert.match(css, /\.academy-hero-copy h1[\s\S]{0,150}color:\s*#fff/);
  assert.match(css, /\.academy-header-cta[\s\S]{0,150}background/);
  assert.match(css, /:focus-visible[\s\S]{0,100}outline:\s*3px\s+solid/);
});
