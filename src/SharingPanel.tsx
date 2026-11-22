import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import type { ApprovedCard } from './domain.ts';
import {
  admit, changeSharedCard, createEvent, endSession, eventIdPattern, getSharing,
  listOwnedEvents, readEventAccess, requestToJoin, revoke, sharingConfigured, sharingEmulator, signIn, watchJoinRequests,
} from './sharing.ts';
import type { Event, EventAccess, SharedCard } from './sharing.ts';
import { OrganizerPlanner, ParticipantPlan } from './PlanningPanel.tsx';
import { OperationStatus } from './OperationStatus.tsx';

type Props = {
  approved: ApprovedCard | null;
  onContextChange: () => void;
  onShareAcknowledged: () => void;
  onLoadCard: (card: SharedCard) => void;
};

function subscribeConnection(onChange: () => void) {
  window.addEventListener('online', onChange);
  window.addEventListener('offline', onChange);
  return () => {
    window.removeEventListener('online', onChange);
    window.removeEventListener('offline', onChange);
  };
}

const accessDenied = (error: unknown) =>
  error instanceof Error && 'code' in error && error.code === 'permission-denied';

function eventFromLocation() {
  const id = new URLSearchParams(location.search).get('event') ?? '';
  return eventIdPattern.test(id) ? id : '';
}

function errorText(error: unknown) {
  if (error instanceof Error && error.message === 'CARD_CHANGED') {
    return 'The shared card changed. Review the current version before replacing it.';
  }
  if (error instanceof Error && error.message === 'INVALID_TITLE') return 'Enter an event title.';
  if (error instanceof RangeError) return 'Enter a time zone such as Europe/London.';
  if (accessDenied(error)) {
    return 'Access was denied. Use Check event access to see your current membership.';
  }
  return 'The request could not be confirmed. Check your connection and try again.';
}

export default function SharingPanel(props: Props) {
  const online = useSyncExternalStore(subscribeConnection, () => navigator.onLine);
  const [uid, setUid] = useState<string | null | undefined>(undefined);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [eventId, setEventId] = useState(eventFromLocation);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => sharingConfigured() ? onAuthStateChanged(getSharing().auth, user => {
    setUid(user?.uid ?? null);
  }, () => {
    setUid(null);
    setStatus('Sign-in could not be loaded.');
  }) : undefined, []);
  useEffect(() => { props.onContextChange(); }, [uid, eventId, props.onContextChange]);
  useEffect(() => {
    const onBackOrForward = () => setEventId(eventFromLocation());
    window.addEventListener('popstate', onBackOrForward);
    return () => window.removeEventListener('popstate', onBackOrForward);
  }, []);

  function openEvent(id: string) {
    const url = new URL(location.href);
    url.hash = '';
    if (id) url.searchParams.set('event', id);
    else url.searchParams.delete('event');
    history.pushState(null, '', url);
    setEventId(id);
    heading.current?.focus();
  }

  async function authenticate(action: () => Promise<unknown>, pending: string) {
    setBusy(true);
    setStatus(pending);
    try { await action(); setStatus(''); }
    catch { setStatus('Sign-in could not be completed. Try again.'); }
    finally { setBusy(false); }
  }

  return <section className="panel approval" aria-labelledby="sharing-title">
    <h2 id="sharing-title" tabIndex={-1} ref={heading}>Event sharing</h2>
    <div role="status">{!online && <p>Connect to use event sharing. You can still prepare and download a card.</p>}</div>
    {online && uid === undefined && <OperationStatus busy={sharingConfigured()}
      message={sharingConfigured() ? 'Checking sign-in…' : 'Event sharing needs Firebase configuration.'}/>}
    {online && uid === null && <>
      <p>{eventId ? 'Sign in to open this event.' : 'Sign in to create or join an event.'}</p>
      <button className="primary" disabled={busy} onClick={() => void authenticate(signIn, 'Signing in…')}>{sharingEmulator ? 'Start demo session' : 'Sign in with Google'}</button>
    </>}
    {uid && <>
      <div className="actions"><button disabled={busy} onClick={() => void authenticate(endSession, 'Signing out…')}>Sign out</button></div>
      {online && <Workspace key={uid + ':' + eventId} {...props} uid={uid} eventId={eventId} openEvent={openEvent}/>}
    </>}
    <OperationStatus busy={busy} message={status}/>
  </section>;
}

function Workspace({ uid, eventId, openEvent, approved, onContextChange, onShareAcknowledged, onLoadCard }:
  Props & { uid: string; eventId: string; openEvent: (id: string) => void }) {
  const { db } = getSharing();
  const [access, setAccess] = useState<EventAccess | null>(null);
  const [events, setEvents] = useState<{ id: string; title: string }[]>([]);
  const [eventInput, setEventInput] = useState('');
  const [codeError, setCodeError] = useState('');
  const [title, setTitle] = useState('');
  const [timeZone, setTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [withdraw, setWithdraw] = useState(false);
  const [revokeUid, setRevokeUid] = useState('');
  const [reload, setReload] = useState(0);
  const [watchRetry, setWatchRetry] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<string[] | null>(null);
  const [requestError, setRequestError] = useState(false);
  const accessRole = access?.role;
  const organizer = accessRole === 'organizer';

  useEffect(() => {
    let current = true;
    setLoading(true);
    const load = eventId ? readEventAccess(db, eventId, uid).then(value => {
      if (current) setAccess(value);
    }) : listOwnedEvents(db, uid).then(value => { if (current) setEvents(value); });
    load.catch(error => {
      if (current) { setAccess(null); setEvents([]); setStatus(errorText(error)); }
    }).finally(() => {
      if (current) setLoading(false);
    });
    return () => { current = false; };
  }, [db, eventId, uid, reload]);

  useEffect(() => {
    if (!eventId || !accessRole || organizer || accessRole === 'revoked') return;
    return onSnapshot(doc(db, 'events', eventId, 'members', uid), { includeMetadataChanges: true }, snapshot => {
      if (snapshot.metadata.fromCache || snapshot.metadata.hasPendingWrites) return;
      if (snapshot.data()?.active === true && accessRole !== 'participant') {
        setStatus('');
        setReload(value => value + 1);
      } else if (snapshot.data()?.active !== true && (snapshot.exists() || accessRole === 'participant')) {
        setAccess({ role: 'revoked' });
        setReload(value => value + 1);
        onContextChange();
      }
    }, () => {
      setAccess(null);
      onContextChange();
      setStatus('Live access updates stopped. Use Check event access to reconnect.');
    });
  }, [db, eventId, uid, accessRole, organizer, onContextChange]);

  useEffect(() => {
    if (!organizer) return;
    setPending(null);
    setRequestError(false);
    return watchJoinRequests(db, eventId, setPending, () => {
      setPending(null);
      setRequestError(true);
    });
  }, [db, eventId, organizer, watchRetry]);

  const loadedEvent = access?.role === 'organizer' || access?.role === 'participant' ? access.event : null;
  useEffect(() => {
    if (!eventId || !loadedEvent) return;
    return onSnapshot(doc(db, 'events', eventId), { includeMetadataChanges: true }, snapshot => {
      if (snapshot.metadata.fromCache || snapshot.metadata.hasPendingWrites) return;
      const latest = snapshot.data() as Event | undefined;
      if (!latest || latest.inputRevision !== loadedEvent.inputRevision || latest.planRevision !== loadedEvent.planRevision) {
        setAccess(null);
        setReload(value => value + 1);
      }
    }, error => {
      setAccess(null);
      onContextChange();
      if (accessRole === 'participant' && accessDenied(error)) {
        // Revocation can deny the event listener before the membership update arrives.
        setReload(value => value + 1);
      } else {
        setStatus('Live access updates stopped. Use Check event access to reconnect.');
      }
    });
  }, [db, eventId, loadedEvent, accessRole, onContextChange]);

  async function perform(action: () => Promise<void>, message: string) {
    if (busy || !navigator.onLine) return;
    setBusy(true);
    setStatus('Working…');
    try {
      await action();
      if (eventId) setReload(value => value + 1);
      setStatus(message);
    } catch (error) {
      setStatus(errorText(error));
      if (accessDenied(error)) {
        setAccess(null);
        onContextChange();
      } else if (error instanceof Error && error.message === 'CARD_CHANGED') {
        setAccess(null);
        setReload(value => value + 1);
      }
    } finally {
      setBusy(false);
    }
  }

  async function submitCard(card: ApprovedCard | null) {
    if (access?.role !== 'participant') return;
    const operationId = crypto.randomUUID();
    await perform(
      async () => {
        await changeSharedCard(db, eventId, uid, access.card?.revision ?? 0, operationId, card);
        onShareAcknowledged();
      },
      card ? 'Your approved card is shared.' : 'Your card was withdrawn.',
    );
    setWithdraw(false);
  }

  async function copyInvite(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setStatus(label + ' copied.');
    } catch { setStatus('Select the ' + label.toLowerCase() + ' and copy it manually.'); }
  }

  const inviteLink = new URL('/', location.origin);
  if (eventId) inviteLink.searchParams.set('event', eventId);

  return <>
    {!eventId && <>
      {events.length > 0 && <><h3>Your events</h3><ul>{events.map(event => <li key={event.id}>
        <button onClick={() => openEvent(event.id)}>{event.title}</button>
      </li>)}</ul></>}
      <div className="grid event-options">
        <form aria-labelledby="create-event-title" onSubmit={event => {
          event.preventDefault();
          void perform(async () => { openEvent(await createEvent(db, uid, title, timeZone)); }, 'Event created.');
        }}>
          <h3 id="create-event-title">Create an event</h3>
          <p className="hint">Create an event to get an invite link and code to share.</p>
          <label htmlFor="event-title">Event title</label>
          <input id="event-title" name="event-title" autoComplete="off" required maxLength={120}
            value={title} onChange={event => setTitle(event.target.value)}/>
          <label htmlFor="event-zone">Time zone</label>
          <input id="event-zone" name="event-zone" autoComplete="off" autoCapitalize="none" spellCheck={false}
            required maxLength={80} value={timeZone} onChange={event => setTimeZone(event.target.value)}/>
          <button className="primary" disabled={busy}>Create event</button>
        </form>
        <form aria-labelledby="join-event-title" onSubmit={event => {
          event.preventDefault();
          const code = eventInput.trim();
          if (!eventIdPattern.test(code)) {
            setCodeError('Enter the 20-character event code from your organizer.');
            (event.currentTarget.elements.namedItem('event-code') as HTMLInputElement | null)?.focus();
            return;
          }
          openEvent(code);
        }}>
          <h3 id="join-event-title">Join an event</h3>
          <p className="hint" id="event-code-help">Open your organizer’s invite link or paste their event code here.</p>
          <label htmlFor="event-code">Event code from your organizer</label>
          <input id="event-code" name="event-code" autoComplete="off" autoCapitalize="none" spellCheck={false}
            aria-invalid={!!codeError} aria-describedby={codeError ? 'event-code-help event-code-error' : 'event-code-help'}
            value={eventInput} onChange={event => { setEventInput(event.target.value); setCodeError(''); }}/>
          {codeError && <p id="event-code-error" role="alert">{codeError}</p>}
          <button type="submit">Open event</button>
        </form>
      </div>
    </>}
    {eventId && <>
      <div className="actions">
        <button disabled={busy} onClick={() => openEvent('')}>Back to events</button>
        <button disabled={busy || loading} onClick={() => {
          setStatus('');
          if (requestError) setWatchRetry(value => value + 1);
          setReload(value => value + 1);
        }}>Check event access</button>
      </div>
      {access?.role === 'request' && <>
        <p>Ask the organizer to approve your access. Your card stays in this tab.</p>
        <button disabled={busy} onClick={() => void perform(() => requestToJoin(db, eventId, uid), 'Join request submitted.')}>Request to join</button>
      </>}
      <div role="status" aria-atomic="true">
        {accessRole === 'pending' && <p>Waiting for organizer approval. This page will update automatically.</p>}
        {accessRole === 'participant' && <p>You have access to this event.</p>}
        {accessRole === 'revoked' && <p>Your access to this event has ended.</p>}
        {!access && loading && <p>Checking event access…</p>}
      </div>
      {accessRole === 'pending' && <p>Your approval reference is <code translate="no">{uid}</code>. If your organizer asks for it, share it so they can identify your request.</p>}
      {access?.role === 'organizer' && <>
        <h3>{access.event.title}</h3>
        <p>Share the invite link or event code with participants. They’ll appear under Join requests after asking to join.</p>
        <label htmlFor="invite-link">Invite link</label>
        <input id="invite-link" name="invite-link" type="url" value={inviteLink.href} readOnly onFocus={event => event.currentTarget.select()}/>
        <button onClick={() => void copyInvite(inviteLink.href, 'Invite link')}>Copy invite link</button>
        <label htmlFor="invite-code">Event code</label>
        <input id="invite-code" name="invite-code" value={eventId} readOnly onFocus={event => event.currentTarget.select()}/>
        <button onClick={() => void copyInvite(eventId, 'Event code')}>Copy event code</button>
        <h4>Join requests</h4>
        <p role="status" aria-atomic="true">{requestError ? 'Live join requests stopped. Use Check event access to reconnect.'
          : pending === null ? 'Checking join requests…'
          : pending.length === 0 ? 'No requests waiting.' : `${pending.length} ${pending.length === 1 ? 'request' : 'requests'} waiting.`}</p>
        {!!pending?.length && <ul>{pending.map(id => <li key={id}>
          Approval reference <code translate="no">{id}</code> <button disabled={busy} aria-label={`Admit participant ${id}`}
            onClick={() => void perform(() => admit(db, eventId, id), 'Participant admitted.')}>Admit participant</button>
        </li>)}</ul>}
        <OrganizerPlanner key={`${access.event.inputRevision}:${access.event.planRevision}`} event={access.event} eventId={eventId} uid={uid} cards={access.cards}
          refresh={() => setReload(value => value + 1)}/>
        <h4>Participants</h4>
        {access.members.length === 0 ? <p>No active participants.</p> : <ul>{access.members.map(id => <li key={id}>
          <code>{id}</code> {revokeUid === id ? <>
            <button disabled={busy} onClick={() => {
              setRevokeUid('');
              void perform(() => revoke(db, eventId, id), 'Access removed and any shared card withdrawn.');
            }}>Confirm removal</button>
            <button disabled={busy} onClick={() => setRevokeUid('')}>Cancel</button>
          </> : <button disabled={busy} onClick={() => setRevokeUid(id)}>Remove access</button>}
        </li>)}</ul>}
        <h4 id="approved-cards" tabIndex={-1}>Approved cards</h4>
        {access.cards.length === 0 && <p>No cards have been shared.</p>}
        {access.cards.map(card => <div key={card.ownerUid}>
          <p>Participant <code>{card.ownerUid}</code> · revision {card.revision}</p>
          <ul>{card.requirements.map(item => <li key={item.id}>{item.request}</li>)}</ul>
        </div>)}
      </>}
      {access?.role === 'participant' && <>
        <h3>{access.event.title}</h3>
        {access.card?.status === 'approved' ? <>
          <h4>Currently shared · revision {access.card.revision}</h4>
          <ul>{access.card.requirements.map(item => <li key={item.id}>{item.request}</li>)}</ul>
          <p>This version stays shared until its replacement or withdrawal is confirmed.</p>
          <div className="actions">
            <button disabled={busy} onClick={() => { if (access.card) onLoadCard(access.card); }}>Copy shared requests into editor</button>
            {withdraw ? <>
              <button disabled={busy} onClick={() => void submitCard(null)}>Confirm withdrawal</button>
              <button disabled={busy} onClick={() => setWithdraw(false)}>Cancel</button>
            </> : <button disabled={busy} onClick={() => setWithdraw(true)}>Withdraw card</button>}
          </div>
        </> : <p>{access.card ? 'Your card was withdrawn.' : 'You have no shared card.'}</p>}
        {approved && <section className="export-preview" aria-label="Exact requests to share">
          <h4>Share this approved card</h4>
          <p>The event organizer can read these exact requests. Approved requests may be used for AI-assisted event planning when available. Withdrawal cannot undo copies already made.</p>
          <ul>{approved.requirements.map((item, index) => <li key={index}>{item.request}</li>)}</ul>
          <button className="primary" disabled={busy} onClick={() => void submitCard(approved)}>
            {access.card?.status === 'approved' ? 'Share replacement with organizer' : 'Share with organizer'}
          </button>
        </section>}
        {!approved && <p>Preview and approve your card above to share it with the organizer.</p>}
        <ParticipantPlan event={access.event} eventId={eventId} uid={uid} card={access.card}/>
      </>}
    </>}
    {!eventId && loading && <p role="status">Loading your events…</p>}
    <OperationStatus busy={busy} message={status}/>
  </>;
}
