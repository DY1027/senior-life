"use client";
import { useState, useEffect } from "react";

interface CheckItem {
  id: string;
  label: string;
}
interface Category {
  key: string;
  title: string;
  emoji: string;
  color: string;
  bg: string;
  border: string;
  items: CheckItem[];
}

const CATEGORIES: Category[] = [
  {
    key: "safety",
    title: "안전 환경",
    emoji: "🏠",
    color: "#7C3AED",
    bg: "#F5F3FF",
    border: "#DDD6FE",
    items: [
      { id: "s1", label: "욕실·화장실에 미끄럼 방지 매트가 있나요?" },
      { id: "s2", label: "화장실·복도에 안전 손잡이가 설치되어 있나요?" },
      { id: "s3", label: "야간에 넘어지지 않도록 조명이 충분한가요?" },
      { id: "s4", label: "문턱이 제거되었거나 경사로가 있나요?" },
      { id: "s5", label: "응급 연락처가 잘 보이는 곳에 붙어 있나요?" },
    ],
  },
  {
    key: "health",
    title: "건강 관리",
    emoji: "💊",
    color: "#059669",
    bg: "#F0FDF4",
    border: "#A7F3D0",
    items: [
      { id: "h1", label: "복용 중인 약 목록과 복용 시간을 기록하고 있나요?" },
      { id: "h2", label: "정기적인 병원 방문 일정을 관리하고 있나요?" },
      { id: "h3", label: "식사량·체중 변화를 주기적으로 확인하나요?" },
      { id: "h4", label: "혈압·혈당 수치를 측정하고 기록하고 있나요?" },
      { id: "h5", label: "치과·안과·이비인후과 등 정기 검진을 챙기나요?" },
    ],
  },
  {
    key: "emotion",
    title: "정서·사회",
    emoji: "❤️",
    color: "#DC2626",
    bg: "#FEF2F2",
    border: "#FECACA",
    items: [
      { id: "e1", label: "하루 한 번 이상 전화하거나 방문하고 있나요?" },
      { id: "e2", label: "경로당·복지관 등 외출과 사회 활동을 지원하나요?" },
      { id: "e3", label: "함께 즐길 수 있는 취미 활동을 찾아드렸나요?" },
      { id: "e4", label: "우울감·기억력 저하 등 변화 징후를 살피고 있나요?" },
      { id: "e5", label: "치매안심센터 등록이나 상담을 검토해보셨나요?" },
    ],
  },
  {
    key: "welfare",
    title: "복지 서비스",
    emoji: "🏛️",
    color: "#1B6FC8",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    items: [
      { id: "w1", label: "장기요양보험 등급 신청 여부를 확인했나요?" },
      { id: "w2", label: "노인 맞춤 돌봄 서비스를 신청했거나 알아봤나요?" },
      { id: "w3", label: "식사 배달 서비스(도시락 배달 등) 이용을 검토했나요?" },
      { id: "w4", label: "이동 지원 서비스(복지콜 등) 신청 여부를 확인했나요?" },
      { id: "w5", label: "긴급복지지원 제도에 대해 알고 있나요?" },
    ],
  },
];

const ALL_ITEMS = CATEGORIES.flatMap((c) => c.items.map((i) => ({ ...i, catKey: c.key, catTitle: c.title })));

interface SavedData { checked: Record<string, boolean>; date: string; pct: number; }

export default function ParentChecklistTool() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [showResult, setShowResult] = useState(false);
  const [lastSaved, setLastSaved] = useState<SavedData | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("parent-checklist");
      if (raw) {
        const data: SavedData = JSON.parse(raw);
        setChecked(data.checked);
        setLastSaved(data);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const total = ALL_ITEMS.length;
      const cnt = ALL_ITEMS.filter((i) => checked[i.id]).length;
      const p = Math.round((cnt / total) * 100);
      if (cnt > 0) {
        const data: SavedData = { checked, date: new Date().toLocaleDateString("ko-KR"), pct: p };
        localStorage.setItem("parent-checklist", JSON.stringify(data));
        setLastSaved(data);
      }
    } catch {}
  }, [checked]);

  const toggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
    setShowResult(false);
  };

  const countOf = (cat: Category) => cat.items.filter((i) => checked[i.id]).length;
  const totalChecked = ALL_ITEMS.filter((i) => checked[i.id]).length;
  const totalItems = ALL_ITEMS.length;
  const pct = Math.round((totalChecked / totalItems) * 100);

  const grade =
    pct >= 80 ? { label: "잘 챙기고 있어요", emoji: "✅", color: "#059669", bg: "#F0FDF4", border: "#A7F3D0" }
    : pct >= 50 ? { label: "조금 더 챙겨보세요", emoji: "📋", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" }
    : { label: "아직 확인이 필요해요", emoji: "⚠️", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" };

  const unchecked = ALL_ITEMS.filter((i) => !checked[i.id]);

  const buildCopyText = () => {
    const lines = [
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "  부모님 생활 점검 결과",
      "  (시니어 든든 참고용 도구)",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "",
      `점검 날짜: ${new Date().toLocaleDateString("ko-KR")}`,
      `전체 점검 항목: ${totalItems}개 중 ${totalChecked}개 확인 (${pct}%)`,
      `상태: ${grade.emoji} ${grade.label}`,
      "",
      ...CATEGORIES.map((c) => {
        const cnt = countOf(c);
        return `${c.emoji} ${c.title}: ${cnt}/${c.items.length}개 확인\n` +
          c.items.map((i) => `  ${checked[i.id] ? "✓" : "○"} ${i.label}`).join("\n");
      }),
      "",
      unchecked.length > 0 ? [
        "─ 아직 확인이 필요한 항목 ────────",
        ...unchecked.map((i) => `  · ${i.label}`),
        "",
      ].join("\n") : "",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "※ 이 점검표는 참고용 도구입니다.",
      "   전문적인 돌봄 판단은 관련 기관에 문의하세요.",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    ];
    return lines.filter(Boolean).join("\n");
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(buildCopyText())
      .then(() => alert("복사되었습니다.\n카카오톡, 메모장 등에 붙여넣기 해보세요."))
      .catch(() => alert("복사에 실패했습니다."));
  };

  const handlePrint = () => {
    const catRows = CATEGORIES.map((c) => {
      const cnt = countOf(c);
      const items = c.items.map(
        (i) => `<tr><td style="padding:7px 10px;border:1px solid #E8F0FE;">${checked[i.id] ? "✓" : "○"}</td><td style="padding:7px 12px;border:1px solid #E8F0FE;font-size:14px;line-height:1.5">${i.label}</td></tr>`
      ).join("");
      return `
        <h2 style="font-size:15px;font-weight:700;margin:20px 0 8px;color:#1A1A2E;">${c.emoji} ${c.title} — ${cnt}/${c.items.length}</h2>
        <table style="width:100%;border-collapse:collapse;">
          <thead><tr><th style="width:40px;padding:7px;background:#F0F7FF;border:1px solid #DBEAFE;text-align:center;">확인</th><th style="padding:7px 12px;background:#F0F7FF;border:1px solid #DBEAFE;text-align:left;">항목</th></tr></thead>
          <tbody>${items}</tbody>
        </table>`;
    }).join("");

    const w = window.open("", "_blank", "width=800,height=900");
    if (!w) { alert("팝업이 차단되었습니다. 팝업 허용 후 다시 시도해주세요."); return; }
    w.document.write(`<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>부모님 생활 점검표</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0;}
      body{font-family:"Apple SD Gothic Neo","Noto Sans KR",sans-serif;padding:32px;color:#1A1A2E;max-width:750px;margin:0 auto;}
      h1{font-size:20px;font-weight:800;color:#7C3AED;margin-bottom:4px;}
      .sub{font-size:12px;color:#4A5568;margin-bottom:20px;padding-bottom:12px;border-bottom:2px solid #7C3AED;}
      .summary{background:#F5F3FF;border:1.5px solid #DDD6FE;border-radius:10px;padding:14px 18px;margin-bottom:8px;}
      .summary-title{font-size:18px;font-weight:800;color:#7C3AED;margin-bottom:4px;}
      .summary-sub{font-size:13px;color:#4A5568;}
      .disclaimer{margin-top:24px;font-size:11px;color:#9CA3AF;border-top:1px solid #E8F0FE;padding-top:12px;line-height:1.7;}
      @media print{body{padding:16px;}}
    </style></head><body>
    <h1>부모님 생활 점검표</h1>
    <p class="sub">참고용 도구 · 전문적인 돌봄 판단은 관련 기관에 문의하세요</p>
    <div class="summary">
      <div class="summary-title">${grade.emoji} ${grade.label} — ${pct}% (${totalChecked}/${totalItems})</div>
      <p class="summary-sub">점검일: ${new Date().toLocaleDateString("ko-KR")} 기준</p>
    </div>
    ${catRows}
    <p class="disclaimer">⚠️ 이 점검표는 부모님 생활 상태를 가족이 함께 확인하기 위한 참고용 도구입니다. 전문적인 돌봄과 복지 판단은 읍·면·동 주민센터 또는 관련 기관에 문의하시기 바랍니다.</p>
    </body></html>`);
    w.document.close();
    setTimeout(() => { w.focus(); w.print(); }, 400);
  };

  return (
    <div style={{ marginBottom: 40 }}>
      {/* 헤더 */}
      <div style={{ background: "linear-gradient(135deg,#7C3AED,#A78BFA)", borderRadius: 20, padding: "28px 24px", marginBottom: 24, color: "#fff" }}>
        <p style={{ fontSize: 13, fontWeight: 600, opacity: 0.85, marginBottom: 6 }}>부모님 생활 점검표</p>
        <h2 style={{ fontSize: "clamp(20px,3vw,26px)", fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.3, marginBottom: 8 }}>
          부모님 상태를 항목별로<br />함께 체크해보세요
        </h2>
        <p style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.65 }}>
          안전·건강·정서·복지 서비스 4가지 영역을 체크하면<br />
          현재 상태와 챙겨야 할 것을 정리해드립니다.
        </p>
      </div>

      {/* 지난 점검 배지 */}
      {lastSaved && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F5F3FF", borderRadius: 10, padding: "10px 16px", marginBottom: 16, border: "1px solid #DDD6FE" }}>
          <span style={{ fontSize: 16 }}>📅</span>
          <p style={{ fontSize: 13, color: "#4A5568" }}>
            지난 점검: <strong style={{ color: "#7C3AED" }}>{lastSaved.date}</strong> · <strong style={{ color: "#7C3AED" }}>{lastSaved.pct}%</strong> 확인
          </p>
        </div>
      )}

      {/* 전체 진행률 */}
      <div style={{ background: "#F5F3FF", borderRadius: 14, padding: "16px 18px", border: "1.5px solid #DDD6FE", marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#4A5568" }}>전체 점검 진행률</p>
            <p style={{ fontSize: 16, fontWeight: 800, color: "#7C3AED" }}>{totalChecked}/{totalItems}</p>
          </div>
          <div style={{ height: 10, background: "#E9D5FF", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: "#7C3AED", borderRadius: 99, transition: "width 0.4s ease" }} />
          </div>
        </div>
        {totalChecked > 0 && (
          <button
            onClick={() => { setShowResult(true); setTimeout(() => document.getElementById("pcl-result")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100); }}
            style={{ height: 44, padding: "0 18px", fontSize: 14, fontWeight: 700, color: "#fff", background: "#7C3AED", border: "none", borderRadius: 10, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}
          >
            결과 확인 →
          </button>
        )}
      </div>

      {/* 카테고리별 체크리스트 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
        {CATEGORIES.map((cat) => {
          const cnt = countOf(cat);
          return (
            <div key={cat.key} style={{ background: "#fff", borderRadius: 16, border: `1.5px solid ${cat.border}`, overflow: "hidden" }}>
              {/* 카테고리 헤더 */}
              <div style={{ background: cat.bg, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{cat.emoji}</span>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1A2E" }}>{cat.title}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ height: 6, width: 60, background: "rgba(0,0,0,0.1)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(cnt / cat.items.length) * 100}%`, background: cat.color, borderRadius: 99, transition: "width 0.3s" }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: cat.color }}>{cnt}/{cat.items.length}</span>
                </div>
              </div>

              {/* 항목들 */}
              <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
                {cat.items.map((item) => (
                  <label key={item.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 12px", borderRadius: 10, cursor: "pointer", background: checked[item.id] ? cat.bg : "transparent", minHeight: 48 }}>
                    <input
                      type="checkbox"
                      checked={!!checked[item.id]}
                      onChange={() => toggle(item.id)}
                      style={{ width: 22, height: 22, cursor: "pointer", accentColor: cat.color, flexShrink: 0, marginTop: 1 }}
                    />
                    <span style={{ fontSize: 15, color: checked[item.id] ? "#6B7280" : "#1A1A2E", textDecoration: checked[item.id] ? "line-through" : "none", lineHeight: 1.55 }}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 결과 */}
      {showResult && totalChecked > 0 && (
        <div id="pcl-result" style={{ background: "#fff", borderRadius: 20, border: `2px solid ${grade.border}`, overflow: "hidden", marginBottom: 16 }}>
          <div style={{ background: "#7C3AED", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>부모님 생활 점검 결과</p>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", background: "rgba(255,255,255,0.15)", padding: "3px 10px", borderRadius: 99 }}>참고용 도구</span>
          </div>

          <div style={{ padding: "24px 20px" }}>
            {/* 등급 카드 */}
            <div style={{ background: grade.bg, border: `1.5px solid ${grade.border}`, borderRadius: 14, padding: "18px 20px", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <span style={{ fontSize: 26 }}>{grade.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 11, color: "#6B7280", fontWeight: 600, marginBottom: 2 }}>점검 결과</p>
                  <p style={{ fontSize: 20, fontWeight: 800, color: grade.color, letterSpacing: "-0.3px" }}>{grade.label}</p>
                </div>
                <p style={{ fontSize: 28, fontWeight: 800, color: grade.color }}>{pct}%</p>
              </div>
              <div style={{ height: 10, background: "rgba(0,0,0,0.08)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: grade.color, borderRadius: 99 }} />
              </div>
              <p style={{ fontSize: 13, color: "#4A5568", marginTop: 10, lineHeight: 1.65 }}>
                전체 {totalItems}개 항목 중 <strong>{totalChecked}개</strong>를 확인했습니다.
                <span style={{ fontSize: 11, color: "#9CA3AF", marginLeft: 8 }}>점검일: {new Date().toLocaleDateString("ko-KR")}</span>
              </p>
            </div>

            {/* 카테고리별 요약 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }} className="pcl-grid">
              {CATEGORIES.map((c) => {
                const cnt = countOf(c);
                return (
                  <div key={c.key} style={{ border: `1.5px solid ${c.border}`, borderRadius: 12, padding: "12px 14px", background: c.bg }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#1A1A2E" }}>{c.emoji} {c.title}</p>
                      <span style={{ fontSize: 14, fontWeight: 800, color: c.color }}>{cnt}/{c.items.length}</span>
                    </div>
                    <div style={{ height: 6, background: "rgba(0,0,0,0.08)", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(cnt / c.items.length) * 100}%`, background: c.color, borderRadius: 99 }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 미확인 항목 */}
            {unchecked.length > 0 && (
              <div style={{ border: "1.5px solid #FECACA", borderRadius: 14, padding: "16px 18px", marginBottom: 20 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E", marginBottom: 12 }}>
                  ⚡ 아직 확인이 필요한 항목 <span style={{ color: "#DC2626" }}>{unchecked.length}개</span>
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {unchecked.map((item) => {
                    const cat = CATEGORIES.find((c) => c.key === item.catKey)!;
                    return (
                      <div key={item.id} style={{ display: "flex", gap: 10, padding: "8px 10px", borderRadius: 8, background: "#FFF5F5" }}>
                        <span style={{ fontSize: 14 }}>{cat.emoji}</span>
                        <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.55 }}>{item.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 면책 */}
            <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
              <p style={{ fontSize: 12, color: "#78350F", lineHeight: 1.7 }}>
                ⚠️ 이 점검표는 가족이 부모님 생활 상태를 <strong>함께 확인하기 위한 참고용 도구</strong>입니다. 전문적인 돌봄과 복지 판단은 읍·면·동 주민센터 또는 관련 기관에 문의하시기 바랍니다.
              </p>
            </div>

            {/* 버튼 */}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleCopy} style={{ flex: 1, height: 52, fontSize: 15, fontWeight: 700, color: "#fff", background: "#7C3AED", border: "none", borderRadius: 12, cursor: "pointer" }}>
                📋 결과 복사하기
              </button>
              <button onClick={handlePrint} style={{ flex: 1, height: 52, fontSize: 15, fontWeight: 700, color: "#7C3AED", background: "#F5F3FF", border: "2px solid #DDD6FE", borderRadius: 12, cursor: "pointer" }}>
                🖨️ 인쇄하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 상시 면책 */}
      <div style={{ padding: "14px 18px", background: "#fff", borderRadius: 12, border: "1px solid #DDD6FE" }}>
        <p style={{ fontSize: 12, color: "#4A5568", lineHeight: 1.65 }}>
          ℹ️ 이 점검표는 <strong>가족이 함께 사용하는 참고용 도구</strong>입니다. 전문적인 돌봄 판단은 읍·면·동 주민센터 또는 관련 기관에 문의하세요.
        </p>
      </div>

      <style>{`
        @media(max-width:540px){.pcl-grid{grid-template-columns:1fr!important;}}
      `}</style>
    </div>
  );
}
