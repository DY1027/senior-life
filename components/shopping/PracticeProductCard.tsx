import Image from "next/image";
import type { PracticeProduct } from "@/lib/shopping/schemas";
import styles from "./shopping.module.css";

export function PracticeProductCard({
  product,
  selected = false,
  onSelect,
  compact = false,
}: {
  product: PracticeProduct;
  selected?: boolean;
  onSelect?: () => void;
  compact?: boolean;
}) {
  const body = (
    <>
      <div className={compact ? styles.productImageCompact : styles.productImage}>
        <Image src={product.image.src} alt={product.image.alt} fill sizes={compact ? "120px" : "(max-width: 640px) 34vw, 220px"} className="object-contain" />
      </div>
      <div className={styles.productCopy}>
        <span className={styles.practiceBadge}>{product.disclosure}</span>
        <strong>{product.title}</strong>
        {!compact && <p>{product.description}</p>}
        <span className={styles.price}>{product.examplePrice.toLocaleString("ko-KR")}원</span>
        <span className={styles.shipping}>{product.shippingFee === 0 ? "배송비 0원" : `배송비 ${product.shippingFee.toLocaleString("ko-KR")}원`}</span>
        {product.badges.length > 0 && <span className={styles.infoBadge}>{product.badges.join(" · ")}</span>}
      </div>
      {selected && <span className={styles.selectedMark}>✓ 선택됨</span>}
    </>
  );

  if (!onSelect) return <article className={`${styles.productCard} ${compact ? styles.productCardCompact : ""}`}>{body}</article>;
  return (
    <button type="button" className={`${styles.productCard} ${styles.productButton} ${selected ? styles.productSelected : ""} ${compact ? styles.productCardCompact : ""}`} onClick={onSelect} aria-pressed={selected}>
      {body}
    </button>
  );
}

