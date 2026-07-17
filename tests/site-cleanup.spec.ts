import { expect, test, type APIRequestContext } from "@playwright/test";

const baseURL = "http://localhost:3210";

async function expectPermanentRedirect(request: APIRequestContext, from: string, to: string) {
  const response = await request.get(from, { maxRedirects: 0 });
  expect([301, 308]).toContain(response.status());
  const location = response.headers().location;
  expect(location, `${from} 리다이렉트 위치`).toBeTruthy();
  expect(new URL(location, baseURL).pathname).toBe(to);
}

test("현재 공개 페이지와 키오스크 7종이 모두 열린다", async ({ request }) => {
  const routes = [
    "/",
    "/kiosk",
    "/kiosk/cafe",
    "/kiosk/fastfood",
    "/kiosk/ticket",
    "/kiosk/parking",
    "/kiosk/mart",
    "/kiosk/atm",
    "/kiosk/civil",
    "/play",
    "/stories",
    "/records",
    "/guide",
    "/legal/terms",
    "/legal/privacy",
  ];

  for (const route of routes) {
    const response = await request.get(route);
    expect(response.status(), `${route} 응답 상태`).toBe(200);
  }
});

test("이전 주소는 적절한 현재 페이지로 영구 이동한다", async ({ request }) => {
  await expectPermanentRedirect(request, "/kiosk/hospital", "/kiosk");
  await expectPermanentRedirect(request, "/kiosk/hospital/check-in", "/kiosk");

  for (const route of [
    "/health",
    "/health/checklist",
    "/hospital",
    "/welfare/basic-pension",
    "/finance/retirement",
    "/retirement/calculator",
    "/care/family",
    "/life-tips/senior-discount",
    "/login",
    "/signup",
    "/mypage",
    "/auth/callback",
  ]) {
    await expectPermanentRedirect(request, route, "/service-changed");
  }
});

test("서비스 변경 안내와 개인·실행 화면은 검색되지 않는다", async ({ page }) => {
  await page.goto("/service-changed");
  await expect(page.getByRole("heading", { name: "시니어든든의 서비스가 새롭게 바뀌었습니다." })).toBeVisible();
  await expect(page.getByRole("link", { name: "생활기기 연습 둘러보기" })).toHaveAttribute("href", "/kiosk");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);

  await page.goto("/records");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);

  await page.goto("/kiosk/cafe/cafe-learn-americano");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("홈과 주요 허브 메타데이터가 현재 서비스 방향과 일치한다", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("시니어든든 | 실제처럼 눌러보는 디지털 생활 놀이터");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "카페 주문, 기차표 예매, 주차 정산, 마트 셀프계산대와 ATM까지 실제처럼 눌러보며 연습하는 무료 시니어 디지털 놀이터입니다.",
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "시니어든든 – 실제처럼 눌러보는 디지털 생활 놀이터",
  );

  const metadataText = await page.locator("head meta").evaluateAll((metas) =>
    metas.map((meta) => meta.getAttribute("content") ?? "").join(" "),
  );
  expect(metadataText).not.toMatch(/병원|복용약|복지혜택|기초연금|노후자금|연금계산|생활비 계산|가족 돌봄/);

  const expectedTitles = [
    ["/kiosk", "키오스크 연습 | 시니어든든"],
    ["/play", "놀이터 | 시니어든든"],
    ["/stories", "그림으로 배우는 생활안전 | 시니어든든"],
    ["/records", "나의 연습 기록 | 시니어든든"],
  ] as const;

  for (const [route, title] of expectedTitles) {
    await page.goto(route);
    await expect(page).toHaveTitle(title);
  }
});

test("sitemap·robots·manifest에서 이전 서비스 흔적을 제외한다", async ({ request }) => {
  const sitemapResponse = await request.get("/sitemap.xml");
  expect(sitemapResponse.status()).toBe(200);
  const sitemap = await sitemapResponse.text();
  expect(sitemap).toContain("https://seniordeundun.com/kiosk/atm");
  expect(sitemap).toContain("https://seniordeundun.com/legal/privacy");
  expect(sitemap).not.toMatch(/\/(health|hospital|welfare|finance|retirement|care|life-tips|login|signup|mypage)(\/|<)/);
  expect(sitemap).not.toContain("/kiosk/cafe/cafe-");
  expect(sitemap).not.toContain("/records");
  expect(sitemap).not.toContain("/service-changed");

  const robotsResponse = await request.get("/robots.txt");
  expect(robotsResponse.status()).toBe(200);
  const robots = await robotsResponse.text();
  expect(robots).toContain("Disallow: /service-changed");
  expect(robots).toContain("Disallow: /records");
  expect(robots).toContain("Disallow: /kiosk/cafe/");

  const manifestResponse = await request.get("/manifest.webmanifest");
  expect(manifestResponse.status()).toBe(200);
  const manifest = await manifestResponse.json();
  expect(manifest.name).toBe("시니어든든 디지털 생활 놀이터");
  expect(manifest.description).toBe("실제처럼 눌러보는 시니어 디지털 생활기기 연습 서비스");
});

test("현재 페이지의 내부 링크와 주요 이미지 자산이 깨지지 않는다", async ({ page, request }) => {
  const seedRoutes = [
    "/",
    "/kiosk",
    "/kiosk/cafe",
    "/kiosk/fastfood",
    "/kiosk/ticket",
    "/kiosk/parking",
    "/kiosk/mart",
    "/kiosk/atm",
    "/kiosk/civil",
    "/play",
    "/stories",
    "/guide",
  ];
  const internalPaths = new Set<string>();
  const imagePaths = new Set<string>();

  for (const route of seedRoutes) {
    await page.goto(route);
    const hrefs = await page.locator("a[href]").evaluateAll((links) =>
      links.map((link) => (link as HTMLAnchorElement).href),
    );
    for (const href of hrefs) {
      const url = new URL(href);
      if (url.origin === baseURL) internalPaths.add(`${url.pathname}${url.search}`);
    }

    const imageSources = await page.locator("img[src]").evaluateAll((images) =>
      images.map((image) => (image as HTMLImageElement).src),
    );
    for (const source of imageSources) {
      const url = new URL(source);
      if (url.origin === baseURL) imagePaths.add(`${url.pathname}${url.search}`);
    }
  }

  for (const path of internalPaths) {
    const response = await request.get(path);
    expect(response.status(), `${path} 내부 링크`).toBeLessThan(400);
  }

  for (const path of imagePaths) {
    const response = await request.get(path);
    expect(response.status(), `${path} 이미지`).toBe(200);
  }

  await page.goto("/");
  const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect(ogImage).toBeTruthy();
  const ogUrl = new URL(ogImage!);
  const ogResponse = await request.get(`${ogUrl.pathname}${ogUrl.search}`);
  expect(ogResponse.status()).toBe(200);

  for (const iconPath of ["/pwa-icon/192", "/pwa-icon/512"]) {
    const iconResponse = await request.get(iconPath);
    expect(iconResponse.status(), iconPath).toBe(200);
  }
});
