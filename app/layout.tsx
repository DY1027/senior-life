import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const naverSiteVerification = process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION;
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL("https://seniordeundun.com"),
  title: {
    default: "시니어 든든 — 눌러보며 배우는 시니어 놀이터",
    template: "%s | 시니어 든든",
  },
  description:
    "키오스크 연습, 복지혜택 찾기, 병원 준비, 노후자금 계산까지. 어르신이 눌러보며 배우고 가족이 함께 쓰는 시니어 놀이터입니다. 회원가입 없이 무료로 사용하세요.",
  alternates: {
    canonical: "/",
  },
  keywords: ["시니어", "시니어 놀이터", "키오스크 연습", "노인복지", "기초연금", "건강보험", "노후준비", "부모님 정보"],
  authors: [{ name: "시니어 든든" }],
  creator: "시니어 든든",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "시니어 든든",
    title: "시니어 든든 — 눌러보며 배우는 시니어 놀이터",
    description: "키오스크 연습·복지혜택·병원 준비·노후재정을 쉽고 재미있게",
  },
  twitter: {
    card: "summary_large_image",
    title: "시니어 든든",
    description: "눌러보며 배우는 시니어 놀이터",
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
    <html lang="ko" className="h-full">
      <head>
        {/* next/font/google has no Korean subset for Noto Sans KR (only
            cyrillic/latin/latin-ext/vietnamese), so it can't self-host Hangul
            glyphs — loading it via <link> is the only way to actually get
            Korean text rendered in this font. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=Jua&display=swap"
          rel="stylesheet"
        />
        {/* Pinned version (not @latest) so the browser can cache this
            indefinitely instead of revalidating on every visit. */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.47.0/tabler-icons.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">
        {/* 글자 크게 설정을 첫 페인트 전에 적용 (깜빡임 방지) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("bigtext")==="1")document.documentElement.dataset.bigtext="1"}catch(e){}`,
          }}
        />
        <main className="flex-1">{children}</main>
      </body>
      {gaMeasurementId && <GoogleAnalytics gaId={gaMeasurementId} />}
    </html>
  );
}
