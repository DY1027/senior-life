// 연습 기록 — 이용자의 브라우저(localStorage)에만 저장한다.
// 서버로 전송하지 않으며, 어떤 연습을 몇 번 끝냈는지만 담는다 (개인정보 없음).
// 개인정보처리방침의 "기기 저장 정보" 항목이 이 동작을 설명하므로,
// 저장 항목을 늘릴 때는 방침 문구도 함께 확인할 것.

import { useSyncExternalStore } from "react";
import { PRACTICES, getPractice } from "@/lib/practices";

export type PracticeProgress = {
  /** scenarioId → 완료 횟수 */
  counts: Record<string, number>;
  /** 마지막으로 끝낸 연습 id */
  lastId: string | null;
  /** 마지막 완료 시각 (ISO) */
  lastAt: string | null;
  /** 최근 완료 시각 목록 — 이번 주 횟수 계산용 (최대 60개 유지) */
  recent: string[];
};

const KEY = "dd-progress-v1";

const EMPTY: PracticeProgress = { counts: {}, lastId: null, lastAt: null, recent: [] };

export function readProgress(): PracticeProgress {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const p = JSON.parse(raw) as Partial<PracticeProgress>;
    return {
      counts: p.counts && typeof p.counts === "object" ? p.counts : {},
      lastId: typeof p.lastId === "string" ? p.lastId : null,
      lastAt: typeof p.lastAt === "string" ? p.lastAt : null,
      recent: Array.isArray(p.recent) ? p.recent.filter((r) => typeof r === "string") : [],
    };
  } catch {
    return EMPTY;
  }
}

export function recordPracticeComplete(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const p = readProgress();
    p.counts[id] = (p.counts[id] ?? 0) + 1;
    p.lastId = id;
    p.lastAt = new Date().toISOString();
    p.recent = [...p.recent, p.lastAt].slice(-60);
    localStorage.setItem(KEY, JSON.stringify(p));
    cached = p;
    listeners.forEach((l) => l());
  } catch {
    /* 저장 실패(시크릿 모드 등)해도 연습 자체는 계속되어야 한다 */
  }
}

// ── React용 구독 훅 ──
// 서버 렌더/수화 중에는 null(아직 모름)을 주고, 수화가 끝나면 실제 기록으로
// 다시 그린다 — localStorage 값이 서버 HTML과 어긋나는 문제를 피하는 표준 패턴.
let cached: PracticeProgress | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getClientSnapshot(): PracticeProgress {
  if (cached === null) cached = readProgress();
  return cached;
}

function getServerSnapshot(): PracticeProgress | null {
  return null;
}

/** 클라이언트 컴포넌트에서 연습 기록을 읽는다. 수화 전에는 null. */
export function useProgress(): PracticeProgress | null {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}

export function totalCompletions(p: PracticeProgress): number {
  return Object.values(p.counts).reduce((a, b) => a + b, 0);
}

export function completedKinds(p: PracticeProgress): number {
  return PRACTICES.filter((pr) => (p.counts[pr.id] ?? 0) > 0).length;
}

/** 이번 주(월요일 시작) 연습 횟수 */
export function weeklyCount(p: PracticeProgress, now = new Date()): number {
  const day = (now.getDay() + 6) % 7; // 월=0
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day);
  return p.recent.filter((iso) => new Date(iso) >= monday).length;
}

export type Stamp = { id: string; label: string; emoji: string; earned: boolean };

/** 도장판 — 점수 대신 부담 없는 도장으로 보여준다. */
export function stamps(p: PracticeProgress): Stamp[] {
  const list: Stamp[] = PRACTICES.map((pr) => ({
    id: `first-${pr.id}`,
    label: `${pr.short} 첫 완료`,
    emoji: pr.emoji,
    earned: (p.counts[pr.id] ?? 0) > 0,
  }));
  list.push(
    { id: "cafe-3", label: "카페 연습 3회", emoji: "🏅", earned: (p.counts["cafe"] ?? 0) >= 3 },
    { id: "all-kinds", label: `생활기기 ${PRACTICES.length}종 완주`, emoji: "🎖️", earned: completedKinds(p) >= PRACTICES.length },
    { id: "total-10", label: "연습 10회 달성", emoji: "🌟", earned: totalCompletions(p) >= 10 },
  );
  return list;
}

export function lastPracticeLabel(p: PracticeProgress): string | null {
  if (!p.lastId) return null;
  return getPractice(p.lastId)?.short ?? null;
}
