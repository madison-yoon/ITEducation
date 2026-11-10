import { mkdir } from "node:fs/promises";
import { expect, test } from "@playwright/test";

const publicRoutes = ["./", "about", "courses", "courses/1", "projects", "notices", "consultation"];

test.describe("IT ACADEMY approved landing-page composition", function () {
  test("home follows the approved visual order and opens course comparison", async function ({ page }) {
    await page.goto("./");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("IT로 만드는");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("당신의 새로운 시작");
    await expect(page.locator(".academy-feature-item")).toHaveCount(4);
    await expect(page.locator(".academy-course-card")).toHaveCount(4);
    await expect(page.locator(".academy-project-feature")).toContainText("MOMO 영화 리뷰 커뮤니티");
    await expect(page.locator(".academy-project-side-item")).toHaveCount(3);
    await expect(page.locator(".academy-home-notices")).toBeVisible();
    await expect(page.locator(".academy-home-consultation")).toBeVisible();
    await expect(page.locator(".academy-final-cta")).toBeVisible();

    const sectionOrder = await page.locator("main#main-content > section").evaluateAll(function (sections) {
      return sections.map(function (section) { return section.className; });
    });
    expect(sectionOrder.indexOf("academy-hero")).toBeLessThan(sectionOrder.indexOf("academy-program-section"));
    expect(sectionOrder.indexOf("academy-program-section")).toBeLessThan(sectionOrder.indexOf("academy-project-showcase"));
    expect(sectionOrder.indexOf("academy-project-showcase")).toBeLessThan(sectionOrder.indexOf("academy-home-information"));
    expect(sectionOrder.indexOf("academy-home-information")).toBeLessThan(sectionOrder.indexOf("academy-final-cta"));

    await page.getByRole("link", { name: "교육과정 보기" }).first().click();
    await expect(page).toHaveURL(/\/courses\/?$/);
    await expect(page.locator(".program-card")).toHaveCount(4);
  });

  test("hero and all course card photographs load", async function ({ page }) {
    await page.goto("./");
    const images = page.locator(".academy-hero-image, .academy-course-art img");
    await expect(images).toHaveCount(5);
    await images.evaluateAll(function (elements) {
      elements.forEach(function (image) { image.loading = "eager"; });
    });
    await expect.poll(async function () {
      return images.evaluateAll(function (elements) {
        return elements.every(function (image) { return image.complete && image.naturalWidth > 0; });
      });
    }, { timeout: 20000 }).toBe(true);
  });

  test("course detail explains fit, learning steps and tangible outcomes", async function ({ page }) {
    await page.goto("courses/1");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("AI·머신러닝 실무 개발자 과정");
    await expect(page.getByText("이런 관심에 맞습니다").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "기초부터 프로젝트까지" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "취향 데이터를 활용한 AI 영화 추천 서비스" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "모집·일정·교육비는 확인된 공지로 안내합니다." })).toBeVisible();
    await expect(page.getByText("모집 정보 확인")).toHaveCount(0);
    await expect(page.getByText("운영기관 공지 확인")).toHaveCount(0);
  });

  test("the Korean typeface and approved colour tokens are loaded", async function ({ page }) {
    await page.goto("./");
    await page.evaluate(function () { return document.fonts.ready; });
    const values = await page.evaluate(function () {
      const root = getComputedStyle(document.documentElement);
      return {
        loadedPretendard: Array.from(document.fonts).some(function (face) {
          return face.family.toLowerCase().includes("pretendard") && face.status === "loaded";
        }),
        family: getComputedStyle(document.body).fontFamily,
        paper: root.getPropertyValue("--site-paper").trim(),
        ink: root.getPropertyValue("--site-ink").trim(),
        brand: root.getPropertyValue("--site-brand").trim(),
        accent: root.getPropertyValue("--site-accent").trim()
      };
    });
    expect(values.loadedPretendard).toBe(true);
    expect(values.family).toContain("Pretendard Variable");
    expect(values.paper).toBe("#f2ede4");
    expect(values.ink).toBe("#182a22");
    expect(values.brand).toBe("#174738");
    expect(values.accent).toBe("#e8753a");
  });

  test("all public routes keep the same forest-green, ivory and typography tokens", async function ({ page }) {
    for (const route of publicRoutes) {
      await page.goto(route);
      const values = await page.evaluate(function () {
        const styles = getComputedStyle(document.documentElement);
        return {
          paper: styles.getPropertyValue("--site-paper").trim(),
          ink: styles.getPropertyValue("--site-ink").trim(),
          brand: styles.getPropertyValue("--site-brand").trim(),
          font: getComputedStyle(document.body).fontFamily
        };
      });
      expect(values.paper, route + " paper").toBe("#f2ede4");
      expect(values.ink, route + " ink").toBe("#182a22");
      expect(values.brand, route + " brand").toBe("#174738");
      expect(values.font, route + " font").toContain("Pretendard Variable");
    }
  });

  test("the public notice preview shows a real empty state, not invented announcements", async function ({ page }) {
    await page.goto("notices");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("공지사항");
    await expect(page.getByRole("heading", { name: "게시된 공지사항이 없습니다." })).toBeVisible();
    await expect(page.getByText("2026년 11월 교육과정 운영 및 상담 안내")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "교육과정 보기" })).toBeVisible();
    await expect(page.locator(".notice-empty-actions").getByRole("link", { name: "상담 안내" })).toBeVisible();

    await page.goto("notices/sample-notice-01");
    await expect(page.getByRole("heading", { name: "이 공지사항을 찾을 수 없습니다." })).toBeVisible();
    await expect(page.getByRole("link", { name: "목록으로 돌아가기" }).first()).toBeVisible();
    await page.getByRole("link", { name: "목록으로 돌아가기" }).first().click();
    await expect(page).toHaveURL(/\/notices\/?$/);
  });

  test("notice categories have visibly distinct semantic colours", async function ({ page }) {
    await page.goto("notices");
    const backgrounds = await page.evaluate(function () {
      const names = ["notice-tag--operations", "notice-tag--recruitment", "notice-tag--program", "notice-tag--news", "notice-tag--default"];
      return names.map(function (name) {
        const tag = document.createElement("span");
        tag.className = "notice-tag " + name;
        document.body.appendChild(tag);
        const value = getComputedStyle(tag).backgroundColor;
        tag.remove();
        return value;
      });
    });
    expect(new Set(backgrounds).size).toBe(5);
  });

  test("project artwork and the detail dialog remain functional", async function ({ page }) {
    await page.goto("projects");
    const images = page.locator(".academy-project-image");
    await expect(images).toHaveCount(6);
    for (let index = 0; index < await images.count(); index += 1) {
      const image = images.nth(index);
      await image.scrollIntoViewIfNeeded();
      await expect.poll(async function () {
        return image.evaluate(function (element) { return element.complete && element.naturalWidth > 0; });
      }).toBe(true);
    }
    const trigger = page.locator(".academy-project-open").first();
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("heading", { name: "구현 흐름" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "완료 기준" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "데이터·품질 통제" })).toBeVisible();
  });

  test("homepage project cards do not reintroduce a generic score framework", async function ({ page }) {
    await page.goto("./");
    await expect(page.getByText("PROJECT SCORE FRAMEWORK")).toHaveCount(0);
    await expect(page.getByText("100 PTS")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "MOMO 영화 리뷰 커뮤니티" })).toBeVisible();
  });

  test("project dialog closes with Escape and restores focus", async function ({ page }) {
    await page.goto("projects");
    const trigger = page.locator(".academy-project-open").first();
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("static consultation preview explains that it cannot accept personal data", async function ({ page }) {
    await page.goto("consultation");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("나에게 맞는 학습 방향");
    await expect(page.getByRole("note").filter({ hasText: "이 미리보기에서는 상담 신청 내용을 저장하지 않습니다" })).toBeVisible();
    await expect(page.locator('input[name="name"]')).toHaveCount(0);
    await expect(page.locator('input[name="phone"]')).toHaveCount(0);
    await expect(page.locator("form")).toHaveCount(0);
    await page.getByRole("link", { name: "교육과정 살펴보기" }).click();
    await expect(page).toHaveURL(/\/courses\/?$/);
  });

  test("shared menu, focus states and all public pages fit the five target widths", async function ({ page }) {
    const widths = [360, 390, 768, 1024, 1440];
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of publicRoutes) {
        await page.goto(route);
        await expect(page.locator("main#main-content")).toBeVisible();
        const dimensions = await page.evaluate(function () {
          return { viewport: document.documentElement.clientWidth, document: document.documentElement.scrollWidth };
        });
        expect(dimensions.document, route + " at " + width).toBeLessThanOrEqual(dimensions.viewport);
      }
    }
  });

  test("the favicon points to the new A mark and the home logo follows the same motif", async function ({ page }) {
    await page.goto("./");
    const favicon = page.locator('link[rel="icon"]');
    await expect(favicon).toHaveAttribute("href", /favicon\.svg/);
    await expect(page.locator(".academy-brand-mark")).toHaveCount(2);
    await expect(page.locator(".academy-brand-copy").first()).toContainText("IT ACADEMY");
    await expect(page.locator(".academy-brand-copy").first()).toContainText("Learn · Build · Grow");
  });

  test("captures desktop and mobile screenshots for every public page", async function ({ page }) {
    const routes = [
      ["home", "./"], ["about", "about"], ["courses", "courses"],
      ["course-detail", "courses/1"], ["projects", "projects"],
      ["notices", "notices"], ["consultation", "consultation"]
    ];
    await mkdir("test-results/visual-review", { recursive: true });
    for (const [name, route] of routes) {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto(route);
      await expect(page.locator("main#main-content")).toBeVisible();
      await page.screenshot({ path: "test-results/visual-review/" + name + "-desktop.png", fullPage: true });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(route);
      await expect(page.locator("main#main-content")).toBeVisible();
      await page.screenshot({ path: "test-results/visual-review/" + name + "-mobile.png", fullPage: true });
    }
  });

  test("unknown routes show a useful not-found page", async function ({ page }) {
    await page.goto("this-route-does-not-exist");
    await expect(page.getByRole("heading", { name: "페이지를 찾을 수 없습니다." })).toBeVisible();
    await expect(page.getByRole("link", { name: "메인 페이지로 이동" })).toBeVisible();
  });
});
