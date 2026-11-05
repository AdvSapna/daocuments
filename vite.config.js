import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const ENV_PREFIX = 'REACT_APP_';
const REQUIRED_ENV = ['REACT_APP_SUPABASE_URL', 'REACT_APP_SUPABASE_ANON_KEY'];

export default defineConfig(({ mode }) => {
  // Fail the dev server and the build (including on Vercel) when a required
  // variable is missing, instead of shipping a site that breaks at runtime.
  // Tests replace the Supabase client with a mock, so they skip this check.
  if (mode !== 'test') {
    const env = loadEnv(mode, process.cwd(), ENV_PREFIX);
    const missing = REQUIRED_ENV.filter(name => !env[name]);
    if (missing.length) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}. Set them in .env, and in Vercel for deploys.`);
    }
  }

  return {
    plugins: [react()],
    envPrefix: ENV_PREFIX,
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
  };
});
