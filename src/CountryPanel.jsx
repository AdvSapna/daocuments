import React, { useState, useEffect } from 'react';
import supabase from './supabase';

const META = {
  legal:      { label:'Legal',      color:'#6ab587', bg:'rgba(139,201,164,0.15)' },
  partial:    { label:'Partial',    color:'#c9a84e', bg:'rgba(237,201,120,0.15)' },
  restricted: { label:'Restricted', color:'#c48540', bg:'rgba(224,166,107,0.15)' },
  banned:     { label:'Banned',     color:'#d45d56', bg:'rgba(212,93,86,0.15)' },
  unknown:    { label:'No Data',    color:'#9e9790', bg:'rgba(176,168,158,0.12)' },
};

function getMeta(status) {
  if (!status) return META.unknown;
  const s = status.toLowerCase();
  if (s === 'legal' || s.includes('friend')) return META.legal;
  if (s === 'partial' || s.includes('moderate') || s.includes('neutral')) return META.partial;
  if (s === 'restricted') return META.restricted;
  if (s === 'banned' || s.includes('ban') || s.includes('illegal')) return META.banned;
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
      fontFamily: "'Times New Roman', Times, serif",
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
        <div style={{ fontSize: 9, color: 'var(--accent)', fontFamily: "'Times New Roman', Times, serif", marginTop: 6, letterSpacing: '0.06em' }}>↗ VIEW SOURCE</div>
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
      <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'Times New Roman', Times, serif", letterSpacing: '0.08em' }}>
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

function ReportInaccuracy({ countryName, countryCode }) {
  const [open, setOpen] = useState(false);
  const [field, setField] = useState('');
  const [detail, setDetail] = useState('');
  const [link, setLink] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!field.trim() || !detail.trim()) return;
    setLoading(true);
    if (supabase) {
      await supabase.from('inaccuracy_reports').insert({
        country_code: countryCode,
        country_name: countryName,
        field_reported: field.trim(),
        detail: detail.trim(),
        source_link: link.trim() || null,
      });
    }
    setLoading(false);
    setSubmitted(true);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          background: 'none', border: '1px solid var(--border)', borderRadius: 6,
          padding: '8px 14px', fontSize: 11, color: 'var(--text-muted)',
          fontFamily: "'Times New Roman', Times, serif", letterSpacing: '0.06em',
          cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s',
          width: '100%',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
      >
        REPORT INACCURACY
      </button>
    );
  }

  if (submitted) {
    return (
      <div style={{ background: 'rgba(139,201,164,0.1)', border: '1px solid rgba(139,201,164,0.3)', borderRadius: 8, padding: '14px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: '#6ab587', fontWeight: 600, marginBottom: 4 }}>Thank you!</div>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>Your report has been submitted. We'll review it shortly.</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{
      background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 8,
      padding: 16, display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'Times New Roman', Times, serif", letterSpacing: '0.1em' }}>REPORT INACCURACY</div>
        <button type="button" onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14 }}>x</button>
      </div>
      <select
        value={field}
        onChange={e => setField(e.target.value)}
        required
        style={{
          padding: '8px 10px', fontSize: 12, border: '1px solid var(--border)', borderRadius: 6,
          background: 'var(--bg-secondary)', color: 'var(--text-primary)',
          fontFamily: "'Times New Roman', Times, serif",
        }}
      >
        <option value="">What is inaccurate?</option>
        <option value="status">Status (Legal/Partial/Restricted)</option>
        <option value="summary">Summary</option>
        <option value="legislation">Legislation</option>
        <option value="news">News</option>
        <option value="cases">Cases</option>
        <option value="other">Other</option>
      </select>
      <textarea
        value={detail}
        onChange={e => setDetail(e.target.value)}
        placeholder="What is incorrect and what should it be?"
        required
        rows={3}
        style={{
          padding: '8px 10px', fontSize: 12, border: '1px solid var(--border)', borderRadius: 6,
          background: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical',
          fontFamily: "'Times New Roman', Times, serif",
        }}
      />
      <input
        type="url"
        value={link}
        onChange={e => setLink(e.target.value)}
        placeholder="Source link (official URL preferred)"
        style={{
          padding: '8px 10px', fontSize: 12, border: '1px solid var(--border)', borderRadius: 6,
          background: 'var(--bg-secondary)', color: 'var(--text-primary)',
          fontFamily: "'Times New Roman', Times, serif",
        }}
      />
      <button type="submit" disabled={loading} style={{
        padding: '8px 14px', background: 'var(--accent)', color: '#fff', border: 'none',
        borderRadius: 6, fontSize: 12, fontWeight: 600, fontFamily: "'Times New Roman', Times, serif",
        cursor: 'pointer', letterSpacing: '0.04em',
      }}>
        {loading ? 'Submitting...' : 'Submit Report'}
      </button>
    </form>
  );
}

export default function CountryPanel({ country, onClose }) {
  const [visitorCount, setVisitorCount] = useState(null);

  useEffect(() => {
    if (!supabase) {
      console.warn('Visitor count: supabase client is null (env vars missing?)');
      return;
    }
    supabase.rpc('increment_visitor_count').then(({ data, error }) => {
      if (error) {
        console.error('Visitor count RPC error:', error);
        return;
      }
      if (data != null) setVisitorCount(data);
    });
  }, []);

  // Empty state — ghost preview cards + visitor counter
  if (!country) {
    return (
      <div className="panel-empty" style={{ ...panelStyle(false), padding: '32px 24px', justifyContent: 'space-between' }}>
        <div>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 32, opacity: 0.15, marginBottom: 8 }}>🌐</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: "'Times New Roman', Times, serif", letterSpacing: '0.08em', lineHeight: 1.8 }}>
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

        {/* Visitor counter */}
        <div style={{
          textAlign: 'center',
          paddingTop: 20,
          borderTop: '1px solid var(--border)',
        }}>
          <div style={{
            fontSize: 10, color: 'var(--text-muted)', fontFamily: "'Times New Roman', Times, serif",
            letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8,
          }}>
            VISITORS
          </div>
          <div style={{
            fontSize: 28, fontWeight: 800, color: 'var(--accent)',
            fontFamily: "'Times New Roman', Times, serif", letterSpacing: '0.04em',
          }}>
            {visitorCount != null ? visitorCount.toLocaleString() : '—'}
          </div>
          <div style={{
            fontSize: 10, color: 'var(--text-muted)', fontFamily: "'Times New Roman', Times, serif",
            marginTop: 4, letterSpacing: '0.06em',
          }}>
            since launch
          </div>
        </div>
      </div>
    );
  }

  const meta = getMeta(country.status);
  const legislation = [...(country.legislation || [])].sort((a, b) => (b.year || 0) - (a.year || 0));
  const news = [...(country.news || [])].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  const cases = [...(country.cases || [])].sort((a, b) => (b.year || 0) - (a.year || 0));

  return (
    <div className="panel-expanded" style={panelStyle(true)}>
      {/* Header */}
      <div style={{ padding: '18px 24px 14px', borderBottom: '1px solid ' + meta.color + '44', background: meta.bg, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 11, color: meta.color, fontFamily: "'Times New Roman', Times, serif", letterSpacing: '0.12em', marginBottom: 4, opacity: 0.8 }}>{country.code}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>{country.name}</div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: '1px solid ' + meta.color + '44', color: meta.color, borderRadius: 4, width: 28, height: 28, cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>×</button>
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
                <span style={{ fontSize: 11, fontWeight: 700, color: meta.color, fontFamily: "'Times New Roman', Times, serif", letterSpacing: '0.08em' }}>{meta.label.toUpperCase()}</span>
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
                <Card key={i}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{item.title}</div>
                  {item.note && <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 4 }}>{item.note}</div>}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'Times New Roman', Times, serif" }}>{item.year}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 16, marginTop: 8, borderTop: '1px solid var(--border)', paddingTop: 8 }}>
                    {item.officialUrl && (
                      <a href={item.officialUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: "'Times New Roman', Times, serif", letterSpacing: '0.06em', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='var(--accent)'} onMouseLeave={e => e.currentTarget.style.color='var(--text-muted)'}>↗ OFFICIAL DOCUMENT</a>
                    )}
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 9, color: 'var(--accent)', fontFamily: "'Times New Roman', Times, serif", letterSpacing: '0.06em', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='#5a9ab5'} onMouseLeave={e => e.currentTarget.style.color='var(--accent)'}>↗ LEARN MORE</a>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: "'Times New Roman', Times, serif" }}>No legislation data yet</Card>
          )}
        </AnimatedSection>

        {/* Row 2: News + Cases */}
        <AnimatedSection delay={0.2}>
          <div className="detail-grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* News */}
            <div>
              <SectionHeader>News</SectionHeader>
              {news.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {news.map((item, i) => (
                    <Card key={i} href={item.url}>
                      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{item.title}</div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'Times New Roman', Times, serif" }}>{item.date}</div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: "'Times New Roman', Times, serif" }}>No news yet</Card>
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
                        <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: "'Times New Roman', Times, serif" }}>{item.status}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'Times New Roman', Times, serif" }}>{item.year}</div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: "'Times New Roman', Times, serif" }}>No cases yet</Card>
              )}
            </div>
          </div>
        </AnimatedSection>

        {/* Report Inaccuracy */}
        <AnimatedSection delay={0.3} style={{ marginTop: 24 }}>
          <ReportInaccuracy countryName={country.name} countryCode={country.code} />
        </AnimatedSection>

      </div>
    </div>
  );
}
