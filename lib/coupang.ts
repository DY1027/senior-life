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

/** 키워드로 상품 1개를 검색한다. 키가 없거나 실패하면 null (호출부에서 폴백). */
export async function searchProduct(keyword: string): Promise<CoupangProduct | null> {
  const path = "/v2/providers/affiliate_open_api/apis/openapi/v1/products/search";
  const query = `keyword=${encodeURIComponent(keyword)}&limit=1`;
  const auth = authHeader("GET", path, query);
  if (!auth) return null;
  try {
    const res = await fetch(`${HOST}${path}?${query}`, {
      headers: { Authorization: auth },
      // 페이지 ISR이 캐시를 담당하므로 fetch 자체는 저장하지 않는다 (데이터 보관 금지 규정 부합)
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    const item = json?.data?.productData?.[0] ?? json?.data?.[0];
    if (!item?.productName || !item?.productUrl) return null;
    return {
      name: String(item.productName),
      price: Number(item.productPrice) || 0,
      image: String(item.productImage ?? ""),
      url: String(item.productUrl),
    };
  } catch {
    return null;
  }
}
