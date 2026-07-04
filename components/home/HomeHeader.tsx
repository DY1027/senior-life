"use client";
import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "노후자금", href: "/finance" },
  { label: "건강정보", href: "/health" },
  { label: "병원도우미", href: "/health/checkup" },
  { label: "생활정보", href: "/life-tips" },
  { label: "디지털도움", href: "/life-tips/senior-discount" },
  { label: "문의하기", href: "#contact" },
];

export default function HomeHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 100, background: "#fff", borderBottom: "1px solid #E8F0FE", boxShadow: "0 2px 12px rgba(27,111,200,0.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", height: 68 }}>
        {/* 로고 */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#1B6FC8,#0EA5E9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="white"/></svg>
          </div>
          <div>
            <p style={{ fontSize: 17, fontWeight: 800, color: "#1B6FC8", lineHeight: 1, letterSpacing: "-0.3px" }}>시니어 든든</p>
            <p style={{ fontSize: 10, color: "#4A5568", lineHeight: 1, marginTop: 2 }}>더 쉽고 든든한 시니어 생활</p>
          </div>
        </Link>

        {/* 데스크탑 nav */}
        <nav style={{ display: "flex", gap: 4, marginLeft: 40, flex: 1 }} className="home-nav-desktop">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} style={{ padding: "8px 14px", fontSize: 14, fontWeight: 600, color: "#1A1A2E", borderRadius: 8, textDecoration: "none", whiteSpace: "nowrap" }}>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* 우측 버튼 */}
        <div style={{ display: "flex", gap: 8, marginLeft: "auto", alignItems: "center" }}>
          <button style={{ padding: "10px 18px", fontSize: 14, fontWeight: 600, color: "#1B6FC8", background: "none", border: "1.5px solid #1B6FC8", borderRadius: 100, cursor: "pointer" }}>로그인</button>
          <button style={{ padding: "10px 18px", fontSize: 14, fontWeight: 600, color: "#fff", background: "#1B6FC8", border: "none", borderRadius: 100, cursor: "pointer" }}>회원가입</button>
          {/* 햄버거 */}
          <button onClick={() => setOpen(!open)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 6 }} className="home-hamburger" aria-label="메뉴">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1A2E" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {open && (
        <div style={{ background: "#fff", borderTop: "1px solid #E8F0FE", padding: "12px 24px 20px" }}>
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ display: "block", padding: "12px 0", fontSize: 16, fontWeight: 600, color: "#1A1A2E", textDecoration: "none", borderBottom: "1px solid #F0F7FF" }}>
              {l.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .home-nav-desktop { display: none !important; }
          .home-hamburger { display: block !important; }
        }
      `}</style>
    </header>
  );
}
