import { expect, test } from "@playwright/test";

test.describe("IT ACADEMY public website", function () {
  test("loads the home page and navigates to course details", async function ({ page }) {
    await page.goto("./");

    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    await page.getByRole("link", { name: "교육과정 탐색" }).click();
    await expect(page).toHaveURL(/\/courses\/?$/);
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();

    await page.goto("courses/1");
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    await expect(page.getByText("운영기관 공지 확인").first()).toBeVisible();
  });

  test("opens a sample notice from the static preview", async function ({ page }) {
    await page.goto("notices");

    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    await page.getByRole("link", { name: /2026년 11월 교육과정 운영 및 상담 안내/ }).click();

    await expect(page).toHaveURL(/\/notices\/sample-notice-01$/);
    await expect(page.getByRole("heading", { name: "2026년 11월 교육과정 운영 및 상담 안내" })).toBeVisible();
  });

  test("does not report a consultation as received without a backend", async function ({ page }) {
    await page.goto("consultation");

    await page.locator('input[name="name"]').fill("테스트 사용자");
    await page.locator('input[name="phone"]').fill("010-1234-5678");
    await page.locator('select[name="courseTitle"]').selectOption({ index: 1 });
    await page.locator('textarea[name="message"]').fill("정적 미리보기의 상담 접수 차단 동작을 확인합니다.");
    await page.locator('input[name="privacyConsent"]').check();
    await page.getByRole("button", { name: "상담 신청하기" }).click();

    await expect(page.getByRole("alert")).toContainText("온라인 접수 서버에 연결할 수 없습니다.");
    await expect(page.getByRole("heading", { name: "상담 신청이 접수되었습니다." })).toHaveCount(0);
  });

  test("renders a useful not-found page for unknown routes", async function ({ page }) {
    await page.goto("this-route-does-not-exist");

    await expect(page.getByRole("heading", { name: "페이지를 찾을 수 없습니다." })).toBeVisible();
    await expect(page.getByRole("link", { name: "메인 페이지로 이동" })).toBeVisible();
  });

  test("keeps the home page within a narrow mobile viewport", async function ({ page }) {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("./");

    const dimensions = await page.evaluate(function () {
      return {
        viewport: document.documentElement.clientWidth,
        document: document.documentElement.scrollWidth
      };
    });

    expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport);
  });
});
