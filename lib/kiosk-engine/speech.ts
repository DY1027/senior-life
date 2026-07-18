/**
 * 화면용 문구를 그대로 읽지 않고, 음성 안내에 맞는 한국어로 바꾸는 도우미.
 * 카탈로그의 voiceLabel/voiceName이 있으면 그것을 우선 사용한다.
 */

const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;

type ParticleKind = "topic" | "subject" | "object" | "direction";

function lastPronouncedCharacter(value: string): string {
  return value.trim().replace(/[)'"’”\]}>.,!?]+$/g, "").slice(-1);
}

function finalConsonantIndex(value: string): number | null {
  const last = lastPronouncedCharacter(value);
  if (!last) return null;

  const code = last.charCodeAt(0);
  if (code >= HANGUL_START && code <= HANGUL_END) return (code - HANGUL_START) % 28;

  // 숫자를 한글로 읽었을 때의 받침. 0 영, 1 일, 2 이, 3 삼, 4 사,
  // 5 오, 6 육, 7 칠, 8 팔, 9 구.
  if (/\d/.test(last)) {
    return ({ "0": 21, "1": 8, "2": 0, "3": 16, "4": 0, "5": 0, "6": 1, "7": 8, "8": 8, "9": 0 } as Record<string, number>)[last];
  }
  return null;
}

export function normalizeVoiceLabel(value: string): string {
  return value
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/["'‘’“”]/g, "")
    .replace(/\s*[·/]\s*/g, "와 ")
    .replace(/\s+/g, " ")
    .trim();
}

export function withParticle(value: string, kind: ParticleKind): string {
  const text = normalizeVoiceLabel(value);
  const finalIndex = finalConsonantIndex(text);
  const hasFinal = finalIndex !== null && finalIndex !== 0;

  if (kind === "topic") return `${text}${hasFinal ? "은" : "는"}`;
  if (kind === "subject") return `${text}${hasFinal ? "이" : "가"}`;
  if (kind === "object") return `${text}${hasFinal ? "을" : "를"}`;

  // 받침이 없거나 ㄹ 받침이면 '로', 그 외 받침이면 '으로'.
  return `${text}${!hasFinal || finalIndex === 8 ? "로" : "으로"}`;
}

const NATIVE_KOREAN_COUNTERS: Record<number, string> = {
  1: "한",
  2: "두",
  3: "세",
  4: "네",
  5: "다섯",
  6: "여섯",
  7: "일곱",
  8: "여덟",
  9: "아홉",
  10: "열",
};

export function countPhrase(quantity: number, unitLabel: string): string {
  const count = NATIVE_KOREAN_COUNTERS[quantity] ?? String(quantity);
  return `${count} ${unitLabel}`;
}

export function spokenValue<T extends { label: string; voiceLabel?: string }>(value: T | undefined): string {
  return normalizeVoiceLabel(value?.voiceLabel ?? value?.label ?? "항목");
}

export function spokenProduct(value: { name: string; voiceName?: string } | undefined): string {
  return normalizeVoiceLabel(value?.voiceName ?? value?.name ?? "상품");
}
