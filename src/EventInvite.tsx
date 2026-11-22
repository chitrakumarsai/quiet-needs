import React, { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function InviteCopyButton({ copy, children }: { copy: () => Promise<boolean>; children: string }) {
  const [copied, setCopied] = useState(false);
  return <button type="button" className="invite-copy" data-copied={copied} onClick={async () => setCopied(await copy())}>
    <span className="copy-icon" aria-hidden="true"><Copy size={17}/><Check size={17}/></span>{children}
  </button>;
}

export function EventInvite({ code, inviteLink, copy }: {
  code: string;
  inviteLink: string;
  copy: (value: string, label: string) => Promise<boolean>;
}) {
  const [qr, setQr] = useState('');
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    void import('qrcode').then(module => module.toDataURL(inviteLink, { width: 192, margin: 2 }))
      .then(image => { if (active) setQr(image); }).catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, [inviteLink]);
  return <section className="invite-panel" aria-labelledby="invite-heading">
    <div>
      <h4 id="invite-heading">Invite participants</h4>
      <p>Share this link or code. Participants still need your approval to join.</p>
      <label htmlFor="invite-code">Event code</label>
      <input id="invite-code" name="invite-code" className="invite-code" value={code} readOnly onFocus={event => event.currentTarget.select()}/>
      <label htmlFor="invite-link">Invite link</label>
      <input id="invite-link" name="invite-link" type="url" value={inviteLink} readOnly onFocus={event => event.currentTarget.select()}/>
      <div className="actions">
        <InviteCopyButton copy={() => copy(inviteLink, 'Invite link')}>Copy invite link</InviteCopyButton>
        <InviteCopyButton copy={() => copy(code, 'Event code')}>Copy code</InviteCopyButton>
      </div>
    </div>
    <div className="invite-qr">
      {qr ? <img src={qr} alt="QR code for the event invitation link" width="144" height="144"/> :
        <div className={failed ? 'qr-loading' : 'qr-loading qr-placeholder'}>
          <p role="status">{failed ? 'QR code unavailable. Use the invite link.' : 'Preparing QR code…'}</p>
        </div>}
    </div>
  </section>;
}
