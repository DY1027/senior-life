"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

// 모바일 하단 메뉴 — 홈 | 연습 | 오늘의 놀이 | 내 기록.
// '내 기록'은 로그인이 아니라 이 기기 브라우저에 저장된 연습 기록을 보여준다.
const tabs = [
  { label: "홈", href: "/", icon: "ti-home" },
  { label: "연습", href: "/kiosk", icon: "ti-hand-click" },
  { label: "오늘의 놀이", href: "/play", icon: "ti-confetti" },
  { label: "내 기록", href: "/records", icon: "ti-rosette-discount-check" },
];

export default function MobileTabBar() {
  const pathname = usePathname();
  // 키오스크 연습 화면 안에서는 기계 화면에 집중하도록 숨긴다
  if (/^\/kiosk\/.+/.test(pathname)) return null;

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
            style={{
              flex: 1,
              minHeight: 60,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              textDecoration: "none",
              color: active ? "#C4621A" : "#8A8578",
            }}
          >
            <i className={`ti ${t.icon}`} style={{ fontSize: 22 }} aria-hidden="true" />
            <span style={{ fontSize: 12, fontWeight: active ? 800 : 600 }}>{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
