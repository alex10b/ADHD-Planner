import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Use root base on Vercel; set VITE_APP_BASE_PATH=/adhd-daily-planner/ for GitHub Pages
const base = process.env.VITE_APP_BASE_PATH ?? '/';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base,
});
