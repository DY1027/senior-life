import type { CartLine, CheckoutSummary, CommerceProduct, SelectedOptions } from "@/features/shopping/domain/types";

export function calculateUnitPrice(product: CommerceProduct, selectedOptions: SelectedOptions) {
  return product.optionGroups.reduce((price, group) => {
    const selected = group.values.find((value) => value.id === selectedOptions[group.id]);
    return price + (selected?.priceDelta ?? 0);
  }, product.basePrice);
}

export function validateSelectedOptions(product: CommerceProduct, selectedOptions: SelectedOptions) {
  return product.optionGroups.every((group) => {
    if (!group.required) return true;
    const value = group.values.find((candidate) => candidate.id === selectedOptions[group.id]);
    return Boolean(value && !value.disabled && value.stock > 0);
  });
}

export function calculateCheckoutSummary(lines: CartLine[]): CheckoutSummary {
  const merchandiseTotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  const shippingTotal = lines.reduce((sum, line) => sum + line.shippingFee, 0);
  const discountTotal = 0;
  return { merchandiseTotal, shippingTotal, discountTotal, paymentTotal: merchandiseTotal + shippingTotal - discountTotal };
}

export function formatWon(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}
