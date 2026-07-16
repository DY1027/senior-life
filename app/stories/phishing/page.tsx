import type { Metadata } from "next";
import StoryPlayer from "@/components/stories/StoryPlayer";
import phishingStory from "@/content/stories/phishing";

export const metadata: Metadata = {
  title: "보이스피싱, 이렇게 막아요 — 그림으로 배우는 생활안전",
  description:
    "택배 사칭, 가족 사칭, 기관 사칭 문자를 구별하는 세 가지 약속을 그림과 쉬운 설명으로 확인해요. 2분 생활안전 안내입니다.",
  alternates: { canonical: "/stories/phishing" },
};

export default function PhishingStoryPage() {
  return <StoryPlayer story={phishingStory} />;
}
