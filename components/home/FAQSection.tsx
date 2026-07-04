"use client";
import { useState } from "react";

const faqs = [
  { q: "회원가입은 어떻게 하나요?", a: "상단 '회원가입' 버튼을 클릭하여 이름, 생년월일, 연락처를 입력하시면 간단하게 가입하실 수 있습니다. 카카오 소셜 로그인도 지원합니다." },
  { q: "노후자금 계산기는 어떻게 사용하나요?", a: "현재 나이, 은퇴 희망 나이, 월 생활비, 기대 수명을 입력하시면 필요 노후자금과 월 저축 목표를 자동으로 계산해 드립니다." },
  { q: "복약 알림은 어떻게 설정하나요?", a: "마이페이지 > 복약 관리에서 복용 중인 약 이름, 복용 시간, 횟수를 입력하시면 매일 알림을 받으실 수 있습니다. 카카오 알림톡으로도 받으실 수 있습니다." },
  { q: "내 정보는 안전한가요?", a: "개인정보보호법에 따라 모든 개인정보는 암호화하여 저장하며, 제3자에게 제공되지 않습니다. 언제든지 정보 삭제를 요청하실 수 있습니다." },
  { q: "카카오 알림은 어떻게 받나요?", a: "마이페이지 > 알림 설정에서 카카오 채널을 연결하시면 복약 알림, 검진 일정 등 중요한 정보를 카카오톡으로 받으실 수 있습니다." },
  { q: "고객센터 운영 시간은 어떻게 되나요?", a: "평일 오전 9시부터 오후 6시까지 운영합니다. 점심시간(12시~13시)은 제외됩니다. 1:1 문의는 24시간 접수 가능하며, 다음 영업일에 답변해 드립니다." },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section style={{ background: "#FAF8F5", padding: "72px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#1B6FC8", marginBottom: 8, letterSpacing: "0.06em" }}>FAQ</p>
        <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: "#1A1A2E", letterSpacing: "-0.5px", marginBottom: 36 }}>자주 묻는 질문</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 14, border: `1.5px solid ${open === i ? "#1B6FC8" : "#E8F0FE"}`, overflow: "hidden", transition: "border-color 0.15s" }}>
              <button onClick={() => setOpen(open === i ? null : i)}
                style={{ width: "100%", padding: "18px 20px", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, textAlign: "left" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1B6FC8", flexShrink: 0 }}>Q.</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#1A1A2E" }}>{f.q}</span>
                </span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A5568" strokeWidth="2" style={{ flexShrink: 0, transform: open === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {open === i && (
                <div style={{ padding: "0 20px 18px", borderTop: "1px solid #E8F0FE" }}>
                  <p style={{ fontSize: 14, color: "#4A5568", lineHeight: 1.75, paddingTop: 14 }}>{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:768px){div[style*="1fr 1fr"]{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}
