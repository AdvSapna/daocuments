import { render, screen } from '@testing-library/react';
import App from './App';

vi.mock('./supabase', () => import('./test/supabaseMock'));

test('renders the landing page', () => {
  render(<App />);
  expect(screen.getByText(/Tracking Crypto Regulation/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /explore the map/i })).toBeInTheDocument();
});
