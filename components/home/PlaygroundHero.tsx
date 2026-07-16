import Image from "next/image";
import Link from "next/link";
import { dailyMissionUrl, todayMission } from "@/lib/daily-missions";

// 계절에 따라 마을 풍경이 옷을 갈아입는다 (봄·여름 → 초록, 가을 → 단풍, 겨울 → 눈).
// 홈 페이지는 하루 단위 ISR(revalidate)이라 계절 전환이 하루 안에 반영된다.
function seasonBg(): string {
  const m = new Date().getMonth() + 1;
  if (m >= 9 && m <= 11) return "/bg-village-autumn.webp";
  if (m === 12 || m <= 2) return "/bg-village-winter.webp";
  return "/bg-village.webp";
}

// 놀이터 홈 히어로 — 첫 화면은 광고·정보 없이 "무엇을 하는 곳인지"와 시작 버튼만.
export default function PlaygroundHero() {
  const mission = todayMission();
  const missionHref = dailyMissionUrl(mission);

  return (
    <section className="bg-[#FDF7E7]">
      {/* 마을 풍경 */}
      <div className="relative h-[220px] w-full overflow-hidden sm:h-[290px] md:h-[350px]">
        <Image
          src={seasonBg()}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_38%]"
        />
      </div>

      {/* 풍경 위에 겹쳐 앉는 가족 컷 + 인사말 */}
      <div className="relative -mt-16 px-5 pb-6 text-center sm:-mt-24">
        <div className="dd-float mx-auto w-[190px] sm:w-[230px]">
          <Image
            src="/hero.webp"
            alt="어르신 부부가 든든이와 함께 태블릿을 보며 웃는 그림"
            width={230}
            height={196}
            priority
            className="h-auto w-full rounded-3xl shadow-[0_10px_28px_rgba(120,84,40,0.18)] ring-4 ring-white/80"
          />
        </div>
        <div className="dd-rise mx-auto mt-4 max-w-[720px]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDDFC0] px-4 py-1.5 text-[15px] font-bold text-[#C4621A]">
            🛝 시니어 디지털 놀이터
          </span>
          <h1 className="mt-3 text-[clamp(28px,5.5vw,42px)] font-extrabold leading-[1.25] tracking-[-0.5px] text-[#3B3226]">
            실제처럼 눌러보는
            <br />
            디지털 생활 놀이터
          </h1>
          <p className="mt-3 text-[clamp(17px,2.5vw,19px)] leading-relaxed text-[#6E5C49]">
            카페 주문부터 주차요금 정산까지.
            <br />
            실제 결제 없이, <strong className="text-[#C4621A]">큰 글씨와 음성 안내</strong>로 천천히 연습하세요.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={missionHref}
              className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-[#E67E3F] px-8 text-[18px] font-extrabold text-white no-underline transition-transform active:scale-[0.97]"
            >
              오늘의 연습 시작 →
            </Link>
            <Link
              href="/kiosk"
              className="inline-flex min-h-[56px] items-center justify-center rounded-full border-2 border-[#EFDFC0] bg-white px-8 text-[18px] font-bold text-[#3B3226] no-underline transition-transform active:scale-[0.97]"
            >
              모든 연습 둘러보기
            </Link>
          </div>
        </div>
      </div>

      {/* 본문 배경(아이보리)으로 자연스럽게 이어지기 */}
      <div className="h-10 bg-gradient-to-b from-[#FDF7E7] to-[#F7F6F3]" />

      <style>{`
        @keyframes ddFloat { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
        @keyframes ddRise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
        .dd-float { animation: ddFloat 5s ease-in-out infinite }
        .dd-rise { animation: ddRise .7s ease-out both }
        @media (prefers-reduced-motion: reduce) { .dd-float, .dd-rise { animation: none } }
      `}</style>
    </section>
  );
}
