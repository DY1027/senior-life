"use client";
// 온라인/오프라인 상태 훅 — 오프라인 배너와 외부 링크(광고) 숨김에 쓴다.
// 서버·수화 중에는 온라인으로 간주해 화면이 어긋나지 않게 한다.
import { useSyncExternalStore } from "react";

function subscribe(listener: () => void): () => void {
  window.addEventListener("online", listener);
  window.addEventListener("offline", listener);
  return () => {
    window.removeEventListener("online", listener);
    window.removeEventListener("offline", listener);
  };
}

export function useOnline(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true
  );
}
