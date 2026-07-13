import Image from "next/image";
import Link from "next/link";

// 홈의 심장 — 일러스트 큰 타일 4개. 어르신이 고민 없이 하나를 고를 수 있게 최대 4개만 둔다.
// 타일 배경은 일러스트의 크림색과 이어지게 맞춰 그림책 느낌을 낸다.
const tiles = [
  {
    img: "/tiles/tile-kiosk.webp",
    alt: "할머니가 든든이와 함께 키오스크 버튼을 누르는 그림",
    title: "키오스크 연습",
    desc: "카페 · 병원 접수 · 햄버거 · 서류 발급, 집에서 미리 눌러 봐요",
    href: "/kiosk",
    badge: "4가지 연습",
    border: "border-[#EFDFC0]",
    badgeStyle: "bg-[#E67E3F] text-white",
    cta: "해보기 →",
  },
  {
    img: "/tiles/tile-benefit.webp",
    alt: "할아버지가 든든이와 함께 선물상자를 열어보는 그림",
    title: "내 혜택 찾아보기",
    desc: "몇 가지만 답하면 받을 수 있는 복지혜택을 알려드려요",
    href: "/welfare",
    badge: null,
    border: "border-[#DCE8CE]",
    badgeStyle: "",
    cta: "찾아보기 →",
  },
  {
    img: "/tiles/tile-hospital.webp",
    alt: "할머니가 병원 갈 가방을 챙기고 든든이가 점검표를 물고 있는 그림",
    title: "병원 갈 준비",
    desc: "챙길 것과 의사에게 물어볼 질문을 정리해 드려요",
    href: "/health/hospital-checklist",
    badge: null,
    border: "border-[#EFDFC0]",
    badgeStyle: "",
    cta: "준비하기 →",
  },
  {
    img: "/tiles/tile-brain.webp",
    alt: "할아버지가 든든이와 함께 퍼즐을 맞추는 그림",
    title: "두뇌 놀이",
    desc: "기억력 게임과 오늘의 문제로 즐겁게 두뇌 운동해요",
    href: null, // 준비 중
    badge: "곧 열려요",
    border: "border-[#FDDFC0]",
    badgeStyle: "bg-[#E67E3F] text-white",
    cta: "",
  },
];

function TileInner({ t }: { t: (typeof tiles)[number] }) {
  return (
    <>
      <div className="relative">
        <Image src={t.img} alt={t.alt} width={720} height={570} className="h-auto w-full" />
        {t.badge && (
          <span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[13px] font-bold ${t.badgeStyle}`}>{t.badge}</span>
        )}
      </div>
      <div className="px-6 pb-6 pt-1 text-center">
        <p className="text-[23px] font-extrabold leading-snug text-[#3B3226]">{t.title}</p>
        <p className="mt-1.5 text-[16px] leading-relaxed text-[#6E5C49]">{t.desc}</p>
        {t.href ? (
          <p className="mt-3 text-[17px] font-extrabold text-[#C4621A]">{t.cta}</p>
        ) : (
          <p className="mt-3 text-[15px] font-bold text-[#9B9890]">든든이가 열심히 만들고 있어요</p>
        )}
      </div>
    </>
  );
}

export default function PlayTiles() {
  return (
    <section className="px-5 pb-4">
      <div className="mx-auto grid max-w-[880px] grid-cols-1 gap-4 sm:grid-cols-2">
        {tiles.map((t) =>
          t.href ? (
            <Link
              key={t.title}
              href={t.href}
              className={`block overflow-hidden rounded-3xl border-2 bg-[#F9F2E0] no-underline transition-transform active:scale-[0.98] ${t.border}`}
            >
              <TileInner t={t} />
            </Link>
          ) : (
            <div key={t.title} className={`overflow-hidden rounded-3xl border-2 bg-[#F9F2E0] ${t.border}`}>
              <TileInner t={t} />
            </div>
          )
        )}
      </div>
    </section>
  );
}
