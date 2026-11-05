import { render, screen, fireEvent } from '@testing-library/react';
import CountryPanel from './CountryPanel';
import { SAMPLE } from './Map';

vi.mock('./supabase', () => import('./test/supabaseMock'));

const country = { code: 'FR', ...SAMPLE.FR, euMember: true };

test('shows the country name', () => {
  render(<CountryPanel country={country} onClose={() => {}} onSelectCountry={() => {}} />);
  expect(screen.getAllByText(SAMPLE.FR.name).length).toBeGreaterThan(0);
});

test('EU member panel links to the MiCA framework entry', () => {
  const onSelectCountry = vi.fn();
  render(<CountryPanel country={country} onClose={() => {}} onSelectCountry={onSelectCountry} />);
  fireEvent.click(screen.getByRole('button', { name: /view mica framework/i }));
  expect(onSelectCountry).toHaveBeenCalledWith(
    expect.objectContaining({ code: 'EU', name: SAMPLE.EU.name, euMember: false })
  );
});
