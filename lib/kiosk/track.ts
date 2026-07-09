// 키오스크 연습 관련 GA4 이벤트 전송 헬퍼.
// seniordeundun.com에 이미 설치된 gtag를 사용한다(측정 대상: 연습 시작·완료·다시하기·공유).
// MVP 성공 기준(연습 시작률/완료율 등)을 이 이벤트로 측정한다.
export function trackKiosk(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  try {
    w.gtag?.("event", event, params ?? {});
  } catch {
    /* gtag 미설정 등은 조용히 무시 */
  }
}
