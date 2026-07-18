"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useVoice } from "@/components/kiosk/useVoice";

// "읽어 주기" 공용 훅: 제공된 정적 음원만 재생한다.
// 정적 파일이 없거나 재생에 실패하면 기기의 기본 합성 음성을 사용하지 않는다.
export function useReadAloud() {
  const { speak, stop: stopSpeech } = useVoice();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [playing, setPlaying] = useState(false);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    stopSpeech();
    setPlaying(false);
  }, [stopSpeech]);

  useEffect(() => stop, [stop]);

  const read = useCallback(
    (text: string, src?: string) => {
      if (playing) {
        stop();
        return;
      }

      if (!src) {
        const started = speak(text);
        if (!started) return;
        setPlaying(true);
        const ms = Math.min(60_000, 2_500 + text.length * 110);
        timeoutRef.current = setTimeout(() => setPlaying(false), ms);
        return;
      }

      setPlaying(true);
      const audio = new Audio(src);
      audioRef.current = audio;
      const finish = () => {
        if (audioRef.current === audio) audioRef.current = null;
        setPlaying(false);
      };
      audio.onended = finish;
      audio.onerror = finish;
      audio.play().catch(finish);
    },
    [playing, speak, stop]
  );

  return { read, stop, playing };
}
