"use client";

import { useCallback, useEffect, useRef } from "react";
import { kioskVoiceAsset } from "@/lib/kiosk-voice/assets";

// 검수 후 저장한 Inworld MP3만 재생한다.
// 파일이 없거나 재생에 실패해도 브라우저 기본 음성으로 대체하지 않는다.
export function useVoice() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || typeof Audio === "undefined") return;
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const speak = useCallback((text: string): boolean => {
    if (typeof window === "undefined" || typeof Audio === "undefined") return false;

    audioRef.current?.pause();
    audioRef.current = null;

    const src = kioskVoiceAsset(text);
    if (!src) return false;

    const audio = new Audio(src);
    audioRef.current = audio;
    audio.onerror = () => {
      if (audioRef.current === audio) audioRef.current = null;
    };
    audio.onended = () => {
      if (audioRef.current === audio) audioRef.current = null;
    };
    audio.play().catch(() => {
      if (audioRef.current === audio) audioRef.current = null;
    });
    return true;
  }, []);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    audioRef.current = null;
  }, []);

  return { supported: true, speak, stop };
}
