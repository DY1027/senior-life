# 쇼핑 공통기능·주문 이후 구현 감사

- 감사일: 2026-07-18 (KST)
- production: <https://seniordeundun.com/shopping>
- 기준 문서: `시니어든든-쇼핑공통기능-주문이후-기술스펙-검수명세서.md`
- 계약 테스트: `shopping-flow-contract.spec.ts`
- 저장소 지침: `AGENTS.md`
- 감사 범위: 현재 production, 현재 배포 커밋, 저장소의 실제 라우트·상태·데이터·테스트
- 변경 범위: 이 감사 문서만 추가. 기능 코드는 수정하지 않음.

## 1. 최종 판정

현재 production은 **4개 미션을 수행하는 쇼핑 연습 콘텐츠**로서는 작동한다. 메인과 키오스크 목록에서 쇼핑 연습관에 들어갈 수 있고, C타입 케이블 미션은 검색부터 상품 확인, 옵션·수량, 연습 장바구니, 배송비 포함 총액, 주문 전 확인, 오답 설명·수정, 완료 기록까지 실제 버튼으로 진행된다.

그러나 새 기술스펙이 정의한 **공용 쇼핑 시스템과 주문 이후 시스템**은 구현되어 있지 않다. `/shopping`에는 공용 검색창이 없고, 공용 장바구니·체크아웃·모의 결제·주문 생성·주문 목록·배송조회·취소·반품·교환·환불 라우트와 도메인 모델이 없다. 현재의 장바구니는 첫 미션 컴포넌트 안의 `cartAdded: boolean`일 뿐이며, 생성된 주문도 없다.

따라서 첨부 계약 테스트 기준 판정은 **0/7 통과 가능, 7/7 실패 예상**이다. 현재 저장소의 기존 쇼핑 테스트 4개는 assertion 기준 모두 통과했지만, 이는 기존 미션 전용 흐름만 검증하며 새 계약을 검증하지 않는다.

출시 차단 조건 중 현재 해당하는 항목은 다음과 같다.

- 검색부터 주문 완료까지 이어지는 공용 쇼핑 흐름이 없음
- 새로고침 시 장바구니·옵션·진행 상태가 복구되지 않음
- 주문 상태 기계와 주문 이후 기능이 없음
- 배송중 취소 차단, 배송완료 반품, 환불 계산을 검증할 수 없음

반대로 첨부 스펙의 “메인과 연습 목록에서 진입할 수 없다”는 초기 진단은 현재 production에는 맞지 않는다. 두 진입점 모두 이미 노출되어 있다.

## 2. 배포·커밋 확인

| 항목 | 확인 결과 |
|---|---|
| production URL | `https://seniordeundun.com/shopping` |
| production에서 확인한 관련 URL | `/`, `/kiosk`, `/shopping`, `/shopping/missions/first-usb-c-cable/practice`, `/shopping/missions/first-usb-c-cable/result`, `/shopping/products/charging` |
| 현재 로컬 HEAD | `e0e6777aae81b39b6d43b4200d4bc08dd038d4fc` |
| 커밋 시각·제목 | `2026-07-18T15:26:07+09:00` · `C타입 쇼핑 연습 흐름 완성` |
| 원격 동기화 | `HEAD...origin/master = 0 0` |
| 배포 상태 | 해당 커밋의 Vercel 상태가 `success`, “Deployment has completed”로 확인됨 |
| 배포 식별 URL | `https://vercel.com/dy-1027/senior-life/HkqajYGWbbKTHzC6HWMzThpe3M4o` |

## 3. 실제 브라우저 검증

### 3.1 환경

- 실제 production 도메인 사용
- 모바일 viewport `360×800`
- 실제 클릭·입력·체크·새로고침으로 상태 변화를 확인
- 완료 흐름 및 제휴 영역에서 브라우저 콘솔 로그: `[]`
- `/shopping`의 `document.documentElement.scrollWidth`는 345px, `innerWidth`는 360px로 가로 넘침 없음

### 3.2 확인한 사용자 흐름

| 흐름 | 실제 결과 | 판정 |
|---|---|---|
| 메인 → 쇼핑 연습관 | 메인 배너의 `/shopping` 링크가 보이고 이동함 | 완료 |
| 키오스크 목록 → 쇼핑 연습관 | `/kiosk`의 “쇼핑 연습관 보기 →”가 보이고 이동함 | 완료 |
| 쇼핑 허브 | 4개 미션 카드와 안전 안내가 보임 | 완료 |
| C타입 검색 | 미션 1/9에서 검색어를 입력하고 결과로 이동함 | 완료 |
| 상품 선택·상세 | C타입 2m 상품을 선택하고 단자·길이·색상·구성·배송비를 확인함 | 완료 |
| 단자·길이·수량 | `C타입-C타입`, `2m`, `1개`를 실제 버튼으로 선택·확인함 | 완료 |
| 연습 장바구니 | “장바구니에 담아보기”가 눌리고 `✓ 장바구니에 담았어요`로 변함 | 부분 구현 |
| 배송비 포함 총액 | `6,900원 × 1 + 배송비 0원 = 6,900원`을 표시함 | 완료 |
| 주문 전 확인 | 상품·옵션·수량·총액 4개 확인란을 체크함 | 완료 |
| 완료·기록 | 결과 URL로 이동, `100점`, `6,900원`, “완료 기록이 이 기기에 저장됐어요” 표시 | 완료 |
| 오답 설명·수정 | 기존 E2E에서 오답 이유를 표시하고 이전 단계에서 수정 후 완료함 | 완료 |
| 새로고침 이어하기 | 3/9에서 새로고침하면 1/9로 초기화되고 선택 상품도 사라짐 | 오작동 |
| 실제 상품 영역 | 결과 뒤에만 별도 안내로 노출됨 | 완료 |
| 쿠팡 파트너스 | production에서 실제 `link.coupang.com` 링크 2개와 대가성 문구가 표시됨 | 완료 |

현재 결과 화면은 `연습 종료 후 선택 영역`이라는 경계를 둔 뒤 실제 상품 안내로 연결한다. 연습 상품 영역에는 제휴 링크가 없고, 별도 실제 상품 화면에서만 “광고”와 쿠팡 파트너스 고지가 함께 표시된다. 이는 `AGENTS.md`의 분리 원칙에 부합한다.

## 4. 현재 라우트 목록

### 4.1 저장소에 실제 존재하는 쇼핑 라우트

| 라우트 | 구현 파일 | 상태 |
|---|---|---|
| `/shopping` | `app/shopping/page.tsx` | 존재 |
| `/shopping/missions/[missionSlug]` | `app/shopping/missions/[missionSlug]/page.tsx` | 존재 |
| `/shopping/missions/[missionSlug]/practice` | `app/shopping/missions/[missionSlug]/practice/page.tsx` | 존재 |
| `/shopping/missions/[missionSlug]/result` | `app/shopping/missions/[missionSlug]/result/page.tsx` | 존재 |
| `/shopping/products/[collectionSlug]` | `app/shopping/products/[collectionSlug]/page.tsx` | 존재. 실물 구매 안내 컬렉션임 |

### 4.2 새 스펙이 요구하지만 없는 라우트

| 요구 라우트 | production 직접 확인 | 판정 |
|---|---|---|
| `/shopping/search` | 404 | 미구현 |
| `/shopping/products/[productId]` | 현재 같은 형태는 컬렉션 slug 용도임 | 부분 구현/계약 불일치 |
| `/shopping/cart` | 404 | 미구현 |
| `/shopping/checkout` | 404 | 미구현 |
| `/shopping/order-complete/[orderId]` | 라우트 없음 | 미구현 |
| `/shopping/orders` | 404 | 미구현 |
| `/shopping/orders/[orderId]` | 라우트 없음 | 미구현 |
| `/shopping/orders/[orderId]/tracking` | 라우트 없음 | 미구현 |
| `/shopping/orders/[orderId]/cancel` | 라우트 없음 | 미구현 |
| `/shopping/orders/[orderId]/return` | 라우트 없음 | 미구현 |
| `/shopping/orders/[orderId]/exchange` | 라우트 없음 | 미구현 |
| `/shopping/orders/[orderId]/refund` | 라우트 없음 | 미구현 |
| `/shopping/test-fixtures/order/paid` | 404 | 미구현 |
| `/shopping/test-fixtures/order/shipped` | 라우트 없음 | 미구현 |
| `/shopping/test-fixtures/order/delivered` | 라우트 없음 | 미구현 |
| `/shopping/practice/rainy-season-budget-30000` | 404 | 미구현/현재 slug·경로와 불일치 |

## 5. 데이터·상태·엔진 감사

### 5.1 현재 데이터 수

| 항목 | 수량 | 내용 |
|---|---:|---|
| 사용 가능한 미션 | 4 | C타입 첫 쇼핑, 장마철 예산, 케이블 비교, 주문 화면 실수 찾기 |
| 서로 다른 로직의 미션 | 4 | `guided`, `budget`, `compare`, `mistake` |
| 정적 카드만 있는 미션 | 0 | 네 카드 모두 실제 연습 러너로 연결됨 |
| 연습 상품 | 8 | 케이블 4, 장마철 상품 4 |
| 실제 상품 안내 컬렉션 | 3 | 충전, 장마철, 안전 쇼핑 |

현재 미션 slug:

```text
first-usb-c-cable
rainy-budget-30000
compare-usb-c-cables
find-order-mistake
```

현재 상품 ID:

```text
cable-usbc-white-2m
cable-usbc-black-1m
cable-eightpin-white-2m
cable-usbc-white-3pack
rain-umbrella-navy
rain-dehumidifier-eight
rain-anti-slip-tape
rain-shoe-covers
```

### 5.2 상태와 계산

| 질문 | 확인 결과 |
|---|---|
| 장바구니 상태가 실제로 작동하는가 | 미션 화면 안에서는 boolean 상태가 바뀌지만 공용 장바구니·라인·삭제·병합·선택 구매는 없음 |
| 배송비가 총액에 포함되는가 | 현재 guided·budget 평가기에서는 포함됨. 배송 그룹·할인·복수 옵션 계산은 없음 |
| 예산 초과 후 수정 가능한가 | 장마 미션에서 선택을 다시 누르는 방식으로 수정 가능. 공용 장바구니 삭제 및 checkout 비활성화 규칙은 없음 |
| 성공 판정 방식 | `lib/shopping/evaluator.ts`의 순수 함수이지만 C타입·2m·수량 1 등 규칙이 코드에 직접 박혀 있음. 범용 규칙 엔진은 아님 |
| localStorage 이어하기 | `dd-shopping-progress-v1`에 step 숫자와 완료 결과만 저장. 러너가 저장 step을 초기 상태로 읽지 않아 새로고침 시 실제 복구 안 됨 |
| 옵션 유지 | connector·length·quantity가 reducer 메모리에만 있어 새로고침 시 사라짐 |
| 주문 유지 | 주문 도메인과 주문 저장 키가 없어 불가능 |
| 이미지 | 저장소에 커밋된 연습용 생성 자산이며 임시 외부 URL은 아님. 실제 판매 상품 사진은 제휴 API 영역에서 별도 표시됨 |
| 쿠팡 링크 | production에서 실제 `link.coupang.com` 링크와 광고·수수료 고지를 직접 확인함 |

현재 스키마는 `PracticeProduct`와 `ShoppingMission`만 정의한다. 새 스펙의 `ProductOptionGroup`, `CartLine`, `CheckoutSummary`, `PracticeOrder`, 배송·취소·반품·교환·환불 모델은 없다.

현재 저장 키는 하나뿐이다.

```text
dd-shopping-progress-v1
```

새 스펙이 요구하는 아래 키는 모두 없다.

```text
seniordeundun:shopping:cart:v2
seniordeundun:shopping:orders:v2
seniordeundun:shopping:progress:v2
seniordeundun:shopping:scenario-clock:v1
```

## 6. 상세 기능 격차 표

| 기능명 | 설계서 요구사항 | 현재 구현 파일 | 실제 브라우저 작동 여부 | 상태 | 부족한 부분 | 원인 | 수정 대상 파일/모듈 | 필요한 테스트 | 우선순위 |
|---|---|---|---|---|---|---|---|---|---|
| 메인 진입 | 메인에서 `/shopping` 접근 | `app/page.tsx`, `components/home/ShoppingPracticeBanner.tsx` | 실제 이동함 | 완료 | 없음 | 구현됨 | 회귀만 유지 | entry E2E | P0 |
| 키오스크 진입 | 연습 목록에서 접근 | `app/kiosk/page.tsx` | 실제 이동함 | 완료 | 없음 | 구현됨 | 회귀만 유지 | entry E2E | P0 |
| 연습 안전 고지 | 모든 핵심 화면에 실제 결제 아님 표시 | 쇼핑 페이지·러너·결과 컴포넌트 | 현재 미션 화면에는 보임 | 부분 구현 | 새 공용 화면이 없고 `practice-disclosure` 계약 ID 없음 | 기존 미션 UI 기준 구현 | 공용 layout/disclosure | 화면별 고지 E2E | P0 |
| 쇼핑 홈 검색 | `/shopping`에서 검색 입력·추천어·최근어 | `app/shopping/page.tsx` | 검색 입력 0개 | 미구현 | 홈이 미션 카드 허브뿐 | 공용 카탈로그 미구현 | `features/shopping/ui/catalog`, `/shopping/search` | 검색/0건/복원 | P0 |
| 검색 결과 | 정렬·필터·총비용 기준 상품 카드 | 없음 | `/shopping/search` 404 | 미구현 | 결과 모델·UI 없음 | 공용 상품 모델 없음 | catalog/search | 정렬·필터 E2E | P1 |
| 상품 상세 | 옵션·재고·총액·교환/반품 안내 | `ShoppingPracticeRunner.tsx` | 첫 미션 안에서만 표시 | 부분 구현 | 공용 상세 라우트와 옵션 재고·가격 증분 없음 | 미션 단계에 하드코딩 | product domain/UI | 상세·필수옵션 | P1 |
| 옵션 시스템 | required group, priceDelta, stock, disabled | reducer의 connector·length 문자열 | 선택은 됨 | 부분 구현 | 범용 그룹·variant·재고 검증 없음 | 스키마 부재 | `domain/product.ts`, option UI | 옵션 조합·품절 | P1 |
| 수량 | 입력·증감·재고 제한 | 러너의 number 상태 | 증감 버튼 작동 | 부분 구현 | 공용 `quantity-input`, 라인 수량, 재고 제한 없음 | 미션 전용 상태 | cart/product UI | 경계값·재고 | P1 |
| 장바구니 추가 | variant별 라인 생성·병합 | `cartAdded` boolean | 버튼 상태만 변함 | 부분 구현 | CartLine, count, line merge 없음 | cart domain 없음 | `domain/cart.ts`, reducer/context | 추가·병합 | P1 |
| 장바구니 수정 | 수량·삭제·선택 구매 | 없음 | `/shopping/cart` 404 | 미구현 | 전부 없음 | cart route 없음 | `/shopping/cart` | 삭제·수량·선택 | P1 |
| 금액 계산 | 상품·배송·할인·결제 총액 분리 | `lib/shopping/evaluator.ts` | 단일/미션 합계는 보임 | 부분 구현 | shipping group, discount, option delta 없음 | 단순 evaluator | `engine/price-calculator.ts` | 순수함수 단위 테스트 | P1 |
| 장마 예산 수정 | 배송비 포함 초과, 삭제 후 재진행, 필수 품목 | budget evaluator/runner | 현재 미션 방식으로 선택 수정 가능 | 부분 구현 | 계약 route·상품 ID·공용 cart·checkout 차단 없음 | 별도 미션 UI | 공용 cart + mission adapter | 첨부 budget 계약 | P1 |
| 체크아웃 | 가상 배송지·결제수단·최종 확인 | 없음 | `/shopping/checkout` 404 | 미구현 | 전체 없음 | checkout domain 없음 | `domain/checkout.ts`, checkout UI | purchase E2E | P1 |
| 모의 결제 | validating/processing/success/error | 없음 | 실행 불가 | 미구현 | 오류·중복 방지·가격 변경 없음 | payment state 없음 | checkout engine | 성공·오류·재시도 | P1 |
| 주문 생성 | 가상 주문번호·주문 요약·목록 저장 | 없음 | 실행 불가 | 미구현 | PracticeOrder 없음 | order domain 없음 | `domain/order.ts`, storage | 주문 생성·복구 | P1 |
| 새로고침 복구 | 옵션·장바구니·체크아웃·주문 유지 | `lib/shopping/progress.ts` | 3/9→1/9 초기화 | 오작동 | step도 읽지 않고 세부 선택 미저장 | write-only progress 연결 | storage/context/migrations | 첨부 resume 계약 | P0 |
| 주문 목록·상세 | 주문 카드, 상태별 행동 | 없음 | `/shopping/orders` 404 | 미구현 | 전체 없음 | order UI 없음 | order routes/UI | 목록·직접 URL | P2 |
| 주문 상태 기계 | PAID→PREPARING→SHIPPED→DELIVERED 등 | 없음 | 실행 불가 | 미구현 | 전환·허용 행동·이력 없음 | 상태 모델 없음 | `engine/order-state-machine.ts` | 전환 표 단위 테스트 | P2 |
| 시나리오 시계 | 실제 대기 없이 시간 전진 | 없음 | 실행 불가 | 미구현 | clock 저장·reset 없음 | engine 부재 | `engine/scenario-clock.ts` | advance/reset | P2 |
| 배송조회 | 시간순 이력·현재 단계·예정일 | 없음 | 실행 불가 | 미구현 | 전체 없음 | shipment domain 없음 | shipment route/UI | shipped fixture | P2 |
| 주문 취소 | 상태별 허용, 일부/수량, 환불 계산 | 없음 | paid fixture 404 | 미구현 | 전체 없음 | cancellation domain 없음 | cancel UI/engine | paid/preparing/shipped | P3 |
| 반품 | 배송완료 후 사유·귀책·배송비·환불 | 없음 | delivered fixture 404 | 미구현 | 전체 없음 | return domain 없음 | return UI/engine | buyer/seller fault | P3 |
| 교환 | 옵션·재고·차액·회수·재배송 | 없음 | 실행 불가 | 미구현 | 전체 없음 | exchange domain 없음 | exchange UI/engine | 재고·차액 | P3 |
| 환불 | 원결제·상품·배송비·쿠폰·최종 환불 | 없음 | 실행 불가 | 미구현 | 전체 없음 | refund calculator 없음 | refund engine/UI | 취소·반품 계산 | P3 |
| 판매자 문의·사기 문자 | 개인정보 없는 문의와 안전 시나리오 | 일부 안전 콘텐츠만 존재 | 주문과 연결 안 됨 | 부분 구현 | 주문번호 연결·문의 완료 흐름 없음 | 주문 모델 없음 | after-sales UI | 개인정보·안전 E2E | P3 |
| 테스트 계약 식별자 | 고정 `data-testid` 목록 | 쇼핑 코드 전체 | production에서 0개 | 미구현 | 첨부 테스트가 첫 locator부터 실패 | 기존 테스트가 역할/텍스트 기반 | 각 공용 UI | 계약 테스트 7개 | P0 |
| 모바일·큰 글씨 | 360px, 48px, 키보드, axe | 공통 CSS·BigTextToggle | 360px 흐름/큰 글씨 작동, 넘침 없음 | 부분 구현 | 새 주문 화면이 없고 axe·4 viewport 증거 없음 | 미구현 화면은 검증 불가 | shopping UI/test | axe·visual·keyboard | P4 |
| 제휴 분리 | 완료 뒤 별도 영역, 실제 링크·고지 | `ShoppingResult.tsx`, product collection, `AffiliateCard` | 실제 링크와 고지 확인 | 완료 | 주문 완료 흐름과는 아직 연결 안 됨 | 현재 미션 결과에만 연결 | 향후 order-complete adapter | separation E2E | P5 |

## 7. 첨부 계약 테스트 판정

계약 테스트 파일을 저장소에 복사하거나 제품 코드를 수정하지 않고, 현재 production과 소스 구조를 기준으로 각 테스트의 첫 실패 지점을 판정했다.

| 계약 테스트 | 예상 결과 | 첫 실패 지점 | 근거 |
|---|---|---|---|
| 메인에서 검색부터 주문 완료 | 실패 | `practice-disclosure` 또는 `shopping-search-input` 없음 | `/shopping`은 미션 허브이고 `data-testid`가 0개 |
| 배송비 포함 예산 초과 수정 | 실패 | `/shopping/practice/rainy-season-budget-30000` 404 | 현재 경로는 `/shopping/missions/rainy-budget-30000/practice` |
| 새로고침 후 장바구니·옵션 유지 | 실패 | 검색 testid 없음; 구현 경로에서도 상태 초기화 | cart/options 저장 모델 없음 |
| 배송 전 주문 취소·환불 | 실패 | `/shopping/test-fixtures/order/paid` 404 | 주문·취소·환불 모델 없음 |
| 배송중 취소 차단·배송조회 | 실패 | `/shopping/test-fixtures/order/shipped` 없음 | 상태 기계·tracking 없음 |
| 배송완료 반품 | 실패 | `/shopping/test-fixtures/order/delivered` 없음 | return/refund 없음 |
| 배송완료 교환 | 실패 | 같은 fixture 없음 | exchange/stock/price difference 없음 |

### 계약 자체에서 먼저 정규화해야 할 이름

기술스펙, 현재 데이터, 계약 테스트의 식별자가 서로 다르다. 구현 전에 하나를 기준으로 확정해야 불필요한 어댑터와 중복 데이터가 생기지 않는다.

| 대상 | 현재 구현 | 계약 테스트 |
|---|---|---|
| 케이블 product id | `cable-usbc-white-2m` | `usb-c-2m-white` |
| 장마 미션 slug | `rainy-budget-30000` | `rainy-season-budget-30000` |
| 우산 product id | `rain-umbrella-navy` | `umbrella` |
| 제습 product id | `rain-dehumidifier-eight` | `dehumidifier-pack` |
| 미끄럼방지 product id | `rain-anti-slip-tape` | `anti-slip-tape` |
| 연습 route | `/shopping/missions/[slug]/practice` | `/shopping/practice/[slug]` |

권장안은 새 공용 도메인의 canonical ID를 계약 테스트와 맞추고, 기존 미션 데이터는 migration/adapter로 연결하는 것이다. 기존 URL은 바로 삭제하지 말고 redirect 또는 호환 route로 유지해야 북마크와 production 링크가 깨지지 않는다.

## 8. 테스트 결과와 실패 자료

### 8.1 현재 저장소 테스트

실행 명령:

```text
npm.cmd exec playwright test tests/shopping.spec.ts
```

결과:

- 4개 테스트의 assertion은 모두 `ok`
- 검증 내용: 허브 모바일, 첫 미션 완료, 오답 설명·수정, 장마 예산 미션
- 다만 명령 프로세스는 결과 출력 뒤 120초 내 종료되지 않아 도구가 `exit 124`로 중단함
- web server 로그에는 로컬 테스트 환경의 쿠팡 키 없음 메시지가 있었음. production에서는 실제 쿠팡 링크를 별도로 확인함

이는 제품 assertion 실패가 아니라 **테스트 실행기/웹서버 종료 문제**로 따로 조사해야 한다. 새 계약 테스트 7개는 현재 앱에 넣지 않았으며, 위 표의 필수 route/testid/domain 부재 때문에 현재 상태에서 통과할 수 없다.

### 8.2 브라우저 콘솔

```text
완료 흐름: []
제휴 상품 영역: []
```

## 9. 원인 분석

핵심 원인은 현재 구현이 `ShoppingPracticeRunner` 한 컴포넌트의 미션별 reducer와 evaluator를 중심으로 만들어졌기 때문이다. 이 구조는 짧은 학습 미션에는 적합하지만, 상품 옵션이 장바구니·체크아웃·주문·배송·취소·반품까지 동일하게 유지되어야 하는 공용 쇼핑 도메인을 대체하지 못한다.

특히 다음 연결이 끊겨 있다.

```text
Product/Variant
  → CartLine
  → CheckoutSummary
  → PracticeOrder
  → OrderState/History
  → Cancel/Return/Exchange/Refund
```

현재는 각 미션의 성공 여부를 계산한 뒤 결과만 저장한다. 따라서 기존 러너에 화면을 계속 붙이는 방식으로는 주문 이후 기능의 상태 일관성, 새로고침 복구, 금액 계산 재사용, 테스트 fixture를 안정적으로 만들기 어렵다.

## 10. 권장 실행 계획

### P0 — 접근 유지와 한 주문의 완주, 이어하기 차단 해소

1. 현재 메인·키오스크 진입 링크를 회귀 테스트로 고정한다.
2. canonical route와 ID를 확정하고 기존 route redirect 정책을 정한다.
3. `/shopping`에 공용 검색 진입과 고정 안전 고지를 제공한다.
4. C타입 2m 1개를 검색→상세→옵션→장바구니→체크아웃→모의 결제→주문 완료까지 완주하게 한다.
5. 실제 개인정보 대신 고정 가상 배송지와 마스킹 결제수단만 사용한다.
6. `data-testid` 계약을 구현한다.
7. 새로고침 후 옵션·장바구니·현재 단계가 복원되게 한다.

완료 기준: 첨부 계약의 첫 테스트와 resume 테스트가 통과하고, production 직접 URL에서 같은 결과가 난다.

### P1 — 공용 장바구니·옵션·금액·주문 엔진

1. `features/shopping/domain`에 Product/Variant/CartLine/CheckoutSummary/PracticeOrder를 분리한다.
2. `calculateLineTotal`, `calculateShipping`, `calculateDiscount`, `calculateCheckoutSummary`, `validateVariant`를 순수 함수로 만든다.
3. cart v2, orders v2, progress v2 저장소와 migration을 만든다.
4. 옵션 변경이 상세·장바구니·체크아웃·주문에 동일하게 반영되게 한다.
5. 장마 예산 미션을 공용 장바구니 엔진 위에 adapter로 올린다.
6. 배송비 포함 초과 시 checkout을 막고, 라인 제거 후 즉시 풀리게 한다.

완료 기준: purchase, budget, resume 계약 테스트 통과 및 계산 단위 테스트 통과.

### P2 — 주문 상태·배송조회

1. `transitionOrder`와 `getAvailableOrderActions`를 상태 표 기반으로 구현한다.
2. scenario clock과 deterministic fixture를 만든다.
3. 주문 목록·상세·배송조회와 상태 이력을 구현한다.
4. 배송중에는 취소 버튼이 없어지고 배송조회만 가능하게 한다.

완료 기준: shipped fixture 계약 테스트와 상태 전환 단위 테스트 통과.

### P3 — 취소·반품·교환·환불

1. PAID/PREPARING 취소, SHIPPED 취소 차단을 구현한다.
2. DELIVERED 반품·교환 흐름을 구현한다.
3. 귀책별 반품 배송비, 쿠폰 복원, 일부 수량 환불을 순수 함수로 계산한다.
4. 교환 옵션 재고와 가격 차이를 검증한다.
5. 모든 전환을 order history에 기록한다.

완료 기준: 첨부 취소·반품·교환 계약 테스트 및 환불 계산 단위 테스트 통과.

### P4 — 모바일·접근성·회귀

1. 360×800, 390×844, 768×1024, 1440×900 시각 검증을 추가한다.
2. 큰 글씨에서 버튼 겹침과 잘림이 없게 한다.
3. 키보드만으로 전체 흐름을 완주하게 한다.
4. 모든 입력 label, 오류 요약·포커스 이동, 48px 목표 크기, axe 위반 0을 검증한다.
5. 기존 키오스크 전체 회귀 테스트를 실행한다.
6. 테스트 종료 지연(exit 124)의 원인을 정리한다.

### P5 — 실물 이미지·쿠팡 파트너스

1. 연습 상품과 실제 제휴 상품의 데이터·UI 경계를 유지한다.
2. 실제 링크는 결과 또는 주문 완료 뒤 별도 영역에서만 노출한다.
3. 광고 표기와 대가성 문구를 링크와 같은 카드에 유지한다.
4. 키가 없거나 API가 실패하면 구매 유도 없이 안내만 표시한다.

## 11. 구현 시작 전 결론

현재 기능을 전부 버릴 필요는 없다. 미션 콘텐츠, 연습 이미지, evaluator의 학습 피드백, 결과 뒤 제휴 분리는 재사용할 수 있다. 다만 `ShoppingPracticeRunner`에 주문 이후 화면을 계속 붙이지 말고, 먼저 공용 도메인·계산·저장·상태 기계를 만든 뒤 기존 4개 미션을 그 위에 adapter로 연결해야 한다.

가장 먼저 해결할 범위는 **P0 + P1의 세로 한 줄**이다.

```text
C타입 검색
→ 상품/옵션 선택
→ 공용 장바구니
→ 배송비 포함 계산
→ 가상 배송지/결제수단
→ 모의 결제
→ PracticeOrder 생성
→ 새로고침 복구
```

이 흐름이 실제 브라우저에서 완주되고 저장되기 전에는 주문 이후 P2·P3 화면을 먼저 만드는 것이 적절하지 않다. 주문 객체와 상태 이력이 없으면 취소·반품·교환 화면이 다시 정적 카드가 되기 때문이다.
