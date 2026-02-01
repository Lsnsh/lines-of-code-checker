import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "bin/cli.js"),
      formats: ["cjs"],
      fileName: "cli",
    },
    rollupOptions: {
      external: ["node:fs", "node:path", "commander"],
    },
    outDir: "dist",
  },
});
