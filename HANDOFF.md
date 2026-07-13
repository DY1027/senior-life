# 시니어 든든 — 에이전트 인수인계 문서

> 최종 업데이트: 2026-07-13
> 최종 배포 태그: `v1.1.0-kiosk-cafe` (커밋 `44bfe0b`) + 키오스크 4종 완성 (브랜치 `claude/mvp-site-improvements-q1m22g`)
> 저장소: https://github.com/DY1027/senior-life

---

## 1. 프로젝트 개요

시니어(어르신)와 그 가족을 위한 생활 정보·도구 서비스.
복지혜택 조회, 노후자금 계산, 병원 준비, 키오스크 연습 등을 큰 글씨·큰 버튼 UI로 제공한다.

- **도메인**: seniordeundun.com
- **배포**: Vercel
- **DB/인증**: Supabase (Google 소셜 로그인)
- **애널리틱스**: Google Analytics 4

---

## 2. 기술 스택

| 항목 | 버전/상세 |
|---|---|
| Next.js | 16.2.9 (App Router) |
| React | 19.2.4 |
| TypeScript | 5.x |
| Supabase | @supabase/supabase-js 2.x, @supabase/ssr 0.12 |
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

### Supabase 클라이언트
`lib/supabase.ts`의 `getClient()`는 브라우저 전용 lazy init 패턴이다.
서버 컴포넌트에서 직접 호출하면 안 된다.

### 빌드 캐시
수정이 반영되지 않을 때 `.next` 폴더를 삭제하고 dev 서버를 재시작한다.

---

## 7. 커밋 히스토리 요약 (최신순)

| 태그 | 커밋 | 설명 |
|---|---|---|
| `v1.1.0-kiosk-cafe` | `44bfe0b` | 카페 키오스크 완성 + 사이트 메뉴 추가 |
| — | `751a997` | 키오스크 UI를 실제 기기처럼 개선 |
| — | `c2446b4` | 키오스크 연습 MVP 최초 추가 |
| — | `6108c3b` | 파비콘 추가 |
| — | `0d7d692` | 관리자 헤더 링크 |
| — | `53254c4` | GA4 트래킹 추가 |
| — | `afdc758` | 관리자 백업 페이지 |
| — | `b5f3a52` | Supabase 인증 (Google 로그인) |
| — | `4e2cd5a` | 히어로 패널 리디자인 + 브랜드 통일 |
| — | `8e2425c` | 2차 기능 5가지 개선 |
| — | `9f0383d` | 최초 홈페이지 구축 |

---

## 8. 로컬 개발 시작

```bash
cd senior-life
npm install
npm run dev        # http://localhost:3000
```

환경변수 필요 (Supabase):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

*이 문서는 마지막 배포 시점 기준이다. 작업 후 변경사항을 반영하여 업데이트할 것.*
