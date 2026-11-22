import React, { useState } from 'react';
import { eventCodePattern } from './routes.ts';

const compact = (value: string) => value.replace(/[\s-]/g, '');
const grouped = (code: string) => code.match(/.{1,4}/g)?.join(' ') ?? '';

export function JoinForm({ open }: { open: (code: string) => void }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  return <form className="focused-form" onSubmit={event => {
    event.preventDefault();
    if (!eventCodePattern.test(code)) {
      setError('Enter the 20-character event code from your organizer.');
      (event.currentTarget.elements.namedItem('event-code') as HTMLInputElement | null)?.focus();
      return;
    }
    open(code);
  }}>
    <p className="hint" id="event-code-help">Use the invitation link or paste the 20-character code from your organizer.</p>
    <label htmlFor="event-code">Event code</label>
    <input id="event-code" name="event-code" className="segmented-code" autoComplete="off" autoCapitalize="none" spellCheck={false}
      aria-invalid={!!error} aria-describedby={error ? 'event-code-help event-code-error' : 'event-code-help'}
      value={grouped(code)} onChange={event => {
        const input = event.currentTarget;
        const next = compact(input.value).slice(0, 20);
        const offset = compact(input.value.slice(0, input.selectionStart ?? input.value.length)).length;
        setCode(next);
        setError('');
        requestAnimationFrame(() => {
          const position = Math.min(input.value.length, offset + Math.max(0, Math.floor((offset - 1) / 4)));
          input.setSelectionRange(position, position);
        });
      }} onKeyDown={event => {
        const input = event.currentTarget;
        const offset = input.selectionStart ?? 0;
        if (event.key === 'Backspace' && input.selectionEnd === offset && input.value[offset - 1] === ' ') {
          event.preventDefault();
          const index = compact(input.value.slice(0, offset)).length;
          setCode(code.slice(0, index - 1) + code.slice(index));
          setError('');
          requestAnimationFrame(() => input.setSelectionRange(offset - 2, offset - 2));
        }
      }}/>
    {error && <p id="event-code-error" className="danger-text" role="alert">{error}</p>}
    <div className="actions form-footer"><a className="button secondary" href="/events">Cancel</a>
      <button className="primary" type="submit">Open event</button></div>
  </form>;
}
