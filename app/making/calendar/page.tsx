import type { Metadata } from "next";
import CalendarMaker from "@/components/making/CalendarMaker";

export const metadata: Metadata = {
  title: "사진 달력 만들기 — 세상에 하나뿐인 우리 가족 달력",
  description:
    "손주·가족 사진을 골라 몇 번만 누르면 인쇄용 달력이 완성됩니다. 사진은 서버에 저장되지 않아요. 어르신을 위한 무료 만들기 놀이입니다.",
  alternates: { canonical: "/making/calendar" },
};

export default function CalendarMakerPage() {
  return <CalendarMaker />;
}
