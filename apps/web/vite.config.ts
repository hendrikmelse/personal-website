import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Frontend-only for now. When an API is added (apps/api), proxy it here so the
// browser sees one origin in development, as it does in production behind Caddy:
//   server: { proxy: { "/api": "http://localhost:3000" } },
export default defineConfig({
  plugins: [react()],
  server: { host: true },
});
