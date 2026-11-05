// The Supabase client must fail loudly when its settings are missing.
afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

test('throws when the Supabase URL is missing', async () => {
  vi.stubEnv('VITE_SUPABASE_URL', '');
  vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', 'sb_publishable_test');
  await expect(import('./supabase')).rejects.toThrow('VITE_SUPABASE_URL');
});

test('throws when the Supabase key is missing', async () => {
  vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
  vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', '');
  await expect(import('./supabase')).rejects.toThrow('VITE_SUPABASE_PUBLISHABLE_KEY');
});

test('creates a client when both settings are present', async () => {
  vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
  vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', 'sb_publishable_test');
  const { default: supabase } = await import('./supabase');
  expect(typeof supabase.from).toBe('function');
});
