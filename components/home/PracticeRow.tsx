import Link from "next/link";

// 완성된 키오스크 4종으로 바로 들어가는 지름길 카드
const practices = [
  { emoji: "☕", label: "카페 주문", href: "/kiosk/cafe" },
  { emoji: "🏥", label: "병원 접수", href: "/kiosk/hospital" },
  { emoji: "🍔", label: "햄버거 주문", href: "/kiosk/fastfood" },
  { emoji: "🏛️", label: "서류 발급", href: "/kiosk/civil" },
];

export default function PracticeRow() {
  return (
    <section className="px-5 py-10">
      <div className="mx-auto max-w-[880px]">
        <h2 className="text-center text-[clamp(22px,4vw,28px)] font-extrabold tracking-[-0.5px] text-[#1A1A2E]">
          오늘의 연습, 바로 시작해요
        </h2>
        <p className="mt-2 text-center text-[16px] leading-relaxed text-[#6B7280]">
          실수해도 괜찮아요. 실제로 결제되지 않는 <strong>연습용 화면</strong>이에요.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {practices.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="flex flex-col items-center gap-2 rounded-2xl border-2 border-[#BBD9F5] bg-white px-4 py-6 no-underline transition-transform active:scale-[0.97]"
            >
              <span className="text-[40px] leading-none" aria-hidden="true">{p.emoji}</span>
              <span className="break-keep text-center text-[18px] font-extrabold text-[#1A1A2E]">{p.label}</span>
              <span className="text-[14px] font-bold text-[#1B6FC8]">연습하기 →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
