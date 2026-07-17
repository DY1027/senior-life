import type { MetadataRoute } from "next";

const scenarioPrefixes = [
  "/kiosk/cafe/",
  "/kiosk/fastfood/",
  "/kiosk/ticket/",
  "/kiosk/parking/",
  "/kiosk/mart/",
  "/kiosk/atm/",
  "/kiosk/civil/",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        ...scenarioPrefixes,
        "/service-changed",
        "/records",
        "/offline",
        "/admin",
        "/api/",
        "/dev",
        "/error-test",
        "/login",
        "/signup",
        "/mypage",
        "/auth",
      ],
    },
    sitemap: "https://seniordeundun.com/sitemap.xml",
  };
}
