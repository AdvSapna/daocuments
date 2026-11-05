import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

// Simplified, self-hosted copy of datasets/geo-countries. Rebuild with
// scripts/simplify-map.mjs.
const GEO_URL = '/countries.geojson';


const COLOR = { legal:'#8bc9a4', partial:'#edc978', restricted:'#e0a66b', banned:'#d45d56', default:'#d4cdc4' };

function getColor(status) {
  if (!status) return COLOR.default;
  const s = status.toLowerCase();
  if (s === 'legal' || s.includes('friend')) return COLOR.legal;
  if (s === 'partial' || s.includes('moderate') || s.includes('neutral')) return COLOR.partial;
  if (s === 'restricted') return COLOR.restricted;
  if (s === 'banned' || s.includes('ban') || s.includes('illegal')) return COLOR.banned;
  return COLOR.default;
}

const NAME_TO_CODE = { France:'FR', Norway:'NO', 'Northern Cyprus':'CY', Kosovo:'XK', Somaliland:'SO' };
const CODE_OVERRIDES = { 'CN-TW':'TW' };

function getCode(props) {
  let code = props['ISO3166-1-Alpha-2'] || props.ISO_A2 || props.iso_a2 || '';
  if (code === '-99' || code === '') {
    const name = props.name || props.ADMIN || props.NAME || '';
    code = NAME_TO_CODE[name] || '';
  }
  return CODE_OVERRIDES[code] || code;
}

function getName(props) {
  return props.name || props.ADMIN || props.NAME || '';
}

export default function Map({ selectedCountry, onCountrySelect, data }) {
  const [tooltip, setTooltip] = useState({ visible:false, x:0, y:0, name:'', status:'' });
  const [position, setPosition] = useState({ coordinates:[0, 20], zoom:1.2 });

  return (
    <div style={{ width:'100%', height:'100%', background:'var(--bg-primary)', position:'relative' }}>
      <ComposableMap
        projection="geoMercator"
        style={{ width:'100%', height:'100%' }}
        projectionConfig={{ scale: 140 }}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={setPosition}
          minZoom={0.8}
          maxZoom={8}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) => geographies.map(geo => {
              const code = getCode(geo.properties);
              const info = data[code];
              const isSelected = selectedCountry && selectedCountry.code === code;
              const statusColor = getColor(info && info.status);
              const fill = isSelected ? statusColor : statusColor;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => onCountrySelect({
                    code,
                    name: (info && info.name) || getName(geo.properties),
                    status: (info && info.status) || null,
                    summary: (info && info.summary) || null,
                    legislation: (info && info.legislation) || [],
                    news: (info && info.news) || [],
                    cases: (info && info.cases) || [],
                    analysis: (info && info.analysis) || [],
                    framework: (info && info.framework) || null,
                    euMember: (info && info.euMember) || false,
                  })}
                  onMouseEnter={(evt) => setTooltip({
                    visible: true,
                    x: evt.clientX + 12,
                    y: evt.clientY - 36,
                    name: (info && info.name) || getName(geo.properties),
                    status: (info && info.status) || 'No data',
                  })}
                  onMouseMove={(evt) => setTooltip(t => ({ ...t, x: evt.clientX + 12, y: evt.clientY - 36 }))}
                  onMouseLeave={() => setTooltip(t => ({ ...t, visible: false }))}
                  // react-simple-maps 5 dropped the { default, hover, pressed } style
                  // object. Base colors are SVG attributes so the :hover rule for
                  // .rsm-geography in index.css can override them.
                  fill={fill}
                  stroke={isSelected ? '#3a3530' : '#e5ddd3'}
                  strokeWidth={isSelected ? 1.2 : 0.4}
                />
              );
            })}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {tooltip.visible && (
        <div style={{
          position:'absolute', left:tooltip.x, top:tooltip.y,
          pointerEvents:'none', background:'#fff',
          border:'1px solid #e5ddd3', borderRadius:6, padding:'8px 12px',
          fontSize:12, fontFamily:"'Times New Roman', Times, serif", color:'#3a3530',
          boxShadow:'0 2px 8px rgba(0,0,0,0.08)',
          whiteSpace:'nowrap', zIndex:100,
        }}>
          {tooltip.name}
          <span style={{ marginLeft:8, color:getColor(tooltip.status), fontSize:10 }}>
            {tooltip.status}
          </span>
        </div>
      )}

      <div style={{
        position:'absolute', bottom:16, left:16,
        fontSize:10, fontFamily:"'Times New Roman', Times, serif",
        color:'#b0a89e', letterSpacing:'0.08em',
      }}>
        SCROLL TO ZOOM · DRAG TO PAN · CLICK COUNTRY
      </div>
    </div>
  );
}