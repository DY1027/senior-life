import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // 관리자·API 경로는 검색엔진이 크롤링하지 않도록 차단(접근 통제는 서버에서 별도 강제).
      disallow: ["/admin", "/api/"],
    },
    sitemap: "https://seniordeundun.com/sitemap.xml",
  };
}
