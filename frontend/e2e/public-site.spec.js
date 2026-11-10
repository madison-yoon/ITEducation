import { expect, test } from "@playwright/test";

test.describe("IT ACADEMY public website", function () {
  test("loads the home page and navigates to course details", async function ({ page }) {
    await page.goto("./");

    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    await page.getByRole("link", { name: "교육과정 살펴보기" }).click();
    await expect(page).toHaveURL(/\/courses\/?$/);
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();

    await page.goto("courses/1");
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    await expect(page.getByText("운영기관 공지 확인").first()).toBeVisible();
  });

  test("loads the Korean typeface and shared design tokens", async function ({ page }) {
    await page.goto("./");
    await page.evaluate(function () { return document.fonts.ready; });

    const typography = await page.evaluate(function () {
      const loadedPretendard = Array.from(document.fonts).some(function (fontFace) {
        return fontFace.family.toLowerCase().includes("pretendard") && fontFace.status === "loaded";
      });
      return {
        loadedPretendard: loadedPretendard,
        family: getComputedStyle(document.body).fontFamily,
        paper: getComputedStyle(document.documentElement).getPropertyValue("--site-paper").trim(),
        ink: getComputedStyle(document.documentElement).getPropertyValue("--site-ink").trim(),
        accent: getComputedStyle(document.documentElement).getPropertyValue("--site-accent").trim()
      };
    });

    expect(typography.loadedPretendard).toBe(true);
    expect(typography.family).toContain("Pretendard Variable");
    expect(typography.paper).toBe("#f3f1e9");
    expect(typography.ink).toBe("#202a24");
    expect(typography.accent).toBe("#bd5034");
  });

  test("keeps the same design tokens across all public routes", async function ({ page }) {
    const routes = ["./", "about", "courses", "courses/1", "projects", "notices", "consultation"];
    for (const route of routes) {
      await page.goto(route);
      const values = await page.evaluate(function () {
        const styles = getComputedStyle(document.documentElement);
        return {
          paper: styles.getPropertyValue("--site-paper").trim(),
          ink: styles.getPropertyValue("--site-ink").trim(),
          accent: styles.getPropertyValue("--site-accent").trim(),
          font: getComputedStyle(document.body).fontFamily
        };
      });
      expect(values.paper, route + " should use the shared paper token").toBe("#f3f1e9");
      expect(values.ink, route + " should use the shared ink token").toBe("#202a24");
      expect(values.accent, route + " should use the shared accent token").toBe("#bd5034");
      expect(values.font, route + " should use the Korean font stack").toContain("Pretendard Variable");
    }
  });

  test("opens a sample notice from the static preview", async function ({ page }) {
    await page.goto("notices");

    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    await page.getByRole("link", { name: /2026년 11월 교육과정 운영 및 상담 안내/ }).click();

    await expect(page).toHaveURL(/\/notices\/sample-notice-01$/);
    await expect(page.getByRole("heading", { name: "2026년 11월 교육과정 운영 및 상담 안내" })).toBeVisible();
  });

  test("loads the new project artwork and exposes the full implementation blueprint", async function ({ page }) {
    await page.goto("projects");

    const projectImages = page.locator(".academy-project-image");
    await expect(projectImages).toHaveCount(6);
    for (let index = 0; index < await projectImages.count(); index += 1) {
      const image = projectImages.nth(index);
      await image.scrollIntoViewIfNeeded();
      await expect.poll(async function () {
        return image.evaluate(function (element) {
          return element.complete && element.naturalWidth > 0;
        });
      }).toBe(true);
    }

    const trigger = page.locator(".academy-project-open").first();
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("heading", { name: "구현 흐름" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "완료 기준" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "데이터·품질 통제" })).toBeVisible();
  });

  test("loads the same project artwork in the homepage feature cards", async function ({ page }) {
    await page.goto("./");
    const images = page.locator(".academy-feature-image");
    await expect(images).toHaveCount(3);
    for (let index = 0; index < await images.count(); index += 1) {
      const image = images.nth(index);
      await image.scrollIntoViewIfNeeded();
      await expect.poll(async function () {
        return image.evaluate(function (element) {
          return element.complete && element.naturalWidth > 0;
        });
      }).toBe(true);
    }
  });

  test("closes the project detail dialog with Escape and restores focus", async function ({ page }) {
    await page.goto("projects");

    const trigger = page.locator(".academy-project-open").first();
    await expect(trigger).toBeVisible();
    await trigger.focus();
    await page.keyboard.press("Enter");

    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");

    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(trigger).toBeFocused();
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

  test("keeps all main pages within a narrow mobile viewport", async function ({ page }) {
    await page.setViewportSize({ width: 360, height: 800 });
    const routes = ["./", "about", "courses", "courses/1", "projects", "notices", "consultation"];

    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator("body")).toBeVisible();
      const dimensions = await page.evaluate(function () {
        return {
          viewport: document.documentElement.clientWidth,
          document: document.documentElement.scrollWidth
        };
      });
      expect(dimensions.document, route + " must not cause horizontal overflow").toBeLessThanOrEqual(dimensions.viewport);
    }
  });
});
