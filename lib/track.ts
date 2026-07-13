// GA4 이벤트 전송 헬퍼 (사이트 공용).
// 키오스크 전용 trackKiosk(lib/kiosk/track.ts)와 동일한 방식이며,
// 두뇌 놀이 등 새 기능은 이 함수를 쓴다.
export function track(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  try {
    w.gtag?.("event", event, params ?? {});
  } catch {
    /* gtag 미설정 등은 조용히 무시 */
  }
}
