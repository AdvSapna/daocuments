import { render, screen } from '@testing-library/react';
import supabase from './supabase';
import CountryPanel from './CountryPanel';

vi.mock('./supabase', () => import('./test/supabaseMock'));

test('counts a visit once per page load, however often the panel mounts', async () => {
  const rpc = vi.spyOn(supabase, 'rpc').mockReturnValue(Promise.resolve({ data: 42, error: null }));

  const first = render(<CountryPanel country={null} onClose={() => {}} onSelectCountry={() => {}} />);
  expect(await screen.findByText('42')).toBeInTheDocument();
  first.unmount();

  // Switching views remounts the panel.
  render(<CountryPanel country={null} onClose={() => {}} onSelectCountry={() => {}} />);
  expect(await screen.findByText('42')).toBeInTheDocument();

  expect(rpc).toHaveBeenCalledTimes(1);
  expect(rpc).toHaveBeenCalledWith('increment_visitor_count');
});
