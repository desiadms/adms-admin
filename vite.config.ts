import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";

export default defineConfig({
  server: {
    port: 7412,
  },
  plugins: [
    react(),
    !process.env.CI &&
      checker({
        eslint: {
          lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
        },
        typescript: true,
      }),
  ],
});
