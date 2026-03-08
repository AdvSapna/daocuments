import React from 'react';

const META = {
  legal:      { label:'Legal',      color:'#6ab587', bg:'rgba(139,201,164,0.15)' },
  partial:    { label:'Partial',    color:'#c9a84e', bg:'rgba(237,201,120,0.15)' },
  restricted: { label:'Restricted', color:'#d07570', bg:'rgba(232,148,142,0.15)' },
  unknown:    { label:'No Data',    color:'#9e9790', bg:'rgba(176,168,158,0.12)' },
};

function getMeta(status) {
  if (!status) return META.unknown;
  const s = status.toLowerCase();
  if (s === 'legal' || s.includes('friend')) return META.legal;
  if (s === 'partial' || s.includes('moderate') || s.includes('neutral')) return META.partial;
  if (s === 'restricted' || s.includes('restrict') || s.includes('ban')) return META.restricted;
  return META.unknown;
}

function panelStyle(expanded) {
  return {
    width: expanded ? 'var(--panel-width-expanded)' : 'var(--panel-width)',
    minWidth: expanded ? 'var(--panel-width-expanded)' : 'var(--panel-width)',
    height: '100%',
    borderLeft: '1px solid var(--border)',
    background: 'var(--bg-secondary)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transition: 'width 0.4s ease, min-width 0.4s ease',
  };
}

function SectionHeader({ children, style }) {
  return (
    <div style={{
      fontSize: 10,
      color: 'var(--text-muted)',
      fontFamily: 'Space Mono, monospace',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      marginBottom: 10,
      ...style,
    }}>
      {children}
    </div>
  );
}

function Card({ children, style, href }) {
  const base = {
    background: 'var(--bg-primary)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '12px 14px',
    ...style,
  };

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          ...base,
          display: 'block',
          textDecoration: 'none',
          color: 'inherit',
          cursor: 'pointer',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#7cafc4'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(124,175,196,0.15)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        {children}
        <div style={{ fontSize: 9, color: 'var(--accent)', fontFamily: 'Space Mono, monospace', marginTop: 6, letterSpacing: '0.06em' }}>↗ VIEW SOURCE</div>
      </a>
    );
  }

  return <div style={base}>{children}</div>;
}

function GhostCard({ label, icon }) {
  return (
    <div style={{
      border: '1.5px dashed var(--border)',
      borderRadius: 8,
      padding: '20px 16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      opacity: 0.5,
    }}>
      <div style={{ fontSize: 20 }}>{icon}</div>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace', letterSpacing: '0.08em' }}>
        {label}
      </div>
    </div>
  );
}

function AnimatedSection({ children, delay, style }) {
  return (
    <div style={{
      animation: `fadeInUp 0.4s ease ${delay}s both`,
      ...style,
    }}>
      {children}
    </div>
  );
}

export default function CountryPanel({ country, onClose }) {

  // Empty state — ghost preview cards
  if (!country) {
    return (
      <div style={{ ...panelStyle(false), padding: '32px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 32, opacity: 0.15, marginBottom: 8 }}>🌐</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace', letterSpacing: '0.08em', lineHeight: 1.8 }}>
            SELECT A COUNTRY<br />ON THE MAP
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <GhostCard icon="◉" label="STATUS" />
          <GhostCard icon="§" label="LEGISLATION" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <GhostCard icon="▤" label="NEWS" />
            <GhostCard icon="⚖" label="CASES" />
          </div>
        </div>
      </div>
    );
  }

  const meta = getMeta(country.status);
  const legislation = country.legislation || [];
  const news = country.news || [];
  const cases = country.cases || [];

  return (
    <div style={panelStyle(true)}>
      {/* Header */}
      <div style={{ padding: '18px 24px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace', letterSpacing: '0.12em', marginBottom: 4 }}>{country.code}</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{country.name}</div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: 4, width: 28, height: 28, cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>×</button>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 28px' }}>

        {/* Status */}
        <AnimatedSection delay={0} style={{ marginBottom: 24 }}>
          <SectionHeader>Status</SectionHeader>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px', borderRadius: 20, background: meta.bg, border: '1px solid ' + meta.color + '44' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: meta.color, boxShadow: '0 0 8px ' + meta.color }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: meta.color, fontFamily: 'Space Mono, monospace', letterSpacing: '0.08em' }}>{meta.label.toUpperCase()}</span>
              </div>
            </div>
            {country.summary && (
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{country.summary}</p>
            )}
          </Card>
        </AnimatedSection>

        {/* Full-width: Legislation */}
        <AnimatedSection delay={0.1} style={{ marginBottom: 24 }}>
          <SectionHeader>Legislation</SectionHeader>
          {legislation.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {legislation.map((item, i) => (
                <Card key={i} href={item.url} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{item.title}</div>
                    {item.note && <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.note}</div>}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace', whiteSpace: 'nowrap', marginTop: 2 }}>{item.year}</div>
                </Card>
              ))}
            </div>
          ) : (
            <Card style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: 'Space Mono, monospace' }}>No legislation data yet</Card>
          )}
        </AnimatedSection>

        {/* Row 2: News + Cases */}
        <AnimatedSection delay={0.2}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* News */}
            <div>
              <SectionHeader>News</SectionHeader>
              {news.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {news.map((item, i) => (
                    <Card key={i} href={item.url}>
                      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace' }}>{item.date}</div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: 'Space Mono, monospace' }}>No news yet</Card>
              )}
            </div>

            {/* Cases */}
            <div>
              <SectionHeader>Cases</SectionHeader>
              {cases.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {cases.map((item, i) => (
                    <Card key={i} href={item.url}>
                      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{item.title}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: 'Space Mono, monospace' }}>{item.status}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace' }}>{item.year}</div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: 'Space Mono, monospace' }}>No cases yet</Card>
              )}
            </div>
          </div>
        </AnimatedSection>

      </div>
    </div>
  );
}
