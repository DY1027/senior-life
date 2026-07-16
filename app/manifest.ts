import type { MetadataRoute } from "next";

// PWA 매니페스트 — 홈 화면에 설치하면 주소창 없는 전체화면 앱처럼 열린다.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "시니어 든든 — 디지털 생활 놀이터",
    short_name: "시니어 든든",
    description:
      "카페 주문부터 ATM까지, 생활 속 디지털 기기를 실제처럼 연습하는 무료 놀이터. 실제 결제 없이 마음껏 연습하세요.",
    start_url: "/",
    display: "standalone",
    orientation: "any",
    lang: "ko",
    background_color: "#FDF7E7",
    theme_color: "#FFFFFF",
    icons: [
      { src: "/pwa-icon/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png", purpose: "any" },
      // 전체를 채운 그라데이션 배경이라 maskable로도 안전하다
      { src: "/pwa-icon/192", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
