// 놀이터 홈 히어로 — 짧고 따뜻하게. 긴 설명 대신 "오늘 뭘 해볼까" 하나만 묻는다.
export default function PlaygroundHero() {
  return (
    <section className="bg-gradient-to-b from-[#FFF3E6] to-[#F7F6F3] px-5 pt-12 pb-8 text-center">
      <div className="mx-auto max-w-[720px]">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDDFC0] px-4 py-1.5 text-[15px] font-bold text-[#C4621A]">
          🛝 시니어 놀이터
        </span>
        <h1 className="mt-4 text-[clamp(30px,6vw,44px)] font-extrabold leading-[1.25] tracking-[-0.5px] text-[#1A1A2E]">
          오늘은 뭘 해볼까요?
        </h1>
        <p className="mt-3 text-[clamp(17px,2.5vw,19px)] leading-relaxed text-[#4A5568]">
          눌러보고, 배워보고, 확인해 보세요.
          <br />
          회원가입 없이 <strong className="text-[#C4621A]">전부 무료</strong>입니다.
        </p>
      </div>
    </section>
  );
}
