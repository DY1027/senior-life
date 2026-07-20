// scripts/generate-shopping-audio.mjs가 생성한 음성 파일 id를 기록한다.
export const AVAILABLE_SHOPPING_VOICE_IDS: readonly string[] = [
  "guide-0683162b",
  "guide-0cb49b5b",
  "guide-1b07075b",
  "guide-1df018e6",
  "guide-21f5d30f",
  "guide-39bc3a78",
  "guide-3e4a7708",
  "guide-408ac6a7",
  "guide-40ff074d",
  "guide-51c6a361",
  "guide-576a7ffa",
  "guide-57fadd27",
  "guide-63ce6132",
  "guide-75fd30d5",
  "guide-77f20cd8",
  "guide-90443b0e",
  "guide-94a99361",
  "guide-95eb3283",
  "guide-9735ab73",
  "guide-a09b3684",
  "guide-a2444375",
  "guide-af9c520e",
  "guide-afb8bdc7",
  "guide-b5b90acb",
  "guide-baaf3626",
  "guide-bec861c3",
  "guide-c25f81ba",
  "guide-c4eba82a",
  "guide-c9593564",
  "guide-d0e55943",
  "guide-d119d676",
  "guide-d1229d9a",
  "guide-d7f2d75f",
  "guide-da7996fb",
  "guide-eb844567",
  "guide-ebd489a4",
  "guide-f263602a"
];

const availableVoiceIds = new Set(AVAILABLE_SHOPPING_VOICE_IDS);

/** 같은 문장은 언제나 같은 파일명을 갖도록 만드는 안정적인 해시다. */
export function shoppingVoiceId(text: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `guide-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function shoppingVoiceAsset(text: string): string | undefined {
  const id = shoppingVoiceId(text);
  return availableVoiceIds.has(id) ? `/audio/shopping/${id}.mp3` : undefined;
}
