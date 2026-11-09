import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("./experience.css", import.meta.url), "utf8");

function rule(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(escaped + "\\s*\\{([^}]*)\\}"));
  assert.ok(match, "missing CSS selector: " + selector);
  return match[1];
}

function luminance(hex) {
  const raw = hex.replace("#", "");
  const channels = [0, 2, 4].map(function (index) {
    const value = parseInt(raw.slice(index, index + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrastRatio(first, second) {
  const values = [luminance(first), luminance(second)].sort(function (a, b) { return b - a; });
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test("course intro eyebrow, heading and description use explicit light text", function () {
  const eyebrow = rule("#main-content > .page .course-page-intro-copy .eyebrow");
  const heading = rule("#main-content > .page .course-page-intro-copy h1");
  const description = rule("#main-content > .page .course-page-intro-copy .lead");

  assert.match(eyebrow, /color:\\s*#f3f6ff\\s*!important/i);
  assert.match(heading, /color:\\s*#ffffff\\s*!important/i);
  assert.match(description, /color:\\s*#f0f4ff\\s*!important/i);
  assert.match(heading, /-webkit-text-stroke/);
  assert.match(description, /text-shadow/);
});

test("white course copy meets WCAG AA against the darkest and lightest hero gradient stops", function () {
  const backgrounds = ["#101a36", "#3b2c72"];
  const textColors = ["#f3f6ff", "#ffffff", "#f0f4ff"];

  for (const foreground of textColors) {
    for (const background of backgrounds) {
      assert.ok(
        contrastRatio(foreground, background) >= 4.5,
        foreground + " on " + background + " must reach 4.5:1"
      );
    }
  }
});

test("notice back action has white text, a dark gradient and a visible keyboard focus", function () {
  const button = rule("#main-content .notice-detail-page .notice-detail-footer button.notice-back-action");
  const focus = rule("#main-content .notice-detail-page .notice-detail-footer button.notice-back-action:focus-visible");
  assert.match(button, /color:\\s*#ffffff\\s*!important/i);
  assert.match(button, /background:\\s*linear-gradient/);
  assert.match(button, /-webkit-text-stroke/);
  assert.match(focus, /outline:\\s*3px\\s+solid/i);

  for (const background of ["#263f98", "#49358f"]) {
    assert.ok(contrastRatio("#ffffff", background) >= 4.5);
  }
});
