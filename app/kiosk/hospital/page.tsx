import type { Metadata } from "next";
import KioskPlayer from "@/components/kiosk/KioskPlayer";
import type { KioskScenario } from "@/lib/kiosk/types";
import hospitalData from "@/content/kiosk/hospital.json";

export const metadata: Metadata = {
  title: "병원 접수 키오스크 연습 — 집에서 미리 눌러보기",
  description:
    "병원 접수 키오스크를 집에서 미리 연습하세요. 진료 접수, 본인 확인, 진료과 선택, 번호표 발급까지 큰 버튼과 음성 안내로 따라 하면 됩니다. 실제 접수는 되지 않습니다.",
  alternates: { canonical: "/kiosk/hospital" },
};

// content/kiosk/hospital.json 은 KioskScenario 형태를 따른다.
const scenario = hospitalData as unknown as KioskScenario;

export default function HospitalKioskPage() {
  return <KioskPlayer scenario={scenario} />;
}
