import { NextResponse } from "next/server";
import { debugSearch } from "@/lib/coupang";

// 임시 진단 라우트 — 쿠팡 Open API 연결 상태 확인용. 확인 후 즉시 삭제할 것.
// 키/서명 값은 노출하지 않으며, 토큰 없이는 아무것도 반환하지 않는다.
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  if (token !== "dd-diag-7f3k9") return new NextResponse(null, { status: 404 });
  const result = await debugSearch("가정용 포토프린터");
  return NextResponse.json(result);
}
