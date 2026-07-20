import { NextRequest, NextResponse } from "next/server";
import { getCompletionAdByKey } from "@/lib/completion-affiliate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const adKey = request.nextUrl.searchParams.get("key") ?? "";
  const requestedVariant = Number(request.nextUrl.searchParams.get("variant") ?? 0);
  const variant = Number.isFinite(requestedVariant) ? Math.min(9, Math.max(0, Math.trunc(requestedVariant))) : 0;
  const ad = await getCompletionAdByKey(adKey, variant);
  if (!ad?.affiliateUrl) return new NextResponse(null, { status: 204 });
  return NextResponse.json(ad, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
