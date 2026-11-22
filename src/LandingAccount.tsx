import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AccountControl, useAccount } from './Account.tsx';

function LandingAccount() {
  const account = useAccount(true);
  const current = document.documentElement.dataset.theme;
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(current === 'light' || current === 'dark' ? current : 'system');
  return <AccountControl account={account} theme={theme} onTheme={value => {
    document.documentElement.dataset.theme = value;
    try { localStorage.setItem('quietneeds-appearance', value); } catch { /* The theme still updates. */ }
    setTheme(value);
  }}/>;
}

export function mountLandingAccount(element: HTMLElement) {
  createRoot(element).render(<LandingAccount/>);
}
