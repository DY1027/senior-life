import type { Metadata } from "next";
import LegalDoc from "@/components/legal/LegalDoc";
import LegalSection from "@/components/legal/LegalSection";
import { companyInfo } from "@/lib/companyInfo";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "시니어 든든 개인정보처리방침입니다.",
  robots: { index: false, follow: false },
};

// 2026-07-15 전면 개정 — 회원가입·결제 기능을 없앤 실제 운영과 일치하도록 축소.
// 실제로 처리하는 항목(자동 수집·기기 저장·통계 도구)만 기재한다.
// 연습 기록(lib/progress.ts)과 글자 크게 설정은 localStorage에만 저장되고 서버로
// 전송되지 않는다 — 이 구조가 바뀌면 "3. 기기에 저장되는 정보" 문구도 함께 고칠 것.
export default function PrivacyPage() {
  return (
    <LegalDoc
      title="개인정보처리방침"
      effectiveDate={companyInfo.effectiveDate}
      breadcrumb={[{ label: "홈", href: "/" }, { label: "개인정보처리방침" }]}
    >
      <p style={{ fontSize: 13.5, color: "#4A4844", lineHeight: 1.75, marginBottom: 24 }}>
        {companyInfo.companyName}(이하 &quot;운영자&quot;)는 「개인정보 보호법」 등 관련 법령을 준수하며, 이용자의
        개인정보를 최소한으로만 처리합니다. 이 방침은 서비스에서 어떤 정보가 어떻게 처리되는지 알려드립니다.
      </p>

      <LegalSection title="1. 직접 수집하는 개인정보">
        <p>
          시니어 든든은 회원가입 기능을 운영하지 않으며, 서비스 이용을 위해 이름, 전화번호, 이메일 등 개인정보를
          직접 수집하지 않습니다. 별도의 문의 양식도 운영하지 않으며, 이용자가 운영 이메일로 문의하는 경우 회신을
          위해 보낸 분의 이메일 주소와 문의 내용이 메일함에 보관됩니다.
        </p>
      </LegalSection>

      <LegalSection title="2. 자동으로 수집되는 정보">
        <p>
          서비스 이용 과정에서 다음 정보가 자동으로 수집될 수 있습니다.
        </p>
        <p>
          가. 접속 IP 주소, 브라우저 및 기기 정보, 접속 일시, 방문 페이지<br />
          나. 쿠키: 서비스 이용 통계를 위해 사용될 수 있으며, 이용자는 브라우저 설정에서 쿠키 저장을 거부할 수
          있습니다.
        </p>
        <p>
          이 정보는 다음 도구를 통해 처리됩니다.
        </p>
        <p>
          가. Vercel Inc. — 서비스 호스팅 및 접속 처리<br />
          나. Google Analytics(Google LLC) — 방문 통계 분석 (개인을 식별하지 않는 통계 목적)
        </p>
      </LegalSection>

      <LegalSection title="3. 기기에 저장되는 정보">
        <p>
          연습 완료 기록(연습 종류·완료 횟수)과 글자 크게 등의 환경설정은 이용자의 브라우저(localStorage)에 저장될
          수 있습니다. 이 정보는 서버로 전송되지 않는 구조이며, 브라우저의 인터넷 사용 기록을 삭제하면 함께
          삭제됩니다. 사진 달력 만들기에 사용한 사진도 서버로 전송되지 않고 이용자의 기기에서만 처리됩니다.
        </p>
      </LegalSection>

      <LegalSection title="4. 외부 링크(쿠팡 파트너스)">
        <p>
          서비스 일부에는 쿠팡 파트너스 링크가 포함되어 있습니다. 해당 링크를 선택하면 쿠팡 사이트로 이동하며, 이동
          이후의 개인정보 처리는 쿠팡의 개인정보처리방침에 따릅니다. 운영자는 링크 이동 과정에서 이용자의
          개인정보를 쿠팡에 제공하지 않습니다.
        </p>
      </LegalSection>

      <LegalSection title="5. 개인정보의 보유 및 파기">
        <p>
          운영자는 개인정보를 직접 수집·보관하는 데이터베이스를 운영하지 않습니다. 이메일 문의 내용은 회신 완료 후
          필요가 없어지면 지체 없이 삭제하며, 접속 기록 등 자동 수집 정보는 각 처리 도구(호스팅·통계 서비스)의
          보관 정책에 따라 일정 기간 후 삭제됩니다.
        </p>
      </LegalSection>

      <LegalSection title="6. 이용자의 권리">
        <p>
          이용자는 언제든지 브라우저 설정을 통해 쿠키 저장을 거부하거나 기기에 저장된 기록을 삭제할 수 있으며,
          이메일 문의 내용의 삭제를 운영 이메일로 요청할 수 있습니다.
        </p>
      </LegalSection>

      <LegalSection title="7. 개인정보 보호책임자">
        <p>
          개인정보 처리에 관한 문의는 아래로 연락해 주세요.
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
