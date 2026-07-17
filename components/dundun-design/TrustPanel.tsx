const trustItems = [
  { icon: "₩", title: "실제 결제 없음", description: "주문·송금·발급이 일어나지 않아요." },
  { icon: "○", title: "로그인 필요 없음", description: "회원가입 없이 바로 시작할 수 있어요." },
  { icon: "↩", title: "실수해도 다시 가능", description: "이전 버튼으로 천천히 돌아가세요." },
] as const;

export function TrustPanel() {
  return (
    <section className="dd-trust" aria-labelledby="trust-title">
      <div className="dd-shell">
        <h2 id="trust-title" className="sr-only">안심하고 연습할 수 있는 이유</h2>
        <div className="dd-trust-grid">
          {trustItems.map((item) => (
            <div key={item.title} className="dd-trust-item">
              <span className="dd-trust-icon" aria-hidden="true">{item.icon}</span>
              <span>
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
