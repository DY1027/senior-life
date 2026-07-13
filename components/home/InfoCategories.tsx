import Image from "next/image";
import Link from "next/link";

// 정보 콘텐츠(검색 유입의 관문) — 놀이터 홈에서는 일러스트 카드 4개로만
const categories = [
  { img: "/tiles/cat-welfare.webp", alt: "동전이 놓인 관공서 건물 그림", label: "복지혜택", desc: "기초연금 · 장기요양", href: "/welfare" },
  { img: "/tiles/cat-health.webp", alt: "청진기가 감싼 하트 그림", label: "건강·병원", desc: "건강검진 · 본인부담금", href: "/health" },
  { img: "/tiles/cat-finance.webp", alt: "웃는 돼지 저금통과 동전 그림", label: "노후재정", desc: "국민연금 · 생활비", href: "/finance" },
  { img: "/tiles/cat-tips.webp", alt: "따뜻하게 빛나는 전구 그림", label: "생활팁", desc: "할인 혜택 · 가족 돌봄", href: "/life-tips" },
];

export default function InfoCategories() {
  return (
    <section className="px-5 py-10">
      <div className="mx-auto max-w-[880px]">
        <h2 className="text-center text-[clamp(22px,4vw,28px)] font-extrabold tracking-[-0.5px] text-[#3B3226]">
          📚 알아두면 든든한 정보
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="flex flex-col overflow-hidden rounded-2xl border border-[#F1E3C8] bg-[#F9F2E0] text-center no-underline transition-transform active:scale-[0.97]"
            >
              <Image src={c.img} alt={c.alt} width={560} height={475} className="h-auto w-full" />
              <span className="px-3 pb-4 pt-1">
                <span className="block text-[18px] font-bold text-[#3B3226]">{c.label}</span>
                <span className="block break-keep text-[14px] text-[#8A7660]">{c.desc}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
