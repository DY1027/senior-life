// 7종 키오스크의 공통 안내문을 Inworld TTS MP3로 사전 생성한다.
// API 키와 voice id는 환경변수로만 받고 파일이나 브라우저 번들에 기록하지 않는다.
//
// 문장 검사만:
//   node --experimental-strip-types --loader ./scripts/ts-path-loader.mjs ./scripts/generate-kiosk-audio.mjs --audit
// 음성 생성:
//   INWORLD_API_KEY=... INWORLD_VOICE_ID=... node --experimental-strip-types --loader ./scripts/ts-path-loader.mjs ./scripts/generate-kiosk-audio.mjs
import fs from "node:fs";
import path from "node:path";
import { allKioskBundles } from "../content/kiosk-v2/all.ts";
import { collectKioskVoiceCorpus } from "../lib/kiosk-engine/voice-corpus.ts";
import { kioskVoiceId } from "../lib/kiosk-voice/assets.ts";

const args = new Set(process.argv.slice(2));
const corpus = collectKioskVoiceCorpus(allKioskBundles);
const forbidden = /(을\(를\)|은\(는\)|이\(가\)|\([^)]*\)|→|·|\b\d+\s*(잔|개|장|통|건|자리)(으)?로\b)/;
const invalid = corpus.filter((text) => forbidden.test(text));

console.log(`키오스크 안내 문장: ${corpus.length}개`);
if (invalid.length > 0) {
  console.error("음성으로 생성할 수 없는 문장이 남아 있습니다:");
  invalid.forEach((text) => console.error(`- ${text}`));
  process.exit(1);
}

if (args.has("--audit")) {
  corpus.forEach((text) => console.log(`- ${text}`));
  process.exit(0);
}

const ids = corpus.map(kioskVoiceId).sort();
function updateManifest() {
  const manifestPath = path.resolve("lib/kiosk-voice/assets.ts");
  const manifest = fs.readFileSync(manifestPath, "utf8");
  const replacement = `export const AVAILABLE_KIOSK_VOICE_IDS: readonly string[] = ${JSON.stringify(ids, null, 2)};`;
  const updated = manifest.replace(/export const AVAILABLE_KIOSK_VOICE_IDS: readonly string\[\] = \[[\s\S]*?\];/, replacement);
  if (updated === manifest) throw new Error("음성 자산 manifest 갱신 위치를 찾지 못했습니다.");
  fs.writeFileSync(manifestPath, updated, "utf8");
}

if (args.has("--manifest-only")) {
  updateManifest();
  console.log(`manifest 갱신: ${ids.length}개`);
  process.exit(0);
}

const key = process.env.INWORLD_API_KEY;
const voiceId = process.env.INWORLD_VOICE_ID ?? process.env.INWORLD_VOICE;
if (!key || !voiceId) {
  console.error("INWORLD_API_KEY와 INWORLD_VOICE_ID 환경변수가 필요합니다.");
  process.exit(1);
}

const api = "https://api.inworld.ai/tts/v1/voice";
const modelId = process.env.INWORLD_MODEL ?? "inworld-tts-1";
const outputDirectory = path.resolve("public/audio/kiosk");
fs.mkdirSync(outputDirectory, { recursive: true });

async function synthesize(text) {
  const response = await fetch(api, {
    method: "POST",
    headers: { Authorization: `Basic ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ text, voiceId, modelId, audioConfig: { audioEncoding: "MP3" } }),
  });
  if (!response.ok) throw new Error(`Inworld TTS 오류 ${response.status}: ${(await response.text()).slice(0, 300)}`);
  const data = await response.json();
  const audioContent = data.audioContent ?? data.result?.audioContent;
  if (!audioContent) throw new Error("Inworld 응답에 audioContent가 없습니다.");
  return Buffer.from(audioContent, "base64");
}

let created = 0;
for (const [index, text] of corpus.entries()) {
  const id = kioskVoiceId(text);
  const outputPath = path.join(outputDirectory, `${id}.mp3`);
  if (fs.existsSync(outputPath) && !args.has("--force")) {
    console.log(`[${index + 1}/${corpus.length}] 기존 파일 사용: ${id}`);
    continue;
  }
  const audio = await synthesize(text);
  fs.writeFileSync(outputPath, audio);
  created += 1;
  console.log(`[${index + 1}/${corpus.length}] 생성: ${id} (${audio.length} bytes)`);
}

updateManifest();

console.log(`완료: 새 파일 ${created}개, 전체 ${ids.length}개`);
