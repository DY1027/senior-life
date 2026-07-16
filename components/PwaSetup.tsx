"use client";
// PWA 초기화 — 서비스워커 등록 + 오프라인 배너 + 새 버전 안내 (명세 3.3, 16장 6단계).
// layout에 한 번만 들어간다. 개발 서버에서는 캐시가 개발을 방해하므로 등록하지 않는다.
import { useEffect, useRef, useState } from "react";
import { useOnline } from "@/lib/useOnline";

export default function PwaSetup() {
  const online = useOnline();
  const [updateReady, setUpdateReady] = useState(false);
  const waitingRef = useRef<ServiceWorker | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    let reloading = false;
    // 첫 설치(clients.claim)로도 controllerchange가 발생하므로,
    // "원래 컨트롤러가 있었는데 바뀐 경우"(=업데이트)에만 새로고침한다
    let hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.register("/sw.js").then((reg) => {
      // 이미 대기 중인 새 버전이 있는 경우 (다른 탭에서 받아둔 경우 등)
      if (reg.waiting && navigator.serviceWorker.controller) {
        waitingRef.current = reg.waiting;
        setUpdateReady(true);
      }
      reg.addEventListener("updatefound", () => {
        const fresh = reg.installing;
        if (!fresh) return;
        fresh.addEventListener("statechange", () => {
          // 기존 버전을 쓰는 중에 새 버전 설치가 끝났을 때만 안내한다
          if (fresh.state === "installed" && navigator.serviceWorker.controller) {
            waitingRef.current = fresh;
            setUpdateReady(true);
          }
        });
      });
    }).catch(() => {
      /* 등록 실패해도 사이트는 평소처럼 동작한다 */
    });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!hadController) {
        hadController = true; // 첫 설치 — 새로고침 불필요
        return;
      }
      if (reloading) return;
      reloading = true;
      window.location.reload();
    });
  }, []);

  function applyUpdate() {
    waitingRef.current?.postMessage("SKIP_WAITING");
    setUpdateReady(false);
  }

  return (
    <>
      {/* 오프라인 안내 — 화면 상단에 작게 (명세 3.3 문구) */}
      {!online && (
        <div
          role="status"
          style={{ position: "sticky", top: 0, zIndex: 70, background: "#3B3226", color: "#FDF7E7", textAlign: "center", padding: "8px 16px", fontSize: 14, fontWeight: 700, lineHeight: 1.5 }}
        >
          📴 인터넷 연결 없이 연습 중입니다. 기록은 이 기기에 저장됩니다.
        </div>
      )}

      {/* 새 버전 안내 */}
      {updateReady && (
        <div
          style={{ position: "fixed", bottom: 76, left: 16, right: 16, zIndex: 70, maxWidth: 480, margin: "0 auto", background: "#1A1A2E", color: "#fff", borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}
        >
          <span style={{ flex: 1, fontSize: 14, fontWeight: 600, lineHeight: 1.5 }}>
            ✨ 새로운 내용이 준비됐어요.
          </span>
          <button
            type="button"
            onClick={applyUpdate}
            style={{ minHeight: 44, padding: "0 16px", background: "#E67E3F", color: "#fff", border: "none", borderRadius: 999, fontSize: 14, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap" }}
          >
            새로고침
          </button>
        </div>
      )}
    </>
  );
}
