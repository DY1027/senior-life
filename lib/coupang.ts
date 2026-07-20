import crypto from "node:crypto";

// 쿠팡 파트너스 Open API 클라이언트 (서버 전용).
// - 키는 Vercel 환경변수(COUPANG_ACCESS_KEY / COUPANG_SECRET_KEY)에만 존재한다.
// - 호출은 페이지 ISR(1시간)당 1회 수준 — 방문자 트래픽이 API 호출로 이어지지 않는다.
// - 실패하면 null을 반환하고, 화면은 소유자가 준 수동 링크 카드로 폴백한다.

const HOST = "https://api-gateway.coupang.com";

export type CoupangProduct = {
  name: string;
  price: number;
  image: string;
  url: string; // 파트너스 트래킹이 포함된 딥링크
};

function authHeader(method: string, path: string, query: string): string | null {
  const accessKey = process.env.COUPANG_ACCESS_KEY;
  const secretKey = process.env.COUPANG_SECRET_KEY;
  if (!accessKey || !secretKey) return null;
  // 서명 규격: yyMMdd'T'HHmmss'Z' (UTC) + method + path + query
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  const datetime =
    `${String(d.getUTCFullYear()).slice(2)}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}` +
    `T${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}Z`;
  const message = datetime + method + path + query;
  const signature = crypto.createHmac("sha256", secretKey).update(message).digest("hex");
  return `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${datetime}, signature=${signature}`;
}

/** 키워드로 상품 목록을 검색한다. 키가 없거나 실패하면 빈 배열을 반환한다. */
export async function searchProducts(keyword: string, requestedLimit = 10): Promise<CoupangProduct[]> {
  const path = "/v2/providers/affiliate_open_api/apis/openapi/v1/products/search";
  const limit = Math.min(10, Math.max(1, Math.trunc(requestedLimit)));
  const query = `keyword=${encodeURIComponent(keyword)}&limit=${limit}`;
  const auth = authHeader("GET", path, query);
  if (!auth) {
    // 진단 로그(빌드/ISR 로그에서 확인) — 키 값은 절대 남기지 않는다
    console.warn(`[coupang] 키 없음 access=${Boolean(process.env.COUPANG_ACCESS_KEY)} secret=${Boolean(process.env.COUPANG_SECRET_KEY)}`);
    return [];
  }
  try {
    const res = await fetch(`${HOST}${path}?${query}`, {
      headers: { Authorization: auth },
      // 페이지 ISR이 캐시를 담당하므로 fetch 자체는 저장하지 않는다 (데이터 보관 금지 규정 부합)
      cache: "no-store",
    });
    if (!res.ok) {
      console.warn(`[coupang] HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
      return [];
    }
    const json = await res.json();
    const productData = json?.data?.productData ?? json?.data;
    if (!Array.isArray(productData)) {
      console.warn(`[coupang] 예상외 응답 형식: ${JSON.stringify(json).slice(0, 300)}`);
      return [];
    }
    return productData
      .filter((item) => item?.productName && item?.productUrl)
      .map((item) => ({
        name: String(item.productName),
        price: Number(item.productPrice) || 0,
        image: String(item.productImage ?? ""),
        url: String(item.productUrl),
      }));
  } catch {
    return [];
  }
}

/** 기존 상품 페이지에서 사용하는 안정적인 첫 번째 검색 결과. */
export async function searchProduct(keyword: string): Promise<CoupangProduct | null> {
  return (await searchProducts(keyword, 1))[0] ?? null;
}
