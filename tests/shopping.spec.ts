import { expect, test } from "@playwright/test";

test.describe("쇼핑 연습관", () => {
  test("허브가 모바일에서 깨지지 않고 연습 안전 문구를 보여준다", async ({ page }) => {
    await page.goto("/shopping");

    await expect(page.getByRole("heading", { level: 1, name: /사기 전에/ })).toBeVisible();
    await expect(page.getByText("무료 · 회원가입 없음 · 실제 결제 없음")).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "하고 싶은 미션을 골라보세요" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  });

  test("첫 쇼핑 미션을 끝내고 학습 결과를 본다", async ({ page }) => {
    await page.goto("/shopping/missions/first-usb-c-cable");
    await page.getByRole("link", { name: "연습 시작하기" }).click();
    await expect(page.getByText("실제 결제 없음")).toBeVisible();

    await page.getByRole("button", { name: "C타입 충전 케이블 2m" }).click();
    await page.getByRole("button", { name: "검색" }).click();
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
    await expect(page.getByRole("heading", { name: "배송비 포함 총액" })).toBeVisible();
    await expect(page.getByText("6,900원", { exact: true }).last()).toBeVisible();
    await page.getByRole("button", { name: "다음" }).click();
    await page.getByRole("checkbox", { name: "상품을 확인했어요" }).check();
    await page.getByRole("checkbox", { name: "단자와 길이를 확인했어요" }).check();
    await page.getByRole("checkbox", { name: "수량을 확인했어요" }).check();
    await page.getByRole("checkbox", { name: "배송비 포함 총액을 확인했어요" }).check();
    await page.getByRole("button", { name: "확인하고 완료" }).click();

    await expect(page).toHaveURL(/\/shopping\/missions\/first-usb-c-cable\/result$/);
    await expect(page.getByRole("heading", { name: /연습을 마쳤어요/ })).toBeVisible();
    await expect(page.getByText("실제 주문이나 결제는 전혀 일어나지 않았습니다.")).toBeVisible();
    await expect(page.getByText("완료 기록이 이 기기에 저장됐어요")).toBeVisible();
    await expect(page.getByText(/배송비 포함 연습 총액/)).toContainText("6,900원");
    await expect(page.getByText("연습 종료 후 선택 영역")).toBeVisible();
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("dd-shopping-progress-v1") ?? "null"));
    expect(saved.current).toBeUndefined();
    expect(saved.completed["first-usb-c-cable"].count).toBe(1);
    expect(saved.lastResult.totalPrice).toBe(6900);
  });

  test("잘못 고른 단자·길이·수량의 이유를 보고 수정해 완료한다", async ({ page }) => {
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
    await expect(page.getByText("완료 기록이 이 기기에 저장됐어요")).toBeVisible();
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
});
