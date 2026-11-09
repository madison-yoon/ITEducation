import test from "node:test";
import assert from "node:assert/strict";
import { getPageMetadata, getScrollAction } from "./navigation.js";

test("known public routes receive specific page titles", function () {
  assert.equal(getPageMetadata("/").title, "홈");
  assert.equal(getPageMetadata("/courses").title, "교육과정");
  assert.equal(getPageMetadata("/courses/12").title, "교육과정 상세");
  assert.equal(getPageMetadata("/notices/abc").title, "공지사항 상세");
  assert.equal(getPageMetadata("/admin/accounts").title, "관리자");
});

test("trailing slashes do not create a false not-found page", function () {
  assert.equal(getPageMetadata("/about/").title, "교육 철학");
  assert.equal(getPageMetadata("/projects/").title, "프로젝트");
});

test("unknown routes receive a not-found title", function () {
  assert.equal(getPageMetadata("/does-not-exist").title, "페이지를 찾을 수 없습니다");
});

test("new navigations reset to the top", function () {
  assert.deepEqual(getScrollAction("PUSH", 820), { mode: "top", top: 0 });
  assert.deepEqual(getScrollAction("REPLACE", 820), { mode: "top", top: 0 });
});

test("browser back and forward restore the saved position", function () {
  assert.deepEqual(getScrollAction("POP", 640), { mode: "restore", top: 640 });
  assert.deepEqual(getScrollAction("POP", -20), { mode: "restore", top: 0 });
  assert.deepEqual(getScrollAction("POP", "invalid"), { mode: "restore", top: 0 });
});
