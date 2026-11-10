import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  outputDir: "./test-results",
  fullyParallel: true,
  reporter: "list",
  timeout: 30000,
  expect: { timeout: 5000 },
  use: {
    baseURL: "http://127.0.0.1:4173/ITEducation/",
    browserName: "chromium",
    headless: true,
    screenshot: "only-on-failure",
    trace: "retain-on-failure"
  },
  webServer: {
    command: "node ./e2e/pages-preview-server.js",
    url: "http://127.0.0.1:4173/ITEducation/",
    reuseExistingServer: !process.env.CI,
    timeout: 30000
  }
});
