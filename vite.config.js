import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Keep the existing REACT_APP_* variable names so .env and the Vercel
  // project settings keep working without renaming anything.
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
