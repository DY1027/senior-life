import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    // 연습 놀이터 전환(2026-07)으로 삭제된 주소들 — 검색 유입이 끊기지 않게 안내한다
    return [
      { source: "/health", destination: "/", permanent: true },
      { source: "/health/:path*", destination: "/", permanent: true },
      { source: "/kiosk/hospital", destination: "/kiosk", permanent: true },
      { source: "/login", destination: "/", permanent: true },
      { source: "/legal/refund", destination: "/legal/terms", permanent: true },
    ];
  },
};

export default nextConfig;
