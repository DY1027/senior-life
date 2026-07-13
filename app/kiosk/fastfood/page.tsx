import type { Metadata } from "next";
import KioskPlayer from "@/components/kiosk/KioskPlayer";
import type { KioskScenario } from "@/lib/kiosk/types";
import fastfoodData from "@/content/kiosk/fastfood.json";

export const metadata: Metadata = {
  title: "패스트푸드 키오스크 연습 — 집에서 미리 눌러보기",
  description:
    "햄버거 가게 키오스크 주문을 집에서 미리 연습하세요. 세트 메뉴 고르기, 음료 변경, 개수, 계산까지 큰 버튼과 음성 안내로 따라 하면 됩니다. 실제 결제는 되지 않습니다.",
  alternates: { canonical: "/kiosk/fastfood" },
};

// content/kiosk/fastfood.json 은 KioskScenario 형태를 따른다.
const scenario = fastfoodData as unknown as KioskScenario;

export default function FastfoodKioskPage() {
  return <KioskPlayer scenario={scenario} />;
}
