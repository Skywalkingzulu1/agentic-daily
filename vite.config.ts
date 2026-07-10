import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import devvit from 'devvit';

export default defineConfig({
  plugins: [react(), devvit()],
  server: {
    port: 5173,
    strictPort: true,
  },
});
