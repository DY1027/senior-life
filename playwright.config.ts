import { existsSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";

// 원격 실행 환경에 미리 설치된 Chromium (버전 불일치 다운로드 방지).
// 이 경로가 없는 로컬 환경에서는 `npx playwright install`로 받은 브라우저를 쓴다.
const PREINSTALLED_CHROMIUM = "/opt/pw-browsers/chromium";

// 키오스크 엔진 e2e — `next build` 후 실행한다 (webServer가 next start를 띄움).
export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  retries: 0,
  use: {
    baseURL: "http://localhost:3210",
    trace: "retain-on-failure",
    ...(existsSync(PREINSTALLED_CHROMIUM)
      ? { launchOptions: { executablePath: PREINSTALLED_CHROMIUM } }
      : {}),
  },
  projects: [
    // 시니어 이용 환경에 맞춰 모바일 크기로 검사한다
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "npx next start -p 3210",
    url: "http://localhost:3210",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
