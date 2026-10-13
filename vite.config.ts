import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// https://vite.dev/config/
export default defineConfig({
  // When deploying to GitHub Pages as a project site, the app is served
  // from /<repo>/. Set GITHUB_PAGES=true in CI to enable the subpath.
  base: process.env.GITHUB_PAGES ? '/learn-ai-native-dev/' : '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src')
    }
  },
  build: {
    target: 'esnext', // Support top-level await
    rollupOptions: {
      output: {
        // Vite 8 (Rolldown) only accepts the function form of manualChunks.
        manualChunks(id) {
          if (/[\\/]node_modules[\\/](react|react-dom|react-router-dom|react-router|scheduler)[\\/]/.test(id)) {
            return 'vendor-react'
          }
          if (/[\\/]node_modules[\\/]@radix-ui[\\/]react-(dialog|scroll-area|collapsible)[\\/]/.test(id)) {
            return 'vendor-ui'
          }
        }
      }
    }
  },
  css: {
    // Suppress esbuild CSS warnings for Tailwind arbitrary classes
    // that get picked up from markdown content strings
    devSourcemap: true,
  },
  esbuild: {
    logOverride: {
      'unsupported-css-property': 'silent',
    },
  },
});
