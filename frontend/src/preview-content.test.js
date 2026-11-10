import test from "node:test";
import assert from "node:assert/strict";
import { previewNotices } from "./preview-content.js";

test("preview contains realistic sample notices for the public notice experience", function () {
  assert.equal(previewNotices.length, 7);
  assert.equal(new Set(previewNotices.map(function (notice) { return notice.id; })).size, 7);
  assert.ok(previewNotices.every(function (notice) {
    return notice.title && notice.category && notice.createdAt && notice.content.length >= 80 && notice.isDemo;
  }));
  assert.equal(previewNotices.filter(function (notice) { return notice.pinned; }).length, 1);
  assert.ok(previewNotices.some(function (notice) { return notice.id === "sample-notice-01"; }));
});
