import type { Metadata } from "next";
import StoryPlayer from "@/components/stories/StoryPlayer";
import phishingStory from "@/content/stories/phishing";

export const metadata: Metadata = {
  title: "보이스피싱, 이렇게 막아요 — 든든이 그림책",
  description:
    "택배 사칭, 자녀 사칭, 기관 사칭 문자를 구별하는 세 가지 약속을 그림책으로 배워요. 어르신을 위한 보이스피싱 예방 교육, 2분이면 충분합니다.",
  alternates: { canonical: "/stories/phishing" },
};

export default function PhishingStoryPage() {
  return <StoryPlayer story={phishingStory} />;
}
