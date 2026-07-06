import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();

  // Supabase 연결 확인
  let dbStatus: "ok" | "error" = "ok";
  let dbMessage: string | undefined;

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { error } = await supabase.from("_health_ping").select("1").limit(1).maybeSingle();
    // 테이블이 없어 "relation does not exist" 오류가 나도 DB 연결 자체는 성공
    if (error && !error.message.includes("does not exist") && !error.message.includes("permission")) {
      dbStatus = "error";
      dbMessage = error.message;
    }
  } catch (e) {
    dbStatus = "error";
    dbMessage = e instanceof Error ? e.message : "unknown";
  }

  const status = dbStatus === "ok" ? "ok" : "degraded";
  const httpStatus = status === "ok" ? 200 : 503;

  return NextResponse.json(
    {
      status,
      latencyMs: Date.now() - start,
      db: { status: dbStatus, ...(dbMessage ? { message: dbMessage } : {}) },
      ts: new Date().toISOString(),
    },
    { status: httpStatus },
  );
}
