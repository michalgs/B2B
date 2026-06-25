import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://localhost:3000",
    chromeWebSecurity: false,
    setupNodeEvents(_on, _config) {
      // implement node event listeners here
    },
    supportFile: "cypress/support/e2e.ts",
  },
});
