import { test, expect, type Page } from "@playwright/test";

// 든든카페 엔진 v2 — 명세 14장 상태 머신·브라우저 테스트의 핵심 흐름 3종.
// (결제 지연 연출이 1.5초라 완료 화면 대기는 넉넉히 잡는다)

async function waitPaymentDone(page: Page) {
  // exact: 천천히 모드의 안내 배너에도 같은 문장이 나와 중복 매칭될 수 있다
  await expect(page.getByText(/^(?:결제|발급) 정보를 확인하고 있어요$/)).toBeVisible();
  await expect(page.getByRole("heading", { name: /영수증을 받으시겠어요|카드를 읽지 못했어요/ })).toBeVisible({ timeout: 8000 });
}

test("홈 오늘의 연습은 표시된 실제 시나리오로 바로 연결된다", async ({ page }) => {
  await page.goto("/");

  const dailyCard = page.locator('section[aria-labelledby="today-mission-title"]');
  const homeText = await dailyCard.locator(".dd-mission-description").innerText();
  const startLink = dailyCard.getByRole("link", { name: "오늘 임무 바로 시작" });
  const href = await startLink.getAttribute("href");

  expect(href).toMatch(/^\/kiosk\/(cafe|fastfood|ticket|parking|mart|atm|civil)\/[a-z0-9-]+$/);
  await startLink.click();
  await expect(page).toHaveURL(new RegExp(`${href!.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`));
  await expect(page.getByText(homeText, { exact: false }).first()).toBeVisible();
});

test("7종 키오스크가 중앙 설정의 도전 설명과 안전 안내를 표시한다", async ({ page }) => {
  const cases = [
    ["cafe", "화면 배치가 달라지고, 상품 품절이나 결제 오류가 생길 수 있어요.", "이 화면은 연습용입니다. 실제 주문이나 결제는 이루어지지 않아요."],
    ["fastfood", "메뉴 구성이 달라지고, 상품 품절이나 쿠폰·결제 오류가 생길 수 있어요.", "이 화면은 연습용입니다. 실제 주문이나 결제는 이루어지지 않아요."],
    ["ticket", "원하는 시간이 매진되거나 좌석 선택과 결제 과정에서 문제가 생길 수 있어요.", "이 화면은 연습용입니다. 실제 예매나 결제는 이루어지지 않아요."],
    ["parking", "차량 검색 실패나 할인 적용, 카드 결제 오류가 생길 수 있어요.", "이 화면은 연습용입니다. 실제 차량 조회나 주차요금 결제는 이루어지지 않아요."],
    ["mart", "바코드 인식, 상품 수량, 무게 확인이나 결제 오류가 생길 수 있어요.", "이 화면은 연습용입니다. 실제 상품 구매나 결제는 이루어지지 않아요."],
    ["atm", "카드 인식, 비밀번호 입력이나 거래 과정에서 오류가 생길 수 있어요.", "이 화면은 연습용입니다. 실제 출금·입금·이체는 이루어지지 않아요."],
    ["civil", "본인 확인, 항목 선택, 출력이나 결제 과정에서 오류가 생길 수 있어요.", "이 화면은 연습용입니다. 실제 서류 발급이나 개인정보 입력은 이루어지지 않아요."],
  ] as const;

  for (const [kioskType, challengeDescription, safetyMessage] of cases) {
    await page.goto(`/kiosk/${kioskType}`);
    await expect(page.getByText(challengeDescription, { exact: true })).toBeVisible();
    await expect(page.getByText(safetyMessage, { exact: false })).toBeVisible();
  }

  for (const kioskType of ["atm", "parking", "civil"]) {
    await page.goto(`/kiosk/${kioskType}`);
    await expect(page.getByText(/품절/)).toHaveCount(0);
  }
});

test("FAQ·생활안전 명칭과 홈 메타데이터가 현재 방향에 맞는다", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("시니어든든 | 실제처럼 눌러보는 디지털 생활 놀이터");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "카페 주문, 기차표 예매, 주차 정산, 마트 셀프계산대와 ATM까지 실제처럼 눌러보며 연습하는 무료 시니어 디지털 놀이터입니다."
  );
  await page.getByRole("button", { name: "가족이나 다른 사람과 함께 사용해도 되나요?" }).click();
  await expect(page.getByText(/실제 화면을 직접 눌러보는 것이 가장 좋은 연습/)).toBeVisible();

  await page.goto("/stories");
  await expect(page.getByRole("heading", { name: "누르기 전에 한 번 더 확인해요" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "그림을 넘기며 확인해요" })).toBeVisible();
  await expect(page.getByText(/그림책/)).toHaveCount(0);
});

test("이번 주 세 가지 기록이 있으면 홈과 내 기록에 주간 도장이 표시된다", async ({ page }) => {
  await page.goto("/");

  const weeklyCard = page.locator('section[aria-labelledby="weekly-challenge-title"]');
  const hrefs = await weeklyCard.getByRole("link", { name: "연습하기" }).evaluateAll((links) =>
    links.map((link) => link.getAttribute("href")).filter((href): href is string => Boolean(href))
  );
  const ids = [...new Set(hrefs.map((href) => href.split("/")[2]).filter(Boolean))];
  expect(ids).toHaveLength(3);

  await page.evaluate((challengeIds) => {
    const now = new Date().toISOString();
    localStorage.setItem(
      "dd-progress-v1",
      JSON.stringify({
        counts: Object.fromEntries(challengeIds.map((id) => [id, 1])),
        lastId: challengeIds.at(-1),
        lastAt: now,
        recent: challengeIds.map(() => now),
        scenarios: [],
        log: challengeIds.map((id) => ({ id, at: now })),
      })
    );
  }, ids);

  await page.reload();
  await expect(weeklyCard.getByText("3 / 3 완료", { exact: true })).toBeVisible();
  await expect(weeklyCard.getByRole("link", { name: "받은 도장 확인" })).toBeVisible();

  await page.goto("/records");
  const weeklyStamp = page.getByText("이번 주 도전 완료", { exact: true }).locator("..");
  await expect(weeklyStamp.getByText("받았어요!", { exact: true })).toBeVisible();
});

test("천천히 배우기: 따뜻한 아메리카노 포장 임무를 완수한다", async ({ page }) => {
  await page.goto("/kiosk/cafe/cafe-learn-americano");
  await expect(page.getByTestId("actual-shopping-ad")).toHaveCount(0);
  await page.getByRole("button", { name: /연습 시작/ }).click();

  // 안내 배너(천천히 모드는 상시)와 강조 대상 확인
  await expect(page.getByText(/포장하기.*눌러 보세요/)).toBeVisible();
  await page.getByRole("button", { name: /포장하기/ }).click();

  await page.getByRole("button", { name: /아메리카노/ }).click();
  await page.getByRole("button", { name: "따뜻하게" }).click();
  await page.getByRole("button", { name: "수량 늘리기" }).click();
  await page.getByRole("button", { name: /담기 ·/ }).click();

  await page.getByRole("button", { name: /주문 확인/ }).click();
  await page.getByRole("button", { name: /결제하기/ }).click();
  await page.getByRole("button", { name: /💳 카드/ }).click();
  await waitPaymentDone(page);
  await page.getByRole("button", { name: "받지 않기" }).click();

  await expect(page.getByRole("heading", { name: /임무 완수/ })).toBeVisible();
  await expect(page.getByText("포장하기 (가져가기) 선택")).toBeVisible();
  await expect(page.getByText(/아메리카노.*2잔 담기/)).toBeVisible();
  const actualShoppingAd = page.getByTestId("actual-shopping-ad");
  await expect(actualShoppingAd.getByRole("heading", { name: "광고 · 여기부터는 실제 쇼핑입니다" })).toBeVisible();
  await expect(actualShoppingAd).toContainText("이 게시물은 쿠팡 파트너스 활동의 일환으로");
  const actualShoppingLink = actualShoppingAd.getByRole("link", { name: "쿠팡에서 실제 상품 보기 ↗" });
  await expect(actualShoppingLink).toHaveAttribute("target", "_blank");
  await expect(actualShoppingLink).toHaveAttribute("rel", /sponsored/);
  const completionActionsBottom = await page.getByTestId("kiosk-completion-actions").evaluate((element) => element.getBoundingClientRect().bottom);
  const adTop = await actualShoppingAd.evaluate((element) => element.getBoundingClientRect().top);
  expect(adTop).toBeGreaterThan(completionActionsBottom + 30);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);

  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("dd-progress-v1") ?? "{}"));
  expect(saved.counts?.cafe).toBe(1);
  expect(saved.scenarios).toContain("cafe-learn-americano");
  expect(saved.lastId).toBe("cafe");
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
  await expect(page.getByTestId("actual-shopping-ad")).toHaveCount(0);
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

  await page.getByRole("button", { name: /발급 항목 확인/ }).click();
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

  await page.getByRole("button", { name: /상품 확인/ }).click();
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

  // 상품 확인: 한 줄에 2개로 합쳐져 있어야 한다
  await page.getByRole("button", { name: /상품 확인 \(1\)/ }).click();
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

  await page.getByRole("button", { name: /예매 확인/ }).click();
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
  await page.getByRole("button", { name: /상품 확인/ }).click();
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
