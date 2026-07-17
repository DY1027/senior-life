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

    await page.getByRole("button", { name: "검색" }).click();
    await page.getByRole("button", { name: /C타입 고속 충전 케이블 2m/ }).click();
    await page.getByRole("button", { name: "다음" }).click();
    await page.getByRole("button", { name: "다음" }).click();
    await page.getByRole("button", { name: "2m" }).click();
    await page.getByRole("button", { name: "화이트" }).click();
    await page.getByRole("button", { name: "다음" }).click();
    await page.getByRole("button", { name: "다음" }).click();
    await page.getByRole("button", { name: "확인하고 완료" }).click();

    await expect(page).toHaveURL(/\/shopping\/missions\/first-usb-c-cable\/result$/);
    await expect(page.getByRole("heading", { name: /연습을 마쳤어요/ })).toBeVisible();
    await expect(page.getByText("실제 주문이나 결제는 전혀 일어나지 않았습니다.")).toBeVisible();
    await expect(page.getByText("연습 종료 후 선택 영역")).toBeVisible();
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
