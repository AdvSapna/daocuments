import { SAMPLE } from './countries';
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

describe('recent updates for the bell', () => {
  test('dated items use YYYY-MM-DD', () => {
    WEEKLY_UPDATES.flatMap(w => w.items).filter(i => i.date).forEach(i => expect(i.date).toMatch(/^\d{4}-\d{2}-\d{2}$/));
  });

  test('keeps only the last 7 days, newest first', async () => {
    const { recentUpdates } = await import('./recentUpdates');
    const updates = [{ label: 'x', items: [
      { title: 'old', date: '2026-10-20' },
      { title: 'mid', date: '2026-11-01' },
      { title: 'new', date: '2026-11-05' },
      { title: 'undated' },
    ] }];
    expect(recentUpdates(updates, new Date('2026-11-05T12:00:00Z')).map(i => i.title)).toEqual(['new', 'mid']);
  });
});
