"use client";
import Link from "next/link";
import { useState } from "react";
import BigTextToggle from "@/components/BigTextToggle";

// 상단 메뉴는 다섯 개로 고정 — 연습 중심 사이트라는 게 메뉴만 봐도 드러나야 한다.
const nav = [
  { label: "생활기기 연습", href: "/kiosk" },
  { label: "오늘의 놀이터", href: "/play" },
  { label: "생활안전", href: "/stories" },
  { label: "이용안내", href: "/guide" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header style={{ background: "#fff", borderBottom: "0.5px solid #EEECE6", position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#E67E3F", display: "inline-block" }} />
          <span style={{ fontSize: 17, fontWeight: 700, color: "#1A1A1A", letterSpacing: "-0.3px", whiteSpace: "nowrap" }}>시니어 든든</span>
        </Link>

        <nav className="hidden md:flex" style={{ gap: 2 }} aria-label="주요 메뉴">
          {nav.map((item) => (
            <Link key={item.href} href={item.href}
              style={{ padding: "6px 11px", fontSize: 15, fontWeight: 600, color: "#6B6860", borderRadius: 8, textDecoration: "none", whiteSpace: "nowrap" }}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <BigTextToggle />
          <Link
            href="/"
            className="hidden md:inline-flex"
            style={{ padding: "7px 14px", background: "transparent", color: "#1A1A1A", border: "1px solid #EEECE6", borderRadius: 999, fontSize: 13, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}
          >
            처음으로
          </Link>

          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="메뉴 열기" style={{ background: "none", border: "none", padding: 6, color: "#1A1A1A" }}>
            <i className={`ti ${open ? "ti-x" : "ti-menu-2"}`} style={{ fontSize: 22 }} />
          </button>
        </div>
      </div>

      {open && (
        <nav style={{ background: "#fff", borderTop: "0.5px solid #EEECE6", padding: "12px 24px 16px" }} aria-label="모바일 메뉴">
          {[{ label: "홈", href: "/" }, ...nav, { label: "내 기록", href: "/records" }].map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
              style={{ display: "block", padding: "12px 0", fontSize: 16, fontWeight: 500, color: "#1A1A1A", borderBottom: "0.5px solid #EEECE6", textDecoration: "none" }}>
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
