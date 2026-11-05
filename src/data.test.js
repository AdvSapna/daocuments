import { SAMPLE } from './Map';
import WEEKLY_UPDATES from './updates';
import COMPARISON_DATA from './comparisonData';

const STATUSES = ['legal', 'partial', 'restricted', 'banned'];
const UPDATE_TYPES = ['regulatory', 'news', 'case'];

describe('SAMPLE country data', () => {
  const entries = Object.entries(SAMPLE);

  test('is keyed by ISO-2 codes', () => {
    entries.forEach(([code]) => expect(code).toMatch(/^[A-Z]{2}$/));
  });

  test('every country has a name and a known status', () => {
    entries.forEach(([code, c]) => {
      expect(c.name, code).toBeTruthy();
      expect(STATUSES, `${code} status "${c.status}"`).toContain(c.status);
    });
  });

  test('includes the EU MiCA entry', () => {
    expect(SAMPLE.EU).toBeDefined();
  });
});

test('comparison data only covers countries in SAMPLE', () => {
  Object.keys(COMPARISON_DATA).forEach(code => expect(SAMPLE, code).toHaveProperty(code));
});

test('weekly updates are well formed', () => {
  WEEKLY_UPDATES.forEach(week => {
    expect(week.label).toBeTruthy();
    week.items.forEach(item => {
      // An empty code is used for items that are not about one country (e.g. DeFi).
      expect(item.country).toMatch(/^([A-Z]{2})?$/);
      expect(UPDATE_TYPES).toContain(item.type);
      expect(item.title).toBeTruthy();
      expect(item.url).toMatch(/^https?:\/\//);
    });
  });
});

describe('world map shapes (public/countries.geojson)', () => {
  test('every country has a name and none is inverted', async () => {
    const { readFileSync } = await import('node:fs');
    const { geoArea } = await import('d3-geo');
    const map = JSON.parse(readFileSync('public/countries.geojson', 'utf8'));
    expect(map.features.length).toBeGreaterThan(200);
    map.features.forEach(feature => {
      expect(feature.properties.name).toBeTruthy();
      // An inverted ring covers more than half the globe and paints over the map.
      expect(geoArea(feature), feature.properties.name).toBeLessThan(2 * Math.PI);
    });
  });
});
