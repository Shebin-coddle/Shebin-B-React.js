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
      include: ["src/**/*"],
      exclude: [
        "src/**/*.css",
        "src/main.tsx",
        "src/App.tsx",
        "src/vite-env.d.ts",
        "src/tests/**",
        "src/types/**",
        "src/assets/**",
        "src/components/layout/**",
        "src/components/Labels/**",
        "src/redux/store.ts",
        "src/utils/toast.ts",
        "src/utils/url.ts",
        "src/utils/validation.ts",
        "src/routes/**",
        "src/pages/PageNotFound.tsx",
        "src/pages/Home.tsx",
        "src/pages/AboutPage.tsx",
        "src/pages/admin/UserForm.tsx",
        "**/index.ts",
      ],
    },
  },
});