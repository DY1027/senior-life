# 시니어 든든 — 에이전트 인수인계 문서

> 최종 업데이트: 2026-07-15 (연습 놀이터 전면 전환)
> 저장소: https://github.com/DY1027/senior-life

---

## 1. 프로젝트 개요 (2026-07-15 방향 전환)

> **시니어든든은 생활 속 디지털 기기를 실제처럼 연습하고, 놀이처럼 반복해서 익히는 무료 연습 공간입니다.**

정보 포털이 아니라 **"실제처럼 눌러보는 시니어 디지털 놀이터"**로 좁혔다 (소유자 결정).
운영 비중: 실제 생활기기 연습 70% · 놀이·반복 방문 기능 20% · 생활안전·제휴상품 10%.
마스코트는 강아지 "든든이". 어린이용처럼 만들지 않되, 캐릭터·축하 효과는 유지.

- **도메인**: seniordeundun.com
- **배포**: Vercel
- **회원/DB**: 없음 — 회원가입·로그인·Supabase 전부 제거됨. 연습 기록은 브라우저 localStorage에만 저장
- **애널리틱스**: Google Analytics 4

### 2026-07-15 전환에서 한 일
- **삭제**: 건강·병원 콘텐츠 전체(`app/health`, MedicationSummary, HospitalChecklistPreview), 병원 접수 키오스크,
  로그인·회원가입·admin·Supabase(패키지 의존성까지), 환불규정 페이지.
  삭제된 주소는 `next.config.ts`의 `redirects()`가 308로 안내한다.
- **메뉴에서 강등(주소는 유지)**: 복지혜택·노후재정·생활팁 — 검색 유입용으로 페이지·sitemap은 남기되
  홈·헤더·푸터 어디에도 노출하지 않는다 ("생활정보 보관함" 취급).
- **새 메뉴**: 홈 | 생활기기 연습(/kiosk) | 오늘의 놀이터(/play) | 생활안전(/stories) | 이용안내(/guide).
  헤더 오른쪽은 글자 크게 + 처음으로. 모바일은 하단 탭바(`components/MobileTabBar.tsx`) 홈|연습|오늘의 놀이|내 기록.
- **새 홈**: 히어로(서비스 한 문장+시작 버튼 2개) → 오늘의 연습(일별 임무, `lib/practices.ts` `todayMission`)
  → 연습 그리드(도장 표시) → 오늘의 놀이터 → 지난번 이어하기 → 새 연습 알림 → FAQ → 닫는 컷.
- **주차요금 정산기** 추가 (`content/kiosk/parking.json`, 가상 브랜드 "든든주차") — 일러스트가 아직 없어
  emoji 박스로 표시된다 (`Practice.img`가 없으면 emoji 폴백).
- **연습 기록**(`lib/progress.ts`): localStorage `dd-progress-v1`에 완료 횟수·마지막 연습만 저장(민감정보 없음).
  `useProgress()` 훅(useSyncExternalStore)으로 읽는다. KioskPlayer가 완료 시 `recordPracticeComplete` 호출.
  도장판·내 기록 화면은 `/records` (noindex).
- **연습·놀이 레지스트리** `lib/practices.ts`: 새 키오스크를 추가하면 여기 등록해야
  홈 그리드·허브 카테고리·도장판·오늘의 임무에 잡힌다. 예고는 `UPCOMING_PRACTICE` 한 개만.
- **약관·개인정보처리방침 전면 개정** (시행일 2026-07-15): 회원·결제(토스페이먼츠) 조항 삭제,
  연습용 콘텐츠·실기기 차이·광고 고지 명시. 방침은 "직접 수집 없음 + 자동수집(Vercel/GA4) + 기기저장" 구조.
  **localStorage 기록을 서버로 보내는 기능을 추가하면 방침 문구부터 고칠 것.**
- **광고 원칙(소유자 지시)**: 연습 진행 화면 안에는 절대 광고 금지. 완료 화면 아래·만들기 완성 화면·생활 콘텐츠
  하단만 허용, 페이지당 1영역, 상품 2~3개, **가격은 표기하지 않음**(AffiliateCard에서 제거됨).
  광고 표시 문구는 AffiliateCard에 내장. 자세한 원칙은 `/guide#ads`.

## 키오스크 엔진 v2 (2026-07-15, 기술 명세서 1.0 기반 — 최우선 프로젝트)

소유자가 준 「키오스크 시뮬레이터 고도화 기술 명세서 1.0」의 1~3단계 일부를 구현했다.
**공통 엔진 + 카탈로그 + 임무 시나리오** 구조이며, 든든카페가 첫 파일럿이다.

### 구조 (명세 11장 폴더 구조를 프로젝트 관례에 맞게 적용)
- `lib/kiosk-engine/` — 공통 엔진 (키오스크 종류와 무관)
  - `types.ts` — Catalog(상품·옵션·결제수단) / Scenario(임무·랜덤 이벤트·모드·배치 변형) / MachineState·Event
  - `machine.ts` — **상태 중심 리듀서** (intro→service→menu→options→cart→payMethod→processing→payError→receipt→done).
    XState 대신 타입 완전한 리듀서를 썼다(번들 절약, 전환이 한 파일에 명시). 이벤트 유니언이라 XState v5 이관 가능.
  - `evaluator.ts` — 임무 판정(evaluateMission: 과정 중심 점검표) + 안내 생성(nextGuidance: 다음 행동 1가지 + 강조 대상)
  - `schemas.ts` — Zod 검증. 카탈로그·시나리오는 모듈 로드 시 검증되므로 **데이터 실수는 빌드가 실패**한다
- `components/kiosk-engine/KioskRunner.tsx` — 공통 화면(KioskShell 포함).
  시스템 버튼 고정 배치(왼쪽 위 이전/가운데 단계/오른쪽 도움말/왼쪽 아래 처음부터),
  결제 지연 연출(1.5초), 카드 인식 실패→재시도, 품절 안내, 직원 호출, 과정 피드백 완료 화면
- `components/kiosk-engine/MissionList.tsx` — 모드별 임무 목록 + 임무별 완료 도장
- `content/kiosk-v2/cafe.ts` — 든든카페 카탈로그 + 임무 8종
- 라우트: `/kiosk/cafe`(임무 허브) → `/kiosk/cafe/[scenarioId]`(generateStaticParams)

### 연습 모드 (명세 6장)
- `learn` 천천히 배우기: 눌러야 할 버튼 반짝임(kg-target) + 안내 자동 음성
- `solo` 혼자 연습하기: 강조 없음, 도움말 버튼으로만 안내 (hintsUsed 기록)
- `challenge` 실제처럼 도전: 화면 배치 변형(layout: "left") + 랜덤 이벤트
- `free` 자유 연습: 임무·판정 없음

### 랜덤 이벤트 (ErrorEngine, 현재 2종)
- `cardFailOnce` — 첫 결제 시도 실패 → "카드 다시 넣고 시도" / 다른 결제수단 / 직원 호출
- `soldOutDecoy` — 임무와 무관한 상품 1개 품절 (품절 만나는 경험)
- 새 이벤트 추가: types.ts 유니언 → machine.ts(shouldPaymentFail 등) → KioskRunner 처리

### 새 임무·새 키오스크 추가 방법 (완료 기준 달성)
- **새 임무**: `content/kiosk-v2/cafe.ts`의 raw 배열에 JSON 한 덩이 추가 — 끝 (코드 수정 없음)
- **새 키오스크**: `content/kiosk-v2/{type}.ts`(카탈로그+시나리오) + 허브·시나리오 페이지 2개(카페 것 복사) +
  `lib/practices.ts` 등록 + sitemap. 엔진·러너는 그대로 재사용
- 기록: `lib/progress.ts`에 `scenarios: string[]`(임무별 완료) 추가됨 — recordPracticeComplete(kioskType, scenarioId)

### 테스트 (명세 14장)
- Playwright e2e 4본 (`tests/kiosk-cafe.spec.ts`, `npm run test:e2e`, 모바일 뷰포트):
  learn 임무 완주 / 카드 오류 해결 / 잘못 담은 메뉴 삭제 / 이전·처음부터 복귀.
  `playwright.config.ts`가 원격 환경의 사전 설치 Chromium(/opt/pw-browsers/chromium)을 자동 사용
- 주의: 테스트 셀렉터는 화면 문구에 의존 — 문구 바꾸면 테스트도 갱신

### 이관 현황 — **키오스크 5종 전부 엔진 v2, 구 엔진 삭제됨**
- 카페(8종) + 햄버거(6종) + 민원(6종) + 주차(5종) + **마트 셀프계산대(7종, 2026-07-15 신규)** = 임무 32종
- 주차용 phase: `keypad`(숫자 입력) → `carSelect`(내 차 확인). `singleChoice: true`면 장바구니 생략하고 결제로
- 마트용 동작: 옵션 없는 상품 담기 = '스캔'. **같은 상품 재탭 시 수량 합침**(중복 스캔),
  `scanFailOnce` 이벤트(첫 스캔 실패 → 재스캔, 과정 피드백 기록), 회원 적립 건너뛰기는 serviceTypes로 물음
  (전화번호 등 실제 입력 없음)
- 구 엔진(KioskPlayer 등)은 삭제됨. `components/kiosk/useVoice.ts`·`lib/kiosk/track.ts`만 v2가 계속 쓴다
- 예고(UPCOMING_PRACTICE)는 기차표 예매로 교체, 홈 새 연습 알림은 마트

### 남은 단계 (명세 16장 기준)
1. 4단계 나머지: 표 예매(출발지·좌석 선택 — 새 phase 필요) → ATM(보이스피싱 경고 중심)
2. 3단계 나머지: 오류 종류 추가(품절 대체 선택, 시간 초과, 프린터 오류, 무게 불일치, 성인 확인 등)
3. 4단계: 마트 셀프계산대 → 표 예매 → ATM (신규 조작: 스캔·키패드·좌석 선택은 컴포넌트 추가 필요)
4. 5단계: 주간 도전·무작위 상황 카드·오늘의 임무를 시나리오와 연결
5. 6단계: PWA·오프라인(Service Worker, IndexedDB 이관 — 현재 기록은 localStorage)
6. 7단계: 시나리오 편집기 (시나리오 50개 이전엔 JSON 운영)
7. 광고(준비물 영역), 기관용 모드

### 다음 단계 (소유자 로드맵 — 엔진 외)
1. 연습 완료 화면 아래 준비물(거치대·터치펜 등) 광고 영역, 별도 준비물 페이지
2. 기관용 모드(복지관 수업용)

---

## 2. 기술 스택

| 항목 | 버전/상세 |
|---|---|
| Next.js | 16.2.9 (App Router) |
| React | 19.2.4 |
| TypeScript | 5.x |
| CSS | Tailwind 4 + 인라인 스타일 혼용 |
| 테스트 | Playwright (설치되어 있으나 테스트 파일 미작성) |

**주의**: Next.js 16은 기존 버전과 API가 다르다. 코드 작성 전 반드시 `node_modules/next/dist/docs/`의 가이드를 참고할 것.

---

## 3. 디렉토리 구조

```
senior-life/
├── app/                    # Next.js App Router 페이지
│   ├── page.tsx            # 홈페이지
│   ├── layout.tsx          # 루트 레이아웃
│   ├── welfare/            # 복지혜택 (기초연금, 장기요양)
│   ├── health/             # 건강·병원 (건강검진, 본인부담금, 복용약)
│   ├── finance/            # 노후재정 (노후자금계산기, 생활비, 국민연금)
│   ├── life-tips/          # 생활팁 (시니어할인, 가족돌봄/부모님점검표)
│   ├── kiosk/              # 키오스크 연습
│   │   ├── page.tsx        # 허브 (4개 키오스크 목록)
│   │   └── cafe/page.tsx   # 카페 키오스크 (완성)
│   ├── admin/              # 관리자 페이지 + 백업
│   ├── login/              # 로그인 (Supabase Google OAuth)
│   ├── legal/              # 이용약관, 개인정보처리방침, 환불규정
│   └── api/health/         # 헬스체크 API
├── components/
│   ├── Header.tsx          # 일반 페이지 헤더 (네비게이션)
│   ├── Footer.tsx          # 공통 푸터
│   ├── home/               # 홈페이지 전용 컴포넌트 (HomeHeader, HeroSection 등)
│   ├── kiosk/              # 키오스크 공통 컴포넌트
│   │   ├── KioskPlayer.tsx # 시나리오 재생 엔진 (핵심)
│   │   ├── BigButton.tsx   # 큰 선택 버튼
│   │   ├── StepGuide.tsx   # 질문 + 안내 듣기 버튼
│   │   ├── ProgressBar.tsx # 진행 표시 바
│   │   ├── ResultCard.tsx  # 완료 화면 (영수증 + 번호표)
│   │   └── useVoice.ts    # 음성 안내 훅 (Web Speech API)
│   ├── welfare/            # 복지 도구 (BenefitFinder)
│   ├── health/             # 건강 도구 (MedicationSummary)
│   ├── life-tips/          # 생활 도구 (ParentChecklistTool)
│   ├── legal/              # 법적 문서 컴포넌트
│   └── admin/              # 관리자 UI
├── content/
│   └── kiosk/cafe.json     # 카페 키오스크 시나리오 데이터
├── lib/
│   ├── supabase.ts         # Supabase 클라이언트 (브라우저 전용 lazy init)
│   ├── adminAuth.ts        # 관리자 권한 확인
│   ├── companyInfo.ts      # 회사 정보
│   ├── backupSanitize.ts   # 백업 시 민감정보 제거
│   └── kiosk/
│       ├── types.ts        # KioskScenario, KioskStep, KioskOption 타입
│       └── track.ts        # GA4 이벤트 전송 헬퍼
└── public/                 # 정적 파일
```

---

## 4. 현재 완료된 기능

### 핵심 페이지
- [x] **놀이터 홈** (2026-07-13 재편: 큰 타일 4개 — 키오스크 연습·혜택 찾기·병원 준비·두뇌 놀이(준비 중) + 연습 지름길 + 도구함 + 정보 카테고리 + FAQ)
- [x] 노후자금 계산기 → `/finance/retirement`, 병원 체크리스트 → `/health/hospital-checklist` (홈 인라인에서 독립 페이지로 이전)
- [x] **일러스트 브랜딩** (2026-07-13): 마스코트 "든든이"(주황 강아지+연두 목도리). 소유자가 AI로 생성해 제공 → 크롭·WebP 압축 후 적용.
  `public/mascot*.webp`(기본/축하/공사/토닥), `public/hero.webp`, `public/tiles/*.webp`(홈 타일 4, 키오스크 4, 카테고리 4).
  `mascot-building`/`mascot-cheer`는 두뇌 놀이 준비 중·오답 화면용으로 대기.
  표면 팔레트: 크림 배경(#F9F2E0), 테라코타(#E67E3F/#C4621A), 세이지(#DCE8CE), 흑갈색 글씨(#3B3226).
  **키오스크 플레이어 내부만 의도적으로 파란 기계 화면 유지** (실제 키오스크와 닮게).
- [x] 복지혜택 허브 + 기초연금 신청방법 + 장기요양보험 등급
- [x] 건강·병원 허브 + 건강검진 안내 + 본인부담금 안내
- [x] 노후재정 허브 + 노후 생활비 계산기 + 국민연금 수령액 안내
- [x] 생활팁 허브 + 시니어 할인 카드 + 가족 돌봄 가이드

### 두뇌 놀이 (`/brain`)
- [x] 카드 짝 맞추기 (`/brain/matching`, 2026-07-13) — 난이도 3단계(3/6/8쌍), 시간 제한 없음,
  맞출 때마다 칭찬·완료 시 축하 든든이. GA4: `brain_start/complete/restart/share` (`lib/track.ts` 공용 헬퍼).
  클릭 핸들러는 `cardsRef` 미러로 최신 상태를 읽는다(더블탭 레이스 방지 — state 클로저로 되돌리지 말 것).
- [ ] 오늘의 문제(속담·상식 퀴즈), 순서 기억하기 — 허브에 "만들고 있어요"로 예고됨

### 정보 페이지 2026 기준 갱신 + 웜톤 통일 (2026-07-14)
- 기준 연도·수치 갱신: 국민연금 평균 월 약 67만(2025), 1인 최소 생활비 139만·적정 197.6만/부부 298.1만
  (국민연금연구원 최신 패널조사), 본인부담상한 1분위 90만/10분위 843만(2026), 생활비 계산기 base 갱신.
  **제도 수치는 매년 1월 발표 후 갱신 필요** (기초연금·상한액·생활비 조사).
  중간 분위 등 공식 확인 안 되는 수치는 표기하지 않고 "공단 확인" 안내로 대체하는 원칙.
- 안쪽 페이지(정보 4카테고리·도구·로그인·에러/404)의 파랑·보라 계열을 웜 팔레트로 일괄 교체.
  파랑이 남은 곳은 의도적: 키오스크 기계 화면, 관리자, apple-icon.

### 두뇌 놀이·만들기 공개 (2026-07-14, 소유자 결정)
보류였던 두 기능의 입구를 다시 열었음: 홈 두뇌 놀이 타일 활성화("새 놀이"),
MakingBanner(사진 달력) 신설, 헤더 nav에 두뇌 놀이·만들기 복귀, sitemap 등록.

### 홈 도구함 제거 (2026-07-14)
"든든 도구함" 섹션(ToolLinks)은 놀이터 전환 전의 유산이라 홈에서 제거함 (소유자 결정:
디자인 이질적 + 어르신이 쓸 이유 없음). 계산기·점검표 등 도구 페이지 자체는 SEO 자산으로
유지되며 각 카테고리 허브와 푸터에서 접근 가능. 홈 구성: 히어로 → 타일 4 → 연습 → 그림책 배너
→ 정보 카테고리 → FAQ → 닫는 컷.

### 그림책 비주얼 시스템 (2026-07-14)
- 제목(h1,h2)은 구글 폰트 **Jua(주아체)** — `globals.css` @layer base. 단일 굵기라 font-weight 400 고정
- 홈 히어로 배경은 **계절 자동 전환** (`PlaygroundHero.seasonBg`): 기본/가을/겨울 3종,
  홈은 `revalidate = 86400`(하루 ISR)이라 계절이 하루 안에 반영됨
- 홈 맨 아래 닫는 컷 `ClosingScene` (노을 든든이 `public/footer-dog.webp`)
- 그림책 1호 장면 3곳 일러스트 적용 (`public/story-{sms,call,112}.webp`)
- 만들기 공개 대비 타일 `public/tiles/tile-making.webp` 보관 중

### 든든이 그림책 (`/stories`) — 공개 중
- [x] 그림책 엔진 `components/stories/StoryPlayer.tsx` (2026-07-13) — 장면 그림/이모지 + 큰 글씨 +
  [다음 장], 사기 문자 예시 말풍선(`sms`), 고르기 퀴즈(`quiz`, 답 전 다음 잠금·오답도 다정하게).
  콘텐츠는 `content/stories/*.ts` (`lib/stories/types.ts` 스키마). 새 그림책 = 콘텐츠 파일 + 라우트 + 허브 등록.
- [x] 1호: 보이스피싱 예방 (`/stories/phishing`) — 홈 배너(StoryBanner)·헤더 nav·sitemap 연결.
  GA4: `story_start/complete/share`.
- [ ] 예고됨: 키오스크 이야기, 스마트폰 안전 수칙

### 만들기 놀이 (`/making`)
- [x] 사진 달력 만들기 (`/making/calendar`, 2026-07-13) — 사진(선택) → 연/월 → 색·문구 → 완성.
  캔버스로 A4 비율 PNG 생성, 인쇄(`window.print` + print CSS)·사진첩 저장·공유(navigator.share).
  **사진은 서버로 전송하지 않음** (업로드 API 없음 — 신뢰 포인트이므로 유지할 것).
  공휴일은 `lib/making/holidays.ts` 상수 — 음력 명절 때문에 **연 1회 갱신 필요**.
  GA4: `making_start/complete/print/save`.
- [ ] 부채 꾸미기, 생신 카드 — 허브에 예고됨. 장기 방향: 체험키트 판매(스마트스토어 연결)와 연계.

### 인터랙티브 도구
- [x] 노후자금 계산기 (홈페이지 인라인)
- [x] 병원 방문 체크리스트
- [x] 내 혜택 찾아보기 (BenefitFinder)
- [x] 복용약 요약표 (MedicationSummary)
- [x] 부모님 생활 점검표 (ParentChecklistTool)
- [x] **키오스크 연습 4종 완성** (KioskPlayer + cafe/hospital/fastfood/civil.json)

### 인프라
- [x] Supabase 인증 (Google OAuth)
- [x] 관리자 페이지 + 백업 (민감정보 제외)
- [x] GA4 트래킹
- [x] SEO (메타데이터, sitemap, robots.txt, OpenGraph)
- [x] 법적 페이지 (이용약관, 개인정보처리방침, 환불규정)
- [x] Vercel 배포 + 헬스체크 API
- [x] 파비콘

---

## 5. 미완료 / 다음 작업

### 키오스크 연습 — 4종 모두 완성 (2026-07-13)
카페·병원 접수·패스트푸드·무인민원발급기 4종이 모두 `ready: true` 상태다.
엔진이 시나리오별 차이를 지원하도록 일반화되었다 (`lib/kiosk/types.ts`의 `KioskScenario` 선택 필드):
- `finishLabel` — 마지막 버튼 글자 (접수하기/발급하기 등)
- `unitLabel` — 수량 단위 (잔/개/통)
- `showTicket: false` — 완료 화면 번호표 숨김 (민원발급기)
- `ticketNote`, `receiptTitle`, `receiptNote`, `cartEmptyText` — 완료 화면 문구
- 가격(`price`) 있는 옵션이 하나도 없으면 합계·결제 UI가 자동으로 숨겨진다 (병원 접수)

**새 키오스크 추가 방법:**
1. `content/kiosk/{id}.json`에 `KioskScenario` 형태의 시나리오 데이터 작성 (`cafe.json` 참고)
2. `app/kiosk/{id}/page.tsx` 생성 (`app/kiosk/cafe/page.tsx` 복사 후 import 경로만 변경)
3. `app/kiosk/page.tsx`의 `practices` 배열에 항목 추가 (`ready: true`)
4. `app/sitemap.ts`에 URL 추가

### 기타 잠재 작업
- Playwright 테스트 작성 (현재 의존성만 설치됨)
- 다크모드 미지원
- 홈페이지 HomeHeader / Header 네비게이션 배열 중복 → 공통화 가능

---

## 6. 주의사항

### 네비게이션 메뉴 수정 시
헤더는 `components/Header.tsx` **하나**다 (2026-07-13에 홈 전용 HomeHeader를 제거하고 단일화).
메뉴 항목은 `nav` 배열만 수정하면 전 페이지에 반영된다.

### 스타일 작성 시 (Tailwind)
새 컴포넌트는 Tailwind 클래스로 작성한다 (홈 컴포넌트들이 예시).
`app/globals.css`의 전역 `a` 규칙은 반드시 `@layer base` 안에 있어야 한다 —
레이어 밖으로 꺼내면 명시도와 무관하게 Tailwind 유틸리티(`.flex` 등)를 덮어써서
링크 레이아웃이 조용히 깨진다.

### 빌드 캐시
수정이 반영되지 않을 때 `.next` 폴더를 삭제하고 dev 서버를 재시작한다.

---

## 7. 커밋 히스토리

`git log --oneline`으로 확인한다. 주요 이정표:
- `8380d7a` (PR #1, 2026-07-13) — 시니어 놀이터 전환: 키오스크 4종 완성 + 홈 재편 + 일러스트 브랜딩
- `44bfe0b` (`v1.1.0-kiosk-cafe`) — 카페 키오스크 최초 완성

---

## 8. 로컬 개발 시작

```bash
cd senior-life
npm install
npm run dev        # http://localhost:3000
```

필수 환경변수 없음 (회원·DB 기능 없음). 선택:
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` (GA4)
- `COUPANG_ACCESS_KEY` / `COUPANG_SECRET_KEY` (쿠팡 파트너스 Open API — 없으면 수동 링크 폴백)

---

*이 문서는 마지막 배포 시점 기준이다. 작업 후 변경사항을 반영하여 업데이트할 것.*

### 쿠팡 파트너스 연동 (2026-07-15)
- 수익화 카드: `content/affiliate.ts`(상품 레지스트리) + `components/AffiliateCard.tsx`(광고 표시·대가성 문구 내장)
- Open API: `lib/coupang.ts` — Vercel 환경변수 `COUPANG_ACCESS_KEY`/`COUPANG_SECRET_KEY` (Production).
  달력 페이지가 1시간 ISR로 공식 사진·가격을 조회, 실패 시 수동 링크 카드로 자동 폴백.
- 광고 원칙: 홈·놀이터 과정에는 광고 금지, 페이지당 1개, 맥락 일치 상품만. 현재 1곳(달력 완성 화면).
