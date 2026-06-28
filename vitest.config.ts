import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Vitest config (ESM). Runs the Node-side unit suite for the lead pipeline
// (lib/leads, lib/notify). The `@` alias mirrors tsconfig "paths" so `@/lib/...`
// imports resolve the same way they do in the app.
const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": root,
    },
  },
});
