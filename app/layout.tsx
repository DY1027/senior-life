import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import MobileTabBar from "@/components/MobileTabBar";
import PwaSetup from "@/components/PwaSetup";
import "./globals.css";

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const naverSiteVerification = process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION;
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL("https://seniordeundun.com"),
  title: {
    default: "시니어든든 | 실제처럼 눌러보는 디지털 생활 놀이터",
    template: "%s | 시니어든든",
  },
  description:
    "카페 주문, 기차표 예매, 주차 정산, 마트 셀프계산대와 ATM까지 실제처럼 눌러보며 연습하는 무료 시니어 디지털 놀이터입니다.",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "시니어 키오스크 연습",
    "키오스크 사용법",
    "디지털 기기 연습",
    "시니어 디지털 교육",
    "무인기기 연습",
    "ATM 연습",
    "셀프계산대 연습",
    "주차정산기 연습",
  ],
  authors: [{ name: "시니어든든" }],
  creator: "시니어든든",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "시니어든든",
    title: "시니어든든 – 실제처럼 눌러보는 디지털 생활 놀이터",
    description: "실제 결제나 발급 없이 생활 속 디지털 기기를 마음껏 눌러보고 반복해서 연습하세요.",
  },
  twitter: {
    card: "summary_large_image",
    title: "시니어든든 – 실제처럼 눌러보는 디지털 생활 놀이터",
    description: "실제 결제나 발급 없이 생활 속 디지털 기기를 마음껏 눌러보고 반복해서 연습하세요.",
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

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
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
        <PwaSetup />
        <main className="flex-1">{children}</main>
        <MobileTabBar />
      </body>
      {gaMeasurementId && <GoogleAnalytics gaId={gaMeasurementId} />}
    </html>
  );
}
