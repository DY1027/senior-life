import { expect, test } from "@playwright/test";

test.describe("쇼핑 연습관", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/affiliate/completion-ad?key=*", async (route) => {
      await route.fulfill({
        contentType: "application/json; charset=utf-8",
        body: JSON.stringify({
          imagePath: "/images/shopping/products/digital/usb-c-charger-20w-white.jpg",
          title: "쇼핑 미션 추천 상품",
          description: "실제 상품 정보는 쿠팡에서 다시 확인하세요.",
          affiliateUrl: "https://link.coupang.com/a/test-shopping-ad",
          buttonLabel: "쿠팡에서 실제 상품 보기 ↗",
        }),
      });
    });
  });

  test("허브가 모바일에서 깨지지 않고 연습 안전 문구를 보여준다", async ({ page }) => {
    await page.goto("/shopping");

    await expect(page.getByRole("heading", { level: 1, name: "무엇을 연습해볼까요?" })).toBeVisible();
    await expect(page.getByTestId("practice-disclosure")).toContainText("실제 주문이나 결제");
    for (const choice of ["처음 쇼핑 배우기", "필요한 물건 찾아보기", "예산 안에서 장보기", "주문 문제 해결하기"]) {
      await expect(page.getByRole("heading", { level: 2, name: choice })).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  });

  test("필요한 물건 화면에서 상황 검색이 실제 상품으로 이어진다", async ({ page }) => {
    await page.goto("/shopping");
    await page.getByRole("link", { name: /필요한 물건 찾아보기/ }).click();
    await expect(page).toHaveURL(/\/shopping\/catalog$/);
    await page.getByTestId("shopping-search-input").fill("장마철");
    await page.getByTestId("shopping-search-submit").click();
    await expect(page.getByTestId("product-card-umbrella")).toBeVisible();
    await expect(page.getByTestId("product-card-dehumidifier-pack")).toBeVisible();
    await expect(page.getByTestId("product-card-anti-slip-tape")).toBeVisible();
  });

  test("휴대폰·디지털 1차 상품은 고유 이미지와 구매 조건을 제공한다", async ({ page }) => {
    await page.goto("/shopping/catalog");
    for (const productId of ["usb-c-charger-20w-white", "power-bank-10000-white", "phone-stand-foldable-silver", "stylus-pen-universal-black", "screen-magnifier-12inch-black"]) {
      await expect(page.getByTestId(`catalog-product-${productId}`)).toBeVisible();
    }
    await page.goto("/shopping/search?q=휴대폰%20충전");
    await expect(page.getByTestId("product-card-usb-c-charger-20w-white")).toBeVisible();
    await expect(page.getByTestId("product-card-power-bank-10000-white")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
    await page.screenshot({ path: "docs/audit-evidence/shopping-digital-batch-360.png", fullPage: true });
    await page.getByTestId("product-card-power-bank-10000-white").click();
    await expect(page.getByRole("heading", { level: 1, name: "휴대용 보조배터리 10,000mAh" })).toBeVisible();
    await expect(page.getByTestId("option-group-capacity")).toBeVisible();
    await expect(page.getByTestId("option-group-color")).toBeVisible();
  });

  test("첫 쇼핑 미션이 실제 상품 검색 흐름으로 시작된다", async ({ page }) => {
    await page.goto("/shopping/missions/first-usb-c-cable");
    await page.getByRole("link", { name: "연습 시작하기" }).click();
    await expect(page).toHaveURL(/\/shopping\/catalog$/);
    await expect(page.getByTestId("active-shopping-mission")).toContainText("C타입-C타입");
    await expect(page.getByTestId("active-shopping-mission")).toContainText("15,000원 이하");
  });

  test("잘못 고른 단자·길이·수량의 이유를 보고 수정해 완료한다", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 900 });
    await page.goto("/shopping/missions/first-usb-c-cable/practice");
    await page.getByRole("button", { name: "C타입 충전 케이블 2m" }).click();
    await page.getByRole("button", { name: "검색" }).click();
    await page.getByRole("button", { name: /C타입 충전 케이블 1m/ }).click();
    await page.getByRole("button", { name: "다음" }).click();
    await page.getByRole("checkbox", { name: "단자를 확인했어요" }).check();
    await page.getByRole("checkbox", { name: "배송비를 확인했어요" }).check();
    await page.getByRole("button", { name: "다음" }).click();
    await page.getByRole("button", { name: "8핀-USB" }).click();
    await page.getByRole("button", { name: "다음" }).click();
    await page.getByRole("button", { name: "1m" }).click();
    await page.getByRole("button", { name: "다음" }).click();
    await page.getByRole("button", { name: "수량 늘리기" }).click();
    await page.getByRole("button", { name: "수량 2개 확인했어요" }).click();
    await page.getByRole("button", { name: "다음" }).click();
    await page.getByRole("button", { name: "장바구니에 담아보기" }).click();
    await page.getByRole("button", { name: "다음" }).click();
    await expect(page.getByText("13,500원", { exact: true }).last()).toBeVisible();
    await page.getByRole("button", { name: "다음" }).click();
    await page.getByRole("checkbox", { name: "상품을 확인했어요" }).check();
    await page.getByRole("checkbox", { name: "단자와 길이를 확인했어요" }).check();
    await page.getByRole("checkbox", { name: "수량을 확인했어요" }).check();
    await page.getByRole("checkbox", { name: "배송비 포함 총액을 확인했어요" }).check();
    await page.getByRole("button", { name: "확인하고 완료" }).click();

    const feedback = page.getByRole("alert").filter({ hasText: "상품을 다시 비교해요" });
    await expect(feedback).toContainText("상품을 다시 비교해요");
    await expect(feedback).toContainText("단자가 달라요");
    await expect(feedback).toContainText("길이는 2m가 필요해요");
    await expect(feedback).toContainText("필요한 수량은 1개예요");

    for (let index = 0; index < 7; index += 1) await page.getByRole("button", { name: "이전" }).click();
    await page.getByRole("button", { name: /C타입 고속 충전 케이블 2m/ }).click();
    await page.getByRole("button", { name: "다음" }).click();
    await page.getByRole("checkbox", { name: "단자를 확인했어요" }).check();
    await page.getByRole("checkbox", { name: "배송비를 확인했어요" }).check();
    await page.getByRole("button", { name: "다음" }).click();
    await page.getByRole("button", { name: "C타입-C타입" }).click();
    await page.getByRole("button", { name: "다음" }).click();
    await page.getByRole("button", { name: "2m" }).click();
    await page.getByRole("button", { name: "다음" }).click();
    await page.getByRole("button", { name: "수량 1개 확인했어요" }).click();
    await page.getByRole("button", { name: "다음" }).click();
    await page.getByRole("button", { name: "장바구니에 담아보기" }).click();
    await page.getByRole("button", { name: "다음" }).click();
    await page.getByRole("button", { name: "다음" }).click();
    await page.getByRole("checkbox", { name: "상품을 확인했어요" }).check();
    await page.getByRole("checkbox", { name: "단자와 길이를 확인했어요" }).check();
    await page.getByRole("checkbox", { name: "수량을 확인했어요" }).check();
    await page.getByRole("checkbox", { name: "배송비 포함 총액을 확인했어요" }).check();
    await page.getByRole("button", { name: "확인하고 완료" }).click();

    await expect(page).toHaveURL(/\/shopping\/missions\/first-usb-c-cable\/result$/);
    await expect(page.getByRole("heading", { level: 1, name: "쇼핑연습을 완료했어요!" })).toBeVisible();
    await expect(page.getByText("지금까지의 과정은 실제 결제 없이 진행된 연습이었습니다.")).toBeVisible();
    await expect(page.getByText("완료 기록이 이 기기에 저장됐어요")).toBeVisible();
    const actualShopping = page.getByTestId("shopping-actual-shopping");
    await expect(actualShopping).toBeVisible();
    await expect(actualShopping.getByRole("heading", { level: 2, name: "여기부터는 실제 쇼핑입니다" })).toBeVisible();
    await expect(actualShopping.getByRole("note", { name: "실제 쇼핑 주의" })).toContainText("주의: 지금부터는 연습이 아닙니다.");
    await expect(actualShopping).toContainText("이 게시물은 쿠팡 파트너스 활동의 일환으로");
    await expect(actualShopping.getByRole("link", { name: "쇼핑연습으로 돌아가기" })).toHaveAttribute("href", "/shopping");

    const actualShoppingButton = actualShopping.getByRole("button", { name: "실제 쿠팡 쇼핑몰로 이동합니다" });
    await actualShoppingButton.click();
    const confirmationDialog = page.getByRole("dialog", { name: "실제 쿠팡 쇼핑몰로 이동할까요?" });
    await expect(confirmationDialog).toBeVisible();
    await expect(confirmationDialog).toContainText("지금부터는 쇼핑연습이 아닙니다.");
    await expect(confirmationDialog.getByRole("link", { name: "네, 실제 쿠팡으로 이동할게요" })).toHaveAttribute("target", "_blank");
    await confirmationDialog.getByRole("button", { name: "취소하고 연습 화면에 있기" }).click();
    await expect(confirmationDialog).toBeHidden();

    const resultActionsBottom = await page.getByTestId("shopping-result-actions").evaluate((element) => element.getBoundingClientRect().bottom);
    const actualShoppingTop = await actualShopping.evaluate((element) => element.getBoundingClientRect().top);
    expect(actualShoppingTop).toBeGreaterThan(resultActionsBottom + 30);
    const mobileLayout = await actualShopping.evaluate((section) => {
      const ids = ["actual-shopping-guide", "actual-shopping-warning", "actual-shopping-open", "actual-shopping-disclosure", "actual-shopping-return"];
      const elements = ids.map((id) => section.querySelector<HTMLElement>(`[data-testid="${id}"]`));
      return {
        tops: elements.map((element) => element?.getBoundingClientRect().top ?? 0),
        buttonWidth: elements[2]?.getBoundingClientRect().width ?? 0,
        sectionWidth: section.getBoundingClientRect().width,
      };
    });
    expect(mobileLayout.tops).toEqual([...mobileLayout.tops].sort((a, b) => a - b));
    expect(mobileLayout.buttonWidth).toBeGreaterThan(mobileLayout.sectionWidth * 0.85);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);

    await page.setViewportSize({ width: 1280, height: 900 });
    await expect(actualShopping).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
  });

  test("장마 예산 미션은 필요한 세 항목만 고르면 통과한다", async ({ page }) => {
    await page.goto("/shopping/missions/rainy-budget-30000/practice");
    await page.getByRole("button", { name: "다음" }).click();
    await page.getByRole("button", { name: /접이식 자동 우산/ }).click();
    await page.getByRole("button", { name: /옷장용 제습제 8개 묶음/ }).click();
    await page.getByRole("button", { name: /투명 미끄럼방지 테이프/ }).click();
    await page.getByRole("button", { name: "다음" }).click();
    await page.getByRole("button", { name: "다음" }).click();
    await page.getByRole("button", { name: "확인하고 완료" }).click();

    await expect(page).toHaveURL(/\/shopping\/missions\/rainy-budget-30000\/result$/);
    await expect(page.getByText("확인 점수 100점")).toBeVisible();
  });

  test("상품 비교 미션은 잘못 고른 이유를 나눠 설명하고 수정 후 기록한다", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 900 });
    await page.goto("/shopping/catalog");
    await page.getByTestId("start-comparison-mission").click();
    await expect(page).toHaveURL(/\/shopping\/missions\/compare-usb-c-cables$/);
    await page.getByRole("link", { name: "연습 시작하기" }).click();

    await page.getByRole("button", { name: "다음" }).click();
    await page.getByTestId("compare-product-cable-usbc-black-1m").click();
    await page.getByRole("button", { name: "다음" }).click();
    await expect(page.getByTestId("comparison-criterion-length")).toContainText("다시 확인");
    await expect(page.getByTestId("comparison-criterion-total")).toContainText("맞음");
    await page.getByRole("button", { name: "확인하고 완료" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "길이가 짧아요" })).toContainText("길이가 짧아요");
    await page.screenshot({ path: "docs/audit-evidence/shopping-compare-wrong-360.png", fullPage: true });

    await page.getByRole("button", { name: "이전" }).click();
    await page.getByTestId("compare-product-cable-usbc-white-3pack").click();
    await page.reload();
    await expect(page.getByTestId("compare-product-cable-usbc-white-3pack")).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "다음" }).click();
    await expect(page.getByTestId("comparison-criterion-bundle")).toContainText("3개 묶음");
    await page.getByRole("button", { name: "확인하고 완료" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "필요한 수량보다 많아요" })).toContainText("필요한 수량보다 많아요");

    await page.getByRole("button", { name: "이전" }).click();
    await page.getByTestId("compare-product-cable-usbc-white-2m").click();
    await page.getByRole("button", { name: "다음" }).click();
    for (const criterion of ["connector", "length", "bundle", "total"]) {
      await expect(page.getByTestId(`comparison-criterion-${criterion}`)).toContainText("맞음");
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    await page.getByRole("button", { name: "확인하고 완료" }).click();

    await expect(page).toHaveURL(/\/shopping\/missions\/compare-usb-c-cables\/result$/);
    await expect(page.getByText("연습 종료 후 선택 영역")).toBeVisible();
    const progress = await page.evaluate(() => JSON.parse(localStorage.getItem("dd-shopping-progress-v1") ?? "null"));
    expect(progress.completed["compare-usb-c-cables"].count).toBe(1);
    await page.screenshot({ path: "docs/audit-evidence/shopping-compare-complete-360.png", fullPage: true });

    await page.getByRole("button", { name: "글자 크게 보기" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-bigtext", "1");
    const resultTitleWidth = await page.getByRole("heading", { level: 1, name: "상품 비교 연습을 마쳤어요!" }).evaluate((element) => element.getBoundingClientRect().width);
    expect(resultTitleWidth).toBeGreaterThan(240);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
    await page.screenshot({ path: "docs/audit-evidence/shopping-compare-complete-bigtext-360.png", fullPage: true });
  });
});

test("주문 실수 찾기는 네 가지 오류를 찾고 직접 고쳐야 완료된다", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 900 });
  await page.goto("/shopping/order-help");
  await page.getByTestId("start-order-mistake-mission").click();
  await expect(page).toHaveURL(/\/shopping\/missions\/find-order-mistake$/);
  await page.getByRole("link", { name: "연습 시작하기" }).click();

  await page.getByRole("button", { name: "다음" }).click();
  await expect(page.getByTestId("mistake-order-preview")).toContainText("16,800원");
  await page.getByRole("checkbox", { name: "수량" }).check();
  await page.getByRole("checkbox", { name: "상품 이름" }).check();
  await page.getByRole("button", { name: "다음" }).click();

  await expect(page.getByTestId("mistake-status-length")).toContainText("다시 확인");
  await page.getByRole("button", { name: "확인하고 완료" }).click();
  const unresolved = page.getByTestId("shopping-feedback");
  await expect(unresolved).toContainText("길이 옵션 오류를 아직 찾지 못했어요");
  await expect(unresolved).toContainText("정상인 상품명도 실수로 골랐어요");
  await expect(unresolved).toContainText("배송비를 다시 확인해 주세요");
  await page.screenshot({ path: "docs/audit-evidence/shopping-mistake-unresolved-360.png", fullPage: true });

  await page.getByRole("button", { name: "이전" }).click();
  await page.getByRole("checkbox", { name: "상품 이름" }).uncheck();
  await page.getByRole("checkbox", { name: "길이 옵션" }).check();
  await page.getByRole("checkbox", { name: "정기배송 선택" }).check();
  await page.getByRole("checkbox", { name: "배송비" }).check();
  await page.getByRole("button", { name: "다음" }).click();
  await page.reload();
  await expect(page.getByTestId("mistake-correction-panel")).toBeVisible();

  await page.getByRole("group", { name: "길이 옵션 고치기" }).getByRole("button", { name: /2m/ }).click();
  await page.getByRole("button", { name: "실수 주문 수량 줄이기" }).click();
  await page.getByRole("group", { name: "구매 방식 고치기" }).getByRole("button", { name: /한 번 구매/ }).click();
  await page.getByTestId("fix-mistake-shipping").click();

  for (const id of ["length", "quantity", "purchase", "shipping"]) {
    await expect(page.getByTestId(`mistake-status-${id}`)).toContainText("맞게 고침");
  }
  await expect(page.getByText("6,900원", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
  await page.screenshot({ path: "docs/audit-evidence/shopping-mistake-corrected-360.png", fullPage: true });

  await page.getByRole("button", { name: "확인하고 완료" }).click();
  await expect(page).toHaveURL(/\/shopping\/missions\/find-order-mistake\/result$/);
  const progress = await page.evaluate(() => JSON.parse(localStorage.getItem("dd-shopping-progress-v1") ?? "null"));
  expect(progress.completed["find-order-mistake"].count).toBe(1);
  await page.screenshot({ path: "docs/audit-evidence/shopping-mistake-complete-360.png", fullPage: true });
});
