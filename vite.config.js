import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: "src",
  base: "/static/dist/",
  server: {
    host: "127.0.0.1",
    port: 8001,
    strictPort: true,
    hmr: {
      host: "127.0.0.1",
      port: 8001,
    },
  },
  build: {
    outDir: "../dist",
    emptyOutDir: false,
    manifest: "manifest.json",
    rollupOptions: {
      input: {
        main: resolve("src/js/app.tsx"),
      },
    },
  },
});
