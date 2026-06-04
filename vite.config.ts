import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/tests/setup.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      exclude: [
    "src/**/*.css",
    "src/main.tsx",
    "src/services/**",
  ],
    },
  },
});