# CODEX 인수인계 문서

## 현재 상태 (2026-07-17)

> 이 문서와 `HANDOFF.md`가 현재 코드의 기준입니다. 과거 건강·병원·복지·재정 포털 기능은 복구하지 않습니다.

- 작업 브랜치: `codex/dundun-redesign`
- 서비스 방향: 실제 주문·결제·송금·발급 없이 생활 속 디지털 기기를 연습하는 무료 시니어 디지털 생활 놀이터
- 프로덕션: https://seniordeundun.com (Vercel, `master` 자동 배포)
- 키오스크: 카페·햄버거·기차표·주차정산·마트 셀프계산·ATM·무인민원발급기 7종, 임무 47개
- 유지 기능: 오늘의 연습 직접 연결, 주간 도전, 도장과 기록, 큰 글씨, 음성 안내, 놀이, 생활안전, PWA·오프라인
- 기록 저장: 로그인·DB 없이 브라우저 `localStorage`만 사용
- 서비스워커: `public/sw.js`의 현재 버전은 `v6`

## 2026-07-17 든든이 장면 중심 디자인 개편

- 홈을 대표 장면, 신뢰 안내, 오늘의 연습, 디지털 생활 연습마을, 주간 도전, 놀이터, 생활안전, 새 연습, FAQ 순서로 재구성
- 기존 브랜드의 주황·초록·파랑·아이보리를 의미 기반 CSS 변수로 정리하고 18px 본문, 48px 터치 영역, 포커스와 모션 감소 기준 적용
- `components/dundun-design/`에 영웅 장면, 장면 섹션·카드, 말풍선, 든든이 안내, 버튼, 제목, 곡선 구분선 공통 컴포넌트 추가
- 새 든든이 원본 14개는 보존하고 `public/images/dundun/*.webp` 사본으로 최적화(각 25.3~103.8KB)
- 홈·연습 목록·놀이터·생활안전·빈 기록·완료 화면에 장면 일러스트 적용. 패스트푸드·민원실은 전용 새 이미지가 없어 기존 타일 유지
- PC 메뉴를 연습·놀이터·생활안전·내 기록으로, 모바일 하단 메뉴를 홈·연습·놀이터·내 기록으로 통일하고 `aria-current` 적용
- 키오스크 상태 머신·시나리오·URL·기록 로직은 유지하고 허브·오류 안내·완료 표현만 개편
- 스크린샷 생성 도구: `scripts/capture-redesign.mjs`, 결과는 `artifacts/screenshots/`

## 2026-07-17 이전 기능·SEO 정리

- 삭제: `app/finance`, `app/welfare`, `app/life-tips`와 전용 계산기·혜택 찾기·돌봄 점검 컴포넌트
- 삭제: 이전 기능 전용 정적 이미지 7개와 미사용 구조화 데이터 컴포넌트
- 리다이렉트: `/kiosk/hospital/*` → `/kiosk`
- 리다이렉트: `/health`, `/hospital`, `/welfare`, `/finance`, `/retirement`, `/care`, `/life-tips` 하위 주소 → `/service-changed`
- 계정 잔여 주소: `/login`, `/signup`, `/mypage`, `/auth/*` → `/service-changed`
- 안내 페이지: `/service-changed`, `noindex,nofollow`
- 검색 차단: `/records`, `/offline`, 개별 `/kiosk/{type}/{scenarioId}` 실행 화면
- sitemap: 현재 공개 허브·키오스크 7종 소개·놀이·생활안전·이용안내·법적 문서만 포함. 개별 임무와 이전 주소는 제외
- 메타데이터: 홈·키오스크·놀이터·생활안전·기록·OG·Twitter·manifest를 현재 서비스 문구로 통일
- 구조화 데이터: `Organization`, `WebSite`, `WebApplication`만 사용하고 교육용 시뮬레이션임을 명시
- `app/api/health/route.ts`는 건강 콘텐츠가 아니라 Vercel 상태 확인 API이므로 유지

## 핵심 코드 위치

- `lib/daily-missions.ts`: 오늘의 실제 시나리오 선택과 직접 URL
- `lib/kiosk-config.ts`: 키오스크 7종 이름·설명·도전 문구·안전 문구·흐름 용어의 단일 기준
- `lib/kiosk-engine/`: 상태 머신, 임무 판정, Zod 스키마, 오류 이벤트
- `components/kiosk-engine/KioskRunner.tsx`: 7종 공통 실행 화면
- `content/kiosk-v2/*.ts`: 카탈로그와 임무 47개
- `lib/progress.ts`: 기기 저장 기록·도장·주간 판정 데이터
- `app/sitemap.ts`, `app/robots.ts`, `next.config.ts`: 검색 노출과 이전 주소 정책
- `tests/kiosk-cafe.spec.ts`: 현재 기능 회귀 18개
- `tests/site-cleanup.spec.ts`: 이전 주소·SEO·내부 링크·이미지 회귀 6개
- `tests/design-redesign.spec.ts`: 7개 화면 폭·큰 글자·메뉴·대체 텍스트·WebP 용량 회귀 5개

## 검증 상태

- `npm run typecheck`: 통과
- `npm run lint`: 0오류, 기존 `app/apple-icon.tsx`의 `<img>` 경고 1개
- `npm run build`: 통과
- `npm run test`: Playwright 29/29 통과
- 360·390·430·768·1024·1280·1440px: 홈 가로 넘침 없음, h1 1개 유지
- 모바일 홈·연습·놀이터·생활안전·빈 기록: 이미지 누락·오류 오버레이·콘솔 오류 없음
- 실물 삼성 기기/Samsung Internet 검증은 별도 수동 확인 필요

## 반드시 지킬 규칙

1. 배포마다 `public/sw.js`의 `VERSION`을 올려 이전 페이지 캐시를 제거합니다.
2. 키오스크 진행 화면에는 광고를 넣지 않습니다. 광고는 허용된 완료/만들기 영역에만 페이지당 1영역입니다.
3. 실제 개인정보·카드·계좌·주민등록번호를 입력하거나 저장하는 기능을 만들지 않습니다.
4. 기록은 `localStorage`에만 저장합니다. 서버 전송을 추가하려면 개인정보처리방침을 먼저 수정합니다.
5. 화면 문구를 바꾸면 Playwright의 문구 기반 셀렉터도 함께 수정합니다.
6. 새 키오스크는 `content/kiosk-v2`, `lib/practices.ts`, 허브/실행 라우트, `lib/kiosk-config.ts`를 함께 갱신합니다.
7. 개별 임무 URL은 `noindex`이며 sitemap에 추가하지 않습니다.
8. 이전 건강·병원·복지·재정·로그인 기능을 복구하지 않습니다.

## 로컬 검증 명령

```bash
npm ci
npm run typecheck
npm run lint
npm run build
npm run test
```

- Windows PowerShell 실행 정책이 `npm.ps1`을 막으면 `npm.cmd`를 사용합니다.
- 삭제된 라우트를 `.next/types`가 참조하면 작업공간 안의 `.next`만 삭제하고 재빌드합니다.

## 환경변수

- 선택: `NEXT_PUBLIC_GA_MEASUREMENT_ID`, Google/Naver 사이트 확인 값
- Vercel Production: `COUPANG_ACCESS_KEY`, `COUPANG_SECRET_KEY`
- 비밀값은 코드·문서·로그에 기록하지 않습니다.

## 다음 작업 후보

1. 잔여 오류 상황: 무게 불일치, 성인 확인
2. 연습 완료 화면 아래 준비물 영역과 별도 준비물 페이지
3. 기관 수업용 모드
4. 시나리오 50개 이후 편집기 검토
5. 실물 삼성 기기와 Samsung Internet 최종 확인
