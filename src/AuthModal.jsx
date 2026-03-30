import React, { useState } from 'react';
import supabase from './supabase';

export default function AuthModal({ onSuccess }) {
  const [step, setStep] = useState('email'); // 'email' | 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newsletter, setNewsletter] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError('');

    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
      },
    });

    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setStep('otp');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) return;
    setLoading(true);
    setError('');

    const { data, error: err } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otp.trim(),
      type: 'email',
    });

    if (err) {
      setLoading(false);
      setError(err.message);
      return;
    }

    // Save newsletter preference
    if (data?.user) {
      await supabase.from('subscribers').upsert(
        { user_id: data.user.id, email: email.trim(), newsletter_optin: newsletter },
        { onConflict: 'user_id' }
      );
    }

    setLoading(false);
    onSuccess();
  };

  const handleResend = async () => {
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true },
    });
    setLoading(false);
    if (err) setError(err.message);
    else setError('Code resent! Check your inbox.');
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

            <form onSubmit={handleSendOtp}>
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
              We'll send a one-time code to verify your email. No password needed.
            </p>
          </>
        ) : (
          <>
            <h2 className="auth-title">Check your email</h2>
            <p className="auth-subtitle">
              We sent a 6-digit code to <strong>{email}</strong>
            </p>

            <form onSubmit={handleVerifyOtp}>
              <input
                type="text"
                className="auth-input auth-otp-input"
                placeholder="000000"
                value={otp}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setOtp(val);
                }}
                maxLength={6}
                inputMode="numeric"
                autoFocus
              />

              {error && <div className="auth-error">{error}</div>}

              <button type="submit" className="auth-btn" disabled={loading || otp.length < 6}>
                {loading ? 'Verifying...' : 'Verify & Enter'}
              </button>
            </form>

            <p className="auth-footer-text">
              Didn't get the code?{' '}
              <button className="auth-link-btn" onClick={handleResend} disabled={loading}>
                Resend
              </button>
              {' · '}
              <button className="auth-link-btn" onClick={() => { setStep('email'); setOtp(''); setError(''); }}>
                Change email
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
