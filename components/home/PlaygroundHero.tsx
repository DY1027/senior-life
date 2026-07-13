import Image from "next/image";

// 놀이터 홈 히어로 — 그림책 첫 장처럼.
// 마을 풍경(소유자 제공 일러스트)이 화면을 열고, 그 위에 가족 컷과 인사말이 앉는다.
// 배경 하단 크림색(#FDF7E7)을 섹션 배경으로 이어 붙여 그림과 화면의 경계를 없앤다.
export default function PlaygroundHero() {
  return (
    <section className="bg-[#FDF7E7]">
      {/* 마을 풍경 */}
      <div className="relative h-[220px] w-full overflow-hidden sm:h-[290px] md:h-[350px]">
        <Image
          src="/bg-village.webp"
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
            🛝 시니어 놀이터
          </span>
          <h1 className="mt-3 text-[clamp(30px,6vw,44px)] font-extrabold leading-[1.25] tracking-[-0.5px] text-[#3B3226]">
            오늘은 뭘 해볼까요?
          </h1>
          <p className="mt-3 text-[clamp(17px,2.5vw,19px)] leading-relaxed text-[#6E5C49]">
            눌러보고, 배워보고, 확인해 보세요.
            <br />
            회원가입 없이 <strong className="text-[#C4621A]">전부 무료</strong>입니다.
          </p>
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
