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

const nextConfig: NextConfig = {
  poweredByHeader: false,
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
