import Link from "next/link";

// 계산기·체크리스트 등 실용 도구 모음 — 큰 글씨 링크 줄로 단순하게
const tools = [
  { emoji: "💰", label: "노후자금 계산기", desc: "준비 상태를 진단해 드려요", href: "/finance/retirement" },
  { emoji: "🧮", label: "노후 생활비 계산기", desc: "한 달 생활비가 얼마나 필요할까요", href: "/finance/living-cost" },
  { emoji: "💊", label: "복용약 요약표", desc: "드시는 약을 한 장으로 정리해요", href: "/health" },
  { emoji: "📋", label: "부모님 생활 점검표", desc: "가족이 함께 살펴보는 점검표", href: "/life-tips/family-care" },
  { emoji: "🎫", label: "시니어 할인 혜택", desc: "교통·문화·통신 할인 모음", href: "/life-tips/senior-discount" },
];

export default function ToolLinks() {
  return (
    <section className="bg-white px-5 py-10">
      <div className="mx-auto max-w-[720px]">
        <h2 className="text-center text-[clamp(22px,4vw,28px)] font-extrabold tracking-[-0.5px] text-[#3B3226]">
          🧰 든든 도구함
        </h2>
        <p className="mt-2 text-center text-[16px] text-[#8A7660]">필요할 때 꺼내 쓰는 생활 도구예요.</p>
        <div className="mt-6 flex flex-col gap-3">
          {tools.map((t) => (
            <Link
              key={t.href + t.label}
              href={t.href}
              className="flex items-center gap-4 rounded-2xl border border-[#EEECE6] bg-[#FAFAF8] px-5 py-4 no-underline transition-transform active:scale-[0.98]"
            >
              <span className="text-[32px] leading-none" aria-hidden="true">{t.emoji}</span>
              <span className="flex-1">
                <span className="block text-[19px] font-bold text-[#3B3226]">{t.label}</span>
                <span className="block text-[15px] text-[#8A7660]">{t.desc}</span>
              </span>
              <span className="text-[18px] font-extrabold text-[#C4621A]" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
