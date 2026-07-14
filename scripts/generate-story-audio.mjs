// 그림책 음성 일괄 생성 스크립트 (Inworld TTS)
//
// 사용법:
//   INWORLD_API_KEY=<Basic용 base64 키> node scripts/generate-story-audio.mjs [--voices] [--sample <voiceId>]
//
//   --voices          한국어 목소리 목록만 출력
//   --sample <voice>  샘플 문장 1개를 생성해 scratch로 저장 (목소리 고르기용)
//   (기본)            content/stories/*.ts 의 모든 장을 public/audio/stories/<id>/<n>.mp3 로 생성
//
// 원칙: API 키는 환경변수로만 받는다. 저장소에 키를 커밋하지 않는다.
// 생성된 MP3는 정적 파일로 커밋 → 방문자 재생에 API 호출·비용 없음.
import fs from "node:fs";
import path from "node:path";

const API = "https://api.inworld.ai/tts/v1";
const KEY = process.env.INWORLD_API_KEY;
if (!KEY) {
  console.error("INWORLD_API_KEY 환경변수가 필요합니다.");
  process.exit(1);
}
const headers = { Authorization: `Basic ${KEY}`, "Content-Type": "application/json" };

const MODEL = process.env.INWORLD_MODEL ?? "inworld-tts-1";
const SAMPLE_TEXT = "안녕하세요, 시니어 든든의 든든이예요. 오늘도 천천히, 함께 배워 봐요.";

async function listKoreanVoices() {
  const res = await fetch(`${API}/voices`, { headers });
  if (!res.ok) throw new Error(`voices ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const voices = (data.voices ?? data).filter?.((v) =>
    JSON.stringify(v).toLowerCase().includes("ko")
  ) ?? data;
  console.log(JSON.stringify(voices, null, 2));
}

async function tts(text, voiceId) {
  const res = await fetch(`${API}/voice`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      text,
      voiceId,
      modelId: MODEL,
      audioConfig: { audioEncoding: "MP3" },
    }),
  });
  if (!res.ok) throw new Error(`tts ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const b64 = data.audioContent ?? data.result?.audioContent;
  if (!b64) throw new Error("응답에 audioContent 없음: " + JSON.stringify(data).slice(0, 200));
  return Buffer.from(b64, "base64");
}

// StoryPlayer의 pageToSpeech와 같은 규칙으로 장 텍스트 합성
function pageToSpeech(page) {
  const parts = [page.title];
  if (page.sms) parts.push(`이런 문자가 왔어요. ${page.sms.body}`);
  if (page.text) parts.push(page.text.replace(/\n/g, " "));
  if (page.quiz) {
    parts.push(page.quiz.question);
    page.quiz.options.forEach((o, i) => parts.push(`${i + 1}번, ${o.label}.`));
    parts.push("화면에서 하나를 골라 주세요.");
  }
  return parts.join(" ");
}

const args = process.argv.slice(2);

if (args[0] === "--voices") {
  await listKoreanVoices();
  process.exit(0);
}

if (args[0] === "--sample") {
  const voiceId = args[1];
  if (!voiceId) { console.error("--sample <voiceId>"); process.exit(1); }
  const buf = await tts(SAMPLE_TEXT, voiceId);
  const out = `sample-${voiceId}.mp3`;
  fs.writeFileSync(out, buf);
  console.log("생성:", out, buf.length, "bytes");
  process.exit(0);
}

// 기본: 모든 그림책 음성 생성
const VOICE = process.env.INWORLD_VOICE;
if (!VOICE) { console.error("INWORLD_VOICE 환경변수(선택한 voiceId)가 필요합니다."); process.exit(1); }

const storiesDir = "content/stories";
for (const file of fs.readdirSync(storiesDir).filter((f) => f.endsWith(".ts"))) {
  // Node 22의 타입 제거 기능으로 TS 콘텐츠 파일을 직접 읽는다 (import type은 소거됨)
  const mod = await import(path.resolve(storiesDir, file));
  const story = mod.default;
  const outDir = `public/audio/stories/${story.id}`;
  fs.mkdirSync(outDir, { recursive: true });
  for (let i = 0; i < story.pages.length; i++) {
    const text = pageToSpeech(story.pages[i]);
    const buf = await tts(text, VOICE);
    fs.writeFileSync(`${outDir}/${i}.mp3`, buf);
    console.log(`${story.id} ${i + 1}/${story.pages.length}장`, buf.length, "bytes");
  }
}
console.log("완료");
