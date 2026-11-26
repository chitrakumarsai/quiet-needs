import React, { useEffect, useState, useSyncExternalStore } from 'react';
import type { User } from 'firebase/auth';
import { LogOut, Settings, UserRound, UsersRound } from 'lucide-react';
import { ReducedMotionSetting } from './ReducedMotionSetting.tsx';
import { currentTheme, setTheme, subscribeTheme } from './theme.ts';
import type { Theme } from './theme.ts';

type IdentityModule = typeof import('./identity.ts');


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

  async function changeSession(action: 'sign-in' | 'sign-out' | 'switch') {
    if (!identity || busy) return;
    if (action !== 'sign-out' && !navigator.onLine) {
      setStatus(action === 'switch' ? 'Connect to switch accounts.' : 'Connect to sign in.');
      return;
    }
    setBusy(true);
    setStatus(action === 'switch' ? 'Switching accounts…' : action === 'sign-out' ? 'Signing out…' : 'Signing in…');
    try {
      if (action === 'sign-out') {
        await identity.endSession();
        setStatus('');
      } else {
        const { user: signedIn } = await identity.signIn(action === 'switch');
        setStatus(action === 'switch' && signedIn.uid !== user?.uid ? 'Account switched.' : '');
      }
    } catch (error) {
      if (action === 'switch') {
        const closed = error instanceof Error && 'code' in error && error.code === 'auth/popup-closed-by-user';
        setStatus(closed ? 'Account switch canceled.' : 'Could not switch accounts. Try again.');
      } else {
        setStatus(action === 'sign-out' ? 'Could not sign out. Try again.' : 'Sign-in could not be completed. Try again.');
      }
    }
    finally { setBusy(false); }
  }

  return { user, status, busy, changeSession, configured: !!identity?.sharingConfigured(),
    signInLabel: identity?.sharingEmulator ? 'Start demo session' : 'Sign in' };
}

export function AccountControl({ account }: { account: ReturnType<typeof useAccount> }) {
  const { user, changeSession, configured, status, busy, signInLabel } = account;
  const theme = useSyncExternalStore(subscribeTheme, currentTheme);
  const authIntent = new URLSearchParams(location.search).get('auth');
  const startSession = () => void changeSession('sign-in');
  const signInDisabled = busy || user === undefined;
  return <div className="account-controls">
    {!user && configured && <div className="account-links">
      {signInLabel !== 'Sign in' ? <button className="primary" disabled={signInDisabled} onClick={startSession}>{signInLabel}</button>
        : authIntent === 'login' || authIntent === 'signup'
          ? <button className="primary" disabled={signInDisabled} onClick={startSession}>Continue with Google</button>
          : <><button className="ghost" disabled={signInDisabled} onClick={startSession}>Log in</button>
            <button className="primary" disabled={signInDisabled} onClick={startSession}>Sign up</button></>}
    </div>}
    <details className="account-menu">
      <summary aria-label={user ? 'Account and settings' : 'Appearance settings'} className="icon-button">
        {user ? <span className="account-avatar">{user.displayName?.trim()[0]?.toUpperCase() || <UserRound size={18} aria-hidden="true"/>}</span>
          : <Settings size={19} aria-hidden="true"/>}
      </summary>
      <div className="popover">
        {user && <p className="account-name">{user.displayName || user.email || 'QuietNeeds account'}
          {user.displayName && user.email && <><br/>{user.email}</>}</p>}
        <label htmlFor="appearance">Appearance</label>
        <select id="appearance" value={theme} onChange={event => setTheme(event.target.value as Theme)}>
          <option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option>
        </select>
        <ReducedMotionSetting/>
        {user && <>
          <div className="account-actions">
            <button disabled={busy} onClick={() => void changeSession('switch')}><UsersRound size={16} aria-hidden="true"/> Switch account</button>
            <button disabled={busy} onClick={() => void changeSession('sign-out')}><LogOut size={16} aria-hidden="true"/> Sign out</button>
          </div>
          <div role="status" className="account-menu-status">{status}</div>
        </>}
      </div>
    </details>
    {!user && <span className="account-status" role="status">{status}</span>}
  </div>;
}
