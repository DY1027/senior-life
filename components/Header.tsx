"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getClient } from "@/lib/supabase";
import { useIsAdmin } from "@/components/useIsAdmin";
import type { User } from "@supabase/supabase-js";

const nav = [
  { label: "키오스크 연습", href: "/kiosk" },
  { label: "두뇌 놀이", href: "/brain" },
  { label: "복지혜택", href: "/welfare" },
  { label: "건강·병원", href: "/health" },
  { label: "노후재정", href: "/finance" },
  { label: "생활팁", href: "/life-tips" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const isAdmin = useIsAdmin(!!user);

  useEffect(() => {
    const sb = getClient();
    if (!sb) return;
    sb.auth.getUser().then((res) => setUser(res.data.user));
    const { data: { subscription } } = sb.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const sb = getClient();
    await sb?.auth.signOut();
    setUser(null);
  }

  return (
    <header style={{ background: "#fff", borderBottom: "0.5px solid #EEECE6", position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1024, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#E67E3F", display: "inline-block" }} />
          <span style={{ fontSize: 17, fontWeight: 700, color: "#1A1A1A", letterSpacing: "-0.3px" }}>시니어 든든</span>
        </Link>

        <nav className="hidden md:flex" style={{ gap: 2 }} aria-label="주요 메뉴">
          {nav.map((item) => (
            <Link key={item.href} href={item.href}
              style={{ padding: "6px 14px", fontSize: 15, fontWeight: 600, color: "#6B6860", borderRadius: 8, textDecoration: "none" }}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex" style={{ alignItems: "center", gap: 8 }}>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {isAdmin && (
                <Link href="/admin" style={{ padding: "6px 12px", background: "#1A1A2E", color: "#fff", borderRadius: 999, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
                  관리자
                </Link>
              )}
              <span style={{ fontSize: 12, color: "#4A5568" }}>{user.email?.split("@")[0]}님</span>
              <button onClick={handleSignOut} style={{ padding: "6px 14px", background: "transparent", color: "#6B7280", border: "1px solid #E5E7EB", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                로그아웃
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" style={{ padding: "7px 16px", background: "transparent", color: "#1A1A1A", border: "1px solid #EEECE6", borderRadius: 999, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                로그인
              </Link>
              <Link href="/login" style={{ padding: "7px 18px", background: "#E67E3F", color: "#fff", borderRadius: 999, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                무료 가입
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="메뉴 열기" style={{ background: "none", border: "none", padding: 6, color: "#1A1A1A" }}>
          <i className={`ti ${open ? "ti-x" : "ti-menu-2"}`} style={{ fontSize: 22 }} />
        </button>
      </div>

      {open && (
        <nav style={{ background: "#fff", borderTop: "0.5px solid #EEECE6", padding: "12px 24px 16px" }} aria-label="모바일 메뉴">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
              style={{ display: "block", padding: "12px 0", fontSize: 16, fontWeight: 500, color: "#1A1A1A", borderBottom: "0.5px solid #EEECE6", textDecoration: "none" }}>
              {item.label}
            </Link>
          ))}
          {user && isAdmin && (
            <Link href="/admin" onClick={() => setOpen(false)}
              style={{ display: "block", padding: "12px 0", fontSize: 16, fontWeight: 700, color: "#1A1A2E", borderBottom: "0.5px solid #EEECE6", textDecoration: "none" }}>
              🔧 관리자
            </Link>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            {user ? (
              <button onClick={handleSignOut} style={{ flex: 1, padding: "12px", background: "transparent", color: "#6B7280", border: "1px solid #E5E7EB", borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                로그아웃
              </button>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} style={{ flex: 1, textAlign: "center", padding: "12px", background: "transparent", color: "#1A1A1A", border: "1px solid #EEECE6", borderRadius: 999, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
                  로그인
                </Link>
                <Link href="/login" onClick={() => setOpen(false)} style={{ flex: 1, textAlign: "center", padding: "12px", background: "#E67E3F", color: "#fff", borderRadius: 999, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
                  무료 가입
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
