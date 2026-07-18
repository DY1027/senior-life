import { NextRequest, NextResponse } from "next/server";
import { getCompletionAdByKey } from "@/lib/completion-affiliate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const adKey = request.nextUrl.searchParams.get("key") ?? "";
  const ad = await getCompletionAdByKey(adKey);
  if (!ad?.affiliateUrl) return new NextResponse(null, { status: 204 });
  return NextResponse.json(ad, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
