import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// 흰 방패 + 파란 체크 (배경 없음). iOS가 둥근 마스크를 자동 적용하므로
// 배경은 꽉 찬 사각형으로 두고 가운데에 방패를 얹는다.
const shield =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
  '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#ffffff"/>' +
  '<path d="M8.5 12l2.5 2.5 5-5" fill="none" stroke="#1B6FC8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' +
  "</svg>";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg,#1B6FC8,#0EA5E9)",
        }}
      >
        <img
          width={120}
          height={120}
          src={`data:image/svg+xml,${encodeURIComponent(shield)}`}
          alt=""
        />
      </div>
    ),
    { ...size }
  );
}
