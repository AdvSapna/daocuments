// Fake Supabase client for tests: a signed-out visitor and empty tables.
const ok = (data = null) => Promise.resolve({ data, error: null });

const supabase = {
  from: () => ({
    select: () => ok([]),
    insert: () => ok(),
    upsert: () => ok(),
  }),
  rpc: () => ok(null),
  auth: {
    getSession: () => ok({ session: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    signInWithOtp: () => ok(),
  },
};

export default supabase;
