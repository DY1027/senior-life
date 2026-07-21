import type { NextConfig } from "next";

const serviceChangedPrefixes = [
  "health",
  "hospital",
  "welfare",
  "finance",
  "retirement",
  "care",
  "life-tips",
] as const;

const retiredAccountPrefixes = ["login", "signup", "mypage", "auth"] as const;

// ── 보안 헤더 ────────────────────────────────────────────────────
// 사이트 성격: 정적 콘텐츠 + localStorage 기록. 회원·DB·사용자 입력 콘텐츠가 없어
// 공격면 자체가 작지만, 다층 방어로 아래를 강제한다.
//
// CSP 허용 외부 출처(이유가 있는 것만 — 새 외부 스크립트·스타일을 추가하면 여기도 갱신할 것):
// - www.googletagmanager.com     : GA4 스크립트 (@next/third-parties)
// - *.google-analytics.com 등     : GA4 수집 요청
// - fonts.googleapis.com/gstatic  : Noto Sans KR 웹폰트
// - *.coupangcdn.com, ads-partners.coupang.com : 쿠팡 파트너스 상품 이미지
//
// script-src의 'unsafe-inline'은 Next.js가 넣는 인라인 스크립트(수화 페이로드) 때문에
// 필요하다. nonce 방식(미들웨어)으로 더 조이는 건 추후 과제 — 다만 이 사이트는
// 사용자 입력을 화면에 렌더링하지 않아 XSS 주입 지점이 없다.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://*.coupangcdn.com https://ads-partners.coupang.com https://*.google-analytics.com https://*.googletagmanager.com",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
  "media-src 'self'",
  "worker-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "frame-src 'none'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // MIME 스니핑 금지 — 업로드 기능은 없지만 기본 방어
  { key: "X-Content-Type-Options", value: "nosniff" },
  // 다른 사이트가 iframe으로 감싸 클릭재킹하는 것 방지
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // 외부 이동(쿠팡 등) 시 경로·쿼리를 보내지 않음
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // 쓰지 않는 민감 기능은 원천 차단 (카메라·마이크·위치·결제)
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  // HTTPS 강제 (Vercel 기본값과 동일하지만 명시)
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ads-partners.coupang.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/kiosk/hospital", destination: "/kiosk", permanent: true },
      { source: "/kiosk/hospital/:path*", destination: "/kiosk", permanent: true },
      ...serviceChangedPrefixes.flatMap((prefix) => [
        { source: `/${prefix}`, destination: "/service-changed", permanent: true },
        { source: `/${prefix}/:path*`, destination: "/service-changed", permanent: true },
      ]),
      ...retiredAccountPrefixes.flatMap((prefix) => [
        { source: `/${prefix}`, destination: "/service-changed", permanent: true },
        { source: `/${prefix}/:path*`, destination: "/service-changed", permanent: true },
      ]),
      { source: "/legal/refund", destination: "/legal/terms", permanent: true },
    ];
  },
};

export default nextConfig;
