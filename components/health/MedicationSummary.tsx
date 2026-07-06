"use client";
import { useState, useEffect } from "react";

type MealTiming = "식전" | "식후" | "상관없음";
const TIMES = ["아침", "점심", "저녁", "자기 전"] as const;
type TimeKey = (typeof TIMES)[number];

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  times: TimeKey[];
  meal: MealTiming;
  notes: string;
}

const EMPTY: Omit<Medicine, "id"> = { name: "", dosage: "", times: [], meal: "식후", notes: "" };

export default function MedicationSummary() {
  const [form, setForm] = useState<Omit<Medicine, "id">>(EMPTY);
  const [list, setList] = useState<Medicine[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("med-list");
      // One-time hydration from localStorage on mount — SSR has no access to
      // localStorage, so this can't be a lazy useState initializer without a
      // hydration mismatch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setList(JSON.parse(saved));
    } catch {}
  }, []);

  const persist = (next: Medicine[]) => {
    setList(next);
    try {
      localStorage.setItem("med-list", JSON.stringify(next));
      setSavedAt(next.length > 0 ? new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }) : null);
    } catch {}
  };

  const handleReset = () => {
    if (!confirm("저장된 약 목록을 모두 삭제할까요?")) return;
    setList([]);
    setSavedAt(null);
    setShowResult(false);
    try { localStorage.removeItem("med-list"); } catch {}
  };

  const toggleTime = (t: TimeKey) => {
    setForm((prev) => ({
      ...prev,
      times: prev.times.includes(t) ? prev.times.filter((x) => x !== t) : [...prev.times, t],
    }));
  };

  const handleAdd = () => {
    if (!form.name.trim()) { setNameError(true); return; }
    setNameError(false);
    persist([...list, { ...form, name: form.name.trim(), id: Date.now().toString() }]);
    setForm(EMPTY);
    setShowResult(false);
  };

  const handleDelete = (id: string) => {
    persist(list.filter((m) => m.id !== id));
    setShowResult(false);
  };

  const buildCopyText = () => {
    if (!list.length) return "";
    const lines = [
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "  복용약 요약표",
      "  (시니어 든든 참고용 도구)",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "",
      ...list.map((m, i) => [
        `${i + 1}. ${m.name}`,
        `   용량: ${m.dosage || "기재 없음"}  |  식사 기준: ${m.meal}`,
        `   복용 시간:  아침 ${m.times.includes("아침") ? "○" : "─"}  점심 ${m.times.includes("점심") ? "○" : "─"}  저녁 ${m.times.includes("저녁") ? "○" : "─"}  자기전 ${m.times.includes("자기 전") ? "○" : "─"}`,
        m.notes ? `   주의사항: ${m.notes}` : "",
        "",
      ].filter(Boolean).join("\n")),
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      `총 복용약: ${list.length}가지`,
      "※ 이 요약표는 병원·약국 방문 시 참고용으로 사용하세요.",
      "※ 약 복용 관련 결정은 의사·약사와 상담하세요.",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    ];
    return lines.join("\n");
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(buildCopyText())
      .then(() => alert("복사되었습니다.\n카카오톡, 메모장 등에 붙여넣기 해보세요."))
      .catch(() => alert("복사에 실패했습니다. 브라우저 설정을 확인해주세요."));
  };

  const handlePrint = () => {
    const rows = list
      .map(
        (m) =>
          `<tr>
            <td>${m.name}</td>
            <td style="text-align:center">${m.dosage || "─"}</td>
            <td style="text-align:center">${m.times.includes("아침") ? "○" : "─"}</td>
            <td style="text-align:center">${m.times.includes("점심") ? "○" : "─"}</td>
            <td style="text-align:center">${m.times.includes("저녁") ? "○" : "─"}</td>
            <td style="text-align:center">${m.times.includes("자기 전") ? "○" : "─"}</td>
            <td style="text-align:center">${m.meal}</td>
            <td>${m.notes || "─"}</td>
          </tr>`
      )
      .join("");

    const w = window.open("", "_blank", "width=900,height=700");
    if (!w) { alert("팝업이 차단되었습니다. 팝업 허용 후 다시 시도해주세요."); return; }
    w.document.write(`<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>복용약 요약표</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0;}
      body{font-family:"Apple SD Gothic Neo","Noto Sans KR",sans-serif;padding:32px;color:#1A1A2E;max-width:900px;margin:0 auto;}
      h1{font-size:20px;font-weight:800;color:#059669;margin-bottom:4px;}
      .sub{font-size:12px;color:#4A5568;margin-bottom:24px;padding-bottom:12px;border-bottom:2px solid #059669;}
      table{width:100%;border-collapse:collapse;font-size:14px;}
      th{background:#F0FDF4;color:#065F46;font-size:13px;padding:10px 8px;border:1px solid #A7F3D0;text-align:center;font-weight:700;}
      td{padding:10px 8px;border:1px solid #D1FAE5;vertical-align:middle;line-height:1.5;}
      tr:nth-child(even) td{background:#F9FAFB;}
      .disclaimer{margin-top:24px;font-size:11px;color:#9CA3AF;border-top:1px solid #E8F0FE;padding-top:12px;line-height:1.7;}
      @media print{body{padding:16px;font-size:13px;}h1{font-size:18px;}}
    </style></head><body>
    <h1>복용약 요약표</h1>
    <p class="sub">참고용 도구 · 총 ${list.length}가지 약 · 정확한 복용법은 의사·약사 안내를 따르세요</p>
    <table>
      <thead>
        <tr>
          <th style="width:18%;text-align:left">약 이름</th>
          <th style="width:9%">1회 용량</th>
          <th style="width:7%">아침</th>
          <th style="width:7%">점심</th>
          <th style="width:7%">저녁</th>
          <th style="width:9%">자기 전</th>
          <th style="width:9%">식사 기준</th>
          <th style="text-align:left">주의사항</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <p class="disclaimer">⚠️ 이 요약표는 병원·약국 방문 시 참고용으로 사용하는 도구입니다. 약 복용과 관련된 결정은 반드시 의사 또는 약사와 상담하시기 바랍니다.</p>
    </body></html>`);
    w.document.close();
    setTimeout(() => { w.focus(); w.print(); }, 400);
  };

  return (
    <div style={{ marginBottom: 40 }}>
      {/* 헤더 */}
      <div style={{ background: "linear-gradient(135deg,#059669,#10B981)", borderRadius: 20, padding: "28px 24px", marginBottom: 24, color: "#fff" }}>
        <p style={{ fontSize: 13, fontWeight: 600, opacity: 0.85, marginBottom: 6 }}>복용약 요약표</p>
        <h2 style={{ fontSize: "clamp(20px,3vw,26px)", fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.3, marginBottom: 8 }}>
          복용 중인 약을 정리해<br />병원·약국에 보여주세요
        </h2>
        <p style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.65 }}>
          약 이름, 용량, 복용 시간을 입력하면 한 장짜리 요약표로 정리됩니다.<br />
          인쇄하거나 복사해서 진료 때 바로 사용하세요.
        </p>
      </div>

      {/* 입력 폼 */}
      <div style={{ background: "#F0FDF4", borderRadius: 18, padding: "24px 20px", border: "1.5px solid #A7F3D0", marginBottom: 20 }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1A2E", marginBottom: 16 }}>💊 약 추가하기</p>

        {/* 약 이름 + 용량 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }} className="med-name-grid">
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#065F46", marginBottom: 6 }}>
              약 이름 <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="예: 아스피린, 혈압약, 메트포르민"
              value={form.name}
              onChange={(e) => { setForm((p) => ({ ...p, name: e.target.value })); setNameError(false); }}
              style={{ width: "100%", height: 52, padding: "0 14px", fontSize: 16, borderRadius: 12, border: `2px solid ${nameError ? "#DC2626" : "#A7F3D0"}`, outline: "none", background: "#fff", boxSizing: "border-box" }}
            />
            {nameError && <p style={{ fontSize: 12, color: "#DC2626", marginTop: 4 }}>약 이름을 입력해주세요</p>}
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#065F46", marginBottom: 6 }}>1회 용량</label>
            <input
              type="text"
              placeholder="예: 1알, 반 알, 5mg"
              value={form.dosage}
              onChange={(e) => setForm((p) => ({ ...p, dosage: e.target.value }))}
              style={{ width: "100%", height: 52, padding: "0 14px", fontSize: 16, borderRadius: 12, border: "2px solid #A7F3D0", outline: "none", background: "#fff", boxSizing: "border-box" }}
            />
          </div>
        </div>

        {/* 복용 시간 */}
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#065F46", marginBottom: 8 }}>복용 시간 (해당하는 것 모두 선택)</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {TIMES.map((t) => (
              <button
                key={t}
                onClick={() => toggleTime(t)}
                style={{ height: 48, padding: "0 18px", fontSize: 15, fontWeight: 600, borderRadius: 12, border: `2px solid ${form.times.includes(t) ? "#059669" : "#A7F3D0"}`, background: form.times.includes(t) ? "#059669" : "#fff", color: form.times.includes(t) ? "#fff" : "#1A1A2E", cursor: "pointer" }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 식사 기준 */}
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#065F46", marginBottom: 8 }}>식사 기준</p>
          <div style={{ display: "flex", gap: 8 }}>
            {(["식전", "식후", "상관없음"] as MealTiming[]).map((m) => (
              <button
                key={m}
                onClick={() => setForm((p) => ({ ...p, meal: m }))}
                style={{ height: 48, padding: "0 18px", fontSize: 15, fontWeight: 600, borderRadius: 12, border: `2px solid ${form.meal === m ? "#059669" : "#A7F3D0"}`, background: form.meal === m ? "#059669" : "#fff", color: form.meal === m ? "#fff" : "#1A1A2E", cursor: "pointer" }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* 주의사항 */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#065F46", marginBottom: 6 }}>주의사항 (선택)</label>
          <input
            type="text"
            placeholder="예: 물과 함께 복용, 자몽 주스 금지, 취침 30분 전"
            value={form.notes}
            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            style={{ width: "100%", height: 52, padding: "0 14px", fontSize: 15, borderRadius: 12, border: "2px solid #A7F3D0", outline: "none", background: "#fff", boxSizing: "border-box" }}
          />
        </div>

        <button
          onClick={handleAdd}
          style={{ width: "100%", height: 54, fontSize: 16, fontWeight: 700, color: "#fff", background: "#059669", border: "none", borderRadius: 14, cursor: "pointer" }}
        >
          + 목록에 추가하기
        </button>
      </div>

      {/* 추가된 약 목록 */}
      {list.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 8, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1A2E" }}>
                입력한 약 <span style={{ color: "#059669" }}>{list.length}가지</span>
              </p>
              {savedAt && (
                <span style={{ fontSize: 11, fontWeight: 600, color: "#059669", background: "#F0FDF4", border: "1px solid #A7F3D0", padding: "2px 8px", borderRadius: 99 }}>
                  💾 저장됨 {savedAt}
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={handleReset}
                style={{ height: 40, padding: "0 14px", fontSize: 13, fontWeight: 600, color: "#EF4444", background: "#FFF5F5", border: "1.5px solid #FECACA", borderRadius: 10, cursor: "pointer" }}
              >
                목록 초기화
              </button>
              <button
                onClick={() => setShowResult(true)}
                style={{ height: 40, padding: "0 20px", fontSize: 14, fontWeight: 700, color: "#fff", background: "#059669", border: "none", borderRadius: 10, cursor: "pointer" }}
              >
                요약표 만들기 →
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {list.map((m) => (
              <div key={m.id} style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #D1FAE5", padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: "#1A1A2E" }}>{m.name}</p>
                    {m.dosage && <span style={{ fontSize: 12, color: "#059669", background: "#F0FDF4", padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>{m.dosage}</span>}
                    <span style={{ fontSize: 12, color: "#6B7280", background: "#F3F4F6", padding: "2px 8px", borderRadius: 6 }}>{m.meal}</span>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {TIMES.map((t) => (
                      <span key={t} style={{ fontSize: 13, padding: "3px 10px", borderRadius: 8, background: m.times.includes(t) ? "#059669" : "#F3F4F6", color: m.times.includes(t) ? "#fff" : "#9CA3AF", fontWeight: m.times.includes(t) ? 700 : 400 }}>
                        {t}
                      </span>
                    ))}
                  </div>
                  {m.notes && <p style={{ fontSize: 12, color: "#6B7280", marginTop: 6 }}>⚠️ {m.notes}</p>}
                </div>
                <button
                  onClick={() => handleDelete(m.id)}
                  style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #FCA5A5", background: "#FFF", color: "#EF4444", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 빈 상태 안내 */}
      {list.length === 0 && (
        <div style={{ background: "#fff", borderRadius: 14, border: "1.5px dashed #D1FAE5", padding: "32px 24px", textAlign: "center", marginBottom: 20 }}>
          <p style={{ fontSize: 32, marginBottom: 10 }}>💊</p>
          <p style={{ fontSize: 15, fontWeight: 600, color: "#4A5568", marginBottom: 6 }}>아직 추가된 약이 없습니다</p>
          <p style={{ fontSize: 13, color: "#9CA3AF", lineHeight: 1.65 }}>위 폼에서 복용 중인 약을 하나씩 추가해보세요.<br />2~3가지를 추가하면 요약표를 만들 수 있습니다.</p>
        </div>
      )}

      {/* 결과 요약표 */}
      {showResult && list.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 20, border: "2px solid #A7F3D0", overflow: "hidden", marginBottom: 16 }}>
          <div style={{ background: "#059669", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>복용약 요약표 — {list.length}가지</p>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", background: "rgba(255,255,255,0.15)", padding: "3px 10px", borderRadius: 99 }}>참고용 도구</span>
          </div>

          <div style={{ padding: "20px", overflowX: "auto" }}>
            {/* 테이블 */}
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 540 }}>
              <thead>
                <tr style={{ background: "#F0FDF4" }}>
                  <th style={{ padding: "10px 12px", fontSize: 13, fontWeight: 700, color: "#065F46", border: "1px solid #A7F3D0", textAlign: "left", whiteSpace: "nowrap" }}>약 이름</th>
                  <th style={{ padding: "10px 8px", fontSize: 13, fontWeight: 700, color: "#065F46", border: "1px solid #A7F3D0", textAlign: "center", whiteSpace: "nowrap" }}>용량</th>
                  {TIMES.map((t) => (
                    <th key={t} style={{ padding: "10px 8px", fontSize: 13, fontWeight: 700, color: "#065F46", border: "1px solid #A7F3D0", textAlign: "center", whiteSpace: "nowrap" }}>{t}</th>
                  ))}
                  <th style={{ padding: "10px 8px", fontSize: 13, fontWeight: 700, color: "#065F46", border: "1px solid #A7F3D0", textAlign: "center", whiteSpace: "nowrap" }}>식사</th>
                  <th style={{ padding: "10px 12px", fontSize: 13, fontWeight: 700, color: "#065F46", border: "1px solid #A7F3D0", textAlign: "left" }}>주의사항</th>
                </tr>
              </thead>
              <tbody>
                {list.map((m, i) => (
                  <tr key={m.id} style={{ background: i % 2 === 1 ? "#F9FAFB" : "#fff" }}>
                    <td style={{ padding: "10px 12px", fontSize: 15, fontWeight: 700, color: "#1A1A2E", border: "1px solid #D1FAE5" }}>{m.name}</td>
                    <td style={{ padding: "10px 8px", fontSize: 14, color: "#4A5568", border: "1px solid #D1FAE5", textAlign: "center" }}>{m.dosage || "─"}</td>
                    {TIMES.map((t) => (
                      <td key={t} style={{ padding: "10px 8px", fontSize: 18, border: "1px solid #D1FAE5", textAlign: "center", color: m.times.includes(t) ? "#059669" : "#D1D5DB" }}>
                        {m.times.includes(t) ? "○" : "─"}
                      </td>
                    ))}
                    <td style={{ padding: "10px 8px", fontSize: 13, color: "#4A5568", border: "1px solid #D1FAE5", textAlign: "center", whiteSpace: "nowrap" }}>{m.meal}</td>
                    <td style={{ padding: "10px 12px", fontSize: 13, color: "#4A5568", border: "1px solid #D1FAE5" }}>{m.notes || "─"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ padding: "0 20px 20px" }}>
            {/* 면책 */}
            <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
              <p style={{ fontSize: 12, color: "#78350F", lineHeight: 1.7 }}>
                ⚠️ 이 요약표는 병원·약국 방문 시 <strong>참고용으로 보여주기 위한 도구</strong>입니다. 약 복용과 관련된 결정은 반드시 의사 또는 약사와 상담하시기 바랍니다.
              </p>
            </div>

            {/* 버튼 */}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleCopy} style={{ flex: 1, height: 52, fontSize: 15, fontWeight: 700, color: "#fff", background: "#059669", border: "none", borderRadius: 12, cursor: "pointer" }}>
                📋 결과 복사하기
              </button>
              <button onClick={handlePrint} style={{ flex: 1, height: 52, fontSize: 15, fontWeight: 700, color: "#059669", background: "#F0FDF4", border: "2px solid #A7F3D0", borderRadius: 12, cursor: "pointer" }}>
                🖨️ 인쇄하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 상시 면책 */}
      <div style={{ padding: "14px 18px", background: "#fff", borderRadius: 12, border: "1px solid #D1FAE5" }}>
        <p style={{ fontSize: 12, color: "#4A5568", lineHeight: 1.65 }}>
          ℹ️ 이 도구는 복용약 목록을 <strong>정리해두기 위한 참고용</strong>입니다. 입력한 정보는 이 기기에 자동 저장되어 브라우저를 닫아도 유지됩니다. 약 복용 관련 결정은 의사·약사와 상담하세요.
        </p>
      </div>

      <style>{`
        @media(max-width:540px){
          .med-name-grid{grid-template-columns:1fr!important;}
        }
      `}</style>
    </div>
  );
}
