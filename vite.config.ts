import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI Library chunks
          'radix-ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast'
          ],
          // Database and API
          'supabase': ['@supabase/supabase-js'],
          // Utility libraries
          'utils': ['clsx', 'tailwind-merge', 'class-variance-authority'],
          // Icons and UI components
          'ui-components': ['lucide-react'],
          // Form handling
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod']
        }
      }
    }
  },
});
