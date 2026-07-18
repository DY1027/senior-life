import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShoppingHubProgress from "@/components/shopping/ShoppingHubProgress";
import { ArrowIcon, CartIcon, CompareIcon, ReturnIcon, SearchIcon } from "@/components/shopping/ShoppingIcons";
import PracticeDisclosure from "@/features/shopping/ui/PracticeDisclosure";
import styles from "@/components/shopping/shopping.module.css";

export const metadata: Metadata = {
  title: "쇼핑 연습관",
  description: "생활에 필요한 상품을 검색하고 비교하며 주문부터 취소와 반품까지 실제 결제 없이 연습하세요.",
  alternates: { canonical: "/shopping" },
};

const SHOPPING_CHOICES = [
  {
    title: "처음 쇼핑 배우기",
    description: "상품 검색부터 옵션, 장바구니와 주문 확인까지 천천히 배워요.",
    action: "처음부터 배우기",
    href: "/shopping/missions/first-usb-c-cable",
    eyebrow: "처음이라면 추천",
    accent: "blue",
    Icon: SearchIcon,
  },
  {
    title: "필요한 물건 찾아보기",
    description: "휴대폰, 집안 안전, 여행과 계절 생활용품을 직접 검색해봐요.",
    action: "물건 찾아보기",
    href: "/shopping/catalog",
    eyebrow: "자유롭게 찾아보기",
    accent: "green",
    Icon: CompareIcon,
  },
  {
    title: "예산 안에서 장보기",
    description: "상품값과 배송비를 더해 정해진 금액 안에서 필요한 물건을 골라요.",
    action: "3만 원 장보기",
    href: "/shopping/missions/rainy-budget-30000",
    eyebrow: "가격·배송비 연습",
    accent: "violet",
    Icon: CartIcon,
  },
  {
    title: "주문 문제 해결하기",
    description: "배송조회, 주문 취소, 교환과 반품을 실제 순서처럼 연습해요.",
    action: "문제 해결 연습",
    href: "/shopping/order-help",
    eyebrow: "주문한 뒤 연습",
    accent: "coral",
    Icon: ReturnIcon,
  },
] as const;

export default function ShoppingHubPage() {
  return (
    <>
      <Header />
      <main data-testid="shopping-hub" className={`${styles.shoppingHub} ${styles.choiceHub}`}>
        <section className={styles.choiceHero}>
          <span>시니어든든 쇼핑 연습관</span>
          <h1>무엇을 연습해볼까요?</h1>
          <p>한 가지만 고르면 다음 화면에서 필요한 연습을 바로 시작할 수 있어요.</p>
          <div className={styles.choiceDisclosure}><PracticeDisclosure /></div>
        </section>

        <div className={styles.choiceShell}>
          <section aria-labelledby="shopping-choice-title">
            <div className={styles.choiceLead}>
              <span>1단계</span>
              <div>
                <h2 id="shopping-choice-title">오늘 할 일을 하나 골라보세요</h2>
                <p>상품은 선택한 다음 화면에서 보여드려요.</p>
              </div>
            </div>
            <div className={styles.choiceGrid}>
              {SHOPPING_CHOICES.map(({ title, description, action, href, eyebrow, accent, Icon }) => (
                <Link key={title} href={href} className={`${styles.choiceCard} ${styles[`choice_${accent}`]}`}>
                  <span className={styles.choiceIcon}><Icon /></span>
                  <span className={styles.choiceEyebrow}>{eyebrow}</span>
                  <h2>{title}</h2>
                  <p>{description}</p>
                  <strong>{action}<ArrowIcon /></strong>
                </Link>
              ))}
            </div>
          </section>

          <ShoppingHubProgress />

          <aside className={styles.choiceHelp}>
            <strong>어디서 시작할지 모르겠다면?</strong>
            <span>첫 번째 ‘처음 쇼핑 배우기’를 누르면 한 단계씩 안내해 드려요.</span>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
