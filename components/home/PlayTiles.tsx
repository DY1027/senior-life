import Link from "next/link";

// 홈의 심장 — 큰 타일 4개. 어르신이 고민 없이 하나를 고를 수 있게 최대 4개만 둔다.
const tiles = [
  {
    emoji: "🖐️",
    title: "키오스크 연습",
    desc: "카페 · 병원 접수 · 햄버거 · 서류 발급, 집에서 미리 눌러 봐요",
    href: "/kiosk",
    badge: "4가지 연습",
    bg: "bg-[#EAF3FC]",
    border: "border-[#BBD9F5]",
    badgeStyle: "bg-[#1B6FC8] text-white",
  },
  {
    emoji: "🏛️",
    title: "내 혜택 찾아보기",
    desc: "몇 가지만 답하면 받을 수 있는 복지혜택을 알려드려요",
    href: "/welfare",
    badge: null,
    bg: "bg-[#F0FDF4]",
    border: "border-[#A7F3D0]",
    badgeStyle: "",
  },
  {
    emoji: "🏥",
    title: "병원 갈 준비",
    desc: "챙길 것과 의사에게 물어볼 질문을 정리해 드려요",
    href: "/health/hospital-checklist",
    badge: null,
    bg: "bg-[#F0F7FF]",
    border: "border-[#BFDBFE]",
    badgeStyle: "",
  },
  {
    emoji: "🧩",
    title: "두뇌 놀이",
    desc: "기억력 게임과 오늘의 문제로 즐겁게 두뇌 운동해요",
    href: null, // 준비 중
    badge: "곧 열려요",
    bg: "bg-[#FEF3E8]",
    border: "border-[#FDDFC0]",
    badgeStyle: "bg-[#E67E3F] text-white",
  },
];

function TileInner({ t }: { t: (typeof tiles)[number] }) {
  return (
    <>
      <div className="flex items-start justify-between">
        <span className="text-[46px] leading-none" aria-hidden="true">{t.emoji}</span>
        {t.badge && (
          <span className={`rounded-full px-3 py-1 text-[13px] font-bold ${t.badgeStyle}`}>{t.badge}</span>
        )}
      </div>
      <p className="mt-3 text-[23px] font-extrabold leading-snug text-[#1A1A2E]">{t.title}</p>
      <p className="mt-1.5 text-[16px] leading-relaxed text-[#4A5568]">{t.desc}</p>
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
              className={`block rounded-3xl border-2 p-6 no-underline transition-transform active:scale-[0.98] ${t.bg} ${t.border}`}
            >
              <TileInner t={t} />
              <p className="mt-3 text-[16px] font-extrabold text-[#1B6FC8]">시작하기 →</p>
            </Link>
          ) : (
            <div key={t.title} className={`rounded-3xl border-2 p-6 opacity-90 ${t.bg} ${t.border}`}>
              <TileInner t={t} />
              <p className="mt-3 text-[15px] font-bold text-[#9B9890]">열심히 만들고 있어요</p>
            </div>
          )
        )}
      </div>
    </section>
  );
}
