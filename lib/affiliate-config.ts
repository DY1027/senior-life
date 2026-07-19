/**
 * 운영자가 승인한 고정 쿠팡 파트너스 링크가 있으면 이 값에 입력한다.
 * 비워 두면 쿠팡 Open API가 반환한 상품별 파트너스 링크를 사용한다.
 */
export const COUPANG_PARTNERS_URL = "https://link.coupang.com/a/fnzNnLtOiy";

/** 프로젝트에서 승인해 현재 사용 중인 쿠팡 파트너스 고지 문구 */
export const COUPANG_PARTNERS_DISCLOSURE =
  "이 게시물은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.";

export function resolveCoupangPartnersUrl(productUrl?: string): string | undefined {
  return productUrl?.trim() || COUPANG_PARTNERS_URL.trim() || undefined;
}
