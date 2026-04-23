import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,       // auto-opens the browser
    strictPort: false, // if 5173 is taken, use the next free port (still auto-opens)
  },
});
