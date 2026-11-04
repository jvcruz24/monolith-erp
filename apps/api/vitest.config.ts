import { defineConfig } from "vitest/config";

export default defineConfig({
  // Resolves the path aliases declared in tsconfig.json, including the ones
  // added by `nest g library`. Requires Vite 8, which ships this option.
  resolve: { tsconfigPaths: true },
  test: {
    include: ["test/**/*.test.ts"],
    globalSetup: ["./test/global-setup.ts"],
    setupFiles: ["./test/setup-env.ts"],
    fileParallelism: false,
    testTimeout: 20000,
  },
});
