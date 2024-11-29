import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      formats: ["cjs"],
      fileName: "index",
    },
    target: "node18",
    outDir: "dist",
    sourcemap: true,
  },
});
