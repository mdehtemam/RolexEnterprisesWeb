import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor": ["react", "react-dom", "react-router-dom"],
          "radix": ["@radix-ui/react-dialog", "@radix-ui/react-select", "@radix-ui/react-tabs"],
          "supabase": ["@supabase/supabase-js"],
          "ui-components": ["sonner", "lucide-react"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
