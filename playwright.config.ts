import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests for Veenus Electronics public website:
 *   npm run build && npm run test:e2e
 * Set E2E_BASE_URL to test an already-running site (e.g. a Vercel preview URL).
 */
const baseURL = process.env.E2E_BASE_URL || "http://localhost:3000";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 45_000,
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  use: { baseURL, trace: "retain-on-failure", screenshot: "only-on-failure" },
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : { command: "npm run start", url: baseURL, reuseExistingServer: true, timeout: 120_000 },
  // Viewports from the production-verification brief using installed Chrome.
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel: "chrome", viewport: { width: 1920, height: 1080 } } },
    { name: "laptop", use: { ...devices["Desktop Chrome"], channel: "chrome", viewport: { width: 1366, height: 768 } } },
    { name: "tablet", use: { ...devices["Desktop Chrome"], channel: "chrome", viewport: { width: 768, height: 1024 }, isMobile: true, hasTouch: true } },
    { name: "android", use: { ...devices["Pixel 7"], channel: "chrome", viewport: { width: 390, height: 844 } } },
    { name: "iphone", use: { ...devices["iPhone 13 mini"], channel: "chrome", viewport: { width: 375, height: 812 } } },
  ],
});
