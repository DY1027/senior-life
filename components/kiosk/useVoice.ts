"use client";
import { useCallback, useEffect, useRef, useState } from "react";

// 시니어용 음성 안내 훅. 브라우저 내장 Web Speech API(SpeechSynthesis)를 쓴다.
// - 무료, API 키 불필요, 한국어(ko-KR) 지원
// - iOS는 사용자가 버튼을 눌러야만 소리가 나므로, 화면마다 "안내 듣기" 버튼을 둔다.
export function useVoice() {
  const [supported, setSupported] = useState(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    // 마운트 시 1회 브라우저 지원 여부 확인(SSR에는 speechSynthesis가 없어 초기값을 못 씀).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(true);
    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      voiceRef.current =
        voices.find((v) => v.lang === "ko-KR") ||
        voices.find((v) => v.lang && v.lang.startsWith("ko")) ||
        null;
    };
    pickVoice();
    // 음성 목록은 비동기로 늦게 로드될 수 있다.
    window.speechSynthesis.addEventListener?.("voiceschanged", pickVoice);
    return () => {
      window.speechSynthesis.removeEventListener?.("voiceschanged", pickVoice);
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel(); // 이전 안내 중단 후 새로 읽기
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "ko-KR";
      if (voiceRef.current) u.voice = voiceRef.current;
      u.rate = 0.95; // 시니어를 위해 살짝 천천히
      u.pitch = 1;
      window.speechSynthesis.speak(u);
    } catch {
      /* 음성 재생 실패는 조용히 무시(안내 문구는 화면에도 있음) */
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* noop */
    }
  }, []);

  return { supported, speak, stop };
}
