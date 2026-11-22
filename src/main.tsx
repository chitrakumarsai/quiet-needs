import React, { lazy, Suspense, useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowUp, Copy, Download, GripVertical, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { makeApprovedCard, makeCardPreview } from './domain.ts';
import type { ApprovedCard, Draft, Category } from './domain.ts';
import { AccountControl, useAccount } from './Account.tsx';
import { JoinForm } from './JoinForm.tsx';
import { OperationStatus } from './OperationStatus.tsx';
import { BalancedCardArtwork } from './DesignPreview.tsx';
import { eventPath, pageTitles, readRoute, workspaceRoutePattern } from './routes.ts';
import './style.css';
import './site.css';

const sharing = import.meta.env.VITE_SHARING_ENABLED === 'true' ||
  (import.meta.env.DEV && import.meta.env.VITE_SHARING_EMULATORS === 'true');
const SharingPanel = sharing ? lazy(() => import('./SharingPanel.tsx')) : null;
const emptyDraft = (): Draft => ({ requirements: [{ category: 'other', request: '' }], questions: [] });
const categories: Category[] = ['other', 'seating', 'timing', 'sensory', 'cost', 'participation'];
const examples = ['Please provide a seat during the discussion.', 'Please send the schedule before the event.', 'Please let me wait somewhere quieter if the hall is crowded.'];

function subscribeConnection(onChange: () => void) {
  window.addEventListener('online', onChange);
  window.addEventListener('offline', onChange);
  return () => {
    window.removeEventListener('online', onChange);
    window.removeEventListener('offline', onChange);
  };
}

function App() {
  const [route, setRoute] = useState(() => readRoute(new URL(location.href)));
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('quietneeds-appearance');
      return saved === 'dark' || saved === 'light' ? saved : 'system';
    } catch { return 'system'; }
  });
  const account = useAccount(sharing);
  const online = useSyncExternalStore(subscribeConnection, () => navigator.onLine);
  const uid = account.user?.uid;
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [approval, setApproval] = useState<{ card: ApprovedCard; eventId: string; uid: string | undefined } | null>(null);
  const [reviewShown, setReviewShown] = useState(false);
  const [status, setStatus] = useState('');
  const nextFocus = useRef<number | null>(null);
  const clearDialog = useRef<HTMLDialogElement>(null);
  const menu = useRef<HTMLDetailsElement>(null);
  const keepEditing = useRef<HTMLButtonElement>(null);
  const copiedSharedCard = useRef(false);
  const dragIndex = useRef<number | null>(null);
  const hasContent = draft.requirements.some(({ request }) => request.trim());
  const preview = draft.requirements.every(({ request }) => request.trim()) ? makeCardPreview(draft) : null;
  const isCard = route.page === '/card';
  const approved = approval && approval.eventId === route.eventId && approval.uid === account.user?.uid ? approval.card : null;
  const heading = route.page === '/events' && route.eventId ? 'Event workspace' : pageTitles[route.page];
  const cardHref = route.eventId ? '/card?event=' + route.eventId : '/card';

  useEffect(() => {
    const back = () => setRoute(readRoute(new URL(location.href)));
    window.addEventListener('popstate', back);
    return () => window.removeEventListener('popstate', back);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('quietneeds-appearance', theme); } catch { /* Appearance still works in this tab. */ }
  }, [theme]);
  useEffect(() => { document.title = heading + ' · QuietNeeds'; }, [heading]);
  useEffect(() => {
    if (nextFocus.current === null || !isCard) return;
    document.getElementById('request-' + nextFocus.current)?.focus();
    nextFocus.current = null;
  }, [draft, isCard]);

  function navigate(href: string) {
    const url = new URL(href, location.origin);
    if (url.href !== location.href) history.pushState(null, '', url);
    if (menu.current) menu.current.open = false;
    setRoute(readRoute(url));
    requestAnimationFrame(() => {
      document.getElementById('workspace-title')?.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    });
  }

  const clearApproval = useCallback(() => {
    setApproval(null);
    setStatus('');
    if (copiedSharedCard.current) { copiedSharedCard.current = false; setDraft(emptyDraft()); }
  }, []);
  useEffect(clearApproval, [account.user?.uid, route.eventId, clearApproval]);

  function edit(next: Draft['requirements']) {
    setDraft({ ...draft, requirements: next });
    setApproval(null);
    setStatus('');
  }

  function update(index: number, values: Partial<Draft['requirements'][number]>) {
    edit(draft.requirements.map((item, itemIndex) => itemIndex === index ? { ...item, ...values } : item));
  }

  function reorder(from: number, to: number) {
    if (to === from || from < 0 || to < 0 || to >= draft.requirements.length) return;
    const items = [...draft.requirements];
    items.splice(to, 0, items.splice(from, 1)[0]);
    nextFocus.current = to;
    edit(items);
    setStatus('Request moved to position ' + (to + 1) + '.');
  }

  function approve() {
    if (!preview) return;
    setApproval({ card: makeApprovedCard(draft, true), eventId: route.eventId, uid: account.user?.uid });
    setStatus('Card approved. You can copy or download it.');
  }

  async function copyCard() {
    if (!approved) return;
    try {
      await navigator.clipboard.writeText(approved.requirements.map(({ request }) => request).join('\n'));
      setStatus('Approved card copied.');
    } catch { setStatus('The card could not be copied. You can still download it.'); }
  }

  function download() {
    if (!approved) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(approved, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quietneeds-approved-card.json';
    link.click();
    setStatus('Download requested. Check your browser’s downloads.');
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <div onClick={event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[href]');
    if (anchor?.origin !== location.origin || !workspaceRoutePattern.test(anchor.pathname) || anchor.target || anchor.download) return;
    event.preventDefault();
    navigate(anchor.href);
  }}>
    <a className="skip-link" href="#workspace-title">Skip to content</a>
    <header className="site-header"><div className="site-width nav-row">
      <a className="brand" href="/" translate="no"><span className="brand-mark" aria-hidden="true">Q</span>QuietNeeds</a>
      <nav aria-label="Workspace">
        <a href={cardHref} aria-current={isCard ? 'page' : undefined}>Card</a>
        <a href="/events" aria-current={route.page.startsWith('/events') ? 'page' : undefined}>Events</a>
        <a href="/join" aria-current={route.page === '/join' ? 'page' : undefined}>Join</a>
      </nav>
      <AccountControl account={account} theme={theme} onTheme={setTheme}/>
    </div></header>
    <main className="workspace">
      <div className="page-heading">
        <h1 id="workspace-title" tabIndex={-1}>{heading}</h1>
        {isCard && <details className="card-menu" ref={menu}><summary aria-label="Card options" className="icon-button"><MoreHorizontal size={22} aria-hidden="true"/></summary>
          <div className="popover"><button disabled={!hasContent && draft.requirements.length === 1} onClick={() => {
            if (menu.current) menu.current.open = false;
            clearDialog.current?.showModal();
            keepEditing.current?.focus();
          }}><Trash2 size={17} aria-hidden="true"/> Clear session</button></div>
        </details>}
      </div>
      {isCard ? <>
        <p className="draft-banner">Your draft stays in this tab until you close or reload it.</p>
        {route.eventId && <p><a href={eventPath(route.eventId)}>Back to the event</a></p>}
        <div className="card-tabs" role="group" aria-label="Card view">
          <button aria-pressed={!reviewShown} onClick={() => setReviewShown(false)}>Write</button>
          <button aria-pressed={reviewShown} onClick={() => setReviewShown(true)}>Preview</button>
        </div>
        <div className="grid card-workspace routed-card" data-review={reviewShown}>
          <section className="request-panel" id="request-panel" aria-labelledby="request-heading">
            <h2 id="request-heading">Write your requests</h2>
            <p className="hint">Use one practical adjustment per field. Share only what the organizer needs to act on.</p>
            {draft.requirements.map((requirement, index) => <div className="panel request-sheet" key={index}
              onDragOver={event => { if (dragIndex.current !== null) event.preventDefault(); }}
              onDrop={event => {
                if (dragIndex.current === null) return;
                event.preventDefault();
                reorder(dragIndex.current, index);
                dragIndex.current = null;
              }}>
              <div className="request-top">
                <label htmlFor={'request-' + index}><span className="request-number" aria-hidden="true">{index + 1}</span>Request {index + 1}</label>
                <div className="actions reorder-actions">
                  {draft.requirements.length > 1 && <>
                    <button type="button" className="icon-button" aria-label={'Move request ' + (index + 1) + ' up'} disabled={index === 0} onClick={() => reorder(index, index - 1)}><ArrowUp size={17} aria-hidden="true"/></button>
                    <button type="button" className="icon-button" aria-label={'Move request ' + (index + 1) + ' down'} disabled={index === draft.requirements.length - 1} onClick={() => reorder(index, index + 1)}><ArrowDown size={17} aria-hidden="true"/></button>
                    <span className="drag-handle" aria-hidden="true" draggable onDragStart={event => {
                      dragIndex.current = index;
                      event.dataTransfer.setData('text/plain', String(index));
                      event.dataTransfer.effectAllowed = 'move';
                    }} onDragEnd={() => { dragIndex.current = null; }}><GripVertical size={18}/></span>
                  </>}
                  <button type="button" className="icon-button danger-text" aria-label={'Delete request ' + (index + 1)}
                    disabled={!requirement.request && draft.requirements.length === 1} onClick={() => {
                      nextFocus.current = Math.max(0, Math.min(index, draft.requirements.length - 2));
                      edit(draft.requirements.length === 1 ? emptyDraft().requirements : draft.requirements.filter((_, i) => i !== index));
                    }}><Trash2 size={17} aria-hidden="true"/></button>
                </div>
              </div>
              <textarea id={'request-' + index} name={'request-' + index} autoComplete="off" autoCorrect="off" spellCheck={false}
                maxLength={500} aria-describedby={'count-' + index} value={requirement.request} onChange={event => update(index, { request: event.target.value })}/>
              <div className="request-bottom"><label>Category <select value={requirement.category} onChange={event => update(index, { category: event.target.value as Category })}>
                {categories.map(category => <option value={category} key={category}>{category[0].toUpperCase() + category.slice(1)}</option>)}
              </select></label><span id={'count-' + index}>{requirement.request.length} / 500</span></div>
            </div>)}
            <button className="add-tile" disabled={draft.requirements.length >= 8} onClick={() => {
              nextFocus.current = draft.requirements.length;
              edit([...draft.requirements, { category: 'other', request: '' }]);
            }}><Plus size={18} aria-hidden="true"/> Add another request</button>
            {!hasContent && <div className="examples"><h3>Try an example</h3>{examples.map(example => <button key={example} onClick={() => {
              nextFocus.current = 0;
              update(0, { request: example });
            }}>{example}</button>)}</div>}
          </section>
          <section className="panel review-panel sticky-preview" id="card-preview" aria-labelledby="review-heading">
            <h2 id="review-heading">Card preview</h2>
            <p className="hint">Review the exact wording before approving.</p>
            <div className="card-paper" aria-live="polite" aria-atomic="true">
              {hasContent ? <ol>{draft.requirements.filter(item => item.request.trim()).map((item, index) =>
                <li key={index}><span className="category-label">{item.category}</span><p>{item.request.trim()}</p></li>)}</ol>
                : <><p>Your requests will appear here as you write.</p><BalancedCardArtwork/></>}
            </div>
            {approved && <details><summary>Exact JSON file</summary><pre>{JSON.stringify(approved, null, 2)}</pre></details>}
            <div className="actions preview-actions">
              <button onClick={() => void copyCard()} disabled={!approved}><Copy size={17} aria-hidden="true"/> Copy</button>
              <button onClick={download} disabled={!approved}><Download size={17} aria-hidden="true"/> Download</button>
              <button className="primary" disabled={!preview || !!approved} onClick={approve}>{approved ? 'Card approved' : 'Approve card'}</button>
            </div>
            {route.eventId && approved && <p><a href={eventPath(route.eventId)}>Open event to share your card</a></p>}
            <p className="review-status" role="status">{status}</p>
          </section>
        </div>
      </> : SharingPanel ? <section className="panel approval routed-events" aria-labelledby="sharing-title">
        <h2 id="sharing-title">{route.eventId ? 'Event access and planning' : route.page === '/events' ? 'Event directory' : 'Event details'}</h2>
        <div role="status">{!online && <p>Connect to use event sharing. You can still prepare and download a card.</p>}</div>
        {online && account.user === undefined && <OperationStatus busy message="Loading your account…"/>}
        {online && account.user === null && route.page === '/join' && !route.eventId && <JoinForm open={code => navigate(eventPath(code))}/>}
        {online && account.user === null && (route.page !== '/join' || route.eventId) && <p>{account.configured
          ? (route.eventId ? 'Sign in from the header to open this event.' : 'Sign in from the header to create or join an event.')
          : 'Event sharing needs Firebase configuration.'}</p>}
        {online && uid && <Suspense fallback={<div className="sharing-loading"><p role="status">Loading this workspace…</p><div className="loading-skeleton" aria-hidden="true"><span/><span/></div></div>}>
          <SharingPanel key={uid + ':' + route.page + ':' + route.eventId} approved={approved} uid={uid} page={route.page} eventId={route.eventId}
            navigate={navigate} onContextChange={clearApproval} onShareAcknowledged={() => { setApproval(null); setStatus(''); }}
            onLoadCard={card => {
              copiedSharedCard.current = true;
              edit(card.requirements.map(({ category, request }) => ({ category, request })));
              setReviewShown(false);
              navigate(cardHref);
            }}/>
        </Suspense>}
      </section> : <p>Event sharing needs Firebase configuration. <a href="/card">Prepare a card</a> while using the local workspace.</p>}
      <dialog ref={clearDialog} aria-labelledby="clear-title" aria-describedby="clear-description"
        onClose={() => menu.current?.querySelector('summary')?.focus()}>
        <h2 id="clear-title">Clear this session?</h2>
        <p id="clear-description">This clears the requests and approval in this tab. Downloaded copies stay on your device.</p>
        <div className="actions dialog-actions">
          <button ref={keepEditing} onClick={() => clearDialog.current?.close()}>Keep editing</button>
          <button className="destructive" onClick={() => {
            copiedSharedCard.current = false;
            edit(emptyDraft().requirements);
            setStatus('Session cleared.');
            clearDialog.current?.close();
          }}>Clear session content</button>
        </div>
      </dialog>
    </main>
  </div>;
}

createRoot(document.getElementById('root')!).render(<App/>);

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  void navigator.serviceWorker.register('/sw.js').catch(() => {
    // The manual workspace remains available online if the browser rejects offline setup.
  });
}
