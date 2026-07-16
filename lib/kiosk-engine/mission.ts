import type { MissionItem } from "./types";

/** 임무 항목을 충족할 수 있는 상품 id들. 첫 항목이 우선 선택, 나머지는 대체 선택이다. */
export function missionProductIds(item: MissionItem): string[] {
  return [item.productId, ...(item.alternativeProductIds ?? [])];
}

/** 이 상품이 임무 항목의 우선 상품 또는 허용된 대체 상품인가. */
export function missionAcceptsProduct(item: MissionItem, productId: string): boolean {
  return missionProductIds(item).includes(productId);
}
