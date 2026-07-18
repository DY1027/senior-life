export type Money = number;

export type ProductOptionValue = {
  id: string;
  label: string;
  priceDelta: Money;
  stock: number;
  disabled?: boolean;
};

export type ProductOptionGroup = {
  id: string;
  label: string;
  required: boolean;
  values: ProductOptionValue[];
};

export type CommerceProduct = {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  basePrice: Money;
  shippingFee: Money;
  image: { src: string; alt: string; width: number; height: number };
  optionGroups: ProductOptionGroup[];
  badges: string[];
  practiceOnly: true;
};

export type SelectedOptions = Record<string, string>;

export type CartLine = {
  id: string;
  productId: string;
  title: string;
  image: CommerceProduct["image"];
  selectedOptions: SelectedOptions;
  optionLabels: string[];
  quantity: number;
  unitPrice: Money;
  shippingFee: Money;
};

export type CheckoutSummary = {
  merchandiseTotal: Money;
  shippingTotal: Money;
  discountTotal: Money;
  paymentTotal: Money;
};

export type PracticeOrder = {
  id: string;
  orderNumber: string;
  lines: CartLine[];
  paymentSummary: CheckoutSummary;
  state: "PAID";
  addressLabel: string;
  paymentMethodLabel: string;
  createdAt: string;
};

export type CartSnapshot = {
  version: 2;
  lines: CartLine[];
  activeBudget?: number;
};

export type OrdersSnapshot = {
  version: 2;
  orders: PracticeOrder[];
};
