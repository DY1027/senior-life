"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import BigTextToggle from "@/components/BigTextToggle";

const navItems = [
  { label: "연습", href: "/kiosk" },
  { label: "쇼핑연습", href: "/shopping" },
  { label: "놀이터", href: "/play" },
  { label: "생활안전", href: "/stories" },
  { label: "내 기록", href: "/records" },
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#EEECE6] bg-white/95 shadow-[0_2px_14px_rgba(59,50,38,0.05)] backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-[1180px] items-center justify-between gap-4 px-4 sm:px-5">
        <Link href="/" className="flex min-h-12 items-center gap-2.5 rounded-xl px-1" aria-label="시니어든든 홈">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#FEF3E8] text-[#C4621A]" aria-hidden="true">
            <span className="text-[20px] leading-none">●</span>
          </span>
          <span className="whitespace-nowrap text-[19px] font-extrabold tracking-[-0.04em] text-[#3B3226]">시니어든든</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="주요 메뉴">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-12 items-center rounded-full px-4 text-[16px] font-bold transition-colors ${
                  active ? "bg-[#FEF3E8] text-[#C4621A]" : "text-[#5F5A51] hover:bg-[#F7F6F3] hover:text-[#3B3226]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <BigTextToggle />
          <Link
            href="/guide"
            aria-current={pathname.startsWith("/guide") ? "page" : undefined}
            className="hidden min-h-12 items-center rounded-full border border-[#EEECE6] px-4 text-[14px] font-bold text-[#5F5A51] hover:border-[#FDDFC0] hover:text-[#C4621A] md:inline-flex"
          >
            이용안내
          </Link>
          <button
            type="button"
            className="grid h-12 w-12 place-items-center rounded-xl border border-[#EEECE6] bg-white text-[#3B3226] md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "전체 메뉴 닫기" : "전체 메뉴 열기"}
            aria-expanded={open}
            aria-controls="mobile-main-menu"
          >
            <span className="text-[27px] leading-none" aria-hidden="true">{open ? "×" : "☰"}</span>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-main-menu" className="border-t border-[#EEECE6] bg-white px-5 py-3 md:hidden" aria-label="전체 메뉴">
          {[{ label: "홈", href: "/" }, ...navItems, { label: "이용안내", href: "/guide" }].map((item) => {
            const active = item.href === "/" ? pathname === "/" : isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`flex min-h-12 items-center justify-between border-b border-[#F2F0EB] px-1 text-[18px] font-bold last:border-0 ${
                  active ? "text-[#C4621A]" : "text-[#3B3226]"
                }`}
              >
                {item.label}
                {active && <span className="text-[13px] font-bold">현재 위치</span>}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
