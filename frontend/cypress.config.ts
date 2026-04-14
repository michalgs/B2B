import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium' && browser.name !== 'stock') {
          launchOptions.args.push('--disable-dev-shm-usage');
          launchOptions.args.push('--disable-gpu');
          launchOptions.args.push('--no-sandbox');
          return launchOptions;
        }
      });
    },

    baseUrl: "http://localhost:3001",
    screenshotsFolder: "cypress/screenshots",
    supportFile: "cypress/support/e2e.ts",
  },
});
