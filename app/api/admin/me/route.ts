import { NextResponse } from "next/server";
import { getServerUser, isAdminEmail } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 관리자 UI 게이팅용. 허용목록 자체는 노출하지 않고 현재 사용자의 판정 결과만 반환한다.
export async function GET() {
  const user = await getServerUser();
  const admin = isAdminEmail(user?.email);
  return NextResponse.json(
    {
      loggedIn: !!user,
      isAdmin: admin,
      email: admin ? user?.email ?? null : null,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
