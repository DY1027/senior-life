"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { kioskVoiceAsset } from "@/lib/kiosk-voice/assets";

// 시니어용 음성 안내 훅.
// - 사전 생성된 Inworld 음성 파일을 우선 재생한다.
// - 파일이 없거나 재생에 실패하면 브라우저 한국어 음성으로 대체한다.
// - API 키는 생성 스크립트에서만 사용하며 브라우저 번들에는 포함하지 않는다.
export function useVoice() {
  const [supported, setSupported] = useState(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
      audioRef.current?.pause();
      audioRef.current = null;
      window.speechSynthesis.cancel();
      window.speechSynthesis.removeEventListener?.("voiceschanged", pickVoice);
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined") return;

    audioRef.current?.pause();
    audioRef.current = null;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();

    const fallback = () => {
      if (!("speechSynthesis" in window)) return;
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "ko-KR";
        if (voiceRef.current) utterance.voice = voiceRef.current;
        utterance.rate = 0.95;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
      } catch {
        /* 안내 문구는 화면에도 있으므로 재생 실패는 조용히 무시한다. */
      }
    };

    const src = kioskVoiceAsset(text);
    if (!src) {
      fallback();
      return;
    }

    let fellBack = false;
    const fallbackOnce = () => {
      if (fellBack) return;
      fellBack = true;
      audioRef.current = null;
      fallback();
    };
    const audio = new Audio(src);
    audioRef.current = audio;
    audio.onerror = fallbackOnce;
    audio.onended = () => {
      if (audioRef.current === audio) audioRef.current = null;
    };
    audio.play().catch(fallbackOnce);
  }, []);

  const stop = useCallback(() => {
    if (typeof window === "undefined") return;
    audioRef.current?.pause();
    audioRef.current = null;
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* noop */
    }
  }, []);

  return { supported, speak, stop };
}
