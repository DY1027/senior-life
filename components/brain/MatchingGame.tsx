"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { track } from "@/lib/track";

// 카드 짝 맞추기 — 두뇌 놀이 1호.
// 시니어 원칙: 시간 압박 없음, 틀려도 혼내지 않음, 맞출 때마다 칭찬.

type Level = { id: string; label: string; desc: string; pairs: number; cols: number };
type CardState = "down" | "up" | "matched";
type Card = { id: number; face: string; state: CardState };

const LEVELS: Level[] = [
  { id: "easy", label: "쉬움", desc: "카드 6장 · 3쌍", pairs: 3, cols: 2 },
  { id: "normal", label: "보통", desc: "카드 12장 · 6쌍", pairs: 6, cols: 3 },
  { id: "hard", label: "어려움", desc: "카드 16장 · 8쌍", pairs: 8, cols: 4 },
];

// 어르신에게 익숙하고 서로 헷갈리지 않는 그림들
const FACES = ["🍎", "🌸", "☕", "🐕", "🍉", "🌻", "🐟", "🎵"];

const MATCH_PRAISES = ["잘하셨어요! 👏", "정확해요!", "기억력이 좋으시네요!", "훌륭해요!"];

function buildDeck(pairs: number): Card[] {
  const faces = FACES.slice(0, pairs);
  const deck = [...faces, ...faces].map((face, i) => ({ id: i, face, state: "down" as CardState }));
  // Fisher–Yates 셔플
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export default function MatchingGame() {
  const [level, setLevel] = useState<Level | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [moves, setMoves] = useState(0);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const busy = useRef(false);
  // 클릭 핸들러가 항상 최신 카드 상태를 보도록 ref로 미러링한다.
  // (state만 쓰면 빠른 연속 탭 — 특히 어르신의 더블탭 — 이 낡은 상태를 읽어
  //  첫 번째 선택을 덮어써 버린다)
  const cardsRef = useRef<Card[]>([]);
  const movesRef = useRef(0);

  const matchedCount = cards.filter((c) => c.state === "matched").length;

  function setDeck(next: Card[]) {
    cardsRef.current = next;
    setCards(next);
  }

  function start(lv: Level) {
    setLevel(lv);
    setDeck(buildDeck(lv.pairs));
    movesRef.current = 0;
    setMoves(0);
    setMessage("같은 그림 두 장을 찾아 보세요");
    setDone(false);
    busy.current = false;
    track("brain_start", { game: "matching", level: lv.id });
  }

  function flip(idx: number) {
    if (busy.current || done) return;
    const cur = cardsRef.current;
    const card = cur[idx];
    if (!card || card.state !== "down") return;

    const upIdx = cur.findIndex((c) => c.state === "up");
    const next = cur.map((c, i) => (i === idx ? { ...c, state: "up" as CardState } : c));

    if (upIdx === -1) {
      // 첫 번째 카드
      setDeck(next);
      return;
    }

    // 두 번째 카드 — 판정
    movesRef.current += 1;
    setMoves(movesRef.current);
    if (next[upIdx].face === next[idx].face) {
      const merged = next.map((c, i) => (i === upIdx || i === idx ? { ...c, state: "matched" as CardState } : c));
      setDeck(merged);
      const remaining = merged.some((c) => c.state !== "matched");
      if (remaining) {
        setMessage(MATCH_PRAISES[movesRef.current % MATCH_PRAISES.length]);
      } else {
        setDone(true);
        track("brain_complete", { game: "matching", level: level?.id, moves: movesRef.current });
      }
    } else {
      setDeck(next);
      setMessage("괜찮아요, 다시 한번! 😊");
      busy.current = true;
      setTimeout(() => {
        setDeck(cardsRef.current.map((c) => (c.state === "up" ? { ...c, state: "down" } : c)));
        busy.current = false;
      }, 1000);
    }
  }

  async function handleShare() {
    track("brain_share", { game: "matching", level: level?.id });
    const text =
      `[시니어 든든] 카드 짝 맞추기(${level?.label})를 끝냈어요! 🧩\n` +
      `카드를 ${moves}번 만에 모두 맞췄어요.\n\n` +
      `함께 두뇌 운동해요 → https://seniordeundun.com/brain`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "두뇌 놀이 완료", text });
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        alert("결과를 복사했어요. 자녀나 가족에게 붙여넣어 보내보세요.");
      }
    } catch {
      /* 공유 취소는 무시 */
    }
  }

  // ── 1. 난이도 고르기 ──
  if (!level) {
    return (
      <div className="mx-auto max-w-[560px] px-5 pb-14 pt-8 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDDFC0] px-4 py-1.5 text-[15px] font-bold text-[#C4621A]">
          🧩 카드 짝 맞추기
        </span>
        <h1 className="mt-3 text-[clamp(26px,5vw,34px)] font-extrabold leading-snug tracking-[-0.5px] text-[#3B3226]">
          몇 장으로 해볼까요?
        </h1>
        <p className="mt-2 text-[17px] leading-relaxed text-[#6E5C49]">
          카드를 뒤집어 <strong>같은 그림 두 장</strong>을 찾는 놀이예요.
          <br />
          천천히 해도 괜찮아요. 시간 제한이 없어요.
        </p>
        <div className="mt-7 flex flex-col gap-3">
          {LEVELS.map((lv) => (
            <button
              key={lv.id}
              type="button"
              onClick={() => start(lv)}
              className="flex items-center justify-between rounded-2xl border-2 border-[#EFDFC0] bg-white px-6 py-5 text-left transition-transform active:scale-[0.98]"
            >
              <span>
                <span className="block text-[22px] font-extrabold text-[#3B3226]">{lv.label}</span>
                <span className="block text-[15px] text-[#8A7660]">{lv.desc}</span>
              </span>
              <span className="text-[17px] font-extrabold text-[#C4621A]">시작 →</span>
            </button>
          ))}
        </div>
        <p className="mt-6 text-[15px] text-[#8A7660]">처음이라면 &lsquo;쉬움&rsquo;부터 해보세요.</p>
      </div>
    );
  }

  // ── 3. 완료 화면 ──
  if (done) {
    return (
      <div className="mx-auto max-w-[480px] px-5 pb-14 pt-10 text-center">
        <Image
          src="/mascot-celebrate.webp"
          alt="색종이 사이에서 만세하는 든든이"
          width={150}
          height={154}
          className="mx-auto mb-4 rounded-3xl"
        />
        <h1 className="text-[clamp(24px,5vw,30px)] font-extrabold leading-snug text-[#3B3226]">
          축하합니다! 카드를 모두 맞추셨어요 🎉
        </h1>
        <p className="mt-3 text-[17px] leading-relaxed text-[#6E5C49]">
          {level.label} 단계를 카드 <strong className="text-[#C4621A]">{moves}번</strong> 뒤집기로 끝내셨어요.
          <br />
          이렇게 매일 조금씩 하면 훌륭한 두뇌 운동이 됩니다.
        </p>
        <div className="mt-7 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => start(level)}
            className="h-[60px] rounded-2xl bg-[#E67E3F] text-[19px] font-extrabold text-white transition-transform active:scale-[0.98]"
          >
            🔁 한 번 더 하기
          </button>
          <button
            type="button"
            onClick={() => setLevel(null)}
            className="h-[56px] rounded-2xl border-2 border-[#EFDFC0] bg-white text-[17px] font-bold text-[#3B3226] transition-transform active:scale-[0.98]"
          >
            난이도 바꾸기
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="h-[56px] rounded-2xl border-2 border-[#FDDFC0] bg-[#FDF0E0] text-[17px] font-bold text-[#C4621A] transition-transform active:scale-[0.98]"
          >
            📤 가족에게 자랑하기
          </button>
          <Link
            href="/brain"
            className="flex h-[52px] items-center justify-center rounded-2xl text-[16px] font-bold text-[#8A7660] no-underline"
          >
            다른 놀이 보러 가기
          </Link>
        </div>
      </div>
    );
  }

  // ── 2. 게임 화면 ──
  return (
    <div className="mx-auto max-w-[560px] px-5 pb-14 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setLevel(null)}
          className="rounded-full border border-[#EFDFC0] bg-white px-4 py-2 text-[15px] font-bold text-[#8A7660]"
        >
          ← 그만하기
        </button>
        <span className="text-[15px] font-bold text-[#8A7660]">
          {level.label} · 맞춘 쌍 {matchedCount / 2}/{level.pairs}
        </span>
      </div>

      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${level.cols}, 1fr)` }}>
        {cards.map((c, i) => (
          <button
            key={c.id}
            type="button"
            onClick={() => flip(i)}
            aria-label={c.state === "down" ? "뒤집힌 카드" : `${c.face} 카드`}
            className={`flex aspect-square items-center justify-center rounded-2xl border-2 text-[clamp(34px,9vw,48px)] leading-none transition-all ${
              c.state === "down"
                ? "border-[#E3CFA4] bg-[#F3E3C3] active:scale-[0.96]"
                : c.state === "matched"
                  ? "border-[#BFDCB2] bg-[#F0F8EA]"
                  : "border-[#E67E3F] bg-white"
            }`}
          >
            <span aria-hidden="true">{c.state === "down" ? "🐾" : c.face}</span>
          </button>
        ))}
      </div>

      <p className="mt-5 min-h-[28px] text-center text-[18px] font-bold text-[#C4621A]" aria-live="polite">
        {message}
      </p>
      <p className="mt-1 text-center text-[14px] text-[#9B8B76]">시간 제한이 없어요. 천천히 찾아 보세요.</p>
    </div>
  );
}
