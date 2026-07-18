import Image from "next/image";
import { PrimaryAction } from "@/components/dundun-design/PrimaryAction";

// 쇼핑연습 홈 카드 이미지 교체 위치:
// public/images/shopping/hero/online-shopping-practice-home.jpg 파일을 같은 이름으로 교체하거나,
// 파일명이 달라지면 아래 경로 한 곳만 수정하세요.
const SHOPPING_PRACTICE_IMAGE = "/images/shopping/hero/online-shopping-practice-home.jpg";

export default function ShoppingPracticeBanner() {
  return (
    <section className="dd-section" aria-labelledby="shopping-practice-home-title">
      <div className="dd-shell dd-new-practice">
        <div className="dd-new-practice-image">
          <Image
            src={SHOPPING_PRACTICE_IMAGE}
            alt="거실 화면에서 생활용품을 살펴보는 어르신과 든든이"
            fill
            sizes="(max-width: 767px) 100vw, 48vw"
            className="object-cover"
          />
        </div>
        <div className="dd-new-practice-copy !order-none">
          <p className="dd-eyebrow">새로운 연습</p>
          <h2 id="shopping-practice-home-title" className="!text-[clamp(28px,3.2vw,42px)]">
            온라인 쇼핑을 천천히 연습해요
          </h2>
          <p>상품 찾기부터 주문 확인까지 안전하게 연습할 수 있어요.</p>
          <PrimaryAction href="/shopping">쇼핑연습 시작하기</PrimaryAction>
        </div>
      </div>
    </section>
  );
}
