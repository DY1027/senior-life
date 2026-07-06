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
    // 프로브용 테이블이 없어서 나는 오류는 DB 연결 자체는 성공했다는 뜻이므로 정상 처리.
    // PostgREST는 "PGRST205"(스키마 캐시에 테이블 없음) 또는 Postgres "42P01"(undefined_table)로
    // 응답하며, 메시지 문구는 "Could not find the table ... in the schema cache" 형태다.
    const isMissingTable =
      error?.code === "PGRST205" ||
      error?.code === "42P01" ||
      /does not exist|could not find the table|permission/i.test(error?.message ?? "");
    if (error && !isMissingTable) {
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
