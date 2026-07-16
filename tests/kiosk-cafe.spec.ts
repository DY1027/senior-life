import { test, expect, type Page } from "@playwright/test";

// 든든카페 엔진 v2 — 명세 14장 상태 머신·브라우저 테스트의 핵심 흐름 3종.
// (결제 지연 연출이 1.5초라 완료 화면 대기는 넉넉히 잡는다)

async function waitPaymentDone(page: Page) {
  // exact: 천천히 모드의 안내 배너에도 같은 문장이 나와 중복 매칭될 수 있다
  await expect(page.getByText("결제 정보를 확인하고 있어요", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: /영수증을 받으시겠어요|카드를 읽지 못했어요/ })).toBeVisible({ timeout: 8000 });
}

test("천천히 배우기: 따뜻한 아메리카노 포장 임무를 완수한다", async ({ page }) => {
  await page.goto("/kiosk/cafe/cafe-learn-americano");
  await page.getByRole("button", { name: /연습 시작/ }).click();

  // 안내 배너(천천히 모드는 상시)와 강조 대상 확인
  await expect(page.getByText(/포장하기.*눌러 보세요/)).toBeVisible();
  await page.getByRole("button", { name: /포장하기/ }).click();

  await page.getByRole("button", { name: /아메리카노/ }).click();
  await page.getByRole("button", { name: "따뜻하게" }).click();
  await page.getByRole("button", { name: /담기 ·/ }).click();

  await page.getByRole("button", { name: /주문 확인/ }).click();
  await page.getByRole("button", { name: /결제하기/ }).click();
  await page.getByRole("button", { name: /💳 카드/ }).click();
  await waitPaymentDone(page);
  await page.getByRole("button", { name: "받지 않기" }).click();

  await expect(page.getByRole("heading", { name: /임무 완수/ })).toBeVisible();
  await expect(page.getByText("포장하기 (가져가기) 선택")).toBeVisible();
});

test("실제처럼 도전: 카드 인식 실패를 해결하고 두 상품을 주문한다", async ({ page }) => {
  await page.goto("/kiosk/cafe/cafe-challenge-cardfail");
  await page.getByRole("button", { name: /연습 시작/ }).click();
  await page.getByRole("button", { name: /포장하기/ }).click();

  // 왼쪽 배치 변형에서도 카테고리·상품을 찾는다
  await page.getByRole("button", { name: /카페라테/ }).click();
  await page.getByRole("button", { name: "차갑게" }).click();
  await page.getByRole("button", { name: /담기 ·/ }).click();
  await page.getByRole("button", { name: "빵·간식" }).click();
  await page.getByRole("button", { name: /쿠키/ }).click(); // 옵션 없는 상품 → 바로 담김

  await page.getByRole("button", { name: /주문 확인/ }).click();
  await page.getByRole("button", { name: /결제하기/ }).click();
  await page.getByRole("button", { name: /💳 카드/ }).click();

  // ErrorEngine: 첫 결제는 실패해야 한다
  await expect(page.getByRole("heading", { name: "카드를 읽지 못했어요" })).toBeVisible({ timeout: 8000 });
  await page.getByRole("button", { name: /다시 넣고 시도/ }).click();
  await expect(page.getByRole("heading", { name: /영수증을 받으시겠어요/ })).toBeVisible({ timeout: 8000 });
  await page.getByRole("button", { name: "받지 않기" }).click();

  await expect(page.getByRole("heading", { name: /임무 완수/ })).toBeVisible();
  await expect(page.getByText("카드 인식 실패를 해결하고 결제를 다시 시도했어요")).toBeVisible();
});

test("혼자 연습하기: 잘못 담긴 메뉴를 삭제하고 임무를 완수한다", async ({ page }) => {
  await page.goto("/kiosk/cafe/cafe-solo-fix-cart");
  await page.getByRole("button", { name: /연습 시작/ }).click();
  await page.getByRole("button", { name: /포장하기/ }).click();

  // 미리 담겨 있는 아이스티를 장바구니에서 삭제 (임무 배너에도 '아이스티'가 있어 카드 텍스트로 확인)
  await page.getByRole("button", { name: /주문 확인/ }).click();
  await expect(page.getByText("🧋 아이스티")).toBeVisible();
  await page.getByRole("button", { name: /삭제/ }).click();
  await expect(page.getByText("🧋 아이스티")).toBeHidden();

  // 메뉴로 돌아가 유자차 담기
  await page.getByRole("button", { name: /메뉴로 돌아가기/ }).click();
  await page.getByRole("button", { name: "차·음료" }).click();
  await page.getByRole("button", { name: /유자차/ }).click();
  await page.getByRole("button", { name: "따뜻하게" }).click();
  await page.getByRole("button", { name: /담기 ·/ }).click();

  await page.getByRole("button", { name: /주문 확인/ }).click();
  await page.getByRole("button", { name: /결제하기/ }).click();
  await page.getByRole("button", { name: /💳 카드/ }).click();
  await waitPaymentDone(page);
  await page.getByRole("button", { name: "받지 않기" }).click();

  await expect(page.getByRole("heading", { name: /임무 완수/ })).toBeVisible();
  await expect(page.getByText("잘못 담긴 메뉴를 직접 삭제했어요")).toBeVisible();
});

test("든든버거: 세트 음료를 사이다로 바꾸고 임무를 완수한다", async ({ page }) => {
  await page.goto("/kiosk/fastfood/burger-solo-change-drink");
  await page.getByRole("button", { name: /연습 시작/ }).click();
  await page.getByRole("button", { name: /매장에서 먹기/ }).click();

  await page.getByRole("button", { name: /새우버거 세트/ }).click();
  await page.getByRole("button", { name: "사이다" }).click(); // 콜라(기본) → 사이다
  await page.getByRole("button", { name: /담기 ·/ }).click();

  await page.getByRole("button", { name: /주문 확인/ }).click();
  await page.getByRole("button", { name: /결제하기/ }).click();
  await page.getByRole("button", { name: /💵 현금/ }).click();
  await waitPaymentDone(page);
  await page.getByRole("button", { name: "받지 않기" }).click();

  await expect(page.getByRole("heading", { name: /임무 완수/ })).toBeVisible();
  await expect(page.getByText(/새우버거 세트 \(사이다\)/)).toBeVisible();
});

test("든든민원: 주문 방법 단계 없이 서류를 발급한다", async ({ page }) => {
  await page.goto("/kiosk/civil/civil-learn-deungbon");
  await page.getByRole("button", { name: /연습 시작/ }).click();

  // 발급기는 주문 방법 단계를 건너뛰고 바로 서류 선택으로 간다
  await page.getByRole("button", { name: /주민등록등본/ }).click();
  await page.getByRole("button", { name: /뒷자리 가리기/ }).click();
  await page.getByRole("button", { name: /담기 ·/ }).click();

  await page.getByRole("button", { name: /주문 확인/ }).click();
  await page.getByRole("button", { name: /수수료 결제하기/ }).click();
  await page.getByRole("button", { name: /💵 현금/ }).click();
  await waitPaymentDone(page);
  await page.getByRole("button", { name: "받지 않기" }).click();

  await expect(page.getByRole("heading", { name: /임무 완수/ })).toBeVisible();
});

test("든든주차: 키패드로 차 번호를 입력하고 요금을 정산한다", async ({ page }) => {
  await page.goto("/kiosk/parking/parking-learn-card");
  await page.getByRole("button", { name: /연습 시작/ }).click();

  // 숫자판으로 4자리 입력 → 확인
  for (const d of ["1", "2", "3", "4"]) {
    await page.getByRole("button", { name: d, exact: true }).click();
  }
  await page.getByRole("button", { name: "확인", exact: true }).click();

  // 내 차 고르기 → 요금 고르면 바로 결제로
  await page.getByRole("button", { name: /흰색 승용차/ }).click();
  await page.getByRole("button", { name: /할인 없이 정산/ }).click();
  await expect(page.getByRole("heading", { name: /어떻게 계산할까요/ })).toBeVisible();

  await page.getByRole("button", { name: /💳 카드/ }).click();
  await waitPaymentDone(page);
  await page.getByRole("button", { name: "받지 않기" }).click();

  await expect(page.getByRole("heading", { name: /임무 완수/ })).toBeVisible();
});

test("든든마트: 바코드 인식 실패를 재스캔으로 해결하고 계산한다", async ({ page }) => {
  await page.goto("/kiosk/mart/mart-challenge-scanfail");
  await page.getByRole("button", { name: /연습 시작/ }).click();
  await page.getByRole("button", { name: /적립 안 함/ }).click();

  // 첫 스캔은 실패한다 (ErrorEngine: scanFailOnce)
  await page.getByRole("button", { name: /우유/ }).click();
  await expect(page.getByText(/바코드를 읽지 못했어요/)).toBeVisible();
  // 같은 상품을 다시 스캔하면 담긴다
  await page.getByRole("button", { name: /우유/ }).click();
  await page.getByRole("button", { name: /라면 묶음/ }).click();

  await page.getByRole("button", { name: /주문 확인/ }).click();
  await page.getByRole("button", { name: /결제하기/ }).click();
  await page.getByRole("button", { name: /💳 카드/ }).click();
  await waitPaymentDone(page);
  await page.getByRole("button", { name: "받기", exact: true }).click();

  await expect(page.getByRole("heading", { name: /임무 완수/ })).toBeVisible();
  await expect(page.getByText("바코드가 안 읽혀도 침착하게 다시 스캔했어요")).toBeVisible();
});

test("든든마트: 같은 상품을 두 번 스캔하면 수량이 합쳐진다", async ({ page }) => {
  await page.goto("/kiosk/mart/mart-solo-double-scan");
  await page.getByRole("button", { name: /연습 시작/ }).click();
  await page.getByRole("button", { name: /적립 안 함/ }).click();

  await page.getByRole("button", { name: /라면 묶음/ }).click();
  await page.getByRole("button", { name: /라면 묶음/ }).click();

  // 주문 확인: 한 줄에 2개로 합쳐져 있어야 한다
  await page.getByRole("button", { name: /주문 확인 \(1\)/ }).click();
  await expect(page.getByText("2개")).toBeVisible();

  await page.getByRole("button", { name: /결제하기/ }).click();
  await page.getByRole("button", { name: /💳 카드/ }).click();
  await waitPaymentDone(page);
  await page.getByRole("button", { name: "받지 않기" }).click();

  await expect(page.getByRole("heading", { name: /임무 완수/ })).toBeVisible();
});

test("든든기차: 매진을 만나도 다른 시간 표를 예매한다", async ({ page }) => {
  await page.goto("/kiosk/ticket/ticket-challenge-soldout");
  await page.getByRole("button", { name: /연습 시작/ }).click();
  await page.getByRole("button", { name: /편도/ }).click();

  // 임무의 우선 선택(오전 9시)은 매진 — 눌러도 담기지 않고 안내가 나온다
  await page.getByRole("button", { name: /오전 9시/ }).click();
  await expect(page.getByText(/품절이에요/)).toBeVisible();

  // 허용된 대체 시간 중 오전 10시를 선택해 예매
  await page.getByRole("button", { name: /대전 · 오전 10시/ }).click();
  await page.getByRole("button", { name: "복도 자리" }).click();
  await page.getByRole("button", { name: /담기 ·/ }).click();

  await page.getByRole("button", { name: /주문 확인/ }).click();
  await page.getByRole("button", { name: /결제하기/ }).click();
  await page.getByRole("button", { name: /💳 카드/ }).click();
  await waitPaymentDone(page);
  await page.getByRole("button", { name: "받기", exact: true }).click();

  await expect(page.getByRole("heading", { name: /임무 완수/ })).toBeVisible();
  await expect(page.getByText(/오전 9시.*오전 10시.*오후 2시.*1장 담기/)).toBeVisible();
});

test("든든ATM: 연습 비밀번호로 출금하고 카드 회수 안내를 본다", async ({ page }) => {
  await page.goto("/kiosk/atm/atm-learn-withdraw");
  await page.getByRole("button", { name: /카드 넣기/ }).click();

  // 연습 비밀번호 1234 — 화면에는 ●로 가려진다
  for (const d of ["1", "2", "3", "4"]) {
    await page.getByRole("button", { name: d, exact: true }).click();
  }
  await expect(page.getByLabel("입력한 번호")).toContainText("●");
  await page.getByRole("button", { name: "확인", exact: true }).click();

  // 업무 선택(3만원 찾기) → 확인 화면(보이스피싱 경고 노출)
  await page.getByRole("button", { name: /3만원 찾기/ }).click();
  await expect(page.getByText(/거래 내용을 확인해 주세요/)).toBeVisible();
  await expect(page.getByText(/112에 전화하세요/)).toBeVisible();
  await page.getByRole("button", { name: /확인하고 진행하기/ }).click();

  await expect(page.getByRole("heading", { name: /명세표를 받으시겠어요/ })).toBeVisible({ timeout: 8000 });
  await page.getByRole("button", { name: "받지 않기" }).click();

  await expect(page.getByRole("heading", { name: /임무 완수/ })).toBeVisible();
  await expect(page.getByText(/카드를 잊지 말고 꼭 챙기세요/)).toBeVisible();
});

test("영수증 프린터 오류를 '다시 출력'으로 해결한다", async ({ page }) => {
  await page.goto("/kiosk/cafe/cafe-challenge-printer");
  await page.getByRole("button", { name: /연습 시작/ }).click();
  await page.getByRole("button", { name: /매장에서 먹기/ }).click();
  await page.getByRole("button", { name: /아메리카노/ }).click();
  await page.getByRole("button", { name: "따뜻하게" }).click();
  await page.getByRole("button", { name: /담기 ·/ }).click();
  await page.getByRole("button", { name: /주문 확인/ }).click();
  await page.getByRole("button", { name: /결제하기/ }).click();
  await page.getByRole("button", { name: /💳 카드/ }).click();
  await waitPaymentDone(page);

  // 영수증 받기 → 프린터 오류 → 다시 출력으로 해결
  await page.getByRole("button", { name: "받기", exact: true }).click();
  await expect(page.getByRole("heading", { name: "영수증이 나오지 않아요" })).toBeVisible();
  await page.getByRole("button", { name: /다시 출력하기/ }).click();

  await expect(page.getByRole("heading", { name: /임무 완수/ })).toBeVisible();
  await expect(page.getByText("영수증이 안 나올 때 '다시 출력'으로 해결했어요")).toBeVisible();
});

test("시간 초과 안내가 나와도 이어서 연습할 수 있다", async ({ page }) => {
  await page.goto("/kiosk/mart/mart-challenge-timeout");
  await page.getByRole("button", { name: /연습 시작/ }).click();
  await page.getByRole("button", { name: /적립 안 함/ }).click();

  // 메뉴에서 15초 기다리면 안내가 뜬다 (임무 문구에도 같은 표현이 있어 exact 매칭)
  await expect(page.getByText("아직 계신가요?", { exact: true })).toBeVisible({ timeout: 20000 });
  await page.getByRole("button", { name: /네, 이어서 할게요/ }).click();
  await expect(page.getByText("아직 계신가요?", { exact: true })).toBeHidden();

  // 이어서 임무 완수
  await page.getByRole("button", { name: /우유/ }).click();
  await page.getByRole("button", { name: /두부/ }).click();
  await page.getByRole("button", { name: /주문 확인/ }).click();
  await page.getByRole("button", { name: /결제하기/ }).click();
  await page.getByRole("button", { name: /💳 카드/ }).click();
  await waitPaymentDone(page);
  await page.getByRole("button", { name: "받지 않기" }).click();

  await expect(page.getByRole("heading", { name: /임무 완수/ })).toBeVisible();
  await expect(page.getByText("시간 초과 안내에서 '이어서 하기'를 눌러 계속했어요")).toBeVisible();
});

test("상황 카드를 뽑으면 이번 판에 상황이 추가된다", async ({ page }) => {
  // 자유 연습에서 카드 뽑기 — 어떤 카드가 나와도 안내문이 표시돼야 한다
  await page.goto("/kiosk/cafe/cafe-free");
  await page.getByRole("button", { name: /상황 카드 뽑기/ }).click();
  await expect(page.getByText(/오늘의 상황 카드/)).toBeVisible();
  // 뽑은 뒤에는 다시 뽑기 버튼이 사라진다 (한 판에 한 장)
  await expect(page.getByRole("button", { name: /상황 카드 뽑기/ })).toBeHidden();
  await page.getByRole("button", { name: /연습 시작/ }).click();
  await expect(page.getByRole("button", { name: /매장에서 먹기/ })).toBeVisible();
});

test("이전 버튼으로 어느 화면에서도 되돌아갈 수 있다", async ({ page }) => {
  await page.goto("/kiosk/cafe/cafe-free");
  await page.getByRole("button", { name: /연습 시작/ }).click();
  await page.getByRole("button", { name: /매장에서 먹기/ }).click();
  await expect(page.getByRole("button", { name: /아메리카노/ })).toBeVisible();

  // 메뉴 → 주문 방법 → (다시 진행)
  await page.getByRole("button", { name: "← 이전" }).click();
  await expect(page.getByRole("button", { name: /매장에서 먹기/ })).toBeVisible();
  await page.getByRole("button", { name: /매장에서 먹기/ }).click();

  // 처음부터 버튼은 intro로 되돌린다
  await page.getByRole("button", { name: /처음부터/ }).click();
  await expect(page.getByRole("button", { name: /연습 시작/ })).toBeVisible();
});
