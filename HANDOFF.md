# 시니어든든 — 에이전트 인수인계 문서

> 최종 업데이트: 2026-07-17 · 든든이 장면 중심 디자인 개편

## 1. 프로젝트 방향

시니어든든은 **실제처럼 눌러보고 실수해도 다시 연습할 수 있는 시니어 디지털 생활 놀이터**입니다.

- 도메인: https://seniordeundun.com
- 저장소: https://github.com/DY1027/senior-life
- 배포: Vercel, `master` 자동 배포
- 회원·로그인·DB: 없음
- 기기 기록: 브라우저 `localStorage`
- 분석: 환경변수가 있을 때만 Google Analytics 4
- 광고: 쿠팡 파트너스, 허용된 완성/완료 영역만

과거 건강·병원·복지·노후재정 포털 기능은 2026-07-17에 코드와 검색 노출에서 완전히 제거했습니다. 해당 기능을 복구하거나 관련 신규 페이지를 만들지 않습니다.

## 2. 현재 공개 기능

### 생활기기 연습

- 카페 주문
- 햄버거 주문
- 기차표 예매
- 주차요금 정산
- 마트 셀프계산
- 은행 ATM
- 무인민원발급기

7종 모두 공통 엔진 v2를 사용하며 임무는 총 47개입니다. 오류 상황은 카드 인식 실패, 품절, 품절 대체 선택, 바코드 재스캔, 영수증 미출력, 시간 초과 안내를 지원합니다.

### 재방문·접근성

- 오늘의 연습: `lib/daily-missions.ts`에서 실제 임무를 골라 실행 URL로 직접 연결
- 주간 도전과 주간 도장
- 키오스크별 완료 도장과 최근 기록
- 기록 전체 삭제
- 큰 글씨와 브라우저 음성 안내
- 이전, 처음부터, 오류 후 재시도
- PWA 설치와 오프라인 폴백

### 놀이·생활안전

- 카드 짝 맞추기: `/brain/matching`
- 보이스피싱 생활안전: `/stories/phishing`
- 사진 달력 만들기: `/making/calendar`

## 3. 현재 라우트

### 검색 노출

- `/`
- `/kiosk`와 키오스크 7종 소개 페이지
- `/play`, `/brain`, `/brain/matching`
- `/stories`, `/stories/phishing`
- `/making`, `/making/calendar`
- `/guide`
- `/legal/terms`, `/legal/privacy`

### noindex

- `/service-changed`
- `/records`
- `/offline`
- 개별 `/kiosk/{type}/{scenarioId}` 실행 화면

### 영구 리다이렉트

- `/kiosk/hospital`과 하위 주소 → `/kiosk`
- `/health`, `/hospital`, `/welfare`, `/finance`, `/retirement`, `/care`, `/life-tips`와 하위 주소 → `/service-changed`
- `/login`, `/signup`, `/mypage`, `/auth`와 하위 주소 → `/service-changed`
- `/legal/refund` → `/legal/terms`

`/service-changed`는 현재 서비스 설명과 생활기기 허브·오늘의 임무 버튼을 제공합니다. 검색에는 노출하지 않습니다.

## 4. 핵심 구조

```text
app/
  kiosk/                 키오스크 허브와 7종 소개·실행 라우트
  brain/                 카드 짝 맞추기
  stories/               그림으로 배우는 생활안전
  making/                만들기 놀이
  records/               기기 기록(noindex)
  service-changed/       이전 주소 안내(noindex)
  legal/                 이용약관·개인정보처리방침
  sitemap.ts             현재 공개 주소만
  robots.ts              실행·개인·내부 페이지 차단

components/kiosk-engine/ 공통 실행 UI
components/dundun-design/ 장면·카드·말풍선·버튼 디자인 시스템
content/kiosk-v2/        7종 카탈로그·임무 데이터
lib/kiosk-engine/        상태·이벤트·임무 판정·Zod 검증
lib/kiosk-config.ts      7종 표시 문구의 단일 기준
lib/daily-missions.ts    오늘의 임무 선택
lib/progress.ts          localStorage 기록·도장
public/images/dundun/    최적화한 WebP 장면 일러스트 14개
tests/                   Playwright 회귀 검사 29개
```

`app/api/health/route.ts`는 건강 콘텐츠가 아니라 배포 상태 확인 API이므로 삭제하지 않습니다.

## 5. 키오스크 엔진 규칙

- `content/kiosk-v2/*.ts`는 모듈 로드 시 Zod로 검증됩니다.
- `components/kiosk-engine/KioskRunner.tsx`가 7종 공통 화면입니다.
- `lib/kiosk-config.ts`가 이름, 설명, 도전 문구, 안전 문구, 단계별 용어의 기준입니다.
- 실제 개인정보, 카드번호, 계좌번호, 주민등록번호를 받지 않습니다.
- ATM 비밀번호는 연습용 1234이며 저장하거나 서버에서 검증하지 않습니다.
- 개별 임무 URL은 실행 화면이므로 `noindex,nofollow`를 유지합니다.
- 새 임무는 해당 콘텐츠 파일에 추가하고 회귀 테스트를 갱신합니다.
- 새 키오스크는 콘텐츠, 설정, 허브, 실행 라우트, `lib/practices.ts`를 함께 추가합니다. sitemap에는 소개 페이지만 넣습니다.

## 6. 기록·개인정보·광고

- 연습 기록과 큰 글씨 설정은 현재 브라우저에만 저장합니다.
- 서버 전송, 사용자 프로필, 회원 전용 조건문을 도입하지 않습니다.
- 개인정보 처리 방식이 바뀌면 코드보다 먼저 약관과 개인정보처리방침의 변경 범위를 검토합니다.
- 키오스크 진행 화면 광고는 금지합니다.
- `AffiliateCard`의 광고 표시와 대가성 문구를 제거하지 않습니다.
- 광고 링크 이후의 거래·개인정보 처리는 외부 사이트 정책을 따릅니다.

## 7. SEO·PWA 기준

- 루트 제목: `시니어든든 | 실제처럼 눌러보는 디지털 생활 놀이터`
- 구조화 데이터: `Organization`, `WebSite`, `WebApplication`
- sitemap에는 이전 주소, 기록, 서비스 변경 안내, 개별 임무를 넣지 않습니다.
- OG 이미지: `app/opengraph-image.tsx`
- manifest: `시니어든든 디지털 생활 놀이터`
- 서비스워커: `public/sw.js`, 현재 `v6`
- 배포마다 서비스워커 버전을 올려 이전 페이지 캐시를 제거합니다.

## 8. 검증

```bash
npm run typecheck
npm run lint
npm run build
npm run test
```

2026-07-17 결과:

- TypeScript 통과
- lint 0오류, 기존 `app/apple-icon.tsx`의 `<img>` 경고 1개
- Next.js production build 통과
- Playwright 29/29 통과
- 홈 360·390·430·768·1024·1280·1440px: 가로 넘침 없음
- 모바일 홈·연습·놀이터·생활안전·빈 기록·완료 화면 시각 점검 통과
- 든든이 WebP 14개: 각 25.3~103.8KB, 대표 장면 외 지연 로딩
- 이전 재정 주소가 `/service-changed`로 이동
- 브라우저 오류 오버레이·콘솔 오류 없음

Windows PowerShell 실행 정책이 `npm.ps1`을 막으면 `npm.cmd`를 사용합니다. 삭제된 페이지를 `.next/types`가 계속 참조하면 작업공간 안의 `.next` 캐시만 삭제하고 재빌드합니다.

## 9. 환경변수

필수 환경변수는 없습니다.

- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: 선택
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`: 선택
- `NEXT_PUBLIC_NAVER_SITE_VERIFICATION`: 선택
- `COUPANG_ACCESS_KEY`, `COUPANG_SECRET_KEY`: Vercel Production, 쿠팡 공식 상품 조회

비밀값은 코드·문서·로그에 기록하지 않습니다.

## 10. 다음 작업 후보

1. 실물 삼성 기기와 Samsung Internet 최종 확인
2. 오류 상황 무게 불일치·성인 확인 검토
3. 연습 완료 화면 아래 준비물 영역과 별도 준비물 페이지
4. 기관 수업용 모드
5. 임무가 50개를 넘으면 시나리오 편집기 재검토
