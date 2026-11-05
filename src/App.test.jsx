import { render, screen } from '@testing-library/react';
import App from './App';

// Run without a live Supabase project, the same way the app runs when the
// environment variables are missing.
vi.mock('./supabase', () => ({ default: null }));

test('renders the landing page', () => {
  render(<App />);
  expect(screen.getByText(/Tracking Crypto Regulation/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /explore the map/i })).toBeInTheDocument();
});
