import Image from "next/image";

// 홈 맨 아래를 닫는 따뜻한 마무리 장면 — 노을 언덕에 앉은 든든이 뒷모습.
export default function ClosingScene() {
  return (
    <section aria-hidden="true">
      <div className="h-8 bg-gradient-to-b from-[#FAF8F5] to-[#FBF3E6]" />
      <div className="relative bg-[#FBF3E6]">
        <Image
          src="/footer-dog.webp"
          alt=""
          width={1376}
          height={768}
          sizes="100vw"
          className="h-auto w-full"
        />
        <p className="absolute bottom-[4%] left-0 right-0 text-center text-[clamp(15px,2.4vw,19px)] font-bold text-[#8A6D50]">
          오늘도 천천히, 든든하게.
        </p>
      </div>
    </section>
  );
}
