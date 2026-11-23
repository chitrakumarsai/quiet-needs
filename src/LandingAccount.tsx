import React from 'react';
import { createRoot } from 'react-dom/client';
import { AccountControl, useAccount } from './Account.tsx';

function LandingAccount() {
  return <AccountControl account={useAccount(true)}/>;
}

export function mountLandingAccount(element: HTMLElement) {
  createRoot(element).render(<LandingAccount/>);
}
