import type { Metadata } from "next";
import LegalDoc from "@/components/legal/LegalDoc";
import LegalSection from "@/components/legal/LegalSection";
import { companyInfo } from "@/lib/companyInfo";

export const metadata: Metadata = {
  title: "환불규정",
  description: "시니어 든든 청약철회 및 환불규정입니다.",
  robots: { index: false, follow: false },
};

export default function RefundPage() {
  return (
    <LegalDoc
      title="환불규정"
      effectiveDate={companyInfo.effectiveDate}
      breadcrumb={[{ label: "홈", href: "/" }, { label: "환불규정" }]}
    >
      <LegalSection title="제1조 (목적)">
        <p>
          이 규정은 {companyInfo.companyName}(이하 &quot;회사&quot;)가 제공하는 유료 상품 및 서비스(이하 &quot;유료
          서비스&quot;)에 대한 청약철회, 계약해제·해지 및 환불의 기준과 절차를 정함을 목적으로 합니다.
        </p>
      </LegalSection>

      <LegalSection title="제2조 (적용 범위)">
        <p>
          이 규정은 회사가 홈페이지를 통해 판매하는 모든 유료 서비스에 적용됩니다. 현재 회사는 판매 중인 유료 상품이
          없으며, 향후 유료 서비스 출시 시 상품별 세부 환불 조건은 해당 상품 소개 페이지에 별도로 안내하고, 그 내용이
          이 규정과 다른 경우 상품별 안내가 우선합니다.
        </p>
      </LegalSection>

      <LegalSection title="제3조 (청약철회)">
        <p>
          1. 이용자는 유료 서비스 결제일로부터 7일 이내에는 「전자상거래 등에서의 소비자보호에 관한 법률」에 따라 청약철회를
          할 수 있습니다.<br />
          2. 다만 다음 각 호에 해당하는 경우에는 회사의 동의 없이는 청약철회를 할 수 없습니다.
        </p>
        <p>
          가. 이용자에게 책임 있는 사유로 서비스가 멸실 또는 훼손된 경우<br />
          나. 이용자의 서비스 사용 또는 일부 소비로 그 가치가 현저히 감소한 경우<br />
          다. 시간이 지나 재판매가 곤란할 정도로 서비스 가치가 현저히 감소한 경우<br />
          라. 디지털 콘텐츠의 제공이 개시된 경우 (단, 가분적 콘텐츠의 경우 제공되지 않은 부분은 청약철회 가능)
        </p>
      </LegalSection>

      <LegalSection title="제4조 (환불 절차 및 방법)">
        <p>
          1. 이용자가 청약철회 또는 환불을 요청하는 경우, 고객센터({companyInfo.csEmail} / {companyInfo.csPhone})로
          접수하여야 합니다.<br />
          2. 회사는 환불 요청 접수일로부터 3영업일 이내에 환불 가능 여부를 확인하여 안내합니다.<br />
          3. 환불이 승인된 경우, 결제 대행사({companyInfo.pgProvider})를 통해 결제한 수단으로 환불되며, 결제수단에 따라
          환불 소요기간은 상이할 수 있습니다.
        </p>
      </LegalSection>

      <LegalSection title="제5조 (환불 금액의 산정)">
        <p>
          1. 서비스 이용 개시 전 전액 결제 취소를 요청하는 경우, 결제금액 전액을 환불합니다.<br />
          2. 서비스를 일부 이용한 후 환불을 요청하는 경우, 이용한 기간 또는 이용량에 해당하는 금액을 공제한 잔액을
          환불합니다. 구체적인 산정 기준은 상품별 안내 페이지에 명시합니다.
        </p>
      </LegalSection>

      <LegalSection title="제6조 (결제수단 및 결제대행)">
        <p>
          회사의 유료 서비스 결제는 {companyInfo.pgProvider}를 통한 전자결제로 이루어지며, 결제 관련 개인정보 처리는
          {companyInfo.pgProvider}의 정책을 따릅니다.
        </p>
      </LegalSection>

      <LegalSection title="제7조 (문의처)">
        <p>
          환불 및 청약철회와 관련한 문의는 아래로 연락해 주시기 바랍니다.
        </p>
        <p>
          고객센터: {companyInfo.csEmail} / {companyInfo.csPhone}<br />
          운영시간: {companyInfo.csHours}
        </p>
      </LegalSection>

      <LegalSection title="부칙">
        <p>이 환불규정은 {companyInfo.effectiveDate}부터 시행합니다.</p>
      </LegalSection>
    </LegalDoc>
  );
}
