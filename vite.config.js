import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Accept VITE_* (Supabase dashboard names) and the older REACT_APP_* names,
  // so existing Vercel settings keep working.
  envPrefix: ['VITE_', 'REACT_APP_'],
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  build: {
    // Same output folder Create React App used, so Vercel needs no changes.
    outDir: 'build',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
});
