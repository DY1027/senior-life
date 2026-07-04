"use client";
import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "노후자금", href: "/finance" },
  { label: "병원준비", href: "/health/checkup" },
  { label: "복지혜택", href: "/welfare" },
  { label: "건강정보", href: "/health" },
  { label: "생활정보", href: "/life-tips" },
];

export default function HomeHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 100, background: "#fff", borderBottom: "1px solid #E8F0FE", boxShadow: "0 2px 8px rgba(27,111,200,0.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", height: 64, gap: 16 }}>
        {/* 로고 */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#1B6FC8,#0EA5E9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="white" opacity=".9"/><path d="M9 12l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 800, color: "#1B6FC8", lineHeight: 1.1, letterSpacing: "-0.3px" }}>시니어 든든</p>
            <p style={{ fontSize: 10, color: "#4A5568", lineHeight: 1 }}>더 쉽고 든든한 시니어 생활</p>
          </div>
        </Link>

        {/* 데스크탑 nav */}
        <nav style={{ display: "flex", gap: 2, flex: 1, justifyContent: "center" }} className="hh-nav">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} style={{ padding: "8px 14px", fontSize: 15, fontWeight: 600, color: "#1A1A2E", borderRadius: 8, textDecoration: "none", whiteSpace: "nowrap" }}>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link href="#calculator" className="hh-cta" style={{ height: 44, padding: "0 20px", fontSize: 14, fontWeight: 700, color: "#fff", background: "#1B6FC8", borderRadius: 10, textDecoration: "none", display: "flex", alignItems: "center", whiteSpace: "nowrap", flexShrink: 0 }}>
          노후자금 계산하기
        </Link>

        {/* 햄버거 */}
        <button onClick={() => setOpen(!open)} className="hh-burger" aria-label="메뉴 열기" style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          {open
            ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1A2E" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1A2E" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          }
        </button>
      </div>

      {/* 모바일 드로어 */}
      {open && (
        <div style={{ background: "#fff", borderTop: "1px solid #E8F0FE", padding: "8px 20px 20px" }}>
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              style={{ display: "block", padding: "14px 0", fontSize: 17, fontWeight: 600, color: "#1A1A2E", textDecoration: "none", borderBottom: "1px solid #F0F7FF" }}>
              {l.label}
            </Link>
          ))}
          <Link href="#calculator" onClick={() => setOpen(false)}
            style={{ display: "block", marginTop: 16, padding: "14px 0", fontSize: 17, fontWeight: 700, color: "#1B6FC8", textDecoration: "none" }}>
            → 노후자금 계산하기
          </Link>
        </div>
      )}

      <style>{`
        @media(max-width:768px){
          .hh-nav{display:none!important;}
          .hh-cta{display:none!important;}
          .hh-burger{display:block!important;}
        }
      `}</style>
    </header>
  );
}
