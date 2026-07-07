"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type AdminState =
  | { status: "loading" }
  | { status: "anon" }
  | { status: "forbidden" }
  | { status: "ok"; email: string | null };

const NAV = [
  { label: "개요", href: "/admin" },
  { label: "백업", href: "/admin/backup" },
];

export default function AdminChrome({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AdminState>({ status: "loading" });
  const pathname = usePathname();

  useEffect(() => {
    let alive = true;
    fetch("/api/admin/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { loggedIn: boolean; isAdmin: boolean; email: string | null }) => {
        if (!alive) return;
        if (d.isAdmin) setState({ status: "ok", email: d.email });
        else if (d.loggedIn) setState({ status: "forbidden" });
        else setState({ status: "anon" });
      })
      .catch(() => alive && setState({ status: "forbidden" }));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#F7F6F3" }}>
      {/* 관리자 헤더 */}
      <header style={{ background: "#1A1A2E", color: "#fff", padding: "0 20px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", height: 60, gap: 20 }}>
          <Link href="/admin" style={{ color: "#fff", fontWeight: 800, fontSize: 16, textDecoration: "none", letterSpacing: "-0.3px" }}>
            시니어 든든 · 관리자
          </Link>
          <nav style={{ display: "flex", gap: 6 }}>
            {NAV.map((n) => {
              const active = pathname === n.href;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: "none",
                    color: active ? "#1A1A2E" : "rgba(255,255,255,0.75)",
                    background: active ? "#fff" : "transparent",
                  }}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <Link href="/" style={{ marginLeft: "auto", color: "rgba(255,255,255,0.6)", fontSize: 13, textDecoration: "none" }}>
            사이트로 →
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "32px 20px 64px" }}>
        {state.status === "loading" && <Message>확인 중…</Message>}
        {state.status === "anon" && (
          <Message>
            관리자 로그인이 필요합니다.{" "}
            <Link href="/login" style={{ color: "#1B6FC8", fontWeight: 700 }}>
              로그인하기 →
            </Link>
          </Message>
        )}
        {state.status === "forbidden" && (
          <Message>이 계정에는 관리자 권한이 없습니다.</Message>
        )}
        {state.status === "ok" && children}
      </main>
    </div>
  );
}

function Message({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #EEECE6",
        borderRadius: 14,
        padding: "40px 24px",
        textAlign: "center",
        fontSize: 15,
        color: "#4A5568",
        lineHeight: 1.7,
      }}
    >
      {children}
    </div>
  );
}
