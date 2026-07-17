"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

// 모바일 하단 메뉴 — 홈 | 연습 | 놀이터 | 내 기록.
// '내 기록'은 로그인이 아니라 이 기기 브라우저에 저장된 연습 기록을 보여준다.
const tabs = [
  { label: "홈", href: "/", icon: "⌂" },
  { label: "연습", href: "/kiosk", icon: "◎" },
  { label: "놀이터", href: "/play", icon: "✦" },
  { label: "내 기록", href: "/records", icon: "✓" },
];

export default function MobileTabBar() {
  const pathname = usePathname();
  // 키오스크 연습 화면 안에서는 기계 화면에 집중하도록 숨긴다
  if (/^\/kiosk\/.+/.test(pathname) || /^\/shopping\/missions\/.+\/(practice|result)$/.test(pathname)) return null;

  return (
    <nav
      className="md:hidden"
      aria-label="하단 메뉴"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        background: "#fff",
        borderTop: "1px solid #EEECE6",
        display: "flex",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {tabs.map((t) => {
        const active = t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            style={{
              flex: 1,
              minHeight: 64,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              textDecoration: "none",
              color: active ? "#C4621A" : "#6B6860",
              background: active ? "#FEF3E8" : "transparent",
            }}
          >
            <span style={{ fontSize: 22, lineHeight: 1 }} aria-hidden="true">{t.icon}</span>
            <span style={{ fontSize: 13, fontWeight: active ? 800 : 700 }}>{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
