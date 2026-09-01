import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    fs: {
      allow: [
        "..",
        "../node_modules",
        "C:/Users/Atulchaudhary/Desktop/Movie-App/node_modules",
      ],
    },
    proxy: {
      "/api/": "http://localhost:3000",
      "/uploads/": "http://localhost:3000",
    },
  },
});
