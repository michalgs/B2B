import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist", ".output", "node_modules"],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {

      "react/react-in-jsx-scope": "off",

      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    },
  },
  {
    files: ["cypress/**/*.{js,ts}", "**/cypress.config.ts"],
    languageOptions: {
      globals: {
        cy: "readonly",
        Cypress: "readonly",
        expect: "readonly",
        assert: "readonly",
        describe: "readonly",
        it: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        before: "readonly",
        after: "readonly",
        context: "readonly",
      },
    },
  }
);