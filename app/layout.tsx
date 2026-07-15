import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import MobileTabBar from "@/components/MobileTabBar";
import "./globals.css";

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const naverSiteVerification = process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION;
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL("https://seniordeundun.com"),
  title: {
    default: "시니어 든든 — 실제처럼 눌러보는 디지털 생활 놀이터",
    template: "%s | 시니어 든든",
  },
  description:
    "카페 주문부터 주차요금 정산까지, 생활 속 디지털 기기를 실제처럼 연습하는 무료 놀이터입니다. 실제 결제 없이 큰 글씨와 음성 안내로 천천히, 실수해도 다시 해보며 배우세요.",
  alternates: {
    canonical: "/",
  },
  keywords: ["시니어", "시니어 놀이터", "키오스크 연습", "무인민원발급기 연습", "주차요금 정산기", "셀프계산대", "디지털 교육", "어르신 키오스크"],
  authors: [{ name: "시니어 든든" }],
  creator: "시니어 든든",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "시니어 든든",
    title: "시니어 든든 — 실제처럼 눌러보는 디지털 생활 놀이터",
    description: "카페 주문부터 주차요금 정산까지, 실제 결제 없이 마음껏 연습하세요",
  },
  twitter: {
    card: "summary_large_image",
    title: "시니어 든든",
    description: "실제처럼 눌러보는 시니어 디지털 놀이터",
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
        <MobileTabBar />
      </body>
      {gaMeasurementId && <GoogleAnalytics gaId={gaMeasurementId} />}
    </html>
  );
}
