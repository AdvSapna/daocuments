import React, { useState, useEffect, useRef, useMemo } from 'react';
import Map, { SAMPLE } from './Map';
import CountryPanel from './CountryPanel';
import CountryList from './CountryList';
import AuthModal from './AuthModal';
import { QRCodeSVG } from 'qrcode.react';
import supabase from './supabase';

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [breakpoint]);
  return isMobile;
}

function useCountryData() {
  const [data, setData] = useState(SAMPLE);
  useEffect(() => {
    if (!supabase) return;
    supabase.from('countries').select('*').then(({ data: rows }) => {
      if (rows && rows.length) {
        const published = rows.filter(r => r.is_published);
        if (published.length) {
          const map = { ...SAMPLE };
          published.forEach(r => { map[r.iso2 || r.code] = r; });
          setData(map);
        }
      }
    });
  }, []);
  return data;
}

function SocialIcon({ href, label, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="social-link" aria-label={label}>
      {children}
    </a>
  );
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function SubstackIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
    </svg>
  );
}

const STATUS_COLOR = { legal: '#8bc9a4', partial: '#edc978', restricted: '#e0a66b', banned: '#d45d56' };

function CountrySearch({ data, onSelect }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return Object.entries(data)
      .filter(([code, info]) => info.name?.toLowerCase().includes(q) || code.toLowerCase().includes(q))
      .slice(0, 8)
      .map(([code, info]) => ({ code, ...info }));
  }, [query, data]);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="country-search">
      <input
        type="text"
        placeholder="Search countries..."
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        className="country-search-input"
      />
      {open && results.length > 0 && (
        <div className="country-search-dropdown">
          {results.map((r) => (
            <button
              key={r.code}
              className="country-search-item"
              onClick={() => {
                onSelect({ code: r.code, name: r.name, status: r.status, summary: r.summary, legislation: r.legislation || [], news: r.news || [], cases: r.cases || [] });
                setQuery('');
                setOpen(false);
              }}
            >
              <span>{r.name}</span>
              <span style={{ fontSize: 10, color: STATUS_COLOR[r.status] || 'var(--text-muted)', letterSpacing: '0.06em' }}>
                {(r.status || 'no data').toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const WALLETS = [
  { chain: 'Ethereum / Base / EVM', address: '0xE017003eFC0dffD03ee6a4fb617d397B5F547c5B', color: '#627EEA' },
  { chain: 'Solana', address: '2tb2mbyCjmDeUVaJXTrkHiLPVZjD7VsYhM5QeXQnvBAq', color: '#9945FF' },
];

function SupportModal({ onClose }) {
  const [copied, setCopied] = useState(null);

  const handleCopy = (address, idx) => {
    navigator.clipboard.writeText(address);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="auth-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="auth-modal" style={{ maxWidth: 700, textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: 'var(--accent)', fontFamily: "'Times New Roman', Times, serif", letterSpacing: '0.12em' }}>SUPPORT MY RESEARCH</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18 }}>x</button>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
          DAOcuments is free and independent. If you find it useful, consider supporting the project onchain.
        </p>
        <div className="support-wallets" style={{ display: 'flex', gap: 20 }}>
          {WALLETS.map((w, i) => (
            <div key={i} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, padding: 20, flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: w.color, fontFamily: "'Times New Roman', Times, serif", letterSpacing: '0.08em', marginBottom: 12 }}>
                {w.chain.toUpperCase()}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
                <div style={{ background: '#fff', padding: 10, borderRadius: 8, display: 'inline-block' }}>
                  <QRCodeSVG value={w.address} size={120} fgColor={w.color} />
                </div>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 6,
                padding: '8px 12px',
              }}>
                <span style={{ flex: 1, fontSize: 10, fontFamily: 'monospace', color: 'var(--text-primary)', wordBreak: 'break-all', textAlign: 'left' }}>
                  {w.address}
                </span>
                <button
                  onClick={() => handleCopy(w.address, i)}
                  style={{
                    background: 'none', border: '1px solid var(--border)', borderRadius: 4,
                    padding: '4px 10px', fontSize: 9, color: copied === i ? '#6ab587' : 'var(--accent)',
                    fontFamily: "'Times New Roman', Times, serif", cursor: 'pointer',
                    letterSpacing: '0.06em', flexShrink: 0, transition: 'color 0.2s',
                  }}
                >
                  {copied === i ? 'COPIED' : 'COPY'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function useAuth() {
  const [user, setUser] = useState(undefined); // undefined = loading, null = not logged in
  useEffect(() => {
    if (!supabase) { setUser(null); return; }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) saveNewsletterPref(session.user);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (_event === 'SIGNED_IN' && session?.user) saveNewsletterPref(session.user);
    });
    return () => subscription.unsubscribe();
  }, []);
  return user;
}

function saveNewsletterPref(user) {
  const newsletter = localStorage.getItem('dao_newsletter');
  const email = localStorage.getItem('dao_email');
  if (newsletter !== null && email && supabase) {
    supabase.from('subscribers').upsert(
      { user_id: user.id, email, newsletter_optin: newsletter === '1' },
      { onConflict: 'user_id' }
    ).then(() => {
      localStorage.removeItem('dao_newsletter');
      localStorage.removeItem('dao_email');
    });
  }
}

export default function App() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [panelFullWidth, setPanelFullWidth] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const mapRef = useRef(null);
  const isMobile = useIsMobile();
  const data = useCountryData();
  const user = useAuth();

  const scrollToMap = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    mapRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ width: '100vw', overflowX: 'hidden' }}>

      {showAuth && (
        <AuthModal onSuccess={() => setShowAuth(false)} onClose={() => setShowAuth(false)} />
      )}

      {showSupport && (
        <SupportModal onClose={() => setShowSupport(false)} />
      )}

      {/* ── Section 1: About ── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'var(--bg-primary)',
        padding: '40px 24px 60px',
        position: 'relative',
      }}>
        <div style={{ maxWidth: 900, textAlign: 'center', width: '100%' }}>
          {/* Avatar placeholder */}
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 800, color: '#fff', margin: '0 auto 16px',
          }}>
            D
          </div>

          <div style={{
            fontSize: 10, color: 'var(--text-muted)', fontFamily: "'Times New Roman', Times, serif",
            letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8,
          }}>
            ABOUT THE PROJECT
          </div>

          <h1 className="about-heading" style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 12, color: 'var(--text-primary)' }}>
            Tracking Crypto Regulation<br />Around the World
          </h1>

          <p style={{
            fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7,
            maxWidth: 680, margin: '0 auto 16px',
          }}>
            DAOcuments is a free, independent project mapping the global landscape of cryptocurrency regulation. We track legislation, enforcement actions, and policy shifts across 47 jurisdictions, giving you the full picture of where crypto stands, country by country.
          </p>

          {/* Who it's for */}
          <div className="about-features" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
            maxWidth: 760, margin: '0 auto 16px', textAlign: 'center',
          }}>
            {[
              ['Lawyers & Compliance', 'Navigate cross-border regulatory requirements with sourced legislation and case law.'],
              ['Founders & Investors', 'Evaluate jurisdictions for launching or investing in Web3 projects.'],
              ['Researchers & Policy', 'Track how crypto regulation is evolving globally with verified data.'],
            ].map(([title, desc]) => (
              <div key={title} style={{ padding: '16px 12px' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.7, fontFamily: "'Times New Roman', Times, serif" }}>{desc}</div>
              </div>
            ))}
          </div>

          {/* Explore the Map CTA */}
          <button
            onClick={scrollToMap}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              margin: '0 auto 16px', padding: '12px 32px',
              background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8,
              fontSize: 14, fontWeight: 700, fontFamily: "'Times New Roman', Times, serif",
              letterSpacing: '0.08em', cursor: 'pointer', transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            EXPLORE THE MAP
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M10 4v12M5 11l5 5 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Why trust us */}
          <div style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10,
            padding: '14px 20px', maxWidth: 760, margin: '0 auto 16px', textAlign: 'left',
          }}>
            <div style={{ fontSize: 13, color: 'var(--accent)', fontFamily: "'Times New Roman', Times, serif", letterSpacing: '0.12em', marginBottom: 12 }}>WHY TRUST DAOCUMENTS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'Built by a practicing lawyer with expertise in crypto policy and regulatory research.',
                'Every legislation entry links to official government sources — gazettes, regulatory body publications, and court records.',
                'Community-verified: users can report inaccuracies with source links, and every correction is reviewed.',
              ].map((text, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', marginTop: 6, flexShrink: 0 }} />
                  <span style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <p style={{
            fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7,
            maxWidth: 580, margin: '0 auto 14px',
            fontFamily: "'Times New Roman', Times, serif",
          }}>
            Built by Sapna Singh — lawyer, researcher, builder, and crypto policy nerd.
          </p>

          {/* Social links */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 10 }}>
            <SocialIcon href="https://x.com/AdvSapna_" label="Twitter / X">
              <TwitterIcon />
            </SocialIcon>
            <SocialIcon href="https://www.linkedin.com/in/sapna-singh-a8388a157/" label="LinkedIn">
              <LinkedInIcon />
            </SocialIcon>
            <SocialIcon href="https://daocuments.substack.com/" label="Substack">
              <SubstackIcon />
            </SocialIcon>
          </div>

        </div>

      </section>

      {/* ── Section 2: Map Tracker ── */}
      <section ref={mapRef} style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        <header className="map-section-header" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 28px', height: '56px', borderBottom: '1px solid var(--border)',
          background: 'var(--bg-secondary)', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff' }}>D</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '0.08em' }}>DAOCUMENTS</div>
              <div className="header-logo-subtitle" style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em', fontFamily: "'Times New Roman', Times, serif" }}>Crypto Regulatory Tracker</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <CountrySearch data={data} onSelect={setSelectedCountry} />
            <div className="header-legend" style={{ display: 'flex', gap: 16 }}>
              {[['Legal', '#8bc9a4'], ['Partial', '#edc978'], ['Restricted', '#e0a66b'], ['Banned', '#d45d56']].map(([label, color]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-secondary)', fontFamily: "'Times New Roman', Times, serif" }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </header>
        <div className="map-layout" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {isMobile ? (
            <>
              {selectedCountry ? (
                <CountryPanel country={selectedCountry} onClose={() => setSelectedCountry(null)} />
              ) : (
                <CountryList data={data} onCountrySelect={setSelectedCountry} />
              )}
            </>
          ) : (
            <>
              {!panelFullWidth && (
                <div className="map-container" style={{ flex: 1, overflow: 'hidden', transition: 'flex 0.4s ease' }}>
                  <Map selectedCountry={selectedCountry} onCountrySelect={setSelectedCountry} data={data} />
                </div>
              )}
              <CountryPanel
                country={selectedCountry}
                onClose={() => { setSelectedCountry(null); setPanelFullWidth(false); }}
                fullWidth={panelFullWidth}
                onToggleFullWidth={() => setPanelFullWidth(f => !f)}
              />
            </>
          )}
        </div>

        {/* Auth gate overlay — map visible behind at ~35% opacity */}
        {!user && user !== undefined && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 10,
            background: 'rgba(247, 243, 238, 0.65)',
            backdropFilter: 'blur(2px)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 16, padding: 24,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, fontWeight: 800, color: '#fff',
            }}>D</div>
            <p style={{ fontSize: 15, color: 'var(--text-primary)', textAlign: 'center', maxWidth: 320, lineHeight: 1.6, fontWeight: 600 }}>
              Enter your email to access the crypto regulatory tracker.
            </p>
            <button
              onClick={() => setShowAuth(true)}
              style={{
                padding: '12px 32px', background: 'var(--accent)', color: '#fff',
                border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700,
                fontFamily: "'Times New Roman', Times, serif", letterSpacing: '0.04em',
                cursor: 'pointer',
              }}
            >
              Sign in with Email
            </button>
          </div>
        )}
      </section>

      {/* ── Fixed Footer Bar ── */}
      <footer style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
        padding: '8px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 40,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 18, height: 18, borderRadius: 4, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: '#fff' }}>D</div>
          <span className="footer-brand" style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', color: 'var(--text-primary)' }}>DAOCUMENTS</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="footer-socials" style={{ display: 'flex', gap: 10 }}>
            {[
              ['https://x.com/AdvSapna_', 'X', <TwitterIcon key="tw" />],
              ['https://www.linkedin.com/in/sapna-singh-a8388a157/', 'LinkedIn', <LinkedInIcon key="li" />],
              ['https://daocuments.substack.com/', 'Substack', <SubstackIcon key="ss" />],
            ].map(([href, label, icon]) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <span style={{ width: 14, height: 14, display: 'flex' }}>{icon}</span>
              </a>
            ))}
          </div>
          <button
            onClick={() => setShowSupport(true)}
            className="footer-support-btn"
            style={{
              background: 'none', border: '1px solid var(--accent)', borderRadius: 5,
              padding: '4px 14px', fontSize: 10, fontWeight: 600,
              color: 'var(--accent)', fontFamily: "'Times New Roman', Times, serif",
              letterSpacing: '0.06em', cursor: 'pointer', transition: 'background 0.2s, color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--accent)'; }}
          >
            SUPPORT MY RESEARCH
          </button>
        </div>
      </footer>
    </div>
  );
}
