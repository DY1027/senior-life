import { test, expect } from "@playwright/test";

test.describe("쇼핑 P0·P1 계약", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/shopping");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("메인에서 검색부터 주문 완료까지 완주한다", async ({ page }) => {
    await expect(page.getByTestId("practice-disclosure")).toContainText("실제");
    await page.getByTestId("shopping-search-input").fill("C타입 충전 케이블");
    await page.getByTestId("shopping-search-submit").click();
    await page.getByTestId("product-card-usb-c-2m-white").click();
    await page.getByTestId("option-value-connector-usb-c").click();
    await page.getByTestId("option-value-length-2m").click();
    await page.getByTestId("quantity-input").fill("1");
    await page.getByTestId("add-to-cart").click();
    await expect(page.getByTestId("cart-count")).toHaveText("1");
    await page.goto("/shopping/cart");
    await expect(page.getByTestId("cart-merchandise-total")).toContainText("원");
    await expect(page.getByTestId("cart-shipping-total")).toContainText("원");
    await expect(page.getByTestId("cart-payment-total")).toContainText("원");
    await page.getByTestId("checkout-start").click();
    await expect(page.getByTestId("checkout-address")).toContainText("연습");
    await expect(page.getByTestId("checkout-payment-method")).toContainText("연습");
    await page.getByTestId("checkout-final-confirm").check();
    await page.getByTestId("mock-payment-submit").click();
    await expect(page.getByTestId("order-complete")).toBeVisible();
    await expect(page.getByTestId("order-number")).not.toBeEmpty();
    await expect(page.getByTestId("practice-disclosure")).toContainText("실제");
  });

  test("배송비를 포함한 예산 초과를 수정할 수 있다", async ({ page }) => {
    await page.goto("/shopping/practice/rainy-season-budget-30000");
    for (const productId of ["umbrella", "dehumidifier-pack", "anti-slip-tape"]) {
      await page.getByTestId(`product-card-${productId}`).click();
      await page.getByTestId("add-to-cart").click();
    }
    await page.goto("/shopping/cart");
    const remaining = page.getByTestId("budget-remaining");
    await expect(remaining).toContainText("-");
    await expect(page.getByTestId("checkout-start")).toBeDisabled();
    await page.getByTestId("cart-line-remove-dehumidifier-pack").click();
    await expect(remaining).not.toContainText("-");
    await expect(page.getByTestId("checkout-start")).toBeEnabled();
  });

  test("새로고침 후 장바구니와 선택 옵션이 유지된다", async ({ page }) => {
    await page.getByTestId("shopping-search-input").fill("C타입 충전 케이블");
    await page.getByTestId("shopping-search-submit").click();
    await page.getByTestId("product-card-usb-c-2m-white").click();
    await page.getByTestId("option-value-connector-usb-c").click();
    await page.getByTestId("option-value-length-2m").click();
    await page.getByTestId("add-to-cart").click();
    await page.reload();
    await expect(page.getByTestId("cart-count")).toHaveText("1");
    await page.goto("/shopping/cart");
    await expect(page.getByText("C타입-C타입")).toBeVisible();
    await expect(page.getByText("2m", { exact: false })).toBeVisible();
  });
});

test.describe("주문 이후 P2·P3 계약", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/shopping");
    await page.evaluate(() => localStorage.clear());
  });

  test("결제완료 주문을 취소하고 환불 내역을 확인한다", async ({ page }) => {
    await page.goto("/shopping/test-fixtures/order/paid");
    await page.getByTestId("order-cancel-start").click();
    await page.getByLabel("취소 사유").selectOption("changed-mind");
    await page.getByRole("button", { name: "취소 신청 완료" }).click();
    await expect(page.getByText("취소완료")).toBeVisible();
    await expect(page.getByTestId("refund-summary")).toContainText("환불");
    await page.reload();
    await expect(page.getByText("취소완료")).toBeVisible();
  });

  test("배송중 주문은 취소할 수 없고 배송조회가 가능하다", async ({ page }) => {
    await page.goto("/shopping/test-fixtures/order/shipped");
    await expect(page.getByTestId("order-cancel-start")).toHaveCount(0);
    await page.getByTestId("order-tracking").click();
    await expect(page.getByText("배송중")).toBeVisible();
  });

  test("배송완료 주문을 반품하고 배송비 계산을 확인한다", async ({ page }) => {
    await page.goto("/shopping/test-fixtures/order/delivered");
    await page.getByTestId("order-return-start").click();
    await page.getByLabel("반품 사유").selectOption("damaged");
    await page.getByRole("button", { name: "반품 신청 완료" }).click();
    await expect(page.getByText("반품 신청완료")).toBeVisible();
    await expect(page.getByTestId("refund-summary")).toContainText("배송비");
  });

  test("배송완료 주문을 재고가 있는 옵션으로 교환한다", async ({ page }) => {
    await page.goto("/shopping/test-fixtures/order/delivered");
    await page.getByTestId("order-exchange-start").click();
    await page.getByLabel("교환 옵션").selectOption("black-2m");
    await page.getByRole("button", { name: "교환 신청 완료" }).click();
    await expect(page.getByText("교환 신청완료")).toBeVisible();
  });
});
