import React, { useState } from 'react';
import Map from './Map';
import CountryPanel from './CountryPanel';

export default function App() {
  const [selectedCountry, setSelectedCountry] = useState(null);

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', width:'100vw', overflow:'hidden', background:'var(--bg-primary)' }}>
      <header style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', height:'56px', borderBottom:'1px solid var(--border)', background:'var(--bg-secondary)', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:28, height:28, borderRadius:6, background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, color:'#fff' }}>D</div>
          <div>
            <div style={{ fontSize:16, fontWeight:800, letterSpacing:'0.08em' }}>DAOCUMENTS</div>
            <div style={{ fontSize:10, color:'var(--text-muted)', letterSpacing:'0.08em', fontFamily:'Space Mono, monospace' }}>Crypto Regulatory Tracker</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:16 }}>
          {[['Legal','#8bc9a4'],['Partial','#edc978'],['Restricted','#e8948e']].map(([label, color]) => (
            <div key={label} style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'var(--text-secondary)', fontFamily:'Space Mono, monospace' }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:color }} />
              {label}
            </div>
          ))}
        </div>
      </header>
      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
        <div style={{ flex:1, overflow:'hidden', transition:'flex 0.4s ease' }}>
          <Map selectedCountry={selectedCountry} onCountrySelect={setSelectedCountry} />
        </div>
        <CountryPanel country={selectedCountry} onClose={() => setSelectedCountry(null)} />
      </div>
    </div>
  );
}