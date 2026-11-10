import { mkdir } from "node:fs/promises";
import { expect, test } from "@playwright/test";

const publicRoutes = ["./", "about", "courses", "courses/1", "projects", "notices", "consultation"];

async function waitForVisualAssets(page, route) {
  const failed = await page.evaluate(async function () {
    const images = Array.from(document.images);
    images.forEach(function (image) { image.loading = "eager"; });
    await document.fonts.ready;
    await Promise.all(images.map(function (image) {
      return image.decode().catch(function () { return null; });
    }));
    return images.filter(function (image) {
      return !image.complete || image.naturalWidth <= 0;
    }).map(function (image) {
      return image.currentSrc || image.src;
    });
  });
  expect(failed, "image assets on " + route).toEqual([]);
}

test.describe("IT ACADEMY approved landing-page composition", function () {
  test("home follows the approved visual order and opens course comparison", async function ({ page }) {
    await page.goto("./");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("IT로 만드는");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("당신의 새로운 시작");
    await expect(page.locator(".academy-feature-item")).toHaveCount(4);
    await expect(page.locator(".academy-course-card")).toHaveCount(4);
    await expect(page.locator(".academy-project-feature")).toContainText("MOMO 영화 리뷰 커뮤니티");
    await expect(page.locator(".academy-project-side-item")).toHaveCount(3);
    const featuredProjectImage = page.locator(".academy-feature-image");
    await expect(featuredProjectImage).toHaveCount(1);
    await expect.poll(async function () {
      return featuredProjectImage.evaluate(function (image) { return image.complete && image.naturalWidth > 0; });
    }, { timeout: 15000 }).toBe(true);
    const relatedImages = page.locator(".academy-project-side-image img");
    await expect(relatedImages).toHaveCount(3);
    await expect.poll(async function () {
      return relatedImages.evaluateAll(function (images) {
        return images.every(function (image) { return image.complete && image.naturalWidth > 0; });
      });
    }, { timeout: 15000 }).toBe(true);
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

  test("the public notice preview displays sample posts and opens their detail pages", async function ({ page }) {
    await page.goto("notices");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("공지사항");
    await expect(page.getByText("예시 데이터입니다")).toBeVisible();
    await expect(page.locator(".notice-row")).toHaveCount(6);
    await expect(page.locator(".notice-featured")).toContainText("IT ACADEMY 홈페이지 이용 안내");

    await page.goto("notices/sample-notice-01");
    await expect(page.getByRole("heading", { name: "IT ACADEMY 홈페이지 이용 안내" })).toBeVisible();
    await expect(page.getByText("교육과정", { exact: false }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "목록으로 돌아가기" }).first()).toBeVisible();
    await page.getByRole("link", { name: "목록으로 돌아가기" }).first().click();
    await expect(page).toHaveURL(/\/notices\/?$/);
  });

  test("notice page uses the forest-and-ivory system without legacy top padding", async function ({ page }) {
    await page.goto("notices");
    const layout = await page.evaluate(function () {
      const main = document.querySelector("main#main-content").getBoundingClientRect();
      const pageElement = document.querySelector(".notice-page");
      const hero = document.querySelector(".notice-header").getBoundingClientRect();
      const style = getComputedStyle(pageElement);
      return {
        topGap: hero.top - main.top,
        paddingTop: style.paddingTop,
        backgroundColor: style.backgroundColor,
        backgroundImage: style.backgroundImage
      };
    });
    expect(layout.topGap).toBeLessThan(55);
    expect(layout.paddingTop).toBe("36px");
    expect(layout.backgroundColor).toBe("rgb(242, 237, 228)");
    expect(layout.backgroundImage).toBe("none");
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

  test("consultation form submits to the existing inquiry API and shows a receipt", async function ({ page }) {
    await page.route("**/api/csrf", function (route) {
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ token: "test-csrf-token" }) });
    });
    await page.route("**/api/courses", function (route) {
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([
        { id: 1, title: "AI·머신러닝 실무 개발자 과정" }
      ]) });
    });
    let submittedPayload;
    await page.route("**/api/inquiries", async function (route) {
      submittedPayload = route.request().postDataJSON();
      return route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({
        receiptNo: "ITA-20261110-000001",
        message: "상담 신청이 접수되었습니다."
      }) });
    });

    await page.goto("consultation");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("지금의 경험과 다음 목표");
    await expect(page.locator(".consultation-form")).toBeVisible();
    await page.locator('input[name="name"]').fill("홍길동");
    await page.locator('input[name="phone"]').fill("010-1234-5678");
    await page.locator('select[name="courseTitle"]').selectOption("AI·머신러닝 실무 개발자 과정");
    await page.locator('textarea[name="message"]').fill("머신러닝 기초부터 프로젝트까지 학습하고 싶습니다.");
    await page.locator('input[name="privacyConsent"]').check();
    await page.getByRole("button", { name: "상담 신청하기" }).click();

    await expect(page.getByRole("heading", { name: "상담 신청이 접수되었습니다." })).toBeVisible();
    await expect(page.getByText("ITA-20261110-000001")).toBeVisible();
    expect(submittedPayload.name).toBe("홍길동");
    expect(submittedPayload.phone).toBe("010-1234-5678");
    expect(submittedPayload.privacyConsent).toBe(true);
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
      await waitForVisualAssets(page, route + " desktop");
      await page.screenshot({ path: "test-results/visual-review/" + name + "-desktop.png", fullPage: true });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(route);
      await expect(page.locator("main#main-content")).toBeVisible();
      await waitForVisualAssets(page, route + " mobile");
      await page.screenshot({ path: "test-results/visual-review/" + name + "-mobile.png", fullPage: true });
    }
  });

  test("unknown routes show a useful not-found page", async function ({ page }) {
    await page.goto("this-route-does-not-exist");
    await expect(page.getByRole("heading", { name: "페이지를 찾을 수 없습니다." })).toBeVisible();
    await expect(page.getByRole("link", { name: "메인 페이지로 이동" })).toBeVisible();
  });
});
