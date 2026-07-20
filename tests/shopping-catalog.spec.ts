import { expect, test } from "@playwright/test";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { COMMERCE_PRODUCTS, searchCommerceProducts } from "../features/shopping/data/products";

test.describe("쇼핑 생활상품 카탈로그", () => {
  test("서로 다른 이미지와 교육 정보가 있는 연습 상품 30개를 제공한다", () => {
    expect(COMMERCE_PRODUCTS).toHaveLength(30);
    expect(new Set(COMMERCE_PRODUCTS.map((product) => product.id)).size).toBe(30);
    expect(new Set(COMMERCE_PRODUCTS.map((product) => product.image.src)).size).toBe(30);

    for (const product of COMMERCE_PRODUCTS) {
      expect(product.practiceOnly).toBe(true);
      expect(product.learningPoints.length, product.id).toBeGreaterThanOrEqual(2);
      expect(product.keywords.length, product.id).toBeGreaterThanOrEqual(4);
      expect(product.situationTags.length, product.id).toBeGreaterThanOrEqual(3);
      expect(product.synonymTags.length, product.id).toBeGreaterThanOrEqual(2);

      const assetPath = join(process.cwd(), "public", product.image.src.replace(/^\//, ""));
      expect(existsSync(assetPath), product.image.src).toBe(true);
      expect(statSync(assetPath).size, product.image.src).toBeLessThan(180 * 1024);
    }
  });

  test("상품명과 생활 상황 검색이 관련 상품으로 이어진다", () => {
    expect(searchCommerceProducts("블루투스 이어폰").map(({ id }) => id)).toContain("bluetooth-earbuds-white");
    expect(searchCommerceProducts("욕실이 미끄러울 때").map(({ id }) => id)).toEqual(expect.arrayContaining(["anti-slip-bath-mat-gray", "anti-slip-tape"]));
    expect(searchCommerceProducts("밤에 어두울 때").map(({ id }) => id)).toContain("motion-sensor-light-white");
    expect(searchCommerceProducts("여행 준비").map(({ id }) => id)).toEqual(expect.arrayContaining(["travel-pouch-set-navy", "travel-neck-pillow-blue", "phone-lanyard-navy"]));
    expect(searchCommerceProducts("겨울 외출").map(({ id }) => id)).toEqual(expect.arrayContaining(["reusable-hand-warmer-gray", "thermal-socks-three-pack"]));
    expect(searchCommerceProducts("목배개").map(({ id }) => id)).toContain("travel-neck-pillow-blue");
  });

  test("모바일 카탈로그에서 30개 상품과 새 상품 상세 옵션을 사용할 수 있다", async ({ page }) => {
    await page.goto("/shopping/catalog");
    await expect(page.getByText("연습용 예시 30개")).toBeVisible();
    await expect(page.locator("[data-testid^='catalog-product-']")).toHaveCount(30);

    await page.getByTestId("catalog-product-motion-sensor-light-white").click();
    await expect(page.getByRole("heading", { level: 1, name: "충전식 동작감지 센서등" })).toBeVisible();
    await expect(page.getByText("20cm", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: /^30cm/ })).toBeVisible();
    await expect(page.getByText("배송비").first()).toBeVisible();
  });
});
