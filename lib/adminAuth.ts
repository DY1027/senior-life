import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";

// 관리자 이메일 허용목록. 서버 전용 환경변수 ADMIN_EMAILS(쉼표 구분)로 관리한다.
// 값이 없으면 프로젝트 소유자 이메일을 기본값으로 사용한다.
// 절대 NEXT_PUBLIC_ 접두어를 붙이지 말 것 — 허용목록이 브라우저에 노출되면 안 된다.
const DEFAULT_ADMIN_EMAILS = ["eoduq007@gmail.com"];

export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS;
  if (!raw) return DEFAULT_ADMIN_EMAILS;
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}

// 요청 쿠키에 담긴 Supabase 세션에서 현재 로그인 사용자를 조회한다.
// 읽기 전용이므로 setAll은 no-op으로 둔다(GET 라우트에서 토큰 갱신 쓰기 방지).
export async function getServerUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          /* 읽기 전용 컨텍스트 */
        },
      },
    }
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// 현재 사용자가 관리자면 User를, 아니면 null을 반환한다.
export async function getAdminUser(): Promise<User | null> {
  const user = await getServerUser();
  if (user && isAdminEmail(user.email)) return user;
  return null;
}
