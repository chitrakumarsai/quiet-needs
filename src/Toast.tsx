import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, X } from 'lucide-react';
import { componentTiming, reducedMotion, seconds } from './motion-settings.ts';

type Notice = { id: string; text: string };
export function Toast({ notice }: { notice: Notice | null }) {
  const [dismissed, setDismissed] = useState<Notice | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement>();
  const progress = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!notice) return;
    if (document.activeElement instanceof HTMLElement && document.activeElement !== closeButton.current) {
      previousFocus.current = document.activeElement;
    }
    const lifetime = seconds(getComputedStyle(document.documentElement).getPropertyValue('--toast-lifetime')) * 1000;
    const tick = componentTiming().base * 1000;
    const deadline = performance.now() + lifetime;
    const countdown = reducedMotion() ? undefined : window.setInterval(() => {
      const remaining = Math.max(0, deadline - performance.now() - tick) / lifetime;
      if (progress.current) progress.current.style.transform = `scaleX(${remaining})`;
    }, tick);
    const timer = window.setTimeout(() => {
      window.clearInterval(countdown);
      if (document.activeElement !== closeButton.current) setDismissed(notice);
    }, lifetime);
    return () => {
      window.clearInterval(countdown);
      window.clearTimeout(timer);
    };
  }, [notice]);
  if (!notice || notice === dismissed) return null;
  return createPortal(<aside className="toast" aria-label="Confirmation" key={notice.id}>
    <Check size={19} aria-hidden="true"/><span>{notice.text}</span>
    <button ref={closeButton} type="button" className="icon-button" aria-label="Dismiss confirmation" onClick={() => {
      if (document.activeElement === closeButton.current) previousFocus.current?.focus({ preventScroll: true });
      setDismissed(notice);
    }}><X size={18} aria-hidden="true"/></button>
    <span ref={progress} className="toast-progress" aria-hidden="true"/>
  </aside>, document.body);
}
