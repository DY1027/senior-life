import type { ShoppingEvaluation } from "@/lib/shopping/evaluator";

export const SHOPPING_PROGRESS_KEY = "dd-shopping-progress-v1";

export type ShoppingSavedResult = ShoppingEvaluation & {
  missionSlug: string;
  completedAt: string;
};

export type ShoppingProgress = {
  version: 1;
  current?: { missionSlug: string; step: number; updatedAt: string };
  completed: Record<string, { count: number; lastAt: string }>;
  lastResult?: ShoppingSavedResult;
};

const EMPTY: ShoppingProgress = { version: 1, completed: {} };

export function readShoppingProgress(): ShoppingProgress {
  if (typeof window === "undefined") return EMPTY;
  try {
    const parsed = JSON.parse(localStorage.getItem(SHOPPING_PROGRESS_KEY) ?? "null") as Partial<ShoppingProgress> | null;
    if (!parsed || parsed.version !== 1 || !parsed.completed || typeof parsed.completed !== "object") return EMPTY;
    return { version: 1, completed: parsed.completed, current: parsed.current, lastResult: parsed.lastResult };
  } catch {
    return EMPTY;
  }
}

function writeShoppingProgress(progress: ShoppingProgress) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SHOPPING_PROGRESS_KEY, JSON.stringify(progress));
    window.dispatchEvent(new Event("dd-shopping-progress"));
  } catch {
    // 저장이 막혀도 연습은 계속한다.
  }
}

export function saveShoppingStep(missionSlug: string, step: number) {
  const progress = readShoppingProgress();
  writeShoppingProgress({ ...progress, current: { missionSlug, step, updatedAt: new Date().toISOString() } });
}

export function completeShoppingMission(missionSlug: string, result: ShoppingEvaluation) {
  const progress = readShoppingProgress();
  const now = new Date().toISOString();
  const previous = progress.completed[missionSlug];
  writeShoppingProgress({
    ...progress,
    current: undefined,
    completed: { ...progress.completed, [missionSlug]: { count: (previous?.count ?? 0) + 1, lastAt: now } },
    lastResult: { ...result, missionSlug, completedAt: now },
  });
}

