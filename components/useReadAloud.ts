"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useVoice } from "@/components/kiosk/useVoice";

// "읽어 주기" 공용 훅.
// 사전 생성된 고품질 음성 파일(src)이 있으면 그것을 재생하고,
// 파일이 없거나 재생에 실패하면 브라우저 내장 음성(Web Speech)으로 자동 폴백한다.
// → 음성 파일을 아직 안 만든 페이지에서도 기능이 항상 동작한다.
export function useReadAloud() {
  const { speak, stop: stopSpeech } = useVoice();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    stopSpeech();
    setPlaying(false);
  }, [stopSpeech]);

  useEffect(() => stop, [stop]); // 화면을 떠나면 소리 중단

  const read = useCallback(
    (text: string, src?: string) => {
      if (playing) {
        stop();
        return;
      }
      setPlaying(true);
      const fallback = () => {
        audioRef.current = null;
        speak(text);
        // Web Speech는 끝 이벤트가 기기별로 불안정해 대략적 길이 후 상태 해제
        const ms = Math.min(60000, 2500 + text.length * 110);
        setTimeout(() => setPlaying(false), ms);
      };
      if (!src) {
        fallback();
        return;
      }
      const audio = new Audio(src);
      audioRef.current = audio;
      audio.onended = () => setPlaying(false);
      audio.onerror = fallback; // 파일 없음(404) 등 → 브라우저 음성
      audio.play().catch(fallback);
    },
    [playing, speak, stop]
  );

  return { read, stop, playing };
}
