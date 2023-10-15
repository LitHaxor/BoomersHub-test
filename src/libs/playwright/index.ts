import { chromium } from "playwright";
import { load } from "cheerio";

export async function launchBrowserAndScrape(url: string) {
  const browser = await chromium.launch({
    headless: false,
  });

  const context = await browser.newContext();

  const page = await context.newPage();

  await page.goto(url);

  const html = await page.content();

  await browser.close();

  return load(html);
}

export async function getBrowser() {
  const browser = await chromium.launch({
    headless: true,
  });

  return browser;
}
