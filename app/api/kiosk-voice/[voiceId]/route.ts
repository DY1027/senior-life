import "server-only";
import { allKioskBundles } from "@/content/kiosk-v2/all";
import { collectKioskVoiceCorpus } from "@/lib/kiosk-engine/voice-corpus";
import { kioskVoiceId } from "@/lib/kiosk-voice/assets";

const corpusById = new Map(
  collectKioskVoiceCorpus(allKioskBundles).map((text) => [kioskVoiceId(text), text] as const)
);

export async function GET(_request: Request, context: { params: Promise<{ voiceId: string }> }) {
  const { voiceId } = await context.params;
  const text = corpusById.get(voiceId);
  if (!text) return new Response("등록되지 않은 키오스크 안내문입니다.", { status: 404 });

  const apiKey = process.env.INWORLD_API_KEY;
  const inworldVoiceId = process.env.INWORLD_VOICE_ID ?? process.env.INWORLD_VOICE;
  if (!apiKey || !inworldVoiceId) {
    return new Response("음성 생성 설정이 없습니다.", { status: 503 });
  }

  const response = await fetch("https://api.inworld.ai/tts/v1/voice", {
    method: "POST",
    headers: {
      Authorization: `Basic ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      voiceId: inworldVoiceId,
      modelId: process.env.INWORLD_MODEL ?? "inworld-tts-1",
      audioConfig: { audioEncoding: "MP3" },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    console.error(`[kiosk-voice] Inworld TTS 요청 실패: ${response.status}`);
    return new Response("음성을 생성하지 못했습니다.", { status: 502 });
  }

  const data = (await response.json()) as { audioContent?: string; result?: { audioContent?: string } };
  const audioContent = data.audioContent ?? data.result?.audioContent;
  if (!audioContent) {
    console.error("[kiosk-voice] Inworld 응답에 audioContent가 없습니다.");
    return new Response("음성 데이터가 없습니다.", { status: 502 });
  }

  return new Response(Buffer.from(audioContent, "base64"), {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=86400",
      "CDN-Cache-Control": "public, s-maxage=31536000, immutable",
      "Content-Disposition": `inline; filename="${voiceId}.mp3"`,
    },
  });
}
