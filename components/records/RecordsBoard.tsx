"use client";
import Link from "next/link";
import { PRACTICES, getPractice } from "@/lib/practices";
import { useProgress, stamps, totalCompletions, weeklyCount } from "@/lib/progress";

// 내 기록 — 로그인 없이 이 기기 브라우저에 저장된 연습 기록을 보여준다.
export default function RecordsBoard() {
  const progress = useProgress();

  const total = progress ? totalCompletions(progress) : 0;
  const stampList = progress ? stamps(progress) : [];
  const last = progress?.lastId ? getPractice(progress.lastId) : null;

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px 56px" }}>
      <div style={{ textAlign: "center", marginBottom: 26 }}>
        <h1 style={{ fontSize: "clamp(24px,5vw,34px)", fontWeight: 800, color: "#3B3226", lineHeight: 1.3, letterSpacing: "-0.5px", marginBottom: 10 }}>
          내 기록
        </h1>
        <p style={{ fontSize: 15, color: "#8A7660", lineHeight: 1.7 }}>
          기록은 지금 쓰고 계신 이 기기 브라우저에만 저장돼요. 서버로 보내지 않아요.
        </p>
      </div>

      {progress && total === 0 && (
        <div style={{ background: "#fff", border: "2px solid #EFDFC0", borderRadius: 20, padding: "36px 24px", textAlign: "center" }}>
          <p style={{ fontSize: 40, marginBottom: 10 }} aria-hidden="true">🛝</p>
          <p style={{ fontSize: 18, fontWeight: 800, color: "#3B3226", marginBottom: 6 }}>아직 기록이 없어요</p>
          <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.7, marginBottom: 18 }}>
            첫 연습을 끝내면 여기에 도장이 하나씩 모여요.
          </p>
          <Link
            href="/kiosk"
            style={{ display: "inline-flex", minHeight: 52, alignItems: "center", justifyContent: "center", background: "#E67E3F", color: "#fff", borderRadius: 999, padding: "0 28px", fontSize: 17, fontWeight: 800, textDecoration: "none" }}
          >
            첫 연습 하러 가기 →
          </Link>
        </div>
      )}

      {progress && total > 0 && (
        <>
          {/* 요약 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 22 }}>
            {[
              { label: "이번 주 연습", value: `${weeklyCount(progress)}회` },
              { label: "전체 연습", value: `${total}회` },
              { label: "받은 도장", value: `${stampList.filter((s) => s.earned).length}개` },
            ].map((f) => (
              <div key={f.label} style={{ background: "#F9F2E0", borderRadius: 16, padding: "16px 10px", textAlign: "center" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#8A7660", marginBottom: 4 }}>{f.label}</p>
                <p style={{ fontSize: 22, fontWeight: 900, color: "#3B3226" }}>{f.value}</p>
              </div>
            ))}
          </div>

          {/* 이어하기 */}
          {last && (
            <Link
              href={last.href}
              style={{ display: "flex", alignItems: "center", gap: 14, background: "#FDF4DF", border: "2px solid #F5D9A8", borderRadius: 18, padding: "18px 20px", textDecoration: "none", marginBottom: 22 }}
            >
              <span style={{ fontSize: 30 }} aria-hidden="true">{last.emoji}</span>
              <span style={{ flex: 1 }}>
                <span style={{ display: "block", fontSize: 14, fontWeight: 700, color: "#8A7660" }}>마지막 연습</span>
                <span style={{ display: "block", fontSize: 19, fontWeight: 800, color: "#3B3226" }}>{last.short} — 이어서 해볼까요?</span>
              </span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#C4621A" }}>→</span>
            </Link>
          )}

          {/* 도장판 */}
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#3B3226", margin: "0 0 12px 4px" }}>도장판</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10, marginBottom: 26 }}>
            {stampList.map((s) => (
              <div
                key={s.id}
                style={{
                  background: s.earned ? "#EFF5E9" : "#F7F6F3",
                  border: s.earned ? "2px solid #CFE3C0" : "2px dashed #E0DDD4",
                  borderRadius: 16,
                  padding: "16px 10px",
                  textAlign: "center",
                  opacity: s.earned ? 1 : 0.65,
                }}
              >
                <p style={{ fontSize: 30, marginBottom: 6, filter: s.earned ? "none" : "grayscale(1)" }} aria-hidden="true">{s.emoji}</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: s.earned ? "#4F7245" : "#9B9890", lineHeight: 1.4, wordBreak: "keep-all" }}>{s.label}</p>
                <p style={{ fontSize: 12, fontWeight: 700, color: s.earned ? "#4F7245" : "#C9C7BE", marginTop: 4 }}>{s.earned ? "받았어요!" : "아직이에요"}</p>
              </div>
            ))}
          </div>

          {/* 연습별 현황 */}
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#3B3226", margin: "0 0 12px 4px" }}>연습별 기록</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {PRACTICES.map((p) => {
              const c = progress.counts[p.id] ?? 0;
              return (
                <Link
                  key={p.id}
                  href={p.href}
                  style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "6px 14px", background: "#fff", border: "1.5px solid #EFE3CC", borderRadius: 16, padding: "16px 18px", textDecoration: "none" }}
                >
                  <span style={{ fontSize: 26 }} aria-hidden="true">{p.emoji}</span>
                  <span style={{ flex: 1, minWidth: 120, fontSize: 17, fontWeight: 800, color: "#3B3226", wordBreak: "keep-all" }}>{p.title}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, whiteSpace: "nowrap", color: c > 0 ? "#4F7245" : "#9B9890" }}>
                    {c > 0 ? `✅ ${c}회 완료` : "아직 안 해봤어요"}
                  </span>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}
