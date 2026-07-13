import type { Metadata } from "next";
import MatchingGame from "@/components/brain/MatchingGame";

export const metadata: Metadata = {
  title: "카드 짝 맞추기 — 두뇌 놀이",
  description:
    "뒤집힌 카드에서 같은 그림 두 장을 찾는 기억력 놀이. 시간 제한 없이 큰 카드로 천천히 즐기세요. 어르신을 위한 무료 두뇌 운동입니다.",
  alternates: { canonical: "/brain/matching" },
};

export default function MatchingGamePage() {
  return <MatchingGame />;
}
