import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { companyInfo } from "@/lib/companyInfo";

export const metadata: Metadata = {
  title: "이용안내 — 시니어 든든은 이런 곳이에요",
  description:
    "시니어 든든의 콘텐츠 이용안내입니다. 모든 연습은 실제 결제가 되지 않는 모의 화면이며, 회원가입 없이 무료로 사용할 수 있습니다. 광고·제휴 안내도 함께 확인하세요.",
  alternates: { canonical: "/guide" },
};

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ background: "#fff", border: "1.5px solid #EFE3CC", borderRadius: 18, padding: "24px 22px", marginBottom: 14 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#3B3226", marginBottom: 12 }}>{title}</h2>
      <div style={{ fontSize: 16, color: "#4A5568", lineHeight: 1.8 }}>{children}</div>
    </section>
  );
}

export default function GuidePage() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px 56px" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{ fontSize: "clamp(24px,5vw,34px)", fontWeight: 800, color: "#3B3226", lineHeight: 1.3, letterSpacing: "-0.5px", marginBottom: 12 }}>
            이용안내
          </h1>
          <p style={{ fontSize: 17, color: "#4A5568", lineHeight: 1.7 }}>
            시니어 든든은 생활 속 디지털 기기를 실제처럼 연습하고,
            <br />
            놀이처럼 반복해서 익히는 <strong>무료 연습 공간</strong>입니다.
          </p>
        </div>

        <Section title="눌러보고, 실수하고, 다시 해보세요">
          <p>
            모든 키오스크 화면은 <strong>연습용 모의 화면</strong>이에요. 실제 주문, 접수, 발급, 송금, 결제가 전혀
            이루어지지 않으니 몇 번을 잘못 눌러도 아무 일도 생기지 않아요. 마음 편하게, 익숙해질 때까지 여러 번
            연습하세요.
          </p>
        </Section>

        <Section title="실제 기기와는 조금 다를 수 있어요">
          <p>
            연습 화면은 여러 실제 기기의 공통 구조를 재구성한 것이에요. 실제 기기의 화면 구성과 순서는 기기 제조사,
            운영기관, 매장, 시기에 따라 달라질 수 있어요. 버튼 위치를 외우기보다{" "}
            <strong>화면에서 필요한 버튼을 찾는 힘</strong>을 기른다고 생각하시면 딱 좋아요. 화면 속 든든카페·든든주차
            같은 이름은 저희가 만든 가상 브랜드로, 실제 매장과는 관련이 없어요.
          </p>
        </Section>

        <Section title="회원가입 없이, 전부 무료예요">
          <p>
            시니어 든든은 회원가입 기능을 운영하지 않아요. 연습 기록과 도장은 지금 쓰고 계신 휴대전화·태블릿의
            브라우저에만 저장되고, 서버로 전송되지 않아요. 브라우저의 인터넷 기록을 지우면 연습 기록도 함께
            지워져요. 내 기록은 <Link href="/records" style={{ color: "#C4621A", fontWeight: 700 }}>내 기록 페이지</Link>에서
            볼 수 있어요.
          </p>
        </Section>

        <Section id="ads" title="광고·제휴 안내">
          <p>
            이 사이트의 일부 페이지에는 <strong>쿠팡 파트너스 링크</strong>가 포함되어 있으며, 해당 링크로 구매가
            발생하면 운영자가 일정액의 수수료를 제공받을 수 있어요. 광고가 들어가는 영역에는 항상 광고임을 표시하고,
            연습 진행 화면 안에는 광고를 넣지 않아요. 광고를 누르지 않아도 모든 기능을 그대로 사용할 수 있고, 상품
            구매 여부는 서비스 이용에 아무 영향을 주지 않아요.
          </p>
          <p style={{ marginTop: 10 }}>
            상품은 화면 크기, 조작 편의성, 제품 설명의 명확성을 기준으로 골라 소개해요. 가격과 배송 조건은 바뀔 수
            있으니 쿠팡 상품 페이지에서 확인하세요. 쿠팡 링크를 누르면 쿠팡 사이트로 이동하며, 이동한 뒤의 개인정보
            처리는 쿠팡의 개인정보처리방침을 따라요.
          </p>
        </Section>

        <Section title="문의하기">
          <p>
            서비스에 대한 의견이나 불편한 점은 이메일로 알려주세요.
            <br />
            운영 이메일: <a href={`mailto:${companyInfo.csEmail}`} style={{ color: "#C4621A", fontWeight: 700 }}>{companyInfo.csEmail}</a>
          </p>
        </Section>

        <p style={{ fontSize: 14, color: "#9B9890", textAlign: "center", lineHeight: 1.7, marginTop: 20 }}>
          자세한 내용은 <Link href="/legal/terms" style={{ color: "#6B6860" }}>이용약관</Link>과{" "}
          <Link href="/legal/privacy" style={{ color: "#6B6860" }}>개인정보처리방침</Link>을 확인하세요.
        </p>
      </main>
      <Footer />
    </>
  );
}
