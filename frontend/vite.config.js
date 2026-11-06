import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // GitHub Pages 프로젝트 사이트는 저장소 이름 경로 아래에서 실행됩니다.
  base: process.env.GITHUB_PAGES === "true" ? "/ITEducation/" : "/",
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true
      }
    }
  }
});
