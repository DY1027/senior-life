"use client";
import Link from "next/link";
import { useState } from "react";

const nav = [
  { label: "복지혜택", href: "/welfare" },
  { label: "건강·병원", href: "/health" },
  { label: "노후재정", href: "/finance" },
  { label: "생활팁", href: "/life-tips" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header style={{ background: "#fff", borderBottom: "0.5px solid #EEECE6", position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1024, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* 로고 */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#E67E3F", display: "inline-block" }} />
          <span style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", letterSpacing: "-0.3px" }}>
            시니어라이프
          </span>
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex" style={{ gap: 2 }} aria-label="주요 메뉴">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{ padding: "6px 14px", fontSize: 13, fontWeight: 500, color: "#6B6860", borderRadius: 8, textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = "#1A1A1A"; (e.target as HTMLElement).style.background = "#F7F6F3"; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = "#6B6860"; (e.target as HTMLElement).style.background = "transparent"; }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA 버튼 */}
        <Link
          href="/welfare/basic-pension"
          className="hidden md:flex"
          style={{ padding: "7px 18px", background: "#1A1A1A", color: "#fff", borderRadius: 999, fontSize: 12, fontWeight: 600, textDecoration: "none", alignItems: "center", gap: 6 }}
        >
          혜택 조회하기
        </Link>

        {/* 모바일 햄버거 */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="메뉴 열기"
          aria-expanded={open}
          style={{ background: "none", border: "none", padding: 6, color: "#1A1A1A" }}
        >
          <i className={`ti ${open ? "ti-x" : "ti-menu-2"}`} style={{ fontSize: 22 }} />
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {open && (
        <nav
          style={{ background: "#fff", borderTop: "0.5px solid #EEECE6", padding: "12px 24px 16px" }}
          aria-label="모바일 메뉴"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              style={{ display: "block", padding: "12px 0", fontSize: 16, fontWeight: 500, color: "#1A1A1A", borderBottom: "0.5px solid #EEECE6", textDecoration: "none" }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/welfare/basic-pension"
            onClick={() => setOpen(false)}
            style={{ display: "block", marginTop: 12, textAlign: "center", padding: "12px", background: "#1A1A1A", color: "#fff", borderRadius: 999, fontSize: 14, fontWeight: 600, textDecoration: "none" }}
          >
            혜택 조회하기
          </Link>
        </nav>
      )}
    </header>
  );
}
