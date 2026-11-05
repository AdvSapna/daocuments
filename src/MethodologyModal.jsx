import React from 'react';
import { STATUS_RUBRIC, METHODOLOGY_NOTE } from './methodology';

const COLORS = { legal: '#8bc9a4', partial: '#edc978', restricted: '#e0a66b', banned: '#d45d56' };

export default function MethodologyModal({ onClose }) {
  return (
    <div className="auth-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="auth-modal" role="dialog" aria-labelledby="methodology-title" style={{ maxWidth: 520 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h2 id="methodology-title" className="auth-title" style={{ marginTop: 0 }}>How statuses are set</h2>
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 20, padding: 0, lineHeight: 1 }}>×</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '8px 0 16px', textAlign: 'left' }}>
          {STATUS_RUBRIC.map(r => (
            <div key={r.status} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[r.status], marginTop: 5, flexShrink: 0 }} />
              <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>{r.label}.</strong> {r.rule}
              </div>
            </div>
          ))}
        </div>
        <p className="auth-footer-text" style={{ textAlign: 'left' }}>{METHODOLOGY_NOTE}</p>
      </div>
    </div>
  );
}
