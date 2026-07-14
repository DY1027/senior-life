"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { track } from "@/lib/track";
import { useReadAloud } from "@/components/useReadAloud";
import type { Story, StoryPage } from "@/lib/stories/types";

// 한 장의 내용을 음성용 문장으로 합친다 (그림책 장 + 문자 예시 + 퀴즈)
function pageToSpeech(page: StoryPage): string {
  const parts = [page.title];
  if (page.sms) parts.push(`이런 문자가 왔어요. ${page.sms.body}`);
  if (page.text) parts.push(page.text.replace(/\n/g, " "));
  if (page.quiz) {
    parts.push(page.quiz.question);
    page.quiz.options.forEach((o, i) => parts.push(`${i + 1}번, ${o.label}.`));
    parts.push("화면에서 하나를 골라 주세요.");
  }
  return parts.join(" ");
}

// 그림책 뷰어 — 장면 그림 + 큰 글씨 + [다음 장]으로 넘기는 이야기 엔진.
// 퀴즈 장은 답을 고르기 전에는 다음으로 넘어가지 않는다 (정답이 아니어도 혼내지 않음).

function SmsBubble({ from, body }: { from: string; body: string }) {
  return (
    <div className="mx-auto mt-4 max-w-[340px] rounded-2xl border border-[#D9D4C8] bg-[#F2F0EA] p-4 text-left">
      <p className="flex items-center justify-between text-[13px] font-bold text-[#8A8578]">
        <span>💬 문자 메시지 · {from}</span>
        <span className="rounded-full bg-[#FCE4E1] px-2 py-0.5 text-[12px] font-bold text-[#C0392B]">사기 예시</span>
      </p>
      <p className="mt-2 rounded-xl bg-white p-3.5 text-[16px] leading-relaxed text-[#3B3226]">{body}</p>
    </div>
  );
}

function PageArt({ page }: { page: StoryPage }) {
  if (page.img) {
    return (
      <Image
        src={page.img}
        alt={page.imgAlt ?? ""}
        width={170}
        height={175}
        className="mx-auto h-auto w-[170px] rounded-3xl"
        priority
      />
    );
  }
  return (
    <div className="mx-auto flex h-[130px] w-[130px] items-center justify-center rounded-3xl bg-[#F9F2E0] text-[64px]" aria-hidden="true">
      {page.emoji ?? "📖"}
    </div>
  );
}

export default function StoryPlayer({ story }: { story: Story }) {
  const [pageNo, setPageNo] = useState(0); // pages.length === finish 화면
  const [picked, setPicked] = useState<number | null>(null);
  const { read, stop: stopReading, playing } = useReadAloud();

  useEffect(() => {
    track("story_start", { story: story.id });
  }, [story.id]);

  const total = story.pages.length;
  const isFinish = pageNo >= total;
  const page = isFinish ? null : story.pages[pageNo];
  const quizAnswered = !page?.quiz || picked !== null;

  function go(next: number) {
    stopReading(); // 장을 넘기면 읽던 소리 중단
    setPicked(null);
    setPageNo(next);
    if (next >= total) track("story_complete", { story: story.id });
  }

  async function handleShare() {
    track("story_share", { story: story.id });
    try {
      if (navigator.share) {
        await navigator.share({ title: story.title, text: story.finish.shareText });
        return;
      }
    } catch {
      /* 공유 취소는 무시 */
    }
    try {
      await navigator.clipboard.writeText(story.finish.shareText);
      alert("내용을 복사했어요. 카카오톡에 붙여넣어 가족에게 보내 보세요.");
    } catch {
      /* 클립보드 실패도 조용히 */
    }
  }

  // ── 마지막 장 (완료) ──
  if (isFinish) {
    return (
      <div className="mx-auto max-w-[520px] px-5 pb-14 pt-10 text-center">
        <Image src="/mascot-celebrate.webp" alt="색종이 사이에서 만세하는 든든이" width={140} height={144} className="mx-auto mb-4 rounded-3xl" />
        <h1 className="text-[clamp(24px,5vw,30px)] font-extrabold leading-snug text-[#3B3226]">{story.finish.title}</h1>
        <p className="mt-3 whitespace-pre-line text-[18px] leading-relaxed text-[#6E5C49]">{story.finish.text}</p>
        <div className="mt-7 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="h-[60px] rounded-2xl bg-[#E67E3F] text-[19px] font-extrabold text-white transition-transform active:scale-[0.98]"
          >
            📤 가족에게 알려주기
          </button>
          <button
            type="button"
            onClick={() => go(0)}
            className="h-[56px] rounded-2xl border-2 border-[#EFDFC0] bg-white text-[17px] font-bold text-[#3B3226] transition-transform active:scale-[0.98]"
          >
            🔁 처음부터 다시 보기
          </button>
          <Link href="/stories" className="flex h-[52px] items-center justify-center text-[16px] font-bold text-[#8A7660] no-underline">
            다른 그림책 보러 가기
          </Link>
        </div>
      </div>
    );
  }

  // ── 본문 장 ──
  return (
    <div className="mx-auto max-w-[520px] px-5 pb-14 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <Link href="/stories" className="rounded-full border border-[#EFDFC0] bg-white px-4 py-2 text-[15px] font-bold text-[#8A7660] no-underline">
          ← 그만 보기
        </Link>
        <span className="text-[15px] font-bold text-[#8A7660]">
          {pageNo + 1}장 / 전체 {total}장
        </span>
      </div>

      {/* 진행 바 */}
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-[#F0E7D2]">
        <div className="h-full rounded-full bg-[#E67E3F] transition-all" style={{ width: `${((pageNo + 1) / total) * 100}%` }} />
      </div>

      <div className="rounded-3xl border-2 border-[#EFDFC0] bg-white px-6 py-8 text-center">
        <button
          type="button"
          onClick={() => read(pageToSpeech(page!), `/audio/stories/${story.id}/${pageNo}.mp3`)}
          className={`mb-4 inline-flex items-center gap-1.5 rounded-full border-2 px-4 py-2 text-[15px] font-bold transition-transform active:scale-[0.97] ${
            playing ? "border-[#E67E3F] bg-[#FDF0E0] text-[#C4621A]" : "border-[#EFDFC0] bg-white text-[#6E5C49]"
          }`}
        >
          {playing ? "⏹️ 그만 듣기" : "🔊 읽어 주기"}
        </button>
        <PageArt page={page!} />
        <h1 className="mt-4 break-keep text-[clamp(22px,5vw,27px)] font-extrabold leading-snug text-[#3B3226]">{page!.title}</h1>
        {page!.sms && <SmsBubble from={page!.sms.from} body={page!.sms.body} />}
        {page!.text && (
          <p className="mt-4 whitespace-pre-line break-keep text-[19px] leading-relaxed text-[#5C4E3D]">{page!.text}</p>
        )}

        {/* 퀴즈 */}
        {page!.quiz && (
          <div className="mt-4">
            <p className="break-keep text-[18px] font-bold leading-relaxed text-[#3B3226]">{page!.quiz.question}</p>
            <div className="mt-4 flex flex-col gap-2.5">
              {page!.quiz.options.map((o, i) => {
                const chosen = picked === i;
                return (
                  <button
                    key={o.label}
                    type="button"
                    onClick={() => setPicked(i)}
                    className={`min-h-[58px] rounded-2xl border-2 px-4 py-3 text-[17px] font-bold transition-transform active:scale-[0.98] ${
                      chosen
                        ? o.correct
                          ? "border-[#7FA876] bg-[#F0F8EA] text-[#3E6B34]"
                          : "border-[#E67E3F] bg-[#FDF0E0] text-[#B4541B]"
                        : "border-[#EFDFC0] bg-white text-[#3B3226]"
                    }`}
                  >
                    {chosen ? (o.correct ? "✅ " : "🤔 ") : ""}
                    {o.label}
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <p className="mt-4 rounded-2xl bg-[#F9F2E0] p-4 text-left text-[16px] leading-relaxed text-[#5C4E3D]" aria-live="polite">
                {page!.quiz.options[picked].feedback}
              </p>
            )}
          </div>
        )}
      </div>

      {/* 넘기기 */}
      <div className="mt-5 flex gap-3">
        {pageNo > 0 && (
          <button
            type="button"
            onClick={() => go(pageNo - 1)}
            className="h-[60px] flex-1 rounded-2xl border-2 border-[#EFDFC0] bg-white text-[17px] font-bold text-[#8A7660] transition-transform active:scale-[0.98]"
          >
            ← 이전 장
          </button>
        )}
        <button
          type="button"
          disabled={!quizAnswered}
          onClick={() => go(pageNo + 1)}
          className={`h-[60px] flex-[2] rounded-2xl text-[19px] font-extrabold transition-transform active:scale-[0.98] ${
            quizAnswered ? "bg-[#E67E3F] text-white" : "cursor-not-allowed bg-[#EFE7D6] text-[#B8A88F]"
          }`}
        >
          {quizAnswered ? (pageNo === total - 1 ? "다 읽었어요 ✨" : "다음 장 →") : "먼저 하나를 골라 주세요"}
        </button>
      </div>
      <p className="mt-3 text-center text-[14px] text-[#9B8B76]">천천히 읽으셔도 돼요. 시간 제한이 없어요.</p>
    </div>
  );
}
