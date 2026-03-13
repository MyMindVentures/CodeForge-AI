import { chromium } from "playwright";

export const runBrowserTask = async (url: string, task: string) => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url);
  
  // Perform task (e.g., take screenshot)
  await page.screenshot({ path: `screenshot-${Date.now()}.png` });
  
  await browser.close();
  return { status: "success" };
};
