import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import ViteRestart from "vite-plugin-restart";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 7412,
  },
  plugins: [
    react(),
    ViteRestart({
      restart: [".eslintrc*", ".prettierrc*", "tsconfig.json"],
    }),
    checker({
      eslint: {
        // for example, lint .ts and .tsx
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
      },
      typescript: true,
    }),
  ],
});
