import type { ReactNode } from "react";

type SpeechBubbleProps = {
  children: ReactNode;
  tone?: "brand" | "green" | "blue";
  className?: string;
};

export function SpeechBubble({ children, tone = "brand", className = "" }: SpeechBubbleProps) {
  return (
    <div className={`dd-speech dd-speech-${tone} ${className}`.trim()}>
      {children}
    </div>
  );
}
