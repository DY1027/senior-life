"use client";
import { useEffect, useState } from "react";

// 로그인한 사용자가 관리자인지 서버에 물어본다(허용목록은 노출하지 않음).
// enabled=false(비로그인)면 호출하지 않고, 반환값도 항상 false가 되도록 유도한다.
export function useIsAdmin(enabled: boolean): boolean {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    fetch("/api/admin/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { isAdmin?: boolean }) => {
        if (alive) setIsAdmin(!!d.isAdmin);
      })
      .catch(() => {
        if (alive) setIsAdmin(false);
      });
    return () => {
      alive = false;
    };
  }, [enabled]);
  // 로그아웃(enabled=false) 시 이전 판정이 남아있어도 false로 보이게 한다.
  return enabled && isAdmin;
}
