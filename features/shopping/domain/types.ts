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

export type OrderState =
  | "PAID"
  | "PREPARING"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURN_REQUESTED"
  | "EXCHANGE_REQUESTED";

export type OrderHistoryEntry = {
  state: OrderState;
  label: string;
  occurredAt: string;
};

export type RefundSummary = {
  originalPayment: Money;
  merchandiseRefund: Money;
  shippingRefund: Money;
  returnShippingFee: Money;
  refundTotal: Money;
  methodLabel: string;
};

export type ReturnReason = "changed-mind" | "damaged" | "wrong-item" | "option-mismatch";

export type AfterSalesRequest = {
  kind: "cancel" | "return" | "exchange";
  reason?: string;
  exchangeOption?: string;
  requestedAt: string;
};

export type PracticeOrder = {
  id: string;
  orderNumber: string;
  lines: CartLine[];
  paymentSummary: CheckoutSummary;
  state: OrderState;
  addressLabel: string;
  paymentMethodLabel: string;
  createdAt: string;
  history: OrderHistoryEntry[];
  refundSummary?: RefundSummary;
  afterSalesRequest?: AfterSalesRequest;
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
