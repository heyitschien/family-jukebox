/**
 * Boots the production build and checks key routes in a real browser.
 * Catches client-side React crashes (e.g. error #185) that curl-only checks miss.
 */
import { spawn } from "node:child_process";
import puppeteer from "puppeteer";

const PORT = Number(process.env.PRODUCTION_SMOKE_PORT ?? 3456);
const BASE_URL = `http://127.0.0.1:${PORT}`;
const ROUTES = [
  "/",
  "/songs",
  "/favorites",
  "/family",
  "/songs/tap-on-the-glass",
  "/songs/legacy-in-the-lane",
  "/members/sam-and-josh",
  "/albums/miracle-in-the-sand-album",
];
const FAIL_TEXT = "This page couldn't load";
const FATAL_PAGE_ERROR = /Maximum update depth exceeded|Minified React error #185\b/;

function isFatalPageError(message) {
  return FATAL_PAGE_ERROR.test(message);
}

function waitForServer(url, timeoutMs = 30_000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          resolve(undefined);
          return;
        }
      } catch {
        // keep polling
      }

      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Server did not become ready at ${url}`));
        return;
      }

      setTimeout(tick, 500);
    };

    tick();
  });
}

const server = spawn("npm", ["start", "--", "-p", String(PORT)], {
  stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env, PORT: String(PORT) },
});

let serverOutput = "";
server.stdout?.on("data", (chunk) => {
  serverOutput += chunk.toString();
});
server.stderr?.on("data", (chunk) => {
  serverOutput += chunk.toString();
});

const shutdown = () => {
  if (!server.killed) server.kill("SIGTERM");
};

process.on("exit", shutdown);
process.on("SIGINT", () => process.exit(1));
process.on("SIGTERM", () => process.exit(1));

try {
  await waitForServer(`${BASE_URL}/`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  const pageErrors = [];

  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  for (const route of ROUTES) {
    pageErrors.length = 0;
    await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle2", timeout: 30_000 });
    await new Promise((resolve) => setTimeout(resolve, 750));

    const bodyText = await page.evaluate(() => document.body.innerText);
    if (bodyText.includes(FAIL_TEXT)) {
      throw new Error(`Production smoke failed on ${route}: global error UI rendered`);
    }

    if (pageErrors.some(isFatalPageError)) {
      throw new Error(`Production smoke failed on ${route}: ${pageErrors.join(" | ")}`);
    }

    console.log(`OK ${route}`);
  }

  await browser.close();
  console.log("Production smoke passed for all routes.");
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  if (serverOutput) {
    console.error("--- server output ---");
    console.error(serverOutput.slice(-4000));
  }
  process.exitCode = 1;
} finally {
  shutdown();
}
