# 시니어 든든 (seniordeundun.com)

눌러보며 배우는 **시니어 놀이터**. 어르신과 가족을 위한 체험형 연습(키오스크), 두뇌 놀이, 생활 도구(계산기·체크리스트), 복지·건강 정보를 큰 글씨·큰 버튼으로 제공합니다.

- 배포: Vercel (master 푸시 시 자동 배포)
- 스택: Next.js 16 (App Router) · React 19 · Tailwind 4 · Supabase (인증)
- 상세한 구조·작업 규칙은 [HANDOFF.md](./HANDOFF.md) 참고

## 개발

```bash
npm install
npm run dev   # http://localhost:3000
```

환경변수 (Supabase):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```
