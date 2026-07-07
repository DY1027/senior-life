import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getAdminUser } from "@/lib/adminAuth";
import { sanitizeValue, sanitizeRows, rowsToCsv } from "@/lib/backupSanitize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 회원(auth.users)에서 백업에 담을 안전한 필드만 골라낸다.
// encrypted_password 등은 admin.listUsers 응답에 애초에 포함되지 않지만,
// 반환 전에 sanitizeValue로 한 번 더 걸러 이중으로 방어한다.
function toSafeMember(user: {
  id: string;
  email?: string | null;
  phone?: string | null;
  created_at?: string;
  last_sign_in_at?: string | null;
  email_confirmed_at?: string | null;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
}) {
  const meta = user.user_metadata ?? {};
  const appMeta = user.app_metadata ?? {};
  return {
    id: user.id,
    email: user.email ?? null,
    name: (meta.full_name as string) ?? (meta.name as string) ?? null,
    phone: user.phone ?? null,
    provider: (appMeta.provider as string) ?? null,
    providers: (appMeta.providers as string[]) ?? null,
    created_at: user.created_at ?? null,
    last_sign_in_at: user.last_sign_in_at ?? null,
    email_confirmed_at: user.email_confirmed_at ?? null,
  };
}

async function collectMembers(admin: SupabaseClient) {
  const perPage = 1000;
  let page = 1;
  const members: Record<string, unknown>[] = [];
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const users = data?.users ?? [];
    for (const u of users) members.push(toSafeMember(u));
    if (users.length < perPage) break;
    page += 1;
  }
  // 화이트리스트로 이미 안전하지만 방어적으로 한 번 더 마스킹한다.
  return sanitizeRows(members);
}

// 향후 public 스키마 테이블이 생기면, 서버 환경변수 PUBLIC_BACKUP_TABLES에
// 백업할 테이블 이름을 쉼표로 나열한다(예: "inquiries,posts"). 나열된 테이블만
// 안전하게 덤프하고, 존재하지 않거나 접근 불가한 테이블은 건너뛴다.
async function collectPublicTables(
  admin: SupabaseClient
): Promise<Record<string, Record<string, unknown>[]>> {
  const raw = process.env.PUBLIC_BACKUP_TABLES;
  if (!raw) return {};
  const names = raw
    .split(",")
    .map((n) => n.trim())
    .filter(Boolean);
  const result: Record<string, Record<string, unknown>[]> = {};
  for (const name of names) {
    try {
      const { data, error } = await admin.from(name).select("*");
      if (error) continue; // 없는 테이블 등은 조용히 건너뜀
      result[name] = sanitizeRows((data ?? []) as Record<string, unknown>[]);
    } catch {
      /* 개별 테이블 실패가 전체 백업을 막지 않도록 무시 */
    }
  }
  return result;
}

export async function GET(request: NextRequest) {
  // 1) 관리자 검증 — 로그인 세션 + 이메일 허용목록 이중 확인
  const adminUser = await getAdminUser();
  if (!adminUser) {
    return NextResponse.json(
      { error: "관리자 권한이 필요합니다." },
      { status: 403 }
    );
  }

  const secretKey = process.env.SUPABASE_SECRET_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!secretKey || !url) {
    return NextResponse.json(
      { error: "서버에 백업 자격 증명이 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  // 2) service role(secret) 키로 관리자 클라이언트 생성 — 서버에서만 사용
  const admin: SupabaseClient = createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let members: Record<string, unknown>[];
  let tables: Record<string, Record<string, unknown>[]>;
  try {
    members = await collectMembers(admin);
    tables = await collectPublicTables(admin);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "백업 데이터 수집 실패" },
      { status: 500 }
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const format = new URL(request.url).searchParams.get("format") === "csv" ? "csv" : "json";

  if (format === "csv") {
    // CSV는 표 형태 한 개만 담을 수 있으므로 회원 목록을 내보낸다.
    const csv = rowsToCsv(members);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="senior-life-members-${today}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  }

  const backup = sanitizeValue({
    service: "시니어 든든",
    exportedAt: new Date().toISOString(),
    exportedBy: adminUser.email,
    note: "비밀번호·API 키·토큰·결제 비밀값 등 민감정보는 백업에서 제외되었습니다.",
    counts: {
      members: members.length,
      ...Object.fromEntries(
        Object.entries(tables).map(([k, v]) => [k, v.length])
      ),
    },
    data: {
      members,
      ...tables,
    },
  });

  return new NextResponse(JSON.stringify(backup, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="senior-life-backup-${today}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
