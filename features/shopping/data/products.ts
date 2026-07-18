import type { CommerceProduct } from "@/features/shopping/domain/types";

const cableImage = {
  src: "/images/shopping/products/digital/usb-c-cable-white-2m.jpg",
  alt: "흰색 USB C타입 충전 케이블 연습용 예시 사진",
  width: 800,
  height: 800,
};

export const COMMERCE_PRODUCTS: CommerceProduct[] = [
  {
    id: "usb-c-2m-white",
    title: "C타입 고속 충전 케이블 2m",
    description: "휴대폰과 충전기 단자, 필요한 길이를 확인하는 연습용 예시 상품입니다.",
    categoryId: "charging-cable",
    basePrice: 6900,
    shippingFee: 0,
    image: cableImage,
    badges: ["무료배송", "연습용 예시 상품"],
    practiceOnly: true,
    optionGroups: [
      {
        id: "connector",
        label: "단자",
        required: true,
        values: [
          { id: "usb-c", label: "C타입-C타입", priceDelta: 0, stock: 30 },
          { id: "usb-a", label: "USB-A-C타입", priceDelta: 0, stock: 20 },
          { id: "eight-pin", label: "8핀-USB", priceDelta: 0, stock: 0, disabled: true },
        ],
      },
      {
        id: "length",
        label: "길이",
        required: true,
        values: [
          { id: "1m", label: "1m", priceDelta: -1000, stock: 20 },
          { id: "2m", label: "2m", priceDelta: 0, stock: 30 },
          { id: "3m", label: "3m", priceDelta: 2000, stock: 10 },
        ],
      },
    ],
  },
  {
    id: "umbrella",
    title: "접이식 자동 우산",
    description: "가방에 넣기 쉬운 장마철 필수 준비물입니다.",
    categoryId: "umbrella",
    basePrice: 12900,
    shippingFee: 3500,
    image: { src: "/images/shopping/products/rainy-season/compact-umbrella-navy.jpg", alt: "남색 접이식 자동 우산 연습용 예시 사진", width: 800, height: 800 },
    badges: ["배송비 3,500원", "연습용 예시 상품"],
    practiceOnly: true,
    optionGroups: [],
  },
  {
    id: "dehumidifier-pack",
    title: "옷장용 제습제 8개 묶음",
    description: "방과 옷장에 나누어 놓는 묶음형 제습제입니다.",
    categoryId: "dehumidifier",
    basePrice: 5900,
    shippingFee: 0,
    image: { src: "/images/shopping/products/rainy-season/dehumidifier-box-eight-pack.jpg", alt: "옷장용 제습제 8개 묶음 연습용 예시 사진", width: 800, height: 800 },
    badges: ["무료배송", "연습용 예시 상품"],
    practiceOnly: true,
    optionGroups: [],
  },
  {
    id: "anti-slip-tape",
    title: "투명 미끄럼방지 테이프",
    description: "젖기 쉬운 바닥에 붙이는 투명한 연습용 예시 상품입니다.",
    categoryId: "anti-slip",
    basePrice: 4500,
    shippingFee: 3500,
    image: { src: "/images/shopping/products/rainy-season/anti-slip-tape-clear.jpg", alt: "투명 미끄럼방지 테이프 연습용 예시 사진", width: 800, height: 800 },
    badges: ["배송비 3,500원", "연습용 예시 상품"],
    practiceOnly: true,
    optionGroups: [],
  },
];

export function getCommerceProduct(productId: string) {
  return COMMERCE_PRODUCTS.find((product) => product.id === productId);
}

export function searchCommerceProducts(query: string) {
  const normalized = query.trim().toLocaleLowerCase("ko-KR").replaceAll(" ", "");
  if (!normalized) return COMMERCE_PRODUCTS;
  return COMMERCE_PRODUCTS.filter((product) => {
    const haystack = `${product.title}${product.description}`.toLocaleLowerCase("ko-KR").replaceAll(" ", "");
    return haystack.includes(normalized) || (normalized.includes("c타입") && product.categoryId === "charging-cable");
  });
}
