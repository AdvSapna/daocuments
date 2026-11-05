import React, { useEffect, useRef } from 'react';

// Cloudflare Turnstile bot check. Supabase Auth verifies the token server-side
// (Authentication → Attack Protection → CAPTCHA), so sign-in links can only be
// requested by a browser that passed the check.
const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
if (!siteKey) {
  throw new Error('Missing VITE_TURNSTILE_SITE_KEY. Set it in .env, and in Vercel for deploys.');
}

let scriptPromise;
function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  scriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(window.turnstile);
    script.onerror = () => {
      scriptPromise = undefined;
      reject(new Error('Could not load the Cloudflare Turnstile check.'));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

// Renders the widget and reports each new token (or null when it expires or
// fails). Bump `resetKey` after a token has been used: tokens are single-use.
export default function Turnstile({ onToken, onError, resetKey = 0 }) {
  const container = useRef(null);
  const widgetId = useRef(null);
  const callbacks = useRef({ onToken, onError });
  callbacks.current = { onToken, onError };

  useEffect(() => {
    let cancelled = false;
    loadTurnstile()
      .then(turnstile => {
        if (cancelled || !container.current) return;
        widgetId.current = turnstile.render(container.current, {
          sitekey: siteKey,
          callback: token => callbacks.current.onToken(token),
          'expired-callback': () => callbacks.current.onToken(null),
          'error-callback': () => {
            callbacks.current.onToken(null);
            callbacks.current.onError?.(new Error('The bot check failed. Please try again.'));
          },
        });
      })
      .catch(err => callbacks.current.onError?.(err));
    return () => {
      cancelled = true;
      if (widgetId.current !== null) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
    };
  }, []);

  useEffect(() => {
    if (resetKey && widgetId.current !== null) {
      callbacks.current.onToken(null);
      window.turnstile?.reset(widgetId.current);
    }
  }, [resetKey]);

  return <div ref={container} style={{ margin: '12px 0', minHeight: 65 }} />;
}
