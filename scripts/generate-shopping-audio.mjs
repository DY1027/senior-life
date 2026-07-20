// 쇼핑 연습 안내 문장을 Inworld TTS MP3로 한 번 생성해 정적 파일로 저장한다.
// 문장 검토: npm run audit:shopping-voice
// 음성 생성: INWORLD_API_KEY=... INWORLD_VOICE_ID=... npm run generate:shopping-voice
import fs from "node:fs";
import path from "node:path";
import { collectShoppingVoiceCorpus } from "../lib/shopping-voice/guidance.ts";
import { shoppingVoiceId } from "../lib/shopping-voice/assets.ts";

const args = new Set(process.argv.slice(2));
const corpus = collectShoppingVoiceCorpus();
const forbidden = /(을\(를\)|를\(을\)|이\(가\)|와\(과\)|\([^)]*\)|\b\d+\s*(개|장|명|건|자리)(으)?로\b)/;
const invalid = corpus.filter((text) => forbidden.test(text));

console.log(`쇼핑 안내 문장: ${corpus.length}개`);
if (invalid.length > 0) {
  console.error("음성으로 생성하면 안 되는 문장이 포함되어 있습니다:");
  invalid.forEach((text) => console.error(`- ${text}`));
  process.exit(1);
}

if (args.has("--audit")) {
  corpus.forEach((text) => console.log(`- ${text}`));
  process.exit(0);
}

const ids = corpus.map(shoppingVoiceId).sort();
const outputDirectory = path.resolve("public/audio/shopping");

function isMp3(buffer) {
  return buffer.length > 1_000 && (
    (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) ||
    (buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0)
  );
}

function updateManifest() {
  const manifestPath = path.resolve("lib/shopping-voice/assets.ts");
  const manifest = fs.readFileSync(manifestPath, "utf8");
  const replacement = `export const AVAILABLE_SHOPPING_VOICE_IDS: readonly string[] = ${JSON.stringify(ids, null, 2)};`;
  const updated = manifest.replace(/export const AVAILABLE_SHOPPING_VOICE_IDS: readonly string\[\] = \[[\s\S]*?\];/, replacement);
  if (updated === manifest) throw new Error("음성 자산 manifest 갱신 위치를 찾지 못했습니다.");
  fs.writeFileSync(manifestPath, updated, "utf8");
}

if (args.has("--manifest-only")) {
  updateManifest();
  console.log(`manifest 갱신: ${ids.length}개`);
  process.exit(0);
}

if (args.has("--check")) {
  const invalidIds = [];
  let totalBytes = 0;
  for (const id of ids) {
    const filePath = path.join(outputDirectory, `${id}.mp3`);
    if (!fs.existsSync(filePath)) {
      invalidIds.push(id);
      continue;
    }
    const audio = fs.readFileSync(filePath);
    if (!isMp3(audio)) {
      invalidIds.push(id);
      continue;
    }
    totalBytes += audio.length;
  }
  if (invalidIds.length) {
    console.error(`누락되거나 잘못된 음성 파일: ${invalidIds.length}/${ids.length}`);
    invalidIds.forEach((id) => console.error(`- ${id}`));
    process.exit(1);
  }
  console.log(`정적 음성 파일 검증 완료: ${ids.length}개 (${(totalBytes / 1024 / 1024).toFixed(2)} MiB)`);
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
  const id = shoppingVoiceId(text);
  const outputPath = path.join(outputDirectory, `${id}.mp3`);
  if (fs.existsSync(outputPath) && !args.has("--force")) {
    console.log(`[${index + 1}/${corpus.length}] 기존 파일 사용: ${id}`);
    continue;
  }
  const audio = await synthesize(text);
  if (!isMp3(audio)) throw new Error(`${id} 응답이 정상 MP3가 아닙니다.`);
  fs.writeFileSync(outputPath, audio);
  created += 1;
  console.log(`[${index + 1}/${corpus.length}] 생성: ${id} (${audio.length} bytes)`);
}

updateManifest();
console.log(`완료: 새 파일 ${created}개, 전체 ${ids.length}개`);
