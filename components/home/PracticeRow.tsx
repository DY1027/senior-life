import Image from "next/image";
import Link from "next/link";

// 완성된 키오스크 4종으로 바로 들어가는 지름길 카드 (일러스트 썸네일)
const practices = [
  { img: "/tiles/kiosk-cafe.webp", alt: "김이 나는 커피와 카페 키오스크 그림", label: "카페 주문", href: "/kiosk/cafe" },
  { img: "/tiles/kiosk-hospital.webp", alt: "청진기와 병원 접수 키오스크 그림", label: "병원 접수", href: "/kiosk/hospital" },
  { img: "/tiles/kiosk-fastfood.webp", alt: "햄버거와 감자튀김, 주문 키오스크 그림", label: "햄버거 주문", href: "/kiosk/fastfood" },
  { img: "/tiles/kiosk-civil.webp", alt: "서류가 나오는 무인민원발급기 그림", label: "서류 발급", href: "/kiosk/civil" },
];

export default function PracticeRow() {
  return (
    <section className="px-5 py-10">
      <div className="mx-auto max-w-[880px]">
        <h2 className="text-center text-[clamp(22px,4vw,28px)] font-extrabold tracking-[-0.5px] text-[#3B3226]">
          오늘의 연습, 바로 시작해요
        </h2>
        <p className="mt-2 text-center text-[16px] leading-relaxed text-[#8A7660]">
          실수해도 괜찮아요. 실제로 결제되지 않는 <strong>연습용 화면</strong>이에요.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {practices.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="flex flex-col overflow-hidden rounded-2xl border-2 border-[#F1E3C8] bg-[#F9F2E0] no-underline transition-transform active:scale-[0.97]"
            >
              <Image src={p.img} alt={p.alt} width={560} height={443} className="h-auto w-full" />
              <span className="px-3 pb-4 pt-1 text-center">
                <span className="block break-keep text-[18px] font-extrabold text-[#3B3226]">{p.label}</span>
                <span className="mt-0.5 block text-[14px] font-bold text-[#C4621A]">연습하기 →</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
