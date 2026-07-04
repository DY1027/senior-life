const steps = [
  { num: 1, icon: "🔍", title: "필요한 생활도구 선택", desc: "노후자금 계산기, 병원 체크리스트 등 필요한 도구를 고릅니다." },
  { num: 2, icon: "✏️", title: "간단한 정보 입력", desc: "복잡한 절차 없이 간단한 숫자나 선택만으로 됩니다." },
  { num: 3, icon: "📊", title: "결과와 다음 행동 확인", desc: "숫자만 보여주지 않고, 다음에 무엇을 확인해야 하는지 알려드립니다." },
  { num: 4, icon: "🖨️", title: "복사하거나 인쇄해서 활용", desc: "병원에 가져가거나 가족에게 공유할 수 있습니다." },
];

export default function GuideSteps() {
  return (
    <section style={{ background: "#FAF8F5", padding: "72px 20px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#1B6FC8", marginBottom: 6, letterSpacing: "0.05em" }}>이용 방법</p>
        <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: "#1A1A2E", letterSpacing: "-0.5px", marginBottom: 8 }}>
          처음 이용하는 분도 쉽게 사용할 수 있어요
        </h2>
        <p style={{ fontSize: 15, color: "#4A5568", marginBottom: 44 }}>회원가입 없이 바로 사용할 수 있습니다.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }} className="steps-grid">
          {steps.map((s, i) => (
            <div key={s.num} style={{ position: "relative" }}>
              {i < steps.length - 1 && (
                <div style={{ position: "absolute", top: 36, left: "calc(50% + 36px)", width: "calc(100% - 72px)", height: 2, background: "#DBEAFE", zIndex: 0 }} className="steps-arrow" />
              )}
              <div style={{ background: "#fff", borderRadius: 18, padding: "24px 20px", textAlign: "center", position: "relative", zIndex: 1, border: "1.5px solid #E8F0FE" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#EFF6FF", border: "2px solid #1B6FC8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>
                  {s.icon}
                </div>
                <div style={{ display: "inline-flex", width: 24, height: 24, borderRadius: "50%", background: "#1B6FC8", color: "#fff", fontSize: 12, fontWeight: 700, alignItems: "center", justifyContent: "center", marginBottom: 12 }}>{s.num}</div>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#1A1A2E", marginBottom: 8 }}>{s.title}</p>
                <p style={{ fontSize: 13, color: "#4A5568", lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          .steps-grid{grid-template-columns:1fr 1fr!important;}
          .steps-arrow{display:none!important;}
        }
        @media(max-width:480px){
          .steps-grid{grid-template-columns:1fr!important;}
        }
      `}</style>
    </section>
  );
}
