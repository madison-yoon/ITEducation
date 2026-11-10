import test from "node:test";
import assert from "node:assert/strict";
import { previewNotices } from "./preview-content.js";

test("public preview does not manufacture academy announcements", function () {
  assert.deepEqual(previewNotices, []);
});
