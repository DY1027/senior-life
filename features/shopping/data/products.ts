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
    keywords: ["휴대폰", "스마트폰", "충전", "케이블", "디지털"],
    situationTags: ["휴대폰 충전", "여행 준비", "충전선이 필요할 때"],
    synonymTags: ["충전선", "C타입 선", "USB C 케이블"],
    learningPoints: ["휴대폰과 충전기의 단자를 확인하세요.", "필요한 길이와 구성 수량을 확인하세요."],
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
    keywords: ["우산", "접이식", "자동 우산", "비", "외출"],
    situationTags: ["장마철", "여행 준비", "비 오는 날", "계절용품"],
    synonymTags: ["양산 겸용 우산", "휴대용 우산"],
    learningPoints: ["접었을 때 길이와 무게를 확인하세요.", "상품 가격과 배송비를 합쳐 비교하세요."],
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
    keywords: ["제습", "습기", "옷장", "신발장", "생활편의"],
    situationTags: ["장마철", "집이 습할 때", "옷장 정리", "계절용품"],
    synonymTags: ["습기 제거제", "옷장 습기제거"],
    learningPoints: ["한 묶음의 실제 개수를 확인하세요.", "놓을 장소에 맞는 형태인지 확인하세요."],
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
    keywords: ["미끄럼", "안전", "욕실", "바닥", "테이프"],
    situationTags: ["장마철", "욕실이 미끄러울 때", "집안 안전", "밤에 어두울 때"],
    synonymTags: ["논슬립 테이프", "미끄럼 방지 스티커"],
    learningPoints: ["붙일 바닥 재질과 사용 장소를 확인하세요.", "젖은 곳에서 사용할 수 있는지 확인하세요."],
    practiceOnly: true,
    optionGroups: [],
  },
  {
    id: "waterproof-shoe-covers",
    title: "미끄럼방지 밑창 방수 신발커버",
    description: "비 오는 날 신발 위에 덧신는 성인용 연습 상품입니다. 밑창 모양과 크기를 확인해요.",
    categoryId: "anti-slip",
    basePrice: 3900,
    shippingFee: 0,
    image: { src: "/images/shopping/products/rainy-season/waterproof-shoe-covers-blue.jpg", alt: "파란색 성인용 방수 신발커버 연습용 예시 사진", width: 800, height: 800 },
    badges: ["무료배송", "연습용 예시 상품"],
    keywords: ["방수", "신발커버", "덧신", "미끄럼", "비"],
    situationTags: ["장마철", "비 오는 날", "젖은 길을 걸을 때", "미끄럼 예방"],
    synonymTags: ["방수 덧신", "우천용 신발커버", "레인 슈커버"],
    learningPoints: ["성인용인지 크기와 길이를 확인하세요.", "밑창의 미끄럼방지 무늬와 사용 장소를 확인하세요."],
    practiceOnly: true,
    optionGroups: [],
  },
  {
    id: "usb-c-charger-20w-white",
    title: "C타입 20W 충전 어댑터",
    description: "케이블과 연결되는 단자와 충전 출력, 플러그 형태를 확인하는 연습용 예시 상품입니다.",
    categoryId: "charging-adapter",
    basePrice: 12900,
    shippingFee: 0,
    image: { src: "/images/shopping/products/digital/usb-c-charger-20w-white.jpg", alt: "흰색 C타입 20W 충전 어댑터 연습용 예시 사진", width: 800, height: 800 },
    badges: ["무료배송", "연습용 예시 상품"],
    keywords: ["충전기", "충전 어댑터", "C타입", "20W", "휴대폰"],
    situationTags: ["휴대폰 충전", "충전기가 없을 때", "여행 준비", "휴대폰 편의"],
    synonymTags: ["충전기 머리", "충전기 본체", "USB C 어댑터", "고속 충전기"],
    learningPoints: ["케이블을 꽂는 단자가 C타입인지 확인하세요.", "충전 출력과 케이블 포함 여부를 확인하세요."],
    practiceOnly: true,
    optionGroups: [
      {
        id: "port",
        label: "출력 단자",
        required: true,
        values: [
          { id: "usb-c", label: "C타입 1구", priceDelta: 0, stock: 25 },
          { id: "usb-a", label: "USB-A 1구", priceDelta: -1000, stock: 14 },
          { id: "dual", label: "C타입 2구", priceDelta: 5000, stock: 8 },
        ],
      },
    ],
  },
  {
    id: "power-bank-10000-white",
    title: "휴대용 보조배터리 10,000mAh",
    description: "외출할 때 휴대폰을 충전하는 보조배터리로, 용량과 무게를 함께 확인하는 연습용 예시 상품입니다.",
    categoryId: "power-bank",
    basePrice: 24900,
    shippingFee: 0,
    image: { src: "/images/shopping/products/digital/power-bank-10000-white.jpg", alt: "흰색 10000mAh 휴대용 보조배터리 연습용 예시 사진", width: 800, height: 800 },
    badges: ["무료배송", "연습용 예시 상품"],
    keywords: ["보조배터리", "휴대용 배터리", "충전", "10000", "외출"],
    situationTags: ["여행 준비", "외출 중 충전", "병원 방문", "휴대폰 충전"],
    synonymTags: ["휴대폰 배터리", "충전 배터리", "파워뱅크"],
    learningPoints: ["용량이 커질수록 무게도 늘어나는지 확인하세요.", "기내 반입과 충전 단자 종류를 확인하세요."],
    practiceOnly: true,
    optionGroups: [
      {
        id: "capacity",
        label: "배터리 용량",
        required: true,
        values: [
          { id: "10000", label: "10,000mAh · 약 220g", priceDelta: 0, stock: 22 },
          { id: "20000", label: "20,000mAh · 약 410g", priceDelta: 12000, stock: 9 },
        ],
      },
      {
        id: "color",
        label: "색상",
        required: true,
        values: [
          { id: "white", label: "화이트", priceDelta: 0, stock: 18 },
          { id: "black", label: "블랙", priceDelta: 0, stock: 13 },
        ],
      },
    ],
  },
  {
    id: "phone-stand-foldable-silver",
    title: "접이식 휴대폰 탁상 거치대",
    description: "영상 통화와 화면 보기에 사용하는 거치대로, 받침 크기와 각도 조절 여부를 확인하는 연습용 예시 상품입니다.",
    categoryId: "phone-stand",
    basePrice: 9900,
    shippingFee: 2500,
    image: { src: "/images/shopping/products/digital/phone-stand-foldable-silver.jpg", alt: "은색 접이식 휴대폰 탁상 거치대 연습용 예시 사진", width: 800, height: 800 },
    badges: ["배송비 2,500원", "연습용 예시 상품"],
    keywords: ["휴대폰 거치대", "탁상 거치대", "스마트폰 받침대", "영상 통화"],
    situationTags: ["손으로 들기 힘들 때", "영상 통화", "휴대폰 화면 보기", "집안 편의"],
    synonymTags: ["핸드폰 거치대", "폰 받침대", "휴대폰 스탠드"],
    learningPoints: ["내 휴대폰과 케이스를 함께 올릴 수 있는 폭인지 확인하세요.", "상품 가격과 배송비를 더한 총액을 확인하세요."],
    practiceOnly: true,
    optionGroups: [],
  },
  {
    id: "stylus-pen-universal-black",
    title: "스마트폰 터치펜 2개 묶음",
    description: "작은 글자나 버튼을 누를 때 사용하는 터치펜으로, 호환 기기와 묶음 수량을 확인하는 연습용 예시 상품입니다.",
    categoryId: "stylus",
    basePrice: 6500,
    shippingFee: 2500,
    image: { src: "/images/shopping/products/digital/stylus-pen-universal-black.jpg", alt: "검은색 스마트폰 터치펜 두 개 연습용 예시 사진", width: 800, height: 800 },
    badges: ["2개 묶음", "배송비 2,500원", "연습용 예시 상품"],
    keywords: ["터치펜", "스마트폰 펜", "휴대폰 펜", "2개 묶음"],
    situationTags: ["작은 버튼을 누를 때", "휴대폰 글씨 쓰기", "휴대폰 편의"],
    synonymTags: ["스마트폰 터치 펜", "정전식 펜", "핸드폰 펜"],
    learningPoints: ["내 휴대폰 화면에서 사용할 수 있는 정전식 제품인지 확인하세요.", "한 개 가격인지 묶음상품 가격인지 확인하세요."],
    practiceOnly: true,
    optionGroups: [
      {
        id: "color",
        label: "색상",
        required: true,
        values: [
          { id: "black", label: "블랙 2개", priceDelta: 0, stock: 20 },
          { id: "silver", label: "실버 2개", priceDelta: 0, stock: 12 },
        ],
      },
    ],
  },
  {
    id: "screen-magnifier-12inch-black",
    title: "휴대폰 화면 확대기 12인치",
    description: "휴대폰 화면을 더 크게 보는 받침형 확대기로, 화면 크기와 설치 공간을 확인하는 연습용 예시 상품입니다.",
    categoryId: "screen-magnifier",
    basePrice: 15900,
    shippingFee: 0,
    image: { src: "/images/shopping/products/digital/screen-magnifier-12inch-black.jpg", alt: "검은색 받침형 휴대폰 화면 확대기 연습용 예시 사진", width: 800, height: 800 },
    badges: ["무료배송", "연습용 예시 상품"],
    keywords: ["화면 확대기", "휴대폰 확대경", "스마트폰 확대", "12인치"],
    situationTags: ["휴대폰 화면이 작을 때", "영상 크게 보기", "집안 편의"],
    synonymTags: ["스마트폰 스크린 확대기", "핸드폰 확대경", "휴대폰 돋보기"],
    learningPoints: ["화면 크기와 제품을 펼칠 공간이 충분한지 확인하세요.", "확대기는 글자를 선명하게 만드는 의료기기가 아님을 확인하세요."],
    practiceOnly: true,
    optionGroups: [
      {
        id: "size",
        label: "화면 크기",
        required: true,
        values: [
          { id: "12", label: "12인치", priceDelta: 0, stock: 16 },
          { id: "14", label: "14인치", priceDelta: 4000, stock: 7 },
        ],
      },
    ],
  },
];

export function getCommerceProduct(productId: string) {
  return COMMERCE_PRODUCTS.find((product) => product.id === productId);
}

export function searchCommerceProducts(query: string) {
  const normalized = query.trim().toLocaleLowerCase("ko-KR").replaceAll(" ", "");
  if (!normalized) return COMMERCE_PRODUCTS;
  const score = (product: CommerceProduct) => {
    const title = product.title.toLocaleLowerCase("ko-KR").replaceAll(" ", "");
    const category = product.categoryId.toLocaleLowerCase("ko-KR").replaceAll("-", "");
    const normalizeTags = (tags: string[]) => tags.map((tag) => tag.toLocaleLowerCase("ko-KR").replaceAll(" ", ""));
    if (title === normalized) return 100;
    if (title.includes(normalized) || normalized.includes(title)) return 80;
    if (category.includes(normalized)) return 70;
    if (normalizeTags(product.situationTags).some((tag) => tag.includes(normalized) || normalized.includes(tag))) return 60;
    if (normalizeTags(product.keywords).some((tag) => tag.includes(normalized) || normalized.includes(tag))) return 50;
    if (normalizeTags(product.synonymTags).some((tag) => tag.includes(normalized) || normalized.includes(tag))) return 40;
    if (normalized.includes("c타입") && product.categoryId === "charging-cable") return 30;
    return 0;
  };
  return COMMERCE_PRODUCTS.map((product) => ({ product, score: score(product) }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((result) => result.product);
}
