import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import type { ApprovedCard } from './domain.ts';
import {
  admit, changeSharedCard, createEvent, endSession, eventIdPattern, getSharing,
  listOwnedEvents, readEventAccess, requestToJoin, revoke, sharingConfigured, sharingEmulator, signIn,
} from './sharing.ts';
import type { Event, EventAccess, SharedCard } from './sharing.ts';
import { OrganizerPlanner, ParticipantPlan } from './PlanningPanel.tsx';

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

function errorText(error: unknown) {
  if (error instanceof Error && error.message === 'CARD_CHANGED') {
    return 'The shared card changed. Refresh event access and review the current version before replacing it.';
  }
  if (error instanceof Error && error.message === 'INVALID_TITLE') return 'Enter an event title.';
  if (error instanceof Error && 'code' in error && error.code === 'permission-denied') {
    return 'Access was denied. Refresh event access to check your membership.';
  }
  return 'The request could not be confirmed. Check your connection and try again.';
}

export default function SharingPanel(props: Props) {
  const online = useSyncExternalStore(subscribeConnection, () => navigator.onLine);
  const [uid, setUid] = useState<string | null | undefined>(undefined);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [eventId, setEventId] = useState(() => {
    const id = new URLSearchParams(location.search).get('event') ?? '';
    return eventIdPattern.test(id) ? id : '';
  });
  useEffect(() => sharingConfigured() ? onAuthStateChanged(getSharing().auth, user => {
    setUid(user?.uid ?? null);
  }, () => {
    setUid(null);
    setStatus('Sign-in could not be loaded.');
  }) : undefined, []);
  useEffect(() => { props.onContextChange(); }, [uid, eventId, props.onContextChange]);

  function openEvent(id: string) {
    const url = new URL(location.href);
    if (id) url.searchParams.set('event', id);
    else url.searchParams.delete('event');
    history.replaceState(null, '', url);
    setEventId(id);
  }

  async function authenticate(action: () => Promise<unknown>) {
    if (!navigator.onLine) return;
    setBusy(true);
    setStatus('');
    try { await action(); }
    catch { setStatus('Sign-in could not be completed. Try again.'); }
    finally { setBusy(false); }
  }

  return <section className="panel approval" aria-labelledby="sharing-title">
    <h2 id="sharing-title">Event sharing</h2>
    <div role="status">{!online && <p>Connect to use event sharing. You can still prepare and download a card.</p>}</div>
    {online && uid === undefined && <p role="status">{sharingConfigured() ? 'Checking sign-in…' : 'Event sharing needs Firebase configuration.'}</p>}
    {online && uid === null && <>
      <p>Sign in to create an event or request access to one.</p>
      <button disabled={busy} onClick={() => void authenticate(signIn)}>{sharingEmulator ? 'Start demo session' : 'Sign in with Google'}</button>
    </>}
    {online && uid && <>
      <div className="actions"><button disabled={busy} onClick={() => void authenticate(endSession)}>Sign out</button></div>
      <Workspace key={uid + ':' + eventId} {...props} uid={uid} eventId={eventId} openEvent={openEvent}/>
    </>}
    {status && <p role="status">{status}</p>}
  </section>;
}

function Workspace({ uid, eventId, openEvent, approved, onContextChange, onShareAcknowledged, onLoadCard }:
  Props & { uid: string; eventId: string; openEvent: (id: string) => void }) {
  const { db } = getSharing();
  const [access, setAccess] = useState<EventAccess | null>(null);
  const [events, setEvents] = useState<{ id: string; title: string }[]>([]);
  const [eventInput, setEventInput] = useState(eventId);
  const [title, setTitle] = useState('');
  const [timeZone, setTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [withdraw, setWithdraw] = useState(false);
  const [revokeUid, setRevokeUid] = useState('');
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let current = true;
    setStatus(eventId ? 'Checking event access…' : 'Loading your events…');
    const load = eventId ? readEventAccess(db, eventId, uid).then(value => {
      if (current) setAccess(value);
    }) : listOwnedEvents(db, uid).then(value => { if (current) setEvents(value); });
    load.then(() => { if (current) setStatus(''); }).catch(error => {
      if (current) { setAccess(null); setEvents([]); setStatus(errorText(error)); }
    });
    return () => { current = false; };
  }, [db, eventId, uid, reload]);

  useEffect(() => {
    if (!eventId || access?.role !== 'participant') return;
    return onSnapshot(doc(db, 'events', eventId, 'members', uid), { includeMetadataChanges: true }, snapshot => {
      if (!snapshot.metadata.fromCache && snapshot.data()?.active !== true) {
        setAccess({ role: 'revoked' });
        onContextChange();
      }
    }, () => {
      setAccess(null);
      onContextChange();
      setStatus('Event access could not be confirmed. Refresh to continue.');
    });
  }, [db, eventId, uid, access?.role, onContextChange]);

  const loadedEvent = access?.role === 'organizer' || access?.role === 'participant' ? access.event : null;
  const isEventParticipant = access?.role === 'participant';
  useEffect(() => {
    if (!eventId || !isEventParticipant) return;
    const refreshOnReturn = () => {
      if (document.visibilityState === 'visible') setReload(value => value + 1);
    };
    document.addEventListener('visibilitychange', refreshOnReturn);
    return () => document.removeEventListener('visibilitychange', refreshOnReturn);
  }, [eventId, isEventParticipant]);

  useEffect(() => {
    if (!eventId || !loadedEvent) return;
    return onSnapshot(doc(db, 'events', eventId), { includeMetadataChanges: true }, snapshot => {
      if (snapshot.metadata.fromCache) return;
      const latest = snapshot.data() as Event | undefined;
      if (!latest || latest.inputRevision !== loadedEvent.inputRevision || latest.planRevision !== loadedEvent.planRevision) {
        setAccess(null);
        setReload(value => value + 1);
      }
    }, () => {
      setAccess(null);
      onContextChange();
    });
  }, [db, eventId, loadedEvent, onContextChange]);

  async function perform(action: () => Promise<void>, message: string) {
    if (busy || !navigator.onLine) return;
    setBusy(true);
    setStatus('Working…');
    try {
      await action();
      if (eventId) {
        try { setAccess(await readEventAccess(db, eventId, uid)); }
        catch { setAccess(null); setStatus(message + ' Refresh event access to view the current state.'); return; }
      }
      setStatus(message);
    } catch (error) {
      setStatus(errorText(error));
      if (eventId) setAccess(null);
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

  return <>
    {!eventId && <>
      <form onSubmit={event => {
        event.preventDefault();
        if (!eventIdPattern.test(eventInput.trim())) { setStatus('Enter the event code from your organizer.'); return; }
        openEvent(eventInput.trim());
      }}>
        <label htmlFor="event-code">Event code</label>
        <input id="event-code" value={eventInput} onChange={event => setEventInput(event.target.value)} maxLength={20}/>
        <button type="submit">Open event</button>
      </form>
      <h3>Create an event</h3>
      <form onSubmit={event => {
        event.preventDefault();
        void perform(async () => { openEvent(await createEvent(db, uid, title, timeZone)); }, 'Event created.');
      }}>
        <label htmlFor="event-title">Event title</label>
        <input id="event-title" required maxLength={120} value={title} onChange={event => setTitle(event.target.value)}/>
        <label htmlFor="event-zone">Time zone</label>
        <input id="event-zone" required maxLength={80} value={timeZone} onChange={event => setTimeZone(event.target.value)}/>
        <div className="actions"><button disabled={busy}>Create event</button></div>
      </form>
      {events.length > 0 && <><h3>Your events</h3><ul>{events.map(event => <li key={event.id}>
        <button onClick={() => openEvent(event.id)}>{event.title}</button>
      </li>)}</ul></>}
    </>}
    {eventId && <>
      <div className="actions">
        <button disabled={busy} onClick={() => openEvent('')}>Back to events</button>
        <button disabled={busy} onClick={() => setReload(value => value + 1)}>Refresh event access</button>
      </div>
      {access?.role === 'request' && <>
        <p>Ask the organizer to approve your access. Your card stays in this tab.</p>
        <button disabled={busy} onClick={() => void perform(() => requestToJoin(db, eventId, uid), 'Join request submitted.')}>Request to join</button>
      </>}
      {access?.role === 'pending' && <p>Your request is awaiting organizer approval. Your request code is <code>{uid}</code>.</p>}
      {access?.role === 'revoked' && <p>Your access to this event has ended.</p>}
      {access?.role === 'organizer' && <>
        <h3>{access.event.title}</h3>
        <p>Share this event link with your participants. Each person still needs your approval.</p>
        <label htmlFor="invite-link">Event link</label>
        <input id="invite-link" type="url" value={location.href} readOnly onFocus={event => event.currentTarget.select()}/>
        <button onClick={async () => {
          try {
            await navigator.clipboard.writeText(location.href);
            setStatus('Event link copied.');
          } catch { setStatus('Select the event link and copy it manually.'); }
        }}>Copy event link</button>
        <OrganizerPlanner key={`${access.event.inputRevision}:${access.event.planRevision}`} event={access.event} eventId={eventId} uid={uid} cards={access.cards}
          refresh={() => setReload(value => value + 1)}/>
        <h4>Join requests</h4>
        {access.pending.length === 0 ? <p>No requests waiting.</p> : <ul>{access.pending.map(id => <li key={id}>
          <code>{id}</code> <button disabled={busy} onClick={() => void perform(() => admit(db, eventId, id), 'Participant admitted.')}>Admit {id}</button>
        </li>)}</ul>}
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
        <h4>Approved cards</h4>
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
    <p role="status">{status}</p>
  </>;
}
