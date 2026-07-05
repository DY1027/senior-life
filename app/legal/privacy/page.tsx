import type { Metadata } from "next";
import LegalDoc from "@/components/legal/LegalDoc";
import LegalSection from "@/components/legal/LegalSection";
import { companyInfo } from "@/lib/companyInfo";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "시니어 든든 개인정보처리방침입니다.",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <LegalDoc
      title="개인정보처리방침"
      effectiveDate={companyInfo.effectiveDate}
      breadcrumb={[{ label: "홈", href: "/" }, { label: "개인정보처리방침" }]}
    >
      <p style={{ fontSize: 13.5, color: "#4A4844", lineHeight: 1.75, marginBottom: 24 }}>
        {companyInfo.companyName}(이하 &quot;회사&quot;)는 이용자의 개인정보를 중요시하며, 「개인정보 보호법」 등
        관련 법령을 준수하고 있습니다. 회사는 개인정보처리방침을 통하여 이용자가 제공하는 개인정보가 어떠한 목적과
        방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.
      </p>

      <LegalSection title="1. 수집하는 개인정보의 항목 및 수집방법">
        <p>
          회사는 회원가입, 서비스 이용, 고객상담 등을 위해 다음과 같은 개인정보를 수집할 수 있습니다.
        </p>
        <p>
          가. 필수항목: 이메일, 비밀번호, 이름<br />
          나. 선택항목: 연락처, 생년월일<br />
          다. 결제 시 수집항목: {companyInfo.pgProvider} 등 전자결제 대행사를 통해 처리되며, 회사는 카드번호 등 결제
          정보를 직접 저장하지 않습니다.<br />
          라. 자동 수집항목: IP 주소, 쿠키, 접속 로그, 서비스 이용 기록
        </p>
        <p>수집방법: 홈페이지 회원가입 및 서비스 이용 과정에서 이용자가 직접 입력, 생성정보 수집 툴을 통한 자동 수집</p>
      </LegalSection>

      <LegalSection title="2. 개인정보의 수집 및 이용목적">
        <p>
          가. 회원 관리: 회원제 서비스 이용에 따른 본인확인, 개인식별, 부정이용 방지<br />
          나. 서비스 제공: 콘텐츠 제공, 맞춤형 정보 안내, 유료 상품 결제 및 요금정산<br />
          다. 마케팅 및 광고 활용: 신규 서비스 안내, 이벤트 정보 제공 (이용자가 별도로 동의한 경우에 한함)
        </p>
      </LegalSection>

      <LegalSection title="3. 개인정보의 보유 및 이용기간">
        <p>
          회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 다만 관계 법령의
          규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계 법령에서 정한 일정한 기간 동안 회원정보를
          보관합니다.
        </p>
        <p>
          가. 계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래 등에서의 소비자보호에 관한 법률)<br />
          나. 대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래 등에서의 소비자보호에 관한 법률)<br />
          다. 소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래 등에서의 소비자보호에 관한 법률)<br />
          라. 접속에 관한 기록: 3개월 (통신비밀보호법)
        </p>
      </LegalSection>

      <LegalSection title="4. 개인정보의 파기절차 및 방법">
        <p>
          이용자가 입력한 개인정보는 목적이 달성된 후 별도의 데이터베이스로 옮겨져(종이의 경우 별도의 서류함) 내부 방침
          및 관련 법령에 의한 정보보호 사유에 따라 일정 기간 저장된 후 파기됩니다. 전자적 파일 형태의 정보는 기록을
          재생할 수 없는 기술적 방법을 사용하여 삭제하며, 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여
          파기합니다.
        </p>
      </LegalSection>

      <LegalSection title="5. 개인정보의 제3자 제공">
        <p>
          회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만 아래의 경우에는 예외로 합니다.
        </p>
        <p>
          가. 이용자가 사전에 제3자 제공에 동의한 경우<br />
          나. 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우
        </p>
      </LegalSection>

      <LegalSection title="6. 개인정보처리 위탁">
        <p>
          회사는 원활한 서비스 제공을 위하여 아래와 같이 개인정보 처리업무를 위탁하고 있으며, 관계 법령에 따라 위탁계약
          시 개인정보가 안전하게 관리될 수 있도록 필요한 사항을 규정하고 있습니다.
        </p>
        <p>
          가. 수탁업체: {companyInfo.pgProvider}<br />
          위탁업무 내용: 전자결제 및 결제대금 정산<br />
          나. 수탁업체: [호스팅/인프라 제공업체]<br />
          위탁업무 내용: 서비스 운영을 위한 서버 호스팅
        </p>
      </LegalSection>

      <LegalSection title="7. 이용자 및 법정대리인의 권리와 그 행사방법">
        <p>
          이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며, 가입해지(동의철회)를 요청할 수도
          있습니다. 개인정보 조회, 수정, 가입해지 요청은 고객센터({companyInfo.csEmail} / {companyInfo.csPhone})를 통해
          하실 수 있습니다.
        </p>
      </LegalSection>

      <LegalSection title="8. 쿠키(Cookie)의 운영 및 거부에 관한 사항">
        <p>
          회사는 이용자에게 맞춤형 서비스를 제공하기 위해 쿠키를 사용할 수 있습니다. 이용자는 웹브라우저 옵션 설정을
          통해 쿠키 저장을 거부할 수 있으며, 이 경우 일부 서비스 이용에 어려움이 발생할 수 있습니다.
        </p>
      </LegalSection>

      <LegalSection title="9. 개인정보의 안전성 확보조치">
        <p>
          회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
        </p>
        <p>
          가. 관리적 조치: 개인정보 취급 직원의 최소화 및 정기적인 교육<br />
          나. 기술적 조치: 개인정보처리시스템 접근권한 관리, 비밀번호 암호화, 접속기록의 보관<br />
          다. 물리적 조치: 전산실, 자료보관실 등의 접근통제
        </p>
      </LegalSection>

      <LegalSection title="10. 개인정보 보호책임자">
        <p>
          회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 이용자의 불만처리 및 피해구제
          등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
        </p>
        <p>
          성명: {companyInfo.privacyOfficer.name}<br />
          직책: {companyInfo.privacyOfficer.position}<br />
          이메일: {companyInfo.privacyOfficer.email}
        </p>
      </LegalSection>

      <LegalSection title="부칙">
        <p>이 개인정보처리방침은 {companyInfo.effectiveDate}부터 시행합니다.</p>
      </LegalSection>
    </LegalDoc>
  );
}
