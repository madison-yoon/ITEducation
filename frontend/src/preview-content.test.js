import test from "node:test";
import assert from "node:assert/strict";
import { previewNotices } from "./preview-content.js";

test("public preview contains ten complete notice examples", function () {
  assert.equal(previewNotices.length, 10);
  assert.equal(new Set(previewNotices.map(function (notice) { return notice.id; })).size, 10);

  previewNotices.forEach(function (notice) {
    assert.ok(notice.title && notice.title.length >= 10);
    assert.ok(notice.category);
    assert.ok(notice.content && notice.content.length >= 120);
    assert.match(notice.createdAt, /^2026-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
  });
});

test("notice examples are ordered from newest to oldest", function () {
  const dates = previewNotices.map(function (notice) { return notice.createdAt; });
  const sorted = dates.slice().sort().reverse();
  assert.deepEqual(dates, sorted);
});

test("notice examples cover operations, recruitment, curriculum and learning news", function () {
  const categories = new Set(previewNotices.map(function (notice) { return notice.category; }));
  ["운영 안내", "모집 안내", "교육과정", "교육 소식", "공지"].forEach(function (category) {
    assert.ok(categories.has(category), "missing category: " + category);
  });
});
