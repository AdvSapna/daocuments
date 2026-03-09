import React, { useState } from 'react';

const STATUS_ORDER = ['legal', 'partial', 'restricted', null];
const STATUS_META = {
  legal:      { label: 'Legal',      color: '#6ab587', bg: 'rgba(139,201,164,0.15)' },
  partial:    { label: 'Partial',    color: '#c9a84e', bg: 'rgba(237,201,120,0.15)' },
  restricted: { label: 'Restricted', color: '#d07570', bg: 'rgba(232,148,142,0.15)' },
  null:       { label: 'No Data',    color: '#9e9790', bg: 'rgba(176,168,158,0.12)' },
};

function normalize(status) {
  if (!status) return null;
  const s = status.toLowerCase();
  if (s === 'legal' || s.includes('friend')) return 'legal';
  if (s === 'partial' || s.includes('moderate') || s.includes('neutral')) return 'partial';
  if (s === 'restricted' || s.includes('restrict') || s.includes('ban')) return 'restricted';
  return null;
}

export default function CountryList({ data, onCountrySelect }) {
  const [search, setSearch] = useState('');

  // Build grouped list from data
  const entries = Object.entries(data).map(([code, info]) => ({
    code,
    name: info.name || code,
    status: normalize(info.status),
    raw: info,
  }));

  const filtered = search
    ? entries.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.code.toLowerCase().includes(search.toLowerCase()))
    : entries;

  const grouped = {};
  STATUS_ORDER.forEach(s => { grouped[s] = []; });
  filtered.forEach(e => {
    const key = e.status;
    if (grouped[key]) grouped[key].push(e);
    else grouped[null].push(e);
  });

  // Sort each group alphabetically
  Object.values(grouped).forEach(arr => arr.sort((a, b) => a.name.localeCompare(b.name)));

  return (
    <div style={{
      width: '100%', height: '100%', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)',
    }}>
      {/* Search */}
      <div style={{ padding: '12px 16px', flexShrink: 0 }}>
        <input
          type="text"
          placeholder="Search countries..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '10px 14px', fontSize: 13,
            border: '1px solid var(--border)', borderRadius: 8,
            background: 'var(--bg-secondary)', color: 'var(--text-primary)',
            fontFamily: 'Advent Pro, sans-serif', outline: 'none',
          }}
        />
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px' }}>
        {STATUS_ORDER.map(statusKey => {
          const items = grouped[statusKey];
          if (!items || items.length === 0) return null;
          const meta = STATUS_META[statusKey];

          return (
            <div key={statusKey || 'nodata'} style={{ marginBottom: 20 }}>
              <div style={{
                fontSize: 10, fontFamily: 'EB Garamond, serif',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: meta.color, marginBottom: 8, paddingLeft: 4,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: meta.color }} />
                {meta.label}
                <span style={{ color: 'var(--text-muted)', fontSize: 9 }}>({items.length})</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {items.map(item => (
                  <button
                    key={item.code}
                    onClick={() => onCountrySelect({
                      code: item.code,
                      name: item.raw.name || item.code,
                      status: item.raw.status || null,
                      summary: item.raw.summary || null,
                      legislation: item.raw.legislation || [],
                      news: item.raw.news || [],
                      cases: item.raw.cases || [],
                    })}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 14px', borderRadius: 8,
                      background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                      cursor: 'pointer', textAlign: 'left', width: '100%',
                      fontFamily: 'Advent Pro, sans-serif',
                      transition: 'border-color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = meta.color}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'EB Garamond, serif', marginTop: 2 }}>{item.code}</div>
                    </div>
                    <div style={{
                      fontSize: 10, fontFamily: 'EB Garamond, serif',
                      color: meta.color, letterSpacing: '0.06em',
                    }}>
                      {meta.label.toUpperCase()} →
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '40px 0',
            fontSize: 12, color: 'var(--text-muted)', fontFamily: 'EB Garamond, serif',
          }}>
            No countries found
          </div>
        )}
      </div>
    </div>
  );
}
