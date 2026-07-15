import type { Metadata } from "next";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import HospitalChecklistPreview from "@/components/home/HospitalChecklistPreview";
import AffiliateCard from "@/components/AffiliateCard";
import { AFFILIATE, mergeProduct } from "@/content/affiliate";
import { searchProduct } from "@/lib/coupang";

export const metadata: Metadata = {
  title: "병원 방문 체크리스트 — 진료 전 준비물과 질문 정리",
  description:
    "진료 목적을 선택하면 병원에 챙겨갈 것과 의사에게 물어볼 질문을 정리해드립니다. 복사하거나 인쇄해서 병원에 가져가세요.",
  alternates: { canonical: "/health/hospital-checklist" },
};

// 파트너스 상품 정보(사진·가격)를 1시간마다 서버에서 갱신
export const revalidate = 3600;

export default async function HospitalChecklistPage() {
  const bpProduct = mergeProduct(AFFILIATE.bpMonitor, await searchProduct(AFFILIATE.bpMonitor.keyword!));
  return (
    <>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 20px 0" }}>
        <BreadcrumbNav items={[{ label: "홈", href: "/" }, { label: "건강·병원", href: "/health" }, { label: "병원 방문 체크리스트" }]} />
      </div>
      <HospitalChecklistPreview />
      {bpProduct && (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 20px 48px" }}>
          <AffiliateCard product={bpProduct} heading="🩺 집에 하나 있으면 진료가 든든해지는 것" />
        </div>
      )}
    </>
  );
}
