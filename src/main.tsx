import React, { useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { makeApprovedCard, sampleDraft } from './domain.ts';
import type { ApprovedCard, Draft } from './domain.ts';
import { extractLocally, initializeLocalAi, isConfigured } from './localAi.ts';
import { localFailureMessage } from './localErrors.ts';
import './style.css';

function App() {
  const [note, setNote] = useState('');
  const [draft, setDraft] = useState<Draft>({ requirements: [], questions: [] });
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState(isConfigured() ? 'Write a request manually, or prepare local AI to help draft it.' : 'Manual editing is available. Local AI requires setup.');
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<ApprovedCard | null>(null);
  const noteInput = useRef<HTMLTextAreaElement>(null);
  const clearDialog = useRef<HTMLDialogElement>(null);
  const clearButton = useRef<HTMLButtonElement>(null);
  const keepEditing = useRef<HTMLButtonElement>(null);
  function requestClear() {
    if (!note && !draft.requirements.length && !draft.questions.length) return;
    clearDialog.current?.showModal();
    keepEditing.current?.focus();
  }
  function restoreClearFocus() {
    if (clearButton.current?.disabled) noteInput.current?.focus();
    else clearButton.current?.focus();
  }
  function closeClear() { clearDialog.current?.close(); }
  function changeDraft(next: Draft) { setDraft(next); setConsent(false); setPreview(null); }
  async function setup() {
    setBusy(true); setStatus('Preparing local AI. Initial download needs internet.');
    try {
      await initializeLocalAi(p => setStatus(`Preparing local AI: ${p}%`));
      setReady(true); setStatus('Local model ready. Private notes use device-only inference.');
    } catch { setStatus('Local AI could not initialize. Check Chrome and Firebase setup, or create a card manually.'); }
    finally { setBusy(false); }
  }
  async function generate() {
    setBusy(true); setConsent(false); setPreview(null); setStatus('Drafting on this device…');
    try { changeDraft(await extractLocally(note)); setStatus('Generated on-device. Check every word before approving.'); }
    catch (error) { setStatus(localFailureMessage(error)); }
    finally { setBusy(false); }
  }
  function clear() {
    setNote(''); changeDraft({ requirements: [], questions: [] }); setStatus('Session content cleared.');
    // Firebase retains its last model session; reload ends this document's SDK context.
    if (ready) window.location.reload();
  }
  function exportCard() {
    if (!preview || !consent) return;
    const blob = new Blob([JSON.stringify(preview, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'quietneeds-approved-card.json'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <main>
    <header><a className="brand" href="/">◌ QuietNeeds</a><span className="badge">Participant prototype · Phase P1</span></header>
    <section className="intro"><p className="eyebrow">MAKE ROOM FOR EVERYONE</p><h1>Prepare your participation card.</h1><p>Prepare a practical request without sharing the story behind it.</p></section>
    <aside className="notice">This first version keeps session content in memory. Refreshing clears it. It does not send cards to an organizer. Exported files remain on your computer.</aside>
    <div className="grid"><section className="panel">
      <p className="step">01 / PRIVATE PREPARATION</p><h2>What would help you take part?</h2>
      <label htmlFor="note">Your private explanation</label>
      <textarea ref={noteInput} id="note" aria-describedby="note-hint" autoComplete="off" autoCorrect="off" spellCheck={false} value={note} disabled={busy} maxLength={4000} placeholder="For example: I find standing for long periods difficult. A seated option would help." onChange={e => { setNote(e.target.value); changeDraft({ requirements: [], questions: [] }); }}/>
      <p className="hint" id="note-hint">Use fictional information during testing.</p>
      <p className="hint">The initial local AI download needs internet. You can add a request manually at any time.</p>
      <div className="actions"><button onClick={setup} disabled={busy || ready || !isConfigured()}>Prepare local AI</button><button className="primary" onClick={generate} disabled={busy || !ready || !note.trim()}>Draft on this device</button></div>
      <p role="status" aria-live="polite" className="status">{status}</p>
      <button className="text-button" disabled={busy} onClick={() => { changeDraft(structuredClone(sampleDraft)); setStatus('Loaded a fixed example, not AI output. Your private note was not processed.'); }}>Try a fictional example</button>
    </section><section className="panel">
      <p className="step">02 / YOUR PARTICIPATION CARD</p><h2>Say only what you choose.</h2>
      <p className="hint">Check each suggestion against what you meant. Remove invented details, unsupported promises and personal reasons before approving. No automatic anonymity is guaranteed.</p>
      {!draft.requirements.length && <div className="empty">Your card starts here. Draft with local AI or add a request yourself.</div>}
      {draft.requirements.map((r, i) => <div className="request" key={i}>
        <label htmlFor={`request-${i}`}>Request {i + 1} · {r.category}</label>
        <textarea id={`request-${i}`} autoComplete="off" autoCorrect="off" spellCheck={false} maxLength={500} disabled={busy} value={r.request} onChange={e => changeDraft({ ...draft, requirements: draft.requirements.map((x, n) => n === i ? { ...x, request: e.target.value } : x) })}/>
        <button className="text-button" disabled={busy} onClick={() => changeDraft({ ...draft, requirements: draft.requirements.filter((_, n) => n !== i) })}>Remove request {i + 1}</button>
      </div>)}
      <button disabled={busy || draft.requirements.length >= 8} onClick={() => changeDraft({ ...draft, requirements: [...draft.requirements, { category: 'other', request: '' }] })}>+ Add a request manually</button>
      {!!draft.questions.length && <div className="questions"><h3>Details to consider privately</h3><ul>{draft.questions.map((q, i) => <li key={i}>{q}</li>)}</ul><p>Add any confirmed details to the request above. These questions are excluded from the export.</p></div>}
    </section></div>
    <section className="panel approval"><p className="step">03 / REVIEW BEFORE SHARING</p><h2>You have the final say.</h2>
      <label className="check"><input type="checkbox" disabled={busy} checked={consent} onChange={e => { setConsent(e.target.checked); setPreview(null); }}/>I reviewed the request text and approve it for an export preview.</label>
      <div className="actions"><button className="primary" disabled={busy || !consent || !draft.requirements.length || draft.requirements.some(r => !r.request.trim())} onClick={() => { try { setPreview(makeApprovedCard(draft, consent)); } catch { setStatus('Check that every request contains valid text.'); } }}>Preview approved content</button><button ref={clearButton} onClick={requestClear} disabled={busy || (!note && !draft.requirements.length && !draft.questions.length)}>Clear session</button></div>
      {preview && <section className="export-preview" aria-labelledby="preview-title">
        <h3 id="preview-title">Your approved card</h3>
        <p>This file contains only the categories and requests below. Downloading keeps it on your computer. You choose whether to share the file with someone later.</p>
        <ol>{preview.requirements.map((r, i) => <li key={i}><span className="category">{r.category}</span><p>{r.request}</p></li>)}</ol>
        <details><summary>Technical details: exact JSON file</summary><pre>{JSON.stringify(preview, null, 2)}</pre></details>
        <button className="primary" onClick={exportCard}>Download approved card</button>
      </section>}
    </section>
    <dialog ref={clearDialog} aria-labelledby="clear-title" aria-describedby="clear-description" onCancel={event => { event.preventDefault(); closeClear(); }} onClose={restoreClearFocus}>
      <h2 id="clear-title">Clear this session?</h2>
      <p id="clear-description">This removes your private explanation, requests, questions and approval from this page. Downloaded files remain on your computer.</p>
      {ready && <p>The page will restart to end its local AI session. You can prepare the model again when needed. Browser and operating-system memory erasure cannot be guaranteed.</p>}
      <div className="actions"><button ref={keepEditing} onClick={closeClear}>Keep editing</button><button className="destructive" onClick={() => { clear(); closeClear(); }}>{ready ? 'Clear and restart session' : 'Clear session content'}</button></div>
    </dialog><footer>Built for thoughtful participation. Private explanations are never included as a separate field in the export.</footer>
  </main>;
}
createRoot(document.getElementById('root')!).render(<App/>);
