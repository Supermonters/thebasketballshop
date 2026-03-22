import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:8080",
      "/legacy": "http://localhost:8080",
      "/legacy-admin": "http://localhost:8080",
      "/dummy": "http://localhost:8080",
      "/images": "http://localhost:8080",
    },
  },
});
