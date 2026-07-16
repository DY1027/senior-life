import { ImageResponse } from "next/og";
import { createElement as h } from "react";

// PWA 설치 아이콘 (192/512 PNG) — apple-icon과 같은 방패 디자인.
// route.ts에서는 JSX를 못 쓰므로 createElement로 그린다. 빌드 시 정적 생성.
export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ size: "192" }, { size: "512" }];
}

const shield =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
  '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#ffffff"/>' +
  '<path d="M8.5 12l2.5 2.5 5-5" fill="none" stroke="#1B6FC8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' +
  "</svg>";

export async function GET(_req: Request, { params }: { params: Promise<{ size: string }> }) {
  const { size } = await params;
  const px = size === "512" ? 512 : 192;
  const inner = Math.round(px * 0.62);
  return new ImageResponse(
    h(
      "div",
      {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg,#1B6FC8,#0EA5E9)",
        },
      },
      h("img", {
        width: inner,
        height: inner,
        src: `data:image/svg+xml,${encodeURIComponent(shield)}`,
        alt: "",
      })
    ),
    { width: px, height: px }
  );
}
