import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { EventInvite, InviteCopyButton } from './EventInvite.tsx';
import { JoinForm } from './JoinForm.tsx';
import { eventPath } from './routes.ts';
import type { WorkspacePage } from './routes.ts';
import { doc, onSnapshot } from 'firebase/firestore';
import type { ApprovedCard } from './domain.ts';
import {
  admit, changeSharedCard, createEvent, getSharing,
  listOwnedEvents, readEventAccess, requestToJoin, revoke, watchJoinRequests,
} from './sharing.ts';
import type { Event, EventAccess, SharedCard } from './sharing.ts';
import { OrganizerPlanner, ParticipantPlan } from './PlanningPanel.tsx';
import { OperationStatus } from './OperationStatus.tsx';

type Props = {
  approved: ApprovedCard | null;
  uid: string;
  page: WorkspacePage;
  eventId: string;
  navigate: (href: string) => void;
  onContextChange: () => void;
  onShareAcknowledged: () => void;
  onNotify: (message: string) => void;
  onLoadCard: (card: SharedCard) => void;
};

const accessDenied = (error: unknown) =>
  error instanceof Error && 'code' in error && error.code === 'permission-denied';

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

const currentZone = () => {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  return zone === 'Asia/Calcutta' ? 'Asia/Kolkata' : zone;
};

const timeZones = ['UTC', ...Intl.supportedValuesOf('timeZone').map(zone => zone === 'Asia/Calcutta' ? 'Asia/Kolkata' : zone)]
  .filter((zone, index, all) => all.indexOf(zone) === index);

export default function SharingPanel({ uid, eventId, page, navigate, approved, onContextChange, onShareAcknowledged, onLoadCard, onNotify }: Props) {
  const openEvent = (code: string) => navigate(eventPath(code));
  const { db } = getSharing();
  const [access, setAccess] = useState<EventAccess | null>(null);
  const [events, setEvents] = useState<Awaited<ReturnType<typeof listOwnedEvents>>>([]);
  const [title, setTitle] = useState('');
  const [timeZone, setTimeZone] = useState(currentZone);
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
    }) : page === '/events' ? listOwnedEvents(db, uid).then(value => { if (current) setEvents(value); }) : Promise.resolve();
    load.catch(error => {
      if (current) { setAccess(null); setEvents([]); setStatus(errorText(error)); }
    }).finally(() => {
      if (current) setLoading(false);
    });
    return () => { current = false; };
  }, [db, eventId, uid, page, reload]);

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
      onNotify(message);
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
      onNotify(label + ' copied.');
      return true;
    } catch {
      setStatus('Select the ' + label.toLowerCase() + ' and copy it manually.');
      return false;
    }
  }

  const inviteLink = new URL(eventPath(eventId), location.origin).href;

  return <>
    {!eventId && page === '/events' && <>
      <div className="actions"><a className="button primary" href="/events/new">Create an event</a>
        <a className="button secondary" href="/join">Join an event</a></div>
      {!loading && events.length === 0 && <div className="event-empty">
        <CalendarDays size={36} strokeWidth={1.5} aria-hidden="true"/><h3>No events you organize yet</h3>
        <p>Create an event to invite participants, or use an event code to join one.</p>
      </div>}
      <div className="grid event-grid">{events.map(event => <article className="panel event-tile" key={event.id}>
        <span className="role-label">Organizer</span><h3>{event.title}</h3><p>{event.timeZone}</p>
        <div className="actions"><InviteCopyButton copy={() => copyInvite(new URL(eventPath(event.id), location.origin).href, 'Invite link')}>Copy invite link</InviteCopyButton>
          <InviteCopyButton copy={() => copyInvite(event.id, 'Event code')}>Copy code</InviteCopyButton>
          <a className="button secondary" href={eventPath(event.id)}>Open <span className="visually-hidden">{event.title}</span><ArrowRight size={16} aria-hidden="true"/></a></div>
      </article>)}</div>
    </>}
    {!eventId && page === '/events/new' && <form className="focused-form" onSubmit={event => {
      event.preventDefault();
      void perform(async () => {
        const zone = timeZone.trim() === 'Asia/Calcutta' ? 'Asia/Kolkata' : timeZone.trim();
        openEvent(await createEvent(db, uid, title, zone));
      }, 'Event created.');
    }}>
      <p className="hint">Create an event to get an invitation to share.</p>
      <label htmlFor="event-title">Event title</label>
      <input id="event-title" name="event-title" autoComplete="off" required maxLength={120} value={title} onChange={event => setTitle(event.target.value)}/>
      <label htmlFor="event-zone">Time zone</label>
      <input id="event-zone" name="event-zone" list="event-zones" autoComplete="off" autoCapitalize="none" spellCheck={false}
        required maxLength={80} value={timeZone} onChange={event => setTimeZone(event.target.value)}/>
      <datalist id="event-zones">{timeZones.map(zone => <option value={zone} key={zone}/>)}</datalist>
      <div className="actions form-footer"><a className="button secondary" href="/events">Cancel</a>
        <button className="primary" disabled={busy}>Create event</button></div>
    </form>}
    {!eventId && page === '/join' && <JoinForm open={openEvent}/>}
    {eventId && <>
      <div className="actions">
        <a className="button secondary" href="/events">Back to events</a>
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
      </div>
      {!access && loading && <OperationStatus busy message="Checking event access…"/>}
      {accessRole === 'pending' && <p>Your approval reference is <code translate="no">{uid}</code>. If your organizer asks for it, share it so they can identify your request.</p>}
      {access?.role === 'organizer' && <>
        <h3>{access.event.title}</h3>
        <EventInvite code={eventId} inviteLink={inviteLink} copy={copyInvite}/>
        <h4>Join requests</h4>
        <p role="status" aria-atomic="true">{requestError ? 'Live join requests stopped. Use Check event access to reconnect.'
          : pending === null ? 'Checking join requests…'
          : pending.length === 0 ? 'No requests waiting.' : `${pending.length} ${pending.length === 1 ? 'request' : 'requests'} waiting.`}</p>
        {!!pending?.length && <ul>{pending.map(id => <li key={id}>
          Approval reference <code translate="no">{id}</code> <button disabled={busy} aria-label={`Admit participant ${id}`}
            onClick={() => void perform(() => admit(db, eventId, id), 'Participant admitted.')}>Admit participant</button>
        </li>)}</ul>}
        <OrganizerPlanner key={`${access.event.inputRevision}:${access.event.planRevision}`} event={access.event} eventId={eventId} uid={uid} cards={access.cards}
          refresh={() => setReload(value => value + 1)} onNotify={onNotify}/>
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
        {!approved && <p><a href={'/card?event=' + eventId}>Prepare and approve your card</a> before sharing it with the organizer.</p>}
        <ParticipantPlan event={access.event} eventId={eventId} uid={uid} card={access.card} onNotify={onNotify}/>
      </>}
    </>}
    {!eventId && loading && page === '/events' && <OperationStatus busy message="Loading your events…"/>}
    <OperationStatus busy={busy} message={status}/>
  </>;
}
