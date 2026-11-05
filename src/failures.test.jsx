import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import supabase from './supabase';
import App from './App';
import CountryPanel from './CountryPanel';
import { SAMPLE } from './countries';

vi.mock('./supabase', () => import('./test/supabaseMock'));

const ok = (data = null) => Promise.resolve({ data, error: null });
const fail = message => Promise.resolve({ data: null, error: { message } });

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

function fillAndSubmitReport() {
  render(<CountryPanel country={{ code: 'FR', ...SAMPLE.FR }} onClose={() => {}} onSelectCountry={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: /report inaccuracy/i }));
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'summary' } });
  fireEvent.change(screen.getByPlaceholderText(/what is incorrect/i), { target: { value: 'Out of date' } });
  fireEvent.click(screen.getByRole('button', { name: /submit report/i }));
}

const signedIn = () => vi.spyOn(supabase.auth, 'getSession').mockReturnValue(ok({ session: { user: { id: 'u1' } } }));

describe('report inaccuracy form', () => {
  test('asks signed-out visitors to sign in and saves nothing', async () => {
    const from = vi.spyOn(supabase, 'from');
    fillAndSubmitReport();
    expect(await screen.findByRole('alert')).toHaveTextContent(/sign in/i);
    expect(from).not.toHaveBeenCalledWith('inaccuracy_reports');
  });

  test('shows the error and keeps the form when saving fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    signedIn();
    vi.spyOn(supabase, 'from').mockReturnValue({ insert: () => fail('permission denied') });
    fillAndSubmitReport();
    expect(await screen.findByRole('alert')).toHaveTextContent('permission denied');
    expect(screen.queryByText(/thank you/i)).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText(/what is incorrect/i)).toHaveValue('Out of date');
  });

  test('thanks the reporter only when saving succeeds', async () => {
    signedIn();
    vi.spyOn(supabase, 'from').mockReturnValue({ insert: () => ok() });
    fillAndSubmitReport();
    expect(await screen.findByText(/thank you/i)).toBeInTheDocument();
  });
});

test('logs an error when country overrides fail to load', async () => {
  const log = vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(supabase, 'from').mockReturnValue({ select: () => fail('relation does not exist') });
  render(<App />);
  await waitFor(() =>
    expect(log).toHaveBeenCalledWith('Could not load country overrides from Supabase:', expect.objectContaining({ message: 'relation does not exist' }))
  );
});

describe('newsletter opt-in after sign-in', () => {
  const user = { id: '11111111-1111-1111-1111-111111111111' };

  function signedInWith(upsert) {
    localStorage.setItem('dao_newsletter', '1');
    localStorage.setItem('dao_email', 'alice@example.com');
    vi.spyOn(supabase.auth, 'getSession').mockReturnValue(ok({ session: { user } }));
    vi.spyOn(supabase, 'from').mockImplementation(table =>
      table === 'subscribers' ? { upsert } : { select: () => ok([]) }
    );
  }

  test('keeps the saved preference when saving fails, so it is retried', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    signedInWith(() => fail('permission denied'));
    render(<App />);
    await waitFor(() => expect(log).toHaveBeenCalledWith('Could not save newsletter preference:', expect.anything()));
    expect(localStorage.getItem('dao_newsletter')).toBe('1');
    expect(localStorage.getItem('dao_email')).toBe('alice@example.com');
  });

  test('clears the saved preference once it is stored', async () => {
    signedInWith(() => ok());
    render(<App />);
    await waitFor(() => expect(localStorage.getItem('dao_newsletter')).toBeNull());
    expect(localStorage.getItem('dao_email')).toBeNull();
  });
});
