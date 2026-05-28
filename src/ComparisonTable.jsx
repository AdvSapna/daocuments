import React, { useState, useMemo, useRef, useEffect } from 'react';
import { FIELD_GROUPS } from './comparisonFields';

const STATUS_COLOR = { legal:'#8bc9a4', partial:'#edc978', restricted:'#e0a66b', banned:'#d45d56' };

const VALUE_COLORS = {
  yes: '#8bc9a4', legal: '#8bc9a4', allowed: '#8bc9a4', live: '#8bc9a4', property: '#8bc9a4',
  partial: '#edc978', 'in progress': '#edc978', pending: '#edc978', partially: '#edc978', pilot: '#edc978', neutral: '#edc978',
  restricted: '#e0a66b', research: '#e0a66b', unclear: '#e0a66b',
  no: '#d4cdc4', banned: '#d45d56', prohibited: '#d45d56', none: '#d4cdc4', paused: '#d4cdc4',
};

function Pill({ value }) {
  if (!value) return <span style={{ color: '#b0a89e' }}>—</span>;
  const bg = VALUE_COLORS[value] || '#e8e2d9';
  const dark = ['#d45d56', '#e0a66b'].includes(bg);
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 10,
      fontSize: 10, fontWeight: 600, letterSpacing: '0.04em',
      background: bg + '22', color: dark ? '#6b3a2a' : '#3a3530',
      border: `1px solid ${bg}55`, textTransform: 'capitalize', whiteSpace: 'nowrap',
    }}>
      {value}
    </span>
  );
}

function FilterPopover({ field, activeFilter, onApply, onClose, anchorRect }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  if (field.type === 'text') {
    return (
      <div ref={ref} style={popoverStyle(anchorRect)}>
        <input
          autoFocus
          type="text" placeholder="Search..." value={activeFilter || ''}
          onChange={e => onApply(e.target.value || null)}
          style={inputStyle}
        />
      </div>
    );
  }

  if (field.type === 'tax') {
    return (
      <div ref={ref} style={popoverStyle(anchorRect)}>
        <input
          autoFocus
          type="text" placeholder='e.g. "30%", "none"' value={activeFilter || ''}
          onChange={e => onApply(e.target.value || null)}
          style={inputStyle}
        />
      </div>
    );
  }

  // enum
  const selected = activeFilter ? new Set(activeFilter) : new Set();
  const toggle = (val) => {
    const next = new Set(selected);
    next.has(val) ? next.delete(val) : next.add(val);
    onApply(next.size > 0 ? [...next] : null);
  };

  return (
    <div ref={ref} style={popoverStyle(anchorRect)}>
      {field.values.map(v => (
        <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0', cursor: 'pointer', fontSize: 11, textTransform: 'capitalize' }}>
          <input type="checkbox" checked={selected.has(v)} onChange={() => toggle(v)} />
          {v}
        </label>
      ))}
      {selected.size > 0 && (
        <button onClick={() => onApply(null)} style={{ ...chipBtnStyle, marginTop: 4, fontSize: 9 }}>Clear</button>
      )}
    </div>
  );
}

function popoverStyle(anchorRect) {
  return {
    position: 'fixed',
    top: anchorRect ? anchorRect.bottom + 4 : 0,
    left: anchorRect ? anchorRect.left : 0,
    background: '#fff', border: '1px solid #e5ddd3', borderRadius: 8,
    padding: '8px 10px', boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
    zIndex: 200, minWidth: 140,
    fontFamily: "'Times New Roman', Times, serif",
  };
}

const inputStyle = {
  width: '100%', padding: '5px 8px', border: '1px solid #e5ddd3', borderRadius: 6,
  fontSize: 11, fontFamily: "'Times New Roman', Times, serif", outline: 'none',
};

const chipBtnStyle = {
  padding: '2px 8px', borderRadius: 10, border: '1px solid #e5ddd3',
  background: '#f7f3ee', cursor: 'pointer', fontSize: 10,
  fontFamily: "'Times New Roman', Times, serif", color: '#3a3530',
};

export default function ComparisonTable({ data, comparisonData, fields, onCountrySelect, isMobile }) {
  const [filters, setFilters] = useState({});
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [openFilter, setOpenFilter] = useState(null);
  const [filterAnchor, setFilterAnchor] = useState(null);
  const headerRefs = useRef({});

  // Merge country data with comparison data
  const rows = useMemo(() => {
    if (!data) return [];
    return Object.entries(data).map(([code, country]) => ({
      code,
      name: country.name,
      status: country.status,
      summary: country.summary,
      legislation: country.legislation || [],
      news: country.news || [],
      cases: country.cases || [],
      euMember: country.euMember || false,
      ...(comparisonData[code] || {}),
    }));
  }, [data, comparisonData]);

  // Filter
  const filtered = useMemo(() => {
    return rows.filter(row => {
      for (const [key, filter] of Object.entries(filters)) {
        if (!filter) continue;
        if (key === 'status') {
          if (Array.isArray(filter) && !filter.includes(row.status)) return false;
        } else {
          const field = fields.find(f => f.key === key);
          const val = row[key];
          if (!field) continue;
          if (field.type === 'enum') {
            if (Array.isArray(filter) && val && !filter.includes(val)) return false;
            if (Array.isArray(filter) && !val) return false;
          } else if (field.type === 'text' || field.type === 'tax') {
            if (typeof filter === 'string' && filter) {
              if (!val || !val.toLowerCase().includes(filter.toLowerCase())) return false;
            }
          }
        }
      }
      return true;
    });
  }, [rows, filters, fields]);

  // Sort
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      let va = sortKey === 'name' ? a.name : sortKey === 'status' ? a.status : a[sortKey];
      let vb = sortKey === 'name' ? b.name : sortKey === 'status' ? b.status : b[sortKey];
      if (!va) va = '';
      if (!vb) vb = '';
      const cmp = String(va).localeCompare(String(vb), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) {
      if (sortDir === 'asc') setSortDir('desc');
      else { setSortKey(null); setSortDir('asc'); }
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const handleFilterClick = (key, e) => {
    if (openFilter === key) { setOpenFilter(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    setFilterAnchor(rect);
    setOpenFilter(key);
  };

  const handleRowClick = (row) => {
    onCountrySelect({
      code: row.code, name: row.name, status: row.status,
      summary: row.summary, legislation: row.legislation,
      news: row.news, cases: row.cases, analysis: row.analysis,
      framework: row.framework, euMember: row.euMember,
    });
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const allFields = [{ key: 'status', label: 'Legal Status', type: 'enum', values: ['legal', 'partial', 'restricted', 'banned'], group: 'core' }, ...fields];

  // Mobile card view
  if (isMobile) {
    return (
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 8px', background: 'var(--bg-primary)' }}>
        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          <span style={{ fontSize: 10, color: '#b0a89e', letterSpacing: '0.08em', alignSelf: 'center' }}>
            {sorted.length} COUNTRIES
          </span>
          {activeFilterCount > 0 && (
            <button onClick={() => setFilters({})} style={chipBtnStyle}>CLEAR ALL</button>
          )}
        </div>

        {sorted.map(row => (
          <div key={row.code} onClick={() => handleRowClick(row)} style={{
            background: '#fff', border: '1px solid #e5ddd3', borderRadius: 8,
            padding: '10px 12px', marginBottom: 8, cursor: 'pointer',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLOR[row.status] || '#d4cdc4', flexShrink: 0 }} />
              <span style={{ fontWeight: 700, fontSize: 13 }}>{row.name}</span>
              <span style={{ fontSize: 10, color: '#b0a89e', marginLeft: 'auto' }}>{row.code}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px' }}>
              {allFields.slice(0, 8).map(f => {
                const val = f.key === 'status' ? row.status : row[f.key];
                return (
                  <div key={f.key} style={{ fontSize: 10 }}>
                    <span style={{ color: '#b0a89e' }}>{f.label}: </span>
                    <Pill value={val} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {sorted.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#b0a89e', fontSize: 12 }}>
            No countries match the current filters.
          </div>
        )}
      </div>
    );
  }

  // Desktop table view
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-primary)' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px',
        borderBottom: '1px solid #e5ddd3', flexWrap: 'wrap', minHeight: 36,
      }}>
        <span style={{ fontSize: 10, color: '#b0a89e', letterSpacing: '0.1em', fontWeight: 600 }}>
          {sorted.length} OF {rows.length} COUNTRIES
        </span>
        {Object.entries(filters).map(([key, val]) => {
          if (!val) return null;
          const f = allFields.find(x => x.key === key);
          const label = f ? f.label : key;
          const display = Array.isArray(val) ? val.join(', ') : val;
          return (
            <span key={key} style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '2px 8px', borderRadius: 10, fontSize: 9,
              background: '#7cafc422', border: '1px solid #7cafc455', color: '#3a3530',
            }}>
              {label}: {display}
              <span onClick={() => setFilters(f => ({ ...f, [key]: null }))} style={{ cursor: 'pointer', fontWeight: 700 }}>&times;</span>
            </span>
          );
        })}
        {activeFilterCount > 0 && (
          <button onClick={() => setFilters({})} style={chipBtnStyle}>Clear all</button>
        )}
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <table style={{
          width: '100%', borderCollapse: 'separate', borderSpacing: 0,
          fontFamily: "'Times New Roman', Times, serif", fontSize: 11,
        }}>
          <thead>
            {/* Group header row */}
            <tr>
              <th rowSpan={2} style={{ ...thStyle, position: 'sticky', left: 0, zIndex: 12, minWidth: 160, background: '#f0ebe4', verticalAlign: 'bottom', borderBottom: '2px solid #e5ddd3' }}>
                <span onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                  Country {sortKey === 'name' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                </span>
              </th>
              {FIELD_GROUPS.map(group => {
                const cols = allFields.filter(f => f.group === group.key);
                if (cols.length === 0) return null;
                return (
                  <th key={group.key} colSpan={cols.length} style={{
                    ...groupThStyle,
                    borderLeft: '2px solid #e5ddd3',
                  }}>
                    {group.label}
                  </th>
                );
              })}
            </tr>
            {/* Field header row */}
            <tr>
              {FIELD_GROUPS.map((group, gi) =>
                allFields.filter(f => f.group === group.key).map((f, fi) => (
                  <th key={f.key} ref={el => headerRefs.current[f.key] = el} style={{
                    ...thStyle, minWidth: 110, top: 28,
                    borderLeft: fi === 0 ? '2px solid #e5ddd3' : undefined,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span onClick={() => handleSort(f.key)} style={{ cursor: 'pointer', flex: 1 }}>
                        {f.label} {sortKey === f.key ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                      </span>
                      <span
                        onClick={(e) => handleFilterClick(f.key, e)}
                        style={{
                          cursor: 'pointer', fontSize: 10, opacity: filters[f.key] ? 1 : 0.4,
                          color: filters[f.key] ? '#7cafc4' : '#b0a89e',
                        }}
                      >
                        &#9662;
                      </span>
                    </div>
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {sorted.map(row => (
              <tr
                key={row.code}
                onClick={() => handleRowClick(row)}
                style={{ cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f7f3ee'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                <td style={{ ...tdStyle, position: 'sticky', left: 0, background: 'inherit', zIndex: 5, fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLOR[row.status] || '#d4cdc4', flexShrink: 0 }} />
                    {row.name}
                    <span style={{ fontSize: 9, color: '#b0a89e', fontWeight: 400 }}>{row.code}</span>
                  </div>
                </td>
                {FIELD_GROUPS.map((group, gi) =>
                  allFields.filter(f => f.group === group.key).map((f, fi) => {
                    const val = f.key === 'status' ? row.status : row[f.key];
                    return (
                      <td key={f.key} style={{ ...tdStyle, borderLeft: fi === 0 ? '2px solid #f0ebe4' : undefined }}>
                        {f.type === 'text' ? (
                          <span style={{ fontSize: 10 }}>{val || <span style={{ color: '#b0a89e' }}>—</span>}</span>
                        ) : (
                          <Pill value={val} />
                        )}
                      </td>
                    );
                  })
                )}
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={allFields.length + 1} style={{ textAlign: 'center', padding: 40, color: '#b0a89e', fontSize: 12 }}>
                  No countries match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Filter popover */}
      {openFilter && (() => {
        const field = allFields.find(f => f.key === openFilter);
        if (!field) return null;
        return (
          <FilterPopover
            field={field}
            activeFilter={filters[openFilter]}
            anchorRect={filterAnchor}
            onApply={val => setFilters(f => ({ ...f, [openFilter]: val }))}
            onClose={() => setOpenFilter(null)}
          />
        );
      })()}
    </div>
  );
}

const groupThStyle = {
  padding: '6px 10px', textAlign: 'center', fontWeight: 800, fontSize: 10,
  letterSpacing: '0.12em', color: '#3a3530', borderBottom: '1px solid #e5ddd3',
  background: '#e8e2d9', position: 'sticky', top: 0, zIndex: 9,
  whiteSpace: 'nowrap', textTransform: 'uppercase',
  fontFamily: "'Times New Roman', Times, serif",
};

const thStyle = {
  padding: '8px 10px', textAlign: 'left', fontWeight: 600, fontSize: 10,
  letterSpacing: '0.06em', color: '#6b5e52', borderBottom: '2px solid #e5ddd3',
  background: '#f0ebe4', position: 'sticky', top: 28, zIndex: 8,
  whiteSpace: 'nowrap', textTransform: 'uppercase',
};

const tdStyle = {
  padding: '8px 10px', borderBottom: '1px solid #f0ebe4',
  background: '#fff', verticalAlign: 'middle',
};
