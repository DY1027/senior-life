# CODEX 인수인계 문서

## 2026-07-17 Codex 최신 변경사항

> 아래 내용이 이 문서의 이전 "현재 상태"보다 우선합니다.

- 작업 브랜치: `codex/soldout-alternatives`
- 오늘의 연습: `lib/daily-missions.ts`에서 실제 시나리오를 고르고 `/kiosk/{type}/{scenarioId}`로 바로 연결합니다.
- 7종 공통 설정: `lib/kiosk-config.ts`에 이름, 설명, 도전 문구, 안전 문구, 단계별 용어를 중앙화했습니다.
- 안전 안내: 모든 키오스크 허브와 임무 시작 화면에 표시하며 ATM은 실제 카드·계좌·비밀번호, 민원은 실제 주민등록번호·개인 식별정보 입력 금지를 추가했습니다.
- 콘텐츠 명칭: 사용자 화면의 "그림책"을 "그림으로 배우는 생활안전"으로 정리했습니다.
- 메타데이터/PWA: 홈 title·description·Open Graph·Twitter·manifest를 현재 서비스 문구로 통일했고 `public/sw.js`는 `v4`입니다.
- 검증: `npx tsc --noEmit` 통과, `npm run lint` 0오류(기존 `app/apple-icon.tsx` 경고 1개), `npm run build` 통과, Playwright 18/18 통과.
- 브라우저 확인: PC, 모바일 360×800, 태블릿 768×1024, 큰글씨에서 가로 넘침 없음. 브라우저 콘솔 오류 없음. 실물 삼성 기기/Samsung Internet 검증은 아직 필요합니다.

> 최종 갱신: 2026-07-17 (Codex 로컬 브랜치 — 품절 대체 선택 구현)
> **자세한 프로젝트 전체 문서는 `HANDOFF.md`를 먼저 읽을 것.** 이 파일은 도구(AI)를 오가며
> 작업을 이어받을 때 필요한 "현재 상태 + 규칙 요약"만 담는다.
> 작업을 마치면 이 파일의 [현재 상태]와 `AI_HARNESS_LOG.md`에 한 줄을 남기고 커밋할 것.

---

## 현재 상태 (2026-07-17)

- **프로덕션**: seniordeundun.com — Vercel, `master` 푸시가 곧 배포다
- **master 최신**: 오류 이벤트 5종 배포 (cardFail·soldOut·scanFail·**printerFail·timeout**),
  키오스크 7종 전부 엔진 v2 (카페8·버거6+1·민원6·주차5·마트7+1·기차7·ATM6 = **임무 47종**),
  주간 도전·무작위 상황 카드(5종)·PWA·오프라인 지원까지 완료
- **작업 브랜치**: `codex/soldout-alternatives` — `MissionItem.alternativeProductIds` either-of 판정,
  `soldOutAlternative` 이벤트, 기차표 매진 시 오전 10시/오후 2시 대체 선택, 상황 카드 후보 추가,
  서비스워커 `v3`까지 구현. 임무 수는 **47종 유지**, 오류 이벤트는 **6종**
- **검증 상태**: 클린 빌드 ✅ · tsc 0오류 ✅ · lint 0오류(기존 경고 1) ✅ · Playwright e2e 14/14 ✅
- **정리된 브랜치**: `audit/prelaunch-site-fixes`(master에 이미 포함), `claude/coupang-link-auto-change-gamusb`(이번에 병합됨) — 지워도 안전

## 다음에 할 일 (소유자 로드맵, HANDOFF.md 「남은 단계」와 동일)

1. 잔여 오류 아이디어: 무게 불일치, 성인 확인
2. 연습 완료 화면 아래 준비물(거치대·터치펜 등) 광고 영역 + 별도 준비물 페이지
3. 기관용 모드(복지관 수업용)
4. 7단계 시나리오 편집기 — 시나리오 50개 이전에는 JSON 운영 (현재 47종)
5. 보류 중: Inworld TTS 사전 생성(네트워크 정책 필요, `scripts/generate-story-audio.mjs` 준비됨),
   OG 카톡 공유 이미지 교체

## 반드시 지킬 규칙 (어기면 실제 장애·규정 위반)

1. **Next.js 16은 학습 데이터와 다르다** — 코드 작성 전 `node_modules/next/dist/docs/` 확인 (AGENTS.md 규칙)
2. **배포마다 `public/sw.js`의 `VERSION`을 올릴 것** — 안 올리면 방문자에게 이전 캐시가 남는다 (작업 브랜치 현재 v3)
3. **e2e 셀렉터는 화면 문구에 의존** — 버튼·안내 문구를 바꾸면 `tests/kiosk-cafe.spec.ts`도 같이 고칠 것
4. **광고 원칙(소유자 지시)**: 연습 진행 화면 안 광고 절대 금지, 페이지당 1영역, 가격 미표기,
   대가성 문구는 AffiliateCard에 내장(제거 금지). 상품 이미지는 쿠팡 공식 API 데이터만
5. **개인정보**: 키오스크 연습에 실제 개인정보 입력 기능 금지 (ATM은 연습 비밀번호 1234만, 저장·검증 안 함).
   기록은 localStorage뿐 — 서버 전송 기능을 만들면 개인정보처리방침부터 고칠 것
6. **정부 수치는 검증된 2026년 값만** — 확인 불가면 "공단 확인" 안내로 대체, 지어내지 말 것
7. **globals.css의 `a {}` 리셋은 `@layer base` 안에 있어야 한다** — 밖으로 빼면 Tailwind 유틸리티가 깨짐
8. 새 키오스크·임무 추가 절차는 HANDOFF.md 「새 임무·새 키오스크 추가 방법」 참고
   (`content/kiosk-v2/*.ts` + `lib/practices.ts` 등록 + sitemap)

## 로컬 개발·검증 명령

```bash
npm ci
npm run build        # Zod가 카탈로그·시나리오를 빌드 시점에 검증 — 데이터 실수는 여기서 잡힌다
npx tsc --noEmit
npm run lint
npm run test:e2e     # Playwright 14본, 프로덕션 서버 위에서 실행 (서비스워커 회귀 포함)
```

- 원격(Claude) 환경은 Supabase 더미 env가 필요 없어졌다(의존성 삭제됨). 빌드가 env를 요구하면 캐시 문제 — `rm -rf .next` 후 재빌드
- Playwright는 사전 설치 Chromium(`/opt/pw-browsers/chromium`)을 자동 사용 (원격 환경)

## 환경·비밀정보

- Vercel env(Production): `COUPANG_ACCESS_KEY`, `COUPANG_SECRET_KEY` — 코드·로그에 절대 노출 금지
- Inworld TTS 키는 저장소에 없음(소유자 보관). 사용 후 키 회전 예정
- GA4는 `lib/track.ts` 경유. 새 상호작용을 만들면 이벤트도 추가할 것
