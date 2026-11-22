import React, { useRef, useState } from 'react';
import { eventCodePattern } from './routes.ts';
import { componentTiming, reducedMotion } from './motion-settings.ts';

const compact = (value: string) => value.replace(/[\s-]/g, '');
const grouped = (code: string) => code.match(/.{1,4}/g)?.join(' ') ?? '';

export function JoinForm({ open }: { open: (code: string) => void }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [digit, setDigit] = useState<{ index: number } | null>(null);
  const sequence = useRef(0);
  const shake = useRef<Animation>();
  return <form className="focused-form" onSubmit={event => {
    event.preventDefault();
    if (!eventCodePattern.test(code)) {
      setError('Enter the 20-character event code from your organizer.');
      const input = event.currentTarget.elements.namedItem('event-code') as HTMLInputElement;
      input.focus();
      shake.current?.cancel();
      if (!reducedMotion()) {
        const timing = componentTiming();
        shake.current = input.animate([0, -4, 4, -2, 0].map(x => ({ transform: `translateX(${x}px)` })), {
          duration: timing.base * 1000,
          easing: timing.validation,
        });
      }
      return;
    }
    open(code);
  }}>
    <p className="hint" id="event-code-help">Use the invitation link or paste the 20-character code from your organizer.</p>
    <label htmlFor="event-code">Event code</label>
    <div className="code-entry"><input id="event-code" name="event-code" className="segmented-code" autoComplete="off" autoCapitalize="none" spellCheck={false}
      aria-invalid={!!error} aria-describedby={error ? 'event-code-help event-code-error' : 'event-code-help'}
      value={grouped(code)} onChange={event => {
        const input = event.currentTarget;
        const next = compact(input.value).slice(0, 20);
        const offset = compact(input.value.slice(0, input.selectionStart ?? input.value.length)).length;
        const position = offset + Math.max(0, Math.floor((offset - 1) / 4));
        if (next.length > code.length && !reducedMotion()) {
          sequence.current++;
          setDigit({ index: Math.min(grouped(next).length, position) - 1 });
        }
        setCode(next);
        setError('');
        requestAnimationFrame(() => {
          input.setSelectionRange(Math.min(input.value.length, position), Math.min(input.value.length, position));
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
      {digit && <span className="code-digit-feedback" key={sequence.current} aria-hidden="true"
        style={{ '--digit-index': digit.index } as React.CSSProperties} onAnimationEnd={() => setDigit(null)}/>}
    </div>
    <p id="event-code-error" className="danger-text code-error" role="alert">{error}</p>
    <div className="actions form-footer"><a className="button secondary" href="/events">Cancel</a>
      <button className="primary" type="submit">Open event</button></div>
  </form>;
}
