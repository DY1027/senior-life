import type { Metadata } from "next";
import LegalDoc from "@/components/legal/LegalDoc";
import LegalSection from "@/components/legal/LegalSection";
import { companyInfo } from "@/lib/companyInfo";

export const metadata: Metadata = {
  title: "이용약관",
  description: "시니어 든든 서비스 이용약관입니다.",
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return (
    <LegalDoc
      title="이용약관"
      effectiveDate={companyInfo.effectiveDate}
      breadcrumb={[{ label: "홈", href: "/" }, { label: "이용약관" }]}
    >
      <LegalSection title="제1조 (목적)">
        <p>
          이 약관은 {companyInfo.companyName}(이하 &quot;회사&quot;)가 제공하는 시니어 든든 서비스(이하 &quot;서비스&quot;)의
          이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
        </p>
      </LegalSection>

      <LegalSection title="제2조 (정의)">
        <p>
          1. &quot;서비스&quot;란 회사가 웹사이트를 통해 제공하는 복지·건강·노후재정 정보 제공 및 관련 부가 서비스를 말합니다.<br />
          2. &quot;이용자&quot;란 이 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.<br />
          3. &quot;회원&quot;이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 서비스를 지속적으로 이용할 수 있는 자를 말합니다.
        </p>
      </LegalSection>

      <LegalSection title="제3조 (약관의 효력 및 변경)">
        <p>
          1. 이 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력을 발생합니다.<br />
          2. 회사는 관련 법령을 위배하지 않는 범위에서 이 약관을 변경할 수 있으며, 변경 시 적용일자 및 변경사유를 명시하여
          현행약관과 함께 적용일자 7일 전부터 공지합니다. 다만 이용자에게 불리한 변경의 경우 30일 전에 공지합니다.
        </p>
      </LegalSection>

      <LegalSection title="제4조 (서비스의 제공 및 변경)">
        <p>
          1. 회사는 다음과 같은 서비스를 제공합니다.
        </p>
        <p>
          가. 복지·건강·노후재정 관련 정보 제공 서비스<br />
          나. 회사가 자체 개발하거나 제휴를 통해 이용자에게 제공하는 기타 서비스
        </p>
        <p>
          2. 회사는 현재 유료로 판매 중인 상품이 없으며, 향후 유료 상품 또는 서비스를 출시하는 경우 별도의 화면을 통해
          그 내용과 가격을 사전에 고지합니다.
        </p>
      </LegalSection>

      <LegalSection title="제5조 (회원가입)">
        <p>
          1. 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로써 회원가입을
          신청합니다.<br />
          2. 회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다.
        </p>
        <p>
          가. 가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우<br />
          나. 등록 내용에 허위, 기재누락, 오기가 있는 경우<br />
          다. 기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우
        </p>
      </LegalSection>

      <LegalSection title="제6조 (회원 탈퇴 및 자격 상실)">
        <p>
          1. 회원은 언제든지 서비스 내 회원탈퇴 기능 또는 고객센터를 통해 탈퇴를 요청할 수 있으며, 회사는 즉시 회원탈퇴를
          처리합니다.<br />
          2. 회원이 이 약관 및 관계 법령을 위반한 경우, 회사는 회원자격을 제한 또는 상실시킬 수 있습니다.
        </p>
      </LegalSection>

      <LegalSection title="제7조 (유료서비스 및 결제)">
        <p>
          1. 회사가 유료 서비스를 제공하는 경우, 결제는 {companyInfo.pgProvider}를 통한 전자결제 방식으로 진행되며, 관련
          약관 및 정책은 {companyInfo.pgProvider}가 별도로 정하는 바에 따릅니다.<br />
          2. 청약철회, 계약해제·해지 및 환불에 관한 사항은 회사가 별도로 정하는{" "}
          <a href="/legal/refund" style={{ color: "#E67E3F" }}>환불규정</a>에 따릅니다.
        </p>
      </LegalSection>

      <LegalSection title="제8조 (회사의 의무)">
        <p>
          회사는 관련 법령과 이 약관이 금지하거나 미풍양속에 반하는 행위를 하지 않으며, 계속적이고 안정적인 서비스 제공을
          위해 최선을 다하여 노력합니다.
        </p>
      </LegalSection>

      <LegalSection title="제9조 (이용자의 의무)">
        <p>
          이용자는 다음 행위를 하여서는 안 됩니다.
        </p>
        <p>
          가. 타인의 정보 도용<br />
          나. 회사가 게시한 정보의 무단 변경<br />
          다. 회사와 기타 제3자의 저작권 등 지식재산권에 대한 침해<br />
          라. 회사와 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위<br />
          마. 관계 법령에 위배되는 행위
        </p>
      </LegalSection>

      <LegalSection title="제10조 (저작권의 귀속)">
        <p>
          서비스 내에서 회사가 작성한 콘텐츠에 대한 저작권 기타 지식재산권은 회사에 귀속하며, 이용자는 회사의 사전 승낙
          없이 이를 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 할 수
          없습니다.
        </p>
      </LegalSection>

      <LegalSection title="제11조 (면책조항)">
        <p>
          1. 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한
          책임이 면제됩니다.<br />
          2. 회사가 제공하는 정보는 관련 공공기관의 자료를 기반으로 하되 참고용이며, 최종적인 법적 효력이나 정확성에
          대해서는 관계 기관에 확인하여야 합니다.
        </p>
      </LegalSection>

      <LegalSection title="제12조 (분쟁해결 및 관할법원)">
        <p>
          1. 회사와 이용자는 서비스와 관련하여 발생한 분쟁을 원만하게 해결하기 위하여 필요한 노력을 합니다.<br />
          2. 제1항의 노력에도 분쟁이 해결되지 않을 경우 민사소송법상의 관할법원에 소를 제기할 수 있습니다.
        </p>
      </LegalSection>

      <LegalSection title="부칙">
        <p>이 약관은 {companyInfo.effectiveDate}부터 시행합니다.</p>
      </LegalSection>
    </LegalDoc>
  );
}
