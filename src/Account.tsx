import React, { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { LogIn, LogOut, Settings, UserRound } from 'lucide-react';
import { ReducedMotionSetting } from './ReducedMotionSetting.tsx';

type IdentityModule = typeof import('./identity.ts');
type Theme = 'system' | 'light' | 'dark';

export function useAccount(sharing: boolean) {
  const [identity, setIdentity] = useState<IdentityModule>();
  const [user, setUser] = useState<User | null | undefined>(sharing ? undefined : null);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!sharing) return;
    let active = true;
    let unsubscribe: (() => void) | undefined;
    void Promise.all([import('./identity.ts'), import('firebase/auth')]).then(([module, auth]) => {
      if (!active) return;
      setIdentity(module);
      if (!module.sharingConfigured()) { setUser(null); return; }
      unsubscribe = auth.onAuthStateChanged(module.getIdentity().auth, setUser, () => {
        setUser(null);
        setStatus('Sign-in could not be loaded. Reload and try again.');
      });
    }).catch(() => {
      if (active) { setUser(null); setStatus('Sign-in could not be loaded. Reload and try again.'); }
    });
    return () => { active = false; unsubscribe?.(); };
  }, [sharing]);

  async function changeSession() {
    if (!identity || busy) return;
    if (!user && !navigator.onLine) { setStatus('Connect to sign in.'); return; }
    setBusy(true);
    setStatus(user ? 'Signing out…' : 'Signing in…');
    try {
      await (user ? identity.endSession() : identity.signIn());
      setStatus('');
    } catch { setStatus('Sign-in could not be completed. Try again.'); }
    finally { setBusy(false); }
  }

  return { user, status, busy, changeSession, configured: !!identity?.sharingConfigured(),
    signInLabel: identity?.sharingEmulator ? 'Start demo session' : 'Sign in' };
}

export function AccountControl({ account, theme, onTheme }: {
  account: ReturnType<typeof useAccount>;
  theme: Theme;
  onTheme: (theme: Theme) => void;
}) {
  const { user, changeSession, configured, status, busy, signInLabel } = account;
  return <div className="account-controls">
    {!user && configured && <button className="primary" disabled={busy || user === undefined} onClick={() => void changeSession()}>
      <LogIn size={17} aria-hidden="true"/> {signInLabel}
    </button>}
    <details className="account-menu">
      <summary aria-label={user ? 'Account and settings' : 'Appearance settings'} className="icon-button">
        {user ? <span className="account-avatar">{user.displayName?.trim()[0]?.toUpperCase() || <UserRound size={18} aria-hidden="true"/>}</span>
          : <Settings size={19} aria-hidden="true"/>}
      </summary>
      <div className="popover">
        {user && <p className="account-name">{user.displayName || 'QuietNeeds account'}</p>}
        <label htmlFor="appearance">Appearance</label>
        <select id="appearance" value={theme} onChange={event => onTheme(event.target.value as Theme)}>
          <option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option>
        </select>
        <ReducedMotionSetting/>
        {user && <button disabled={busy} onClick={() => void changeSession()}><LogOut size={16} aria-hidden="true"/> Sign out</button>}
      </div>
    </details>
    <span className="account-status" role="status">{status}</span>
  </div>;
}
