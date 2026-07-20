"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { shoppingVoiceAsset } from "@/lib/shopping-voice/assets";

const VOICE_PREFERENCE_KEY = "seniordeundun:shopping:voice:v1";

type PlaybackState = "idle" | "playing" | "blocked";

export default function ShoppingVoiceGuide({ text }: { text: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [playback, setPlayback] = useState<PlaybackState>("idle");
  const source = shoppingVoiceAsset(text);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    audioRef.current = null;
    setPlayback("idle");
  }, []);

  const play = useCallback(() => {
    if (!source || typeof Audio === "undefined") return;
    audioRef.current?.pause();
    const audio = new Audio(source);
    audioRef.current = audio;
    setPlayback("playing");
    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
        setPlayback("idle");
      }
    };
    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
        setPlayback("blocked");
      }
    };
    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
        setPlayback("blocked");
      }
    });
  }, [source]);

  useEffect(() => {
    const preferenceEnabled = window.localStorage.getItem(VOICE_PREFERENCE_KEY) === "on";
    if (!preferenceEnabled) return;
    const timer = window.setTimeout(() => {
      setEnabled(true);
      play();
    }, 0);
    return () => {
      window.clearTimeout(timer);
      stop();
    };
  }, [play, stop]);

  if (!source) return null;

  function enableAndPlay() {
    window.localStorage.setItem(VOICE_PREFERENCE_KEY, "on");
    setEnabled(true);
    play();
  }

  function disable() {
    window.localStorage.setItem(VOICE_PREFERENCE_KEY, "off");
    setEnabled(false);
    stop();
  }

  return (
    <section data-testid="shopping-voice-guide" aria-label="쇼핑연습 음성 안내" className="mt-5 rounded-2xl border-2 border-[#BFD0E9] bg-[#F4F8FF] p-4 sm:flex sm:items-center sm:justify-between sm:gap-5">
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="grid h-12 w-12 flex-none place-items-center rounded-full bg-[#246BDF] text-[24px] text-white">♬</span>
        <div>
          <h2 className="text-[19px] font-black text-[#25324A]">음성으로 천천히 안내해 드려요</h2>
          <p aria-live="polite" className="mt-1 text-[15px] font-bold leading-relaxed text-[#56647A]">
            {playback === "playing" ? "안내 음성을 재생하고 있어요." : playback === "blocked" ? "재생이 멈췄어요. 다시 듣기를 눌러주세요." : enabled ? "필요하면 다시 들을 수 있어요." : "버튼을 누르면 다음 화면부터도 음성 안내가 이어집니다."}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:mt-0 sm:min-w-[190px]">
        <button data-testid="shopping-voice-play" type="button" onClick={enabled ? play : enableAndPlay} className="min-h-12 rounded-xl bg-[#246BDF] px-5 text-[16px] font-extrabold text-white">
          {enabled ? "음성 안내 다시 듣기" : "음성 안내 듣기"}
        </button>
        {enabled && <button data-testid="shopping-voice-disable" type="button" onClick={disable} className="min-h-11 rounded-xl border border-[#9EB5D7] bg-white px-4 text-[14px] font-extrabold text-[#3D5577]">음성 안내 끄기</button>}
      </div>
    </section>
  );
}
