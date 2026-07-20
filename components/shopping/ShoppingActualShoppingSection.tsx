"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { COUPANG_PARTNERS_DISCLOSURE } from "@/lib/affiliate-config";
import { track } from "@/lib/track";
import styles from "./shopping.module.css";

type Props = {
  affiliateUrl: string;
  affiliateTitle: string;
  affiliateDescription?: string;
  imagePath?: string;
};

export default function ShoppingActualShoppingSection({ affiliateUrl, affiliateTitle, affiliateDescription, imagePath }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);

  const openConfirmation = () => {
    dialogRef.current?.showModal();
  };

  const closeConfirmation = () => {
    dialogRef.current?.close();
  };

  return (
    <section
      data-testid="shopping-actual-shopping"
      className={styles.actualShoppingSection}
      aria-labelledby="shopping-actual-title"
    >
      <p className={styles.actualShoppingLabel}>광고 · 외부 실제 쇼핑몰</p>
      <h2 id="shopping-actual-title">여기부터는 실제 쇼핑입니다</h2>
      <div data-testid="actual-shopping-guide" className={styles.actualShoppingGuide}>
        <p>아래 버튼을 누르면 시니어든든의 쇼핑연습을 종료하고 실제 쿠팡 쇼핑몰로 이동합니다.</p>
        <p>쿠팡에서는 상품 주문, 결제 및 배송이 실제로 이루어질 수 있습니다.</p>
      </div>

      <p data-testid="actual-shopping-warning" className={styles.actualShoppingWarning} role="note" aria-label="실제 쇼핑 주의">
        <strong>주의: 지금부터는 연습이 아닙니다.</strong>
      </p>

      {imagePath && (
        <article data-testid="actual-shopping-product" className={styles.actualShoppingProduct}>
          <div className={styles.actualShoppingImageWrap}>
            <Image
              data-testid="actual-shopping-product-image"
              src={imagePath}
              alt={`${affiliateTitle} 실제 상품 이미지`}
              width={360}
              height={360}
              sizes="(max-width: 600px) 72vw, 280px"
            />
          </div>
          <div>
            <span>이번에 살펴볼 실제 상품</span>
            <h3>{affiliateTitle}</h3>
            {affiliateDescription && <p>{affiliateDescription}</p>}
          </div>
        </article>
      )}

      <button
        ref={openButtonRef}
        data-testid="actual-shopping-open"
        type="button"
        aria-label="실제 쿠팡 쇼핑몰로 이동합니다"
        aria-haspopup="dialog"
        className={styles.actualShoppingButton}
        onClick={openConfirmation}
      >
        쿠팡에서 실제로 쇼핑하기 <span aria-hidden="true">↗</span>
      </button>

      <p data-testid="actual-shopping-disclosure" className={styles.partnersDisclosure}>{COUPANG_PARTNERS_DISCLOSURE}</p>

      <Link data-testid="actual-shopping-return" className={styles.returnToPracticeButton} href="/shopping">
        쇼핑연습으로 돌아가기
      </Link>

      <dialog
        ref={dialogRef}
        className={styles.actualShoppingDialog}
        aria-modal="true"
        aria-labelledby="actual-shopping-dialog-title"
        aria-describedby="actual-shopping-dialog-description"
        onClose={() => openButtonRef.current?.focus()}
      >
        <div className={styles.actualShoppingDialogContent}>
          <p className={styles.dialogLabel}>외부 실제 쇼핑몰 이동 확인</p>
          <h2 id="actual-shopping-dialog-title">실제 쿠팡 쇼핑몰로 이동할까요?</h2>
          <p id="actual-shopping-dialog-description">
            지금부터는 쇼핑연습이 아닙니다. 쿠팡에서 상품을 주문하면 실제 결제와 배송이 이루어질 수 있습니다.
          </p>
          <div className={styles.actualShoppingDialogActions}>
            <button type="button" autoFocus onClick={closeConfirmation}>
              취소하고 연습 화면에 있기
            </button>
            <a
              href={affiliateUrl}
              target="_blank"
              rel="sponsored nofollow noopener"
              onClick={() => {
                track("affiliate_click", { product: affiliateTitle, placement: "shopping_completion_confirmed" });
                closeConfirmation();
              }}
            >
              네, 실제 쿠팡으로 이동할게요
            </a>
          </div>
        </div>
      </dialog>
    </section>
  );
}
