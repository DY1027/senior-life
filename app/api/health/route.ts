import { NextResponse } from "next/server";

// 서비스 헬스체크 (Vercel/모니터링용).
// 회원·DB 기능을 없앤 뒤로는 앱 프로세스 응답 여부만 확인한다.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ status: "ok", ts: new Date().toISOString() });
}
