import Link from "next/link";

// 정보 콘텐츠(검색 유입의 관문) — 놀이터 홈에서는 간단한 카드 4개로만
const categories = [
  { emoji: "🏛️", label: "복지혜택", desc: "기초연금 · 장기요양", href: "/welfare" },
  { emoji: "🏥", label: "건강·병원", desc: "건강검진 · 본인부담금", href: "/health" },
  { emoji: "💰", label: "노후재정", desc: "국민연금 · 생활비", href: "/finance" },
  { emoji: "💡", label: "생활팁", desc: "할인 혜택 · 가족 돌봄", href: "/life-tips" },
];

export default function InfoCategories() {
  return (
    <section className="px-5 py-10">
      <div className="mx-auto max-w-[880px]">
        <h2 className="text-center text-[clamp(22px,4vw,28px)] font-extrabold tracking-[-0.5px] text-[#1A1A2E]">
          📚 알아두면 든든한 정보
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="flex flex-col items-center gap-1.5 rounded-2xl border border-[#EEECE6] bg-white px-4 py-5 text-center no-underline transition-transform active:scale-[0.97]"
            >
              <span className="text-[34px] leading-none" aria-hidden="true">{c.emoji}</span>
              <span className="text-[18px] font-bold text-[#1A1A2E]">{c.label}</span>
              <span className="text-[14px] text-[#6B7280]">{c.desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
