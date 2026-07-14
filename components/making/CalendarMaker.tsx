"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { track } from "@/lib/track";
import { getHoliday } from "@/lib/making/holidays";
import AffiliateCard from "@/components/AffiliateCard";
import { AFFILIATE } from "@/content/affiliate";

// 사진 달력 만들기 — 만들기 놀이 1호.
// 사진은 서버로 보내지 않고 브라우저 안에서만 처리한다 (업로드 API 없음).

type Step = "photo" | "month" | "style" | "done";

const THEMES = [
  { id: "terracotta", label: "주황", accent: "#C4621A", band: "#FDF0E0" },
  { id: "sage", label: "연두", accent: "#5C7D54", band: "#EFF5E9" },
  { id: "navy", label: "남색", accent: "#3E5C8A", band: "#EDF2F9" },
];

const YEARS = [2026, 2027];
const CANVAS_W = 1240; // A4 세로 비율 (210×297)
const CANVAS_H = 1754;

function drawCalendar(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement | null,
  year: number,
  month: number,
  theme: (typeof THEMES)[number],
  caption: string
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  const F = "'Noto Sans KR','Apple SD Gothic Neo',sans-serif";

  // 배경
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // 사진 영역 (위쪽) — 둥근 모서리로 자르고 cover 방식으로 채움
  const px = 70, py = 70, pw = CANVAS_W - 140, ph = 660;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(px, py, pw, ph, 36);
  ctx.clip();
  if (img) {
    const scale = Math.max(pw / img.width, ph / img.height);
    const dw = img.width * scale, dh = img.height * scale;
    ctx.drawImage(img, px + (pw - dw) / 2, py + (ph - dh) / 2, dw, dh);
  } else {
    ctx.fillStyle = theme.band;
    ctx.fillRect(px, py, pw, ph);
    ctx.font = `200px ${F}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🌸", CANVAS_W / 2, py + ph / 2);
  }
  ctx.restore();

  // 문구
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  if (caption) {
    ctx.fillStyle = "#3B3226";
    ctx.font = `bold 52px ${F}`;
    ctx.fillText(caption, CANVAS_W / 2, py + ph + 88);
  }

  // 연·월 제목
  ctx.fillStyle = theme.accent;
  ctx.font = `800 84px ${F}`;
  ctx.fillText(`${year}년 ${month}월`, CANVAS_W / 2, py + ph + (caption ? 200 : 130));

  // 요일 줄
  const gridTop = py + ph + (caption ? 260 : 190);
  const gx = 70, gw = CANVAS_W - 140;
  const cw = gw / 7;
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  ctx.font = `bold 40px ${F}`;
  dayNames.forEach((d, i) => {
    ctx.fillStyle = i === 0 ? "#C93A2E" : i === 6 ? "#3E6FA8" : "#3B3226";
    ctx.fillText(d, gx + cw * i + cw / 2, gridTop);
  });

  // 날짜 격자
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const rows = Math.ceil((firstDay + daysInMonth) / 7);
  const rowH = Math.min(150, (CANVAS_H - gridTop - 120) / rows);

  for (let d = 1; d <= daysInMonth; d++) {
    const idx = firstDay + d - 1;
    const col = idx % 7, row = Math.floor(idx / 7);
    const cx = gx + cw * col + cw / 2;
    const cy = gridTop + 60 + row * rowH + 46;
    const holiday = getHoliday(year, month, d);
    ctx.fillStyle = col === 0 || holiday ? "#C93A2E" : col === 6 ? "#3E6FA8" : "#3B3226";
    ctx.font = `bold 46px ${F}`;
    ctx.fillText(String(d), cx, cy);
    if (holiday) {
      ctx.font = `24px ${F}`;
      ctx.fillText(holiday, cx, cy + 34);
    }
  }

  // 하단 서명
  ctx.fillStyle = "#9B8B76";
  ctx.font = `26px ${F}`;
  ctx.fillText("시니어 든든에서 정성으로 만들었어요 · seniordeundun.com", CANVAS_W / 2, CANVAS_H - 46);
}

export default function CalendarMaker() {
  const now = new Date();
  const [step, setStep] = useState<Step>("photo");
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null);
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [theme, setTheme] = useState(THEMES[0]);
  const [caption, setCaption] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    track("making_start", { tool: "calendar" });
  }, []);

  // 완성 단계에 들어오면 달력을 그린다
  useEffect(() => {
    if (step !== "done" || !canvasRef.current) return;
    drawCalendar(canvasRef.current, photo, year, month, theme, caption);
    setDataUrl(canvasRef.current.toDataURL("image/png"));
    track("making_complete", { tool: "calendar", month: `${year}-${month}` });
  }, [step, photo, year, month, theme, caption]);

  function onPickPhoto(file: File | undefined) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      setPhoto(img);
      setStep("month");
    };
    img.src = url;
  }

  async function handleSave() {
    track("making_save", { tool: "calendar" });
    try {
      const blob = await new Promise<Blob | null>((r) => canvasRef.current?.toBlob(r, "image/png"));
      if (blob && navigator.canShare?.({ files: [new File([blob], "달력.png", { type: "image/png" })] })) {
        await navigator.share({
          title: "내가 만든 달력",
          files: [new File([blob], `${year}년${month}월-달력.png`, { type: "image/png" })],
        });
        return;
      }
    } catch {
      /* 공유 취소 등은 무시하고 다운로드로 넘어감 */
    }
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${year}년${month}월-달력.png`;
    a.click();
  }

  function handlePrint() {
    track("making_print", { tool: "calendar" });
    window.print();
  }

  const stepNo = { photo: 1, month: 2, style: 3, done: 4 }[step];

  return (
    <div className="mx-auto max-w-[560px] px-5 pb-14 pt-8">
      {step !== "done" && (
        <p className="mb-4 text-center text-[15px] font-bold text-[#8A7660]">{stepNo}단계 / 전체 3단계</p>
      )}

      {/* 1. 사진 고르기 */}
      {step === "photo" && (
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDDFC0] px-4 py-1.5 text-[15px] font-bold text-[#C4621A]">
            📅 사진 달력 만들기
          </span>
          <h1 className="mt-3 text-[clamp(26px,5vw,34px)] font-extrabold leading-snug text-[#3B3226]">
            달력에 넣을 사진을 골라 주세요
          </h1>
          <p className="mt-2 text-[17px] leading-relaxed text-[#6E5C49]">
            손주, 가족, 좋아하는 풍경 — 무엇이든 좋아요.
            <br />
            사진은 <strong>어디에도 저장되지 않아요.</strong> 안심하세요.
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onPickPhoto(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="mt-7 h-[64px] w-full rounded-2xl bg-[#E67E3F] text-[20px] font-extrabold text-white transition-transform active:scale-[0.98]"
          >
            📷 사진 고르기
          </button>
          <button
            type="button"
            onClick={() => setStep("month")}
            className="mt-3 h-[56px] w-full rounded-2xl border-2 border-[#EFDFC0] bg-white text-[17px] font-bold text-[#8A7660] transition-transform active:scale-[0.98]"
          >
            사진 없이 만들기
          </button>
        </div>
      )}

      {/* 2. 달 고르기 */}
      {step === "month" && (
        <div className="text-center">
          <h1 className="text-[clamp(26px,5vw,34px)] font-extrabold leading-snug text-[#3B3226]">
            몇 월 달력을 만들까요?
          </h1>
          <div className="mt-5 flex justify-center gap-2">
            {YEARS.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => setYear(y)}
                className={`rounded-full px-6 py-2.5 text-[17px] font-bold transition-transform active:scale-[0.97] ${
                  year === y ? "bg-[#E67E3F] text-white" : "border-2 border-[#EFDFC0] bg-white text-[#8A7660]"
                }`}
              >
                {y}년
              </button>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2.5">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMonth(m)}
                className={`h-[64px] rounded-2xl text-[20px] font-extrabold transition-transform active:scale-[0.97] ${
                  month === m ? "bg-[#E67E3F] text-white" : "border-2 border-[#EFDFC0] bg-white text-[#3B3226]"
                }`}
              >
                {m}월
              </button>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <button type="button" onClick={() => setStep("photo")} className="h-[56px] flex-1 rounded-2xl border-2 border-[#EFDFC0] bg-white text-[17px] font-bold text-[#8A7660]">
              ← 이전
            </button>
            <button type="button" onClick={() => setStep("style")} className="h-[56px] flex-[2] rounded-2xl bg-[#E67E3F] text-[19px] font-extrabold text-white">
              다음 →
            </button>
          </div>
        </div>
      )}

      {/* 3. 꾸미기 */}
      {step === "style" && (
        <div className="text-center">
          <h1 className="text-[clamp(26px,5vw,34px)] font-extrabold leading-snug text-[#3B3226]">
            달력을 꾸며 볼까요?
          </h1>
          <p className="mt-4 text-left text-[16px] font-bold text-[#6E5C49]">글씨 색 고르기</p>
          <div className="mt-2 flex gap-2.5">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t)}
                className={`flex h-[56px] flex-1 items-center justify-center gap-2 rounded-2xl text-[17px] font-bold transition-transform active:scale-[0.97] ${
                  theme.id === t.id ? "border-[3px] border-[#3B3226] bg-white" : "border-2 border-[#EFDFC0] bg-white"
                }`}
              >
                <span className="h-5 w-5 rounded-full" style={{ background: t.accent }} />
                {t.label}
              </button>
            ))}
          </div>
          <p className="mt-5 text-left text-[16px] font-bold text-[#6E5C49]">달력에 넣을 한마디 (안 써도 돼요)</p>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={16}
            placeholder="예: 사랑하는 우리 가족"
            className="mt-2 h-[60px] w-full rounded-2xl border-2 border-[#EFDFC0] bg-white px-5 text-center text-[19px] font-bold text-[#3B3226] outline-none placeholder:font-normal placeholder:text-[#B8A88F] focus:border-[#E67E3F]"
          />
          <div className="mt-6 flex gap-3">
            <button type="button" onClick={() => setStep("month")} className="h-[56px] flex-1 rounded-2xl border-2 border-[#EFDFC0] bg-white text-[17px] font-bold text-[#8A7660]">
              ← 이전
            </button>
            <button type="button" onClick={() => setStep("done")} className="h-[56px] flex-[2] rounded-2xl bg-[#E67E3F] text-[19px] font-extrabold text-white">
              달력 완성하기 ✨
            </button>
          </div>
        </div>
      )}

      {/* 4. 완성 */}
      {step === "done" && (
        <div className="text-center">
          <Image src="/mascot-celebrate.webp" alt="만세하는 든든이" width={110} height={113} className="mx-auto mb-2 rounded-2xl" />
          <h1 className="text-[clamp(24px,5vw,30px)] font-extrabold leading-snug text-[#3B3226]">
            와, 세상에 하나뿐인 달력이에요!
          </h1>
          <p className="mt-2 text-[16px] leading-relaxed text-[#6E5C49]">
            인쇄해서 냉장고나 벽에 붙여 보세요.
            <br />
            반으로 접으면 탁상 달력도 됩니다.
          </p>

          {/* 미리보기 */}
          <div className="mt-5 overflow-hidden rounded-2xl border-2 border-[#EFDFC0] bg-white shadow-[0_6px_24px_rgba(59,50,38,0.12)]">
            {dataUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element -- 캔버스에서 만든 data URL 미리보기 */
              <img src={dataUrl} alt={`${year}년 ${month}월 달력 미리보기`} className="w-full" />
            ) : (
              <p className="py-16 text-[16px] text-[#8A7660]">달력을 그리고 있어요…</p>
            )}
          </div>

          <div className="mt-5 flex flex-col gap-3">
            <button type="button" onClick={handlePrint} className="h-[60px] rounded-2xl bg-[#E67E3F] text-[19px] font-extrabold text-white transition-transform active:scale-[0.98]">
              🖨️ 인쇄하기
            </button>
            <button type="button" onClick={handleSave} className="h-[56px] rounded-2xl border-2 border-[#FDDFC0] bg-[#FDF0E0] text-[17px] font-bold text-[#C4621A] transition-transform active:scale-[0.98]">
              📱 사진첩에 저장 / 가족에게 보내기
            </button>
            <button type="button" onClick={() => setStep("style")} className="h-[54px] rounded-2xl border-2 border-[#EFDFC0] bg-white text-[16px] font-bold text-[#3B3226]">
              ← 다시 꾸미기
            </button>
          </div>

          {/* 프린터 안내 + 파트너스 카드 */}
          <div className="mt-6 rounded-2xl bg-[#FBF6EA] p-4">
            <p className="break-keep text-center text-[15px] leading-relaxed text-[#6E5C49]">
              프린터가 없어도 괜찮아요. 사진첩에 저장한 뒤
              <br />
              가까운 <strong>편의점 인쇄기</strong>에서 몇백 원에 뽑을 수 있어요.
            </p>
            <AffiliateCard product={AFFILIATE.photoPrinter} heading="🖨️ 집에서 자주 뽑고 싶다면" />
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <Link href="/making" className="flex h-[50px] items-center justify-center text-[16px] font-bold text-[#8A7660] no-underline">
              다른 만들기 보러 가기
            </Link>
          </div>
        </div>
      )}

      {/* 그리기용 캔버스 (화면에는 숨김) */}
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      {/* 인쇄 시에는 달력 이미지만 보이게 */}
      {dataUrl && (
        <div className="calendar-print-area">
          {/* eslint-disable-next-line @next/next/no-img-element -- 인쇄 전용 사본 */}
          <img src={dataUrl} alt="" />
        </div>
      )}
      <style>{`
        .calendar-print-area { display: none; }
        @media print {
          body * { visibility: hidden; }
          .calendar-print-area { display: block; visibility: visible; position: absolute; inset: 0; }
          .calendar-print-area img { visibility: visible; width: 100%; }
        }
      `}</style>
    </div>
  );
}
