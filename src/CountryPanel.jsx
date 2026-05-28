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

const CLARITY_META = {
  clear:      { label:'Clear',      color:'#6ab587', bg:'rgba(139,201,164,0.15)' },
  partial:    { label:'Partial',    color:'#c9a84e', bg:'rgba(237,201,120,0.15)' },
  unclear:    { label:'Unclear',    color:'#9e9790', bg:'rgba(176,168,158,0.18)' },
  prohibited: { label:'Prohibited', color:'#d45d56', bg:'rgba(212,93,86,0.15)' },
};

function getClarityMeta(c) {
  return CLARITY_META[c] || CLARITY_META.unclear;
}

const ANALYST_CONTACT = {
  name: 'team',
  email: 'advsapna06@gmail.com',
};

function panelStyle(expanded, fullWidth) {
  return {
    width: fullWidth ? '100%' : expanded ? 'var(--panel-width-expanded)' : 'var(--panel-width)',
    minWidth: fullWidth ? '100%' : expanded ? 'var(--panel-width-expanded)' : 'var(--panel-width)',
    height: '100%',
    borderLeft: fullWidth ? 'none' : '1px solid var(--border)',
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

function UAEFrameworkDiagram() {
  return (
    <svg
      viewBox="0 0 700 360"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: 'auto', display: 'block', fontFamily: "'Times New Roman', Times, serif" }}
      role="img"
      aria-label="UAE multi-regulator routing diagram"
    >
      {/* Federal band */}
      <rect x="10" y="10" width="680" height="100" rx="8" fill="var(--bg-primary)" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="25" y="32" fontSize="11" fill="var(--accent)" letterSpacing="2">FEDERAL — UAE-WIDE</text>

      <rect x="30" y="45" width="320" height="55" rx="6" fill="var(--bg-secondary)" stroke="var(--accent)" strokeWidth="1" />
      <text x="45" y="68" fontSize="16" fontWeight="700" fill="var(--text-primary)">CMA</text>
      <text x="45" y="86" fontSize="10" fill="var(--text-secondary)">Capital Markets Authority — tokenised securities & VASP</text>

      <rect x="360" y="45" width="320" height="55" rx="6" fill="var(--bg-secondary)" stroke="var(--accent)" strokeWidth="1" />
      <text x="375" y="68" fontSize="16" fontWeight="700" fill="var(--text-primary)">CBUAE</text>
      <text x="375" y="86" fontSize="10" fill="var(--text-secondary)">Central Bank — stablecoins, payment rails, DeFi</text>

      {/* Dubai column */}
      <rect x="10" y="130" width="450" height="220" rx="8" fill="var(--bg-primary)" stroke="var(--border)" strokeWidth="1" />
      <text x="25" y="152" fontSize="11" fill="var(--text-secondary)" letterSpacing="2">DUBAI</text>

      <rect x="25" y="165" width="420" height="80" rx="6" fill="var(--bg-secondary)" stroke="var(--accent)" strokeWidth="1" />
      <text x="40" y="190" fontSize="18" fontWeight="700" fill="var(--text-primary)">VARA</text>
      <text x="40" y="210" fontSize="11" fill="var(--text-secondary)">Virtual Assets Regulatory Authority</text>
      <text x="40" y="227" fontSize="10" fill="var(--text-muted)" fontStyle="italic">Dubai mainland (excl. DIFC) — 8 activity categories</text>

      <rect x="25" y="260" width="420" height="80" rx="6" fill="var(--bg-secondary)" stroke="var(--accent)" strokeWidth="1" />
      <text x="40" y="285" fontSize="18" fontWeight="700" fill="var(--text-primary)">DFSA</text>
      <text x="40" y="305" fontSize="11" fill="var(--text-secondary)">Dubai Financial Services Authority</text>
      <text x="40" y="322" fontSize="10" fill="var(--text-muted)" fontStyle="italic">DIFC zone — Crypto Token Regime, common-law courts</text>

      {/* Abu Dhabi column */}
      <rect x="470" y="130" width="220" height="220" rx="8" fill="var(--bg-primary)" stroke="var(--border)" strokeWidth="1" />
      <text x="485" y="152" fontSize="11" fill="var(--text-secondary)" letterSpacing="2">ABU DHABI</text>

      <rect x="485" y="165" width="190" height="175" rx="6" fill="var(--bg-secondary)" stroke="var(--accent)" strokeWidth="1" />
      <text x="500" y="190" fontSize="18" fontWeight="700" fill="var(--text-primary)">FSRA</text>
      <text x="500" y="210" fontSize="11" fill="var(--text-secondary)">Financial Services</text>
      <text x="500" y="225" fontSize="11" fill="var(--text-secondary)">Regulatory Authority</text>
      <text x="500" y="248" fontSize="10" fill="var(--text-muted)" fontStyle="italic">ADGM zone</text>
      <text x="500" y="275" fontSize="10" fill="var(--text-secondary)">• Digital Asset Framework</text>
      <text x="500" y="293" fontSize="10" fill="var(--text-secondary)">• DLT Foundations Regulations</text>
      <text x="500" y="311" fontSize="10" fill="var(--text-secondary)">• World's first DAO regime</text>
    </svg>
  );
}

function EUMiCAFrameworkDiagram() {
  return (
    <svg
      viewBox="0 0 700 380"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: 'auto', display: 'block', fontFamily: "'Times New Roman', Times, serif" }}
      role="img"
      aria-label="EU MiCA regulator routing diagram"
    >
      {/* Supranational band */}
      <rect x="10" y="10" width="680" height="100" rx="8" fill="var(--bg-primary)" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="25" y="32" fontSize="11" fill="var(--accent)" letterSpacing="2">SUPRANATIONAL — EU-WIDE</text>

      <rect x="25" y="45" width="209" height="55" rx="6" fill="var(--bg-secondary)" stroke="var(--accent)" strokeWidth="1" />
      <text x="40" y="68" fontSize="16" fontWeight="700" fill="var(--text-primary)">ESMA</text>
      <text x="40" y="86" fontSize="10" fill="var(--text-secondary)">RTS/ITS, significant CASPs & ARTs</text>

      <rect x="246" y="45" width="209" height="55" rx="6" fill="var(--bg-secondary)" stroke="var(--accent)" strokeWidth="1" />
      <text x="261" y="68" fontSize="16" fontWeight="700" fill="var(--text-primary)">EBA</text>
      <text x="261" y="86" fontSize="10" fill="var(--text-secondary)">Significant EMTs/ARTs, prudential</text>

      <rect x="467" y="45" width="209" height="55" rx="6" fill="var(--bg-secondary)" stroke="var(--accent)" strokeWidth="1" />
      <text x="482" y="68" fontSize="16" fontWeight="700" fill="var(--text-primary)">ECB</text>
      <text x="482" y="86" fontSize="10" fill="var(--text-secondary)">Consultation on euro-area stables</text>

      {/* National band */}
      <rect x="10" y="130" width="680" height="90" rx="8" fill="var(--bg-primary)" stroke="var(--border)" strokeWidth="1" />
      <text x="25" y="152" fontSize="11" fill="var(--text-secondary)" letterSpacing="2">NATIONAL — 27 MEMBER STATE NCAs</text>

      <rect x="25" y="165" width="650" height="48" rx="6" fill="var(--bg-secondary)" stroke="var(--accent)" strokeWidth="1" />
      <text x="40" y="187" fontSize="13" fontWeight="700" fill="var(--text-primary)">National Competent Authorities</text>
      <text x="40" y="204" fontSize="10" fill="var(--text-secondary)">BaFin (DE) · AMF (FR) · CSSF (LU) · AFM (NL) · CONSOB (IT) · CNMV (ES) · CBoI (IE) · … 27 total</text>

      {/* Parallel regime band */}
      <rect x="10" y="240" width="680" height="120" rx="8" fill="var(--bg-primary)" stroke="var(--text-muted)" strokeWidth="1.5" strokeDasharray="2 3" />
      <text x="25" y="262" fontSize="11" fill="var(--text-secondary)" letterSpacing="2">PARALLEL REGIME — TOKENISED FINANCIAL INSTRUMENTS (EXCLUDED FROM MiCA)</text>

      <rect x="25" y="275" width="155" height="70" rx="6" fill="var(--bg-secondary)" stroke="var(--text-muted)" strokeWidth="1" />
      <text x="40" y="298" fontSize="13" fontWeight="700" fill="var(--text-primary)">MiFID II</text>
      <text x="40" y="316" fontSize="9" fill="var(--text-secondary)">Securities,</text>
      <text x="40" y="328" fontSize="9" fill="var(--text-secondary)">derivatives,</text>
      <text x="40" y="340" fontSize="9" fill="var(--text-secondary)">structured products</text>

      <rect x="190" y="275" width="155" height="70" rx="6" fill="var(--bg-secondary)" stroke="var(--text-muted)" strokeWidth="1" />
      <text x="205" y="298" fontSize="13" fontWeight="700" fill="var(--text-primary)">Prospectus Reg</text>
      <text x="205" y="316" fontSize="9" fill="var(--text-secondary)">Public offering</text>
      <text x="205" y="328" fontSize="9" fill="var(--text-secondary)">disclosure for</text>
      <text x="205" y="340" fontSize="9" fill="var(--text-secondary)">tokenised securities</text>

      <rect x="355" y="275" width="155" height="70" rx="6" fill="var(--bg-secondary)" stroke="var(--text-muted)" strokeWidth="1" />
      <text x="370" y="298" fontSize="13" fontWeight="700" fill="var(--text-primary)">CSDR</text>
      <text x="370" y="316" fontSize="9" fill="var(--text-secondary)">Central securities</text>
      <text x="370" y="328" fontSize="9" fill="var(--text-secondary)">depositories &</text>
      <text x="370" y="340" fontSize="9" fill="var(--text-secondary)">settlement</text>

      <rect x="520" y="275" width="155" height="70" rx="6" fill="var(--bg-secondary)" stroke="var(--text-muted)" strokeWidth="1" />
      <text x="535" y="298" fontSize="13" fontWeight="700" fill="var(--text-primary)">DLT Pilot Regime</text>
      <text x="535" y="316" fontSize="9" fill="var(--text-secondary)">Sandbox: DLT</text>
      <text x="535" y="328" fontSize="9" fill="var(--text-secondary)">trading/settlement</text>
      <text x="535" y="340" fontSize="9" fill="var(--text-secondary)">infrastructures</text>
    </svg>
  );
}

function IndiaFrameworkDiagram() {
  return (
    <svg
      viewBox="0 0 700 380"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: 'auto', display: 'block', fontFamily: "'Times New Roman', Times, serif" }}
      role="img"
      aria-label="India regulator patchwork diagram"
    >
      {/* Markets & Banking column */}
      <rect x="10" y="10" width="250" height="290" rx="8" fill="var(--bg-primary)" stroke="var(--border)" strokeWidth="1" />
      <text x="25" y="32" fontSize="11" fill="var(--text-secondary)" letterSpacing="2">MARKETS & BANKING</text>

      <rect x="25" y="50" width="220" height="115" rx="6" fill="var(--bg-secondary)" stroke="var(--accent)" strokeWidth="1" />
      <text x="40" y="75" fontSize="16" fontWeight="700" fill="var(--text-primary)">RBI</text>
      <text x="40" y="93" fontSize="11" fill="var(--text-secondary)">Reserve Bank of India</text>
      <text x="40" y="112" fontSize="10" fill="var(--text-muted)" fontStyle="italic">Central bank, banking,</text>
      <text x="40" y="126" fontSize="10" fill="var(--text-muted)" fontStyle="italic">Digital Rupee (e₹) CBDC,</text>
      <text x="40" y="140" fontSize="10" fill="var(--text-muted)" fontStyle="italic">bank-crypto restrictions</text>

      <rect x="25" y="175" width="220" height="115" rx="6" fill="var(--bg-secondary)" stroke="var(--accent)" strokeWidth="1" />
      <text x="40" y="200" fontSize="16" fontWeight="700" fill="var(--text-primary)">SEBI</text>
      <text x="40" y="218" fontSize="11" fill="var(--text-secondary)">Securities & Exchange</text>
      <text x="40" y="232" fontSize="11" fill="var(--text-secondary)">Board of India</text>
      <text x="40" y="252" fontSize="10" fill="var(--text-muted)" fontStyle="italic">Capital markets, MFs, AIFs,</text>
      <text x="40" y="266" fontSize="10" fill="var(--text-muted)" fontStyle="italic">monitoring "security-like"</text>
      <text x="40" y="280" fontSize="10" fill="var(--text-muted)" fontStyle="italic">tokens (Apr 2025)</text>

      {/* AML & Tax column */}
      <rect x="272" y="10" width="240" height="290" rx="8" fill="var(--bg-primary)" stroke="var(--border)" strokeWidth="1" />
      <text x="287" y="32" fontSize="11" fill="var(--text-secondary)" letterSpacing="2">AML & TAX</text>

      <rect x="287" y="50" width="210" height="75" rx="6" fill="var(--bg-secondary)" stroke="var(--accent)" strokeWidth="1" />
      <text x="302" y="73" fontSize="14" fontWeight="700" fill="var(--text-primary)">FIU-IND</text>
      <text x="302" y="91" fontSize="10" fill="var(--text-secondary)">Financial Intelligence Unit</text>
      <text x="302" y="110" fontSize="10" fill="var(--text-muted)" fontStyle="italic">PMLA AML/KYC, VASP registry</text>

      <rect x="287" y="135" width="210" height="75" rx="6" fill="var(--bg-secondary)" stroke="var(--accent)" strokeWidth="1" />
      <text x="302" y="158" fontSize="14" fontWeight="700" fill="var(--text-primary)">Income Tax / CBDT</text>
      <text x="302" y="176" fontSize="10" fill="var(--text-secondary)">Sections 115BBH + 194S</text>
      <text x="302" y="195" fontSize="10" fill="var(--text-muted)" fontStyle="italic">30% VDA tax + 1% TDS</text>

      <rect x="287" y="220" width="210" height="75" rx="6" fill="var(--bg-secondary)" stroke="var(--accent)" strokeWidth="1" />
      <text x="302" y="243" fontSize="14" fontWeight="700" fill="var(--text-primary)">CBIC / GST Council</text>
      <text x="302" y="261" fontSize="10" fill="var(--text-secondary)">Indirect taxation</text>
      <text x="302" y="280" fontSize="10" fill="var(--text-muted)" fontStyle="italic">18% GST on service fees</text>

      {/* Sandbox column */}
      <rect x="524" y="10" width="166" height="290" rx="8" fill="var(--bg-primary)" stroke="var(--border)" strokeWidth="1" />
      <text x="539" y="32" fontSize="11" fill="var(--text-secondary)" letterSpacing="2">SANDBOX</text>

      <rect x="539" y="50" width="136" height="240" rx="6" fill="var(--bg-secondary)" stroke="var(--accent)" strokeWidth="1" />
      <text x="554" y="80" fontSize="16" fontWeight="700" fill="var(--text-primary)">IFSCA</text>
      <text x="554" y="100" fontSize="10" fill="var(--text-secondary)">International</text>
      <text x="554" y="114" fontSize="10" fill="var(--text-secondary)">Financial Services</text>
      <text x="554" y="128" fontSize="10" fill="var(--text-secondary)">Centres Authority</text>
      <text x="554" y="158" fontSize="12" fontWeight="700" fill="var(--accent)">GIFT City</text>
      <text x="554" y="183" fontSize="10" fill="var(--text-muted)" fontStyle="italic">Sandbox regime</text>
      <text x="554" y="197" fontSize="10" fill="var(--text-muted)" fontStyle="italic">for tokenisation</text>
      <text x="554" y="211" fontSize="10" fill="var(--text-muted)" fontStyle="italic">pilots</text>
      <text x="554" y="240" fontSize="9" fill="var(--text-secondary)">Only structured</text>
      <text x="554" y="253" fontSize="9" fill="var(--text-secondary)">RWA pathway</text>
      <text x="554" y="266" fontSize="9" fill="var(--text-secondary)">from India</text>

      {/* Policy band */}
      <rect x="10" y="315" width="680" height="55" rx="8" fill="var(--bg-primary)" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="25" y="338" fontSize="11" fill="var(--accent)" letterSpacing="2">POLICY LAYER</text>
      <text x="25" y="358" fontSize="11" fontWeight="700" fill="var(--text-primary)">MoF — Ministry of Finance</text>
      <text x="225" y="358" fontSize="10" fill="var(--text-secondary)" fontStyle="italic">Finance Acts, overall crypto policy, inter-regulator coordination</text>
    </svg>
  );
}

function USFrameworkDiagram() {
  return (
    <svg
      viewBox="0 0 700 540"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: 'auto', display: 'block', fontFamily: "'Times New Roman', Times, serif" }}
      role="img"
      aria-label="United States federal and state crypto regulator diagram"
    >
      {/* Federal: Markets & Derivatives */}
      <rect x="10" y="10" width="680" height="100" rx="8" fill="var(--bg-primary)" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="25" y="32" fontSize="11" fill="var(--accent)" letterSpacing="2">FEDERAL — MARKETS & DERIVATIVES</text>

      <rect x="25" y="45" width="320" height="55" rx="6" fill="var(--bg-secondary)" stroke="var(--accent)" strokeWidth="1" />
      <text x="40" y="68" fontSize="16" fontWeight="700" fill="var(--text-primary)">SEC</text>
      <text x="40" y="86" fontSize="10" fill="var(--text-secondary)">Securities, investment contracts (Howey), broker-dealer</text>

      <rect x="365" y="45" width="320" height="55" rx="6" fill="var(--bg-secondary)" stroke="var(--accent)" strokeWidth="1" />
      <text x="380" y="68" fontSize="16" fontWeight="700" fill="var(--text-primary)">CFTC</text>
      <text x="380" y="86" fontSize="10" fill="var(--text-secondary)">Digital commodities, derivatives, swaps</text>

      {/* Federal: AML / Sanctions / Tax */}
      <rect x="10" y="130" width="680" height="100" rx="8" fill="var(--bg-primary)" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="25" y="152" fontSize="11" fill="var(--accent)" letterSpacing="2">FEDERAL — AML / SANCTIONS / TAX</text>

      <rect x="25" y="165" width="208" height="55" rx="6" fill="var(--bg-secondary)" stroke="var(--accent)" strokeWidth="1" />
      <text x="40" y="188" fontSize="14" fontWeight="700" fill="var(--text-primary)">FinCEN</text>
      <text x="40" y="206" fontSize="10" fill="var(--text-secondary)">AML/MSB, Travel Rule</text>

      <rect x="245" y="165" width="208" height="55" rx="6" fill="var(--bg-secondary)" stroke="var(--accent)" strokeWidth="1" />
      <text x="260" y="188" fontSize="14" fontWeight="700" fill="var(--text-primary)">OFAC</text>
      <text x="260" y="206" fontSize="10" fill="var(--text-secondary)">Sanctions enforcement</text>

      <rect x="465" y="165" width="208" height="55" rx="6" fill="var(--bg-secondary)" stroke="var(--accent)" strokeWidth="1" />
      <text x="480" y="188" fontSize="14" fontWeight="700" fill="var(--text-primary)">IRS</text>
      <text x="480" y="206" fontSize="10" fill="var(--text-secondary)">Tax, broker reporting</text>

      {/* Federal: Banking & Payments */}
      <rect x="10" y="250" width="680" height="100" rx="8" fill="var(--bg-primary)" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="25" y="272" fontSize="11" fill="var(--accent)" letterSpacing="2">FEDERAL — BANKING & PAYMENTS (POST-GENIUS)</text>

      <rect x="25" y="285" width="208" height="55" rx="6" fill="var(--bg-secondary)" stroke="var(--accent)" strokeWidth="1" />
      <text x="40" y="308" fontSize="14" fontWeight="700" fill="var(--text-primary)">OCC</text>
      <text x="40" y="326" fontSize="10" fill="var(--text-secondary)">National bank crypto custody</text>

      <rect x="245" y="285" width="208" height="55" rx="6" fill="var(--bg-secondary)" stroke="var(--accent)" strokeWidth="1" />
      <text x="260" y="308" fontSize="14" fontWeight="700" fill="var(--text-primary)">Federal Reserve</text>
      <text x="260" y="326" fontSize="10" fill="var(--text-secondary)">Bank supervision, payments</text>

      <rect x="465" y="285" width="208" height="55" rx="6" fill="var(--bg-secondary)" stroke="var(--accent)" strokeWidth="1" />
      <text x="480" y="308" fontSize="14" fontWeight="700" fill="var(--text-primary)">FDIC</text>
      <text x="480" y="326" fontSize="10" fill="var(--text-secondary)">Stablecoin reserve banks</text>

      {/* State Layer */}
      <rect x="10" y="370" width="680" height="140" rx="8" fill="var(--bg-primary)" stroke="var(--border)" strokeWidth="1" />
      <text x="25" y="392" fontSize="11" fill="var(--text-secondary)" letterSpacing="2">STATE LAYER</text>

      <rect x="25" y="405" width="210" height="95" rx="6" fill="var(--bg-secondary)" stroke="var(--accent)" strokeWidth="1" />
      <text x="40" y="428" fontSize="14" fontWeight="700" fill="var(--text-primary)">NYDFS</text>
      <text x="40" y="446" fontSize="10" fill="var(--text-secondary)">BitLicense</text>
      <text x="40" y="465" fontSize="10" fill="var(--text-muted)" fontStyle="italic">Toughest state regime;</text>
      <text x="40" y="479" fontSize="10" fill="var(--text-muted)" fontStyle="italic">required for any</text>
      <text x="40" y="493" fontSize="10" fill="var(--text-muted)" fontStyle="italic">NY-facing service</text>

      <rect x="245" y="405" width="210" height="95" rx="6" fill="var(--bg-secondary)" stroke="var(--accent)" strokeWidth="1" />
      <text x="260" y="428" fontSize="14" fontWeight="700" fill="var(--text-primary)">Wyoming</text>
      <text x="260" y="446" fontSize="10" fill="var(--text-secondary)">DAO LLC / DLT SPDIs</text>
      <text x="260" y="465" fontSize="10" fill="var(--text-muted)" fontStyle="italic">Crypto-friendly</text>
      <text x="260" y="479" fontSize="10" fill="var(--text-muted)" fontStyle="italic">infrastructure for</text>
      <text x="260" y="493" fontSize="10" fill="var(--text-muted)" fontStyle="italic">SPVs and DAOs</text>

      <rect x="465" y="405" width="210" height="95" rx="6" fill="var(--bg-secondary)" stroke="var(--accent)" strokeWidth="1" />
      <text x="480" y="428" fontSize="14" fontWeight="700" fill="var(--text-primary)">49+ State MTLs</text>
      <text x="480" y="446" fontSize="10" fill="var(--text-secondary)">Money Transmitter Licences</text>
      <text x="480" y="465" fontSize="10" fill="var(--text-muted)" fontStyle="italic">CA, TX, FL, etc.</text>
      <text x="480" y="479" fontSize="10" fill="var(--text-muted)" fontStyle="italic">Per-state licensing;</text>
      <text x="480" y="493" fontSize="10" fill="var(--text-muted)" fontStyle="italic">Montana excepted</text>
    </svg>
  );
}

function FrameworkDiagram({ countryCode }) {
  if (countryCode === 'AE') return <UAEFrameworkDiagram />;
  if (countryCode === 'EU') return <EUMiCAFrameworkDiagram />;
  if (countryCode === 'IN') return <IndiaFrameworkDiagram />;
  if (countryCode === 'US') return <USFrameworkDiagram />;
  return null;
}

function AnalystCTA({ countryName, hasAnalysis }) {
  const message = hasAnalysis
    ? `Need deeper analysis on ${countryName}? Contact ${ANALYST_CONTACT.name} →`
    : `Request a regulatory analysis for ${countryName} →`;
  const subject = hasAnalysis
    ? `Deeper analysis request: ${countryName}`
    : `Analysis request: ${countryName}`;
  return (
    <a
      href={`mailto:${ANALYST_CONTACT.email}?subject=${encodeURIComponent(subject)}`}
      style={{
        display: 'block',
        background: 'rgba(124,175,196,0.08)',
        border: '1px dashed var(--accent)',
        borderRadius: 8,
        padding: '12px 14px',
        fontSize: 12,
        color: 'var(--accent)',
        textDecoration: 'none',
        fontFamily: "'Times New Roman', Times, serif",
        letterSpacing: '0.04em',
        textAlign: 'center',
        transition: 'background 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,175,196,0.15)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(124,175,196,0.08)'; }}
    >
      {message}
    </a>
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

export default function CountryPanel({ country, onClose, fullWidth, onToggleFullWidth, onSelectCountry }) {
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
      <div className="panel-empty" style={{ ...panelStyle(false, false), padding: '32px 24px', justifyContent: 'space-between' }}>
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
    <div className="panel-expanded" style={panelStyle(true, fullWidth)}>
      {/* Header */}
      <div style={{ padding: '18px 24px 14px', borderBottom: '1px solid ' + meta.color + '44', background: meta.bg, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 11, color: meta.color, fontFamily: "'Times New Roman', Times, serif", letterSpacing: '0.12em', marginBottom: 4, opacity: 0.8 }}>{country.code}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>{country.name}</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {onToggleFullWidth && (
            <button
              onClick={onToggleFullWidth}
              title={fullWidth ? 'Show map' : 'Expand panel'}
              style={{ background: 'none', border: '1px solid ' + meta.color + '44', color: meta.color, borderRadius: 4, width: 28, height: 28, cursor: 'pointer', fontSize: 12, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {fullWidth ? '⇥' : '⇤'}
            </button>
          )}
          <button onClick={onClose} style={{ background: 'none', border: '1px solid ' + meta.color + '44', color: meta.color, borderRadius: 4, width: 28, height: 28, cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>×</button>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 28px' }}>

        {/* EU MiCA Banner */}
        {country.euMember && (
          <div
            style={{
              background: 'rgba(0, 51, 153, 0.06)', border: '1px solid rgba(0, 51, 153, 0.2)',
              borderRadius: 8, padding: '12px 14px', marginBottom: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>🇪🇺</span>
              <span style={{ fontSize: 12, color: '#003399', fontWeight: 600 }}>This country operates under EU MiCA</span>
            </div>
            {onSelectCountry && (
              <button
                onClick={() => {
                  const eu = require('./Map').SAMPLE.EU;
                  if (eu) onSelectCountry({ code: 'EU', name: eu.name, status: eu.status, summary: eu.summary, legislation: eu.legislation || [], news: eu.news || [], cases: eu.cases || [], analysis: eu.analysis || [], framework: eu.framework || null, euMember: false });
                }}
                style={{
                  background: 'none', border: '1px solid rgba(0, 51, 153, 0.3)', borderRadius: 5,
                  padding: '4px 10px', fontSize: 10, color: '#003399', cursor: 'pointer',
                  fontFamily: "'Times New Roman', Times, serif", letterSpacing: '0.06em', flexShrink: 0,
                }}
              >
                VIEW MiCA FRAMEWORK
              </button>
            )}
          </div>
        )}

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

        {/* Framework — regulator routing & jurisdictional map */}
        {country.framework && (
          <AnimatedSection delay={0.04} style={{ marginBottom: 24 }}>
            <SectionHeader>Framework</SectionHeader>
            <Card>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{country.framework.title}</div>
              {country.framework.intro && (
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7, margin: '0 0 14px' }}>{country.framework.intro}</p>
              )}
              <FrameworkDiagram countryCode={country.code} />
              {country.framework.regulators && country.framework.regulators.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
                  {country.framework.regulators.map((r, i) => (
                    <div key={i} style={{ padding: '10px 12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{r.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{r.fullName}</div>
                        <div style={{ fontSize: 9, color: 'var(--accent)', fontFamily: "'Times New Roman', Times, serif", letterSpacing: '0.08em', textTransform: 'uppercase', marginLeft: 'auto' }}>{r.scope}</div>
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{r.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </AnimatedSection>
        )}

        {/* Analysis — activity-level breakdowns */}
        <AnimatedSection delay={0.05} style={{ marginBottom: 24 }}>
          <SectionHeader>Analysis</SectionHeader>
          {country.analysis && country.analysis.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {country.analysis.map((item, i) => {
                const cm = getClarityMeta(item.clarity);
                return (
                  <Card key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{item.activity}</div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 9px', borderRadius: 12, background: cm.bg, border: '1px solid ' + cm.color + '44', flexShrink: 0 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: cm.color }} />
                        <span style={{ fontSize: 9, fontWeight: 700, color: cm.color, fontFamily: "'Times New Roman', Times, serif", letterSpacing: '0.08em' }}>{cm.label.toUpperCase()}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{item.body}</p>
                  </Card>
                );
              })}
              <AnalystCTA countryName={country.name} hasAnalysis={true} />
            </div>
          ) : (
            <AnalystCTA countryName={country.name} hasAnalysis={false} />
          )}
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
