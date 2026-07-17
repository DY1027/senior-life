import { expect, test } from "@playwright/test";

const illustrationFiles = [
  "challenge-weekly.webp",
  "complete-practice.webp",
  "guide-mistake.webp",
  "hero-digital-playground.webp",
  "hero-playground.webp",
  "hero-safety.webp",
  "kiosk-atm.webp",
  "kiosk-cafe.webp",
  "kiosk-mart.webp",
  "kiosk-parking.webp",
  "kiosk-ticket.webp",
  "mascot-cafe-guide.webp",
  "new-practice.webp",
  "practice-village.webp",
] as const;

test("최적화한 든든이 일러스트는 WebP로 제공되고 각 150KB보다 작다", async ({ request }) => {
  for (const file of illustrationFiles) {
    const response = await request.get(`/images/dundun/${file}`);
    expect(response.status(), file).toBe(200);
    expect(response.headers()["content-type"], file).toContain("image/webp");
    expect((await response.body()).byteLength, file).toBeLessThan(150 * 1024);
  }
});

test("홈은 주요 화면 폭에서 가로 스크롤 없이 한 개의 h1을 유지한다", async ({ page }) => {
  for (const width of [360, 390, 430, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth))
      .toBeLessThanOrEqual(1);
  }
});

test("홈 이미지 대체 텍스트와 메뉴 현재 위치를 제공한다", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const images = page.locator("main img");
  const imageCount = await images.count();
  expect(imageCount).toBeGreaterThan(10);
  for (let index = 0; index < imageCount; index += 1) {
    await expect(images.nth(index)).toHaveAttribute("alt");
  }

  await expect(page.locator('nav[aria-label="하단 메뉴"] a[href="/"]')).toHaveAttribute("aria-current", "page");
  await page.getByRole("button", { name: "전체 메뉴 열기" }).click();
  const mobileMenu = page.getByRole("navigation", { name: "전체 메뉴" });
  for (const label of ["연습", "놀이터", "생활안전", "내 기록"]) {
    await expect(mobileMenu.getByRole("link", { name: label, exact: true })).toBeVisible();
  }
});

test("주요 내부 페이지는 모바일에서 넘치지 않고 현재 메뉴를 표시한다", async ({ page }) => {
  const routes = [
    ["/kiosk", "연습"],
    ["/play", "놀이터"],
    ["/stories", "생활안전"],
    ["/records", "내 기록"],
  ] as const;

  await page.setViewportSize({ width: 390, height: 844 });
  for (const [route, currentLabel] of routes) {
    await page.goto(route);
    await expect(page.locator("h1")).toHaveCount(1);
    if (route === "/stories") {
      await page.getByRole("button", { name: "전체 메뉴 열기" }).click();
    }
    await expect(page.locator('[aria-current="page"]:visible', { hasText: currentLabel }).first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  }
});

test("큰 글자 기능에서도 홈과 연습 목록에 가로 스크롤이 생기지 않는다", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "글자 크게 보기" }).click();
  for (const route of ["/", "/kiosk"]) {
    await page.goto(route);
    await expect(page.locator("html")).toHaveAttribute("data-bigtext", "1");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  }
});
