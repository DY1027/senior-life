"use client";
import { useEffect, useState } from "react";

// 글자 크게 토글 — html[data-bigtext] 속성으로 사이트 전체를 확대(zoom)한다.
// 선택은 localStorage에 저장되고, 첫 페인트 전 적용은 layout의 인라인 스크립트가 담당.
export default function BigTextToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR에서 localStorage를 못 읽어 마운트 후 동기화
    setOn(document.documentElement.dataset.bigtext === "1");
  }, []);

  function toggle() {
    const next = !on;
    setOn(next);
    if (next) {
      document.documentElement.dataset.bigtext = "1";
      localStorage.setItem("bigtext", "1");
    } else {
      delete document.documentElement.dataset.bigtext;
      localStorage.removeItem("bigtext");
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "글자 원래 크기로" : "글자 크게 보기"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        padding: "6px 12px",
        borderRadius: 999,
        border: `1.5px solid ${on ? "#E67E3F" : "#EEECE6"}`,
        background: on ? "#FDF0E0" : "#fff",
        color: on ? "#C4621A" : "#6B6860",
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      가<span style={{ fontSize: 16, lineHeight: 1 }}>{on ? "−" : "+"}</span>
    </button>
  );
}
