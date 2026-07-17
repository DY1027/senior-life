import Image from "next/image";
import type { ReactNode } from "react";
import { illustrations } from "@/components/dundun-design/illustration-assets";
import { SpeechBubble } from "@/components/dundun-design/SpeechBubble";

type DungDungGuideProps = {
  children: ReactNode;
  image?: string;
  alt?: string;
  tone?: "brand" | "green" | "blue";
  compact?: boolean;
};

export function DungDungGuide({
  children,
  image = illustrations.cafeGuide,
  alt = "든든이가 연습 방법을 안내하는 그림",
  tone = "brand",
  compact = false,
}: DungDungGuideProps) {
  return (
    <div className={`dd-guide ${compact ? "dd-guide-compact" : ""}`.trim()}>
      <div className="dd-guide-image">
        <Image
          src={image}
          alt={alt}
          fill
          sizes={compact ? "96px" : "(max-width: 768px) 120px, 160px"}
          className="object-contain"
        />
      </div>
      <SpeechBubble tone={tone}>{children}</SpeechBubble>
    </div>
  );
}
