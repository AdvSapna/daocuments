import React, { useState, useEffect, useRef, useMemo } from 'react';
import Map, { SAMPLE } from './Map';
import CountryPanel from './CountryPanel';
import CountryList from './CountryList';
import AuthModal from './AuthModal';
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

function useAuth() {
  const [user, setUser] = useState(undefined); // undefined = loading, null = not logged in
  useEffect(() => {
    if (!supabase) { setUser(null); return; }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);
  return user;
}

export default function App() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
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
        <AuthModal onSuccess={() => setShowAuth(false)} />
      )}

      {/* ── Section 1: About ── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'var(--bg-primary)',
        padding: '80px 24px',
        position: 'relative',
      }}>
        <div style={{ maxWidth: 640, textAlign: 'center' }}>
          {/* Avatar placeholder */}
          <div style={{
            width: 80, height: 80, borderRadius: '50%', background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, fontWeight: 800, color: '#fff', margin: '0 auto 24px',
          }}>
            D
          </div>

          <div style={{
            fontSize: 10, color: 'var(--text-muted)', fontFamily: "'Times New Roman', Times, serif",
            letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12,
          }}>
            ABOUT THE PROJECT
          </div>

          <h1 className="about-heading" style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 20, color: 'var(--text-primary)' }}>
            Tracking Crypto Regulation<br />Around the World
          </h1>

          <p style={{
            fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8,
            maxWidth: 520, margin: '0 auto 16px',
          }}>
            DAOcuments is a free, independent project mapping the global landscape of cryptocurrency regulation. We track legislation, enforcement actions, and policy shifts across jurisdictions, giving you the full picture of where crypto stands, country by country.
          </p>

          <p style={{
            fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.8,
            maxWidth: 480, margin: '0 auto 40px',
            fontFamily: "'Times New Roman', Times, serif",
          }}>
            Built by Sapna Singh — lawyer, researcher, builder, and crypto policy nerd.
          </p>

          {/* Social links */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 48 }}>
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

        {/* Scroll indicator */}
        <button
          className="scroll-cta"
          onClick={scrollToMap}
          style={{
            position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          }}
        >
          <span className="scroll-cta-text" style={{ fontSize: 10, fontFamily: "'Times New Roman', Times, serif", color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
            EXPLORE THE MAP
          </span>
          <svg className="scroll-cta-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ animation: 'fadeInUp 1.5s ease infinite' }}>
            <path d="M10 4v12M5 11l5 5 5-5" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
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
              <div className="map-container" style={{ flex: 1, overflow: 'hidden', transition: 'flex 0.4s ease' }}>
                <Map selectedCountry={selectedCountry} onCountrySelect={setSelectedCountry} data={data} />
              </div>
              <CountryPanel country={selectedCountry} onClose={() => setSelectedCountry(null)} />
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

      {/* ── Section 3: Footer ── */}
      <footer style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
        padding: '48px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 24, height: 24, borderRadius: 5, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff' }}>D</div>
          <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.08em' }}>DAOCUMENTS</span>
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
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

        <div style={{
          fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Times New Roman', Times, serif",
          letterSpacing: '0.06em', textAlign: 'center', lineHeight: 1.8,
        }}>
          Tracking crypto regulation worldwide.
        </div>
      </footer>
    </div>
  );
}
