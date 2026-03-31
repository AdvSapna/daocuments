import React, { useState } from 'react';
import supabase from './supabase';

export default function AuthModal({ onSuccess }) {
  const [step, setStep] = useState('email'); // 'email' | 'sent'
  const [email, setEmail] = useState('');
  const [newsletter, setNewsletter] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendLink = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError('');

    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
        emailRedirectTo: window.location.origin,
      },
    });

    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      // Store newsletter preference locally — will be saved on successful auth
      localStorage.setItem('dao_newsletter', newsletter ? '1' : '0');
      localStorage.setItem('dao_email', email.trim());
      setStep('sent');
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true, emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (err) setError(err.message);
    else setError('Link resent! Check your inbox.');
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <div className="auth-logo">
          <div style={{
            width: 40, height: 40, borderRadius: '50%', background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 800, color: '#fff',
          }}>
            D
          </div>
        </div>

        {step === 'email' ? (
          <>
            <h2 className="auth-title">Welcome to DAOcuments</h2>
            <p className="auth-subtitle">
              Enter your email to access the crypto regulatory tracker.
            </p>

            <form onSubmit={handleSendLink}>
              <input
                type="email"
                className="auth-input"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />

              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  checked={newsletter}
                  onChange={(e) => setNewsletter(e.target.checked)}
                />
                <span>Send me weekly updates on global Web3 developments</span>
              </label>

              {error && <div className="auth-error">{error}</div>}

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? 'Sending...' : 'Continue'}
              </button>
            </form>

            <p className="auth-footer-text">
              We'll send a login link to your email. No password needed.
            </p>
          </>
        ) : (
          <>
            <h2 className="auth-title">Check your email</h2>
            <p className="auth-subtitle">
              We sent a login link to <strong>{email}</strong>
            </p>
            <p className="auth-subtitle" style={{ fontSize: 12 }}>
              Click the link in the email to access DAOcuments. You can close this tab.
            </p>

            {error && <div className="auth-error">{error}</div>}

            <p className="auth-footer-text">
              Didn't get the email?{' '}
              <button className="auth-link-btn" onClick={handleResend} disabled={loading}>
                Resend
              </button>
              {' · '}
              <button className="auth-link-btn" onClick={() => { setStep('email'); setError(''); }}>
                Change email
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
