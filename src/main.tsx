import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { makeApprovedCard, makeCardPreview } from './domain.ts';
import type { ApprovedCard, Draft } from './domain.ts';
import { BalancedCardArtwork, CardArtwork, DirectionPicker, directionFromLocation } from './DesignPreview.tsx';
import './style.css';

if (import.meta.env.DEV) void import('./design-preview.css');

const sharingAvailable = import.meta.env.VITE_SHARING_ENABLED === 'true' ||
  (import.meta.env.DEV && import.meta.env.VITE_SHARING_EMULATORS === 'true');
const SharingPanel = sharingAvailable ? lazy(() => import('./SharingPanel.tsx')) : null;

const emptyDraft = (): Draft => ({ requirements: [{ category: 'other', request: '' }], questions: [] });

function App() {
  const [direction, setDirection] = useState(import.meta.env.DEV ? directionFromLocation : () => 'c' as const);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [preview, setPreview] = useState<ApprovedCard | null>(null);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState('');
  const firstRequest = useRef<HTMLTextAreaElement>(null);
  const previewHeading = useRef<HTMLHeadingElement>(null);
  const nextRequestFocus = useRef<number | null>(null);
  const clearDialog = useRef<HTMLDialogElement>(null);
  const clearButton = useRef<HTMLButtonElement>(null);
  const keepEditing = useRef<HTMLButtonElement>(null);
  const copiedSharedCard = useRef(false);
  const hasContent = draft.requirements.some(({ request }) => request.trim());
  const canPreview = draft.requirements.length > 0 && draft.requirements.every(({ request }) => request.trim());

  useEffect(() => {
    if (nextRequestFocus.current === null) return;
    document.getElementById(`request-${nextRequestFocus.current}`)?.focus();
    nextRequestFocus.current = null;
  }, [draft.requirements.length]);
  useEffect(() => {
    if (preview) previewHeading.current?.focus();
  }, [preview]);
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const syncDirection = () => setDirection(directionFromLocation());
    window.addEventListener('popstate', syncDirection);
    return () => window.removeEventListener('popstate', syncDirection);
  }, []);

  const clearApproval = useCallback(() => {
    setConsent(false);
    setPreview(null);
    setStatus('');
    if (copiedSharedCard.current) {
      copiedSharedCard.current = false;
      setDraft(emptyDraft());
    }
  }, []);

  function changeDraft(next: Draft) {
    setDraft(next);
    setConsent(false);
    setPreview(null);
    setStatus('');
  }

  function showPreview() {
    try {
      setPreview(makeCardPreview(draft));
      setConsent(false);
      setStatus('');
    } catch {
      setStatus('Check that every request contains valid text.');
    }
  }

  function exportCard() {
    if (!preview || !consent) return;
    const approved = makeApprovedCard({ requirements: preview.requirements, questions: [] }, consent);
    const blob = new Blob([JSON.stringify(approved, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quietneeds-approved-card.json';
    link.click();
    setStatus('Download requested. Check your browser’s downloads.');
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function selectDirection(next: typeof direction) {
    const url = new URL(location.href);
    url.searchParams.set('design', next);
    history.replaceState(history.state, '', url);
    setDirection(next);
  }

  return <main className="workspace" data-design={import.meta.env.DEV ? direction : undefined}>
    <a className="skip-link" href="#request-0" onClick={event => {
      event.preventDefault();
      firstRequest.current?.focus();
    }}>Skip to requests</a>
    <header className="workspace-header">
      <a className="brand" href="#card-title" translate="no"><span className="brand-mark" aria-hidden="true">Q</span>QuietNeeds</a>
      {SharingPanel && <nav aria-label="Workspace">
        <a href="#card-title">Participation card</a>
        <a href="#sharing-title">Event sharing</a>
      </nav>}
    </header>
    {import.meta.env.DEV && <DirectionPicker direction={direction} onSelect={selectDirection}/>}
    <section className="intro" aria-labelledby="card-title">
      <div className="intro-copy">
        <h1 id="card-title" tabIndex={-1}>Your participation card</h1>
        <p>Describe what would help you take part. Include any conditions, places, times, or costs the organizer needs to know.</p>
        <p className="draft-note">Your draft stays in this tab until you close or reload it.</p>
      </div>
      {import.meta.env.DEV && direction === 'b' && <CardArtwork direction="b"/>}
    </section>
    <div className="grid card-workspace">
      <section className="panel request-panel">
        <h2>Write your requests</h2>
        <p className="hint">Use one practical request per field. Share only the details needed to act on it.</p>
        {draft.requirements.map((requirement, index) => <div className="request" key={index}>
          <label htmlFor={`request-${index}`}>Request {index + 1}</label>
          <textarea ref={index === 0 ? firstRequest : undefined} id={`request-${index}`} name={`request-${index}`}
            autoComplete="off" autoCorrect="off" spellCheck={false} maxLength={500} value={requirement.request}
            onChange={event => {
              const request = event.target.value;
              changeDraft({ ...draft, requirements: draft.requirements.map((item, offset) => offset === index ? { ...item, request } : item) });
            }}/>
          {draft.requirements.length > 1 && <button className="text-button" onClick={() => {
            nextRequestFocus.current = Math.min(index, draft.requirements.length - 2);
            changeDraft({ ...draft, requirements: draft.requirements.filter((_, offset) => offset !== index) });
          }}>Remove request {index + 1}</button>}
        </div>)}
        <div className="actions">
          <button disabled={draft.requirements.length >= 8} onClick={() => {
            nextRequestFocus.current = draft.requirements.length;
            changeDraft({ ...draft, requirements: [...draft.requirements, { category: 'other', request: '' }] });
          }}>Add another request</button>
          <button ref={clearButton} disabled={!hasContent && draft.requirements.length === 1} onClick={() => {
            clearDialog.current?.showModal();
            keepEditing.current?.focus();
          }}>Clear session</button>
        </div>
      </section>
      <section className="panel review-panel">
        <h2>Review and approve</h2>
        <p className="hint">Preview the exact wording before approving your card.</p>
        <p className="review-status" role="status">{status}</p>
        {preview ? <section className="export-preview card-paper" aria-labelledby="preview-title">
          <h3 id="preview-title" ref={previewHeading} tabIndex={-1}>Card preview</h3>
          <ol>{preview.requirements.map((requirement, index) => <li key={index}><p>{requirement.request}</p></li>)}</ol>
          <details><summary>Exact JSON file</summary><pre>{JSON.stringify(preview, null, 2)}</pre></details>
          <label className="check">
            <input type="checkbox" checked={consent} onChange={event => {
              const approved = event.target.checked;
              setConsent(approved);
              setStatus(approved ? 'Card approved for download.' : 'Card approval removed.');
            }}/>
            I approve this exact card for download.
          </label>
          <button className="primary" disabled={!consent} onClick={exportCard}>Download approved card</button>
        </section> : <div className="card-paper card-paper-empty">
          <p>{canPreview ? 'Your requests are ready to preview.' : 'Write a request to preview your card.'}</p>
          <button className="primary" disabled={!canPreview} onClick={showPreview}>Preview card</button>
          {!canPreview && (import.meta.env.DEV
            ? direction !== 'b' && <CardArtwork direction={direction}/>
            : <BalancedCardArtwork/>)}
        </div>}
      </section>
    </div>
    {SharingPanel && <Suspense fallback={<section className="panel approval sharing-loading" aria-labelledby="sharing-title">
      <h2 id="sharing-title" tabIndex={-1}>Event sharing</h2>
      <p role="status">Loading event sharing…</p>
      <div className="loading-skeleton" aria-hidden="true"><span/><span/></div>
    </section>}>
      <SharingPanel approved={consent ? preview : null} onContextChange={clearApproval}
        onShareAcknowledged={() => { setConsent(false); setPreview(null); setStatus(''); }}
        onLoadCard={card => {
          copiedSharedCard.current = true;
          changeDraft({ requirements: card.requirements.map(({ category, request }) => ({ category, request })), questions: [] });
        }}/>
    </Suspense>}
    <dialog ref={clearDialog} aria-labelledby="clear-title" aria-describedby="clear-description"
      onClose={() => (clearButton.current?.disabled ? firstRequest.current : clearButton.current)?.focus()}>
      <h2 id="clear-title">Clear this session?</h2>
      <p id="clear-description">This clears the requests and approval in this tab. Downloaded copies stay on your device.</p>
      <div className="actions">
        <button ref={keepEditing} onClick={() => clearDialog.current?.close()}>Keep editing</button>
        <button className="destructive" onClick={() => {
          copiedSharedCard.current = false;
          changeDraft(emptyDraft());
          setStatus('Session cleared.');
          clearDialog.current?.close();
        }}>Clear session content</button>
      </div>
    </dialog>
  </main>;
}

createRoot(document.getElementById('root')!).render(<App/>);

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  void navigator.serviceWorker.register('/sw.js').catch(() => {
    // The manual workspace remains available online if the browser rejects offline setup.
  });
}
