import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const naverSiteVerification = process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION;
const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://seniordeundun.com"),
  title: {
    default: "시니어 든든 — 노후자금, 병원 준비, 복지혜택을 한 번에",
    template: "%s | 시니어 든든",
  },
  description:
    "50대 이상 시니어와 부모님 정보를 찾는 가족을 위한 생활정보 포털. 기초연금, 복지혜택, 건강보험, 노후재정, 생활팁을 쉽고 정확하게 안내합니다.",
  alternates: {
    canonical: "/",
  },
  keywords: ["시니어", "노인복지", "기초연금", "건강보험", "노후준비", "부모님 정보"],
  authors: [{ name: "시니어 든든" }],
  creator: "시니어 든든",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "시니어 든든",
    title: "시니어 든든 — 부모님 혜택, 한 번에 정리됩니다",
    description: "기초연금·복지혜택·건강보험·노후재정·생활팁을 쉽고 정확하게",
  },
  twitter: {
    card: "summary_large_image",
    title: "시니어 든든",
    description: "50대 이상을 위한 생활정보 포털",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
  verification: {
    ...(googleSiteVerification ? { google: googleSiteVerification } : {}),
    ...(naverSiteVerification ? { other: { "naver-site-verification": naverSiteVerification } } : {}),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${notoSansKr.className} h-full`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
