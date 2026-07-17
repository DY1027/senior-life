import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3211";
const outputDir = resolve("artifacts/screenshots");

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });

async function openPage(pathname, width, height) {
  const context = await browser.newContext({
    viewport: { width, height },
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(`${baseURL}${pathname}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  return { context, page };
}

async function loadLazyImages(page) {
  const viewportHeight = await page.evaluate(() => window.innerHeight);
  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < pageHeight; y += Math.max(500, Math.floor(viewportHeight * 0.8))) {
    await page.evaluate((nextY) => window.scrollTo(0, nextY), y);
    await page.waitForTimeout(90);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(250);
}

async function capturePage(pathname, filename, width, height) {
  const { context, page } = await openPage(pathname, width, height);
  await loadLazyImages(page);
  await page.screenshot({ path: resolve(outputDir, filename), fullPage: true });
  await context.close();
}

async function captureSection(selector, filename) {
  const { context, page } = await openPage("/", 390, 844);
  await page.locator(selector).screenshot({ path: resolve(outputDir, filename) });
  await context.close();
}

await capturePage("/", "home-1440.png", 1440, 900);
await capturePage("/", "home-390.png", 390, 844);
await capturePage("/kiosk", "kiosk-list-1440.png", 1440, 900);
await capturePage("/kiosk", "kiosk-list-390.png", 390, 844);
await capturePage("/play", "playground-390.png", 390, 844);
await capturePage("/stories", "safety-390.png", 390, 844);
await capturePage("/records", "records-empty-390.png", 390, 844);
await captureSection('section[aria-labelledby="today-mission-title"]', "today-mission-390.png");
await captureSection('section[aria-labelledby="weekly-challenge-title"]', "weekly-challenge-390.png");

{
  const { context, page } = await openPage("/kiosk/cafe/cafe-learn-americano", 390, 844);
  await page.getByRole("button", { name: /연습 시작/ }).click();
  await page.getByRole("button", { name: /포장하기/ }).click();
  await page.getByRole("button", { name: /아메리카노/ }).click();
  await page.getByRole("button", { name: "따뜻하게" }).click();
  await page.getByRole("button", { name: "수량 늘리기" }).click();
  await page.getByRole("button", { name: /담기 ·/ }).click();
  await page.getByRole("button", { name: /주문 확인/ }).click();
  await page.getByRole("button", { name: /결제하기/ }).click();
  await page.getByRole("button", { name: /카드/ }).click();
  await page.getByRole("button", { name: "받지 않기" }).click({ timeout: 8000 });
  await page.getByRole("heading", { name: /임무 완수/ }).waitFor();
  await page.screenshot({ path: resolve(outputDir, "kiosk-complete-390.png"), fullPage: true });
  await context.close();
}

await browser.close();

console.log(`Saved redesign screenshots to ${outputDir}`);
