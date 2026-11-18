import React, { lazy, Suspense, useCallback, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { makeApprovedCard, makeCardPreview } from './domain.ts';
import type { ApprovedCard, Draft } from './domain.ts';
import './style.css';

const sharingAvailable = import.meta.env.VITE_SHARING_ENABLED === 'true' ||
  (import.meta.env.DEV && import.meta.env.VITE_SHARING_EMULATORS === 'true');
const SharingPanel = sharingAvailable ? lazy(() => import('./SharingPanel.tsx')) : null;

const emptyDraft = (): Draft => ({ requirements: [{ category: 'other', request: '' }], questions: [] });

function App() {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [preview, setPreview] = useState<ApprovedCard | null>(null);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState('');
  const firstRequest = useRef<HTMLTextAreaElement>(null);
  const clearDialog = useRef<HTMLDialogElement>(null);
  const clearButton = useRef<HTMLButtonElement>(null);
  const keepEditing = useRef<HTMLButtonElement>(null);
  const copiedSharedCard = useRef(false);
  const hasContent = draft.requirements.some(({ request }) => request.trim());
  const canPreview = draft.requirements.length > 0 && draft.requirements.every(({ request }) => request.trim());

  const clearApproval = useCallback(() => {
    setConsent(false);
    setPreview(null);
    if (copiedSharedCard.current) {
      copiedSharedCard.current = false;
      setDraft(emptyDraft());
      setStatus('');
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
      setStatus('Preview ready. Review the card before approving.');
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
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <main>
    <header><a className="brand" href="/">◌ QuietNeeds</a></header>
    <section className="intro">
      <h1>Prepare your participation card.</h1>
      <p>Describe what would help you take part. Include any conditions, places, times, or amounts you want the organizer to know.</p>
    </section>
    <aside className="notice">Your draft stays in this tab until you close or refresh it. You can download an approved copy and choose where to share it.</aside>
    <div className="grid">
      <section className="panel">
        <h2>Write your requests</h2>
        <p className="hint">Use one practical request per field. Share only the details needed to act on it.</p>
        {draft.requirements.map((requirement, index) => <div className="request" key={index}>
          <label htmlFor={`request-${index}`}>Request {index + 1}</label>
          <textarea ref={index === 0 ? firstRequest : undefined} id={`request-${index}`}
            autoComplete="off" autoCorrect="off" spellCheck={false} maxLength={500} value={requirement.request}
            onChange={event => {
              const request = event.target.value;
              changeDraft({ ...draft, requirements: draft.requirements.map((item, offset) => offset === index ? { ...item, request } : item) });
            }}/>
          {draft.requirements.length > 1 && <button className="text-button" onClick={() => changeDraft({
            ...draft, requirements: draft.requirements.filter((_, offset) => offset !== index),
          })}>Remove request {index + 1}</button>}
        </div>)}
        <div className="actions">
          <button disabled={draft.requirements.length >= 8} onClick={() => changeDraft({
            ...draft, requirements: [...draft.requirements, { category: 'other', request: '' }],
          })}>Add another request</button>
          <button ref={clearButton} disabled={!hasContent && draft.requirements.length === 1} onClick={() => {
            clearDialog.current?.showModal();
            keepEditing.current?.focus();
          }}>Clear session</button>
        </div>
      </section>
      <section className="panel">
        <h2>Review and approve</h2>
        <p className="hint">Check the wording and details on the card before you approve it for download.</p>
        <button className="primary" disabled={!canPreview} onClick={showPreview}>Preview card</button>
        <p role="status">{status}</p>
        {preview && <section className="export-preview" aria-labelledby="preview-title">
          <h3 id="preview-title">Card preview</h3>
          <ol>{preview.requirements.map((requirement, index) => <li key={index}><p>{requirement.request}</p></li>)}</ol>
          <details><summary>Exact JSON file</summary><pre>{JSON.stringify(preview, null, 2)}</pre></details>
          <label className="check">
            <input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)}/>
            I approve this exact card for download.
          </label>
          <button className="primary" disabled={!consent} onClick={exportCard}>Download approved card</button>
        </section>}
      </section>
    </div>
    {SharingPanel && <Suspense fallback={<p role="status">Loading event sharing…</p>}>
      <SharingPanel approved={consent ? preview : null} onContextChange={clearApproval}
        onShareAcknowledged={() => { setConsent(false); setPreview(null); }}
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
