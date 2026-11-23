import React, { useEffect, useRef, useState } from 'react';
import { createCloudProposal, organizerCloudEnabled } from './organizerCloud.ts';
import { maxPlanningItems, publicAgenda } from './planning.ts';
import type { AgendaSlot, Choice, PlanningInput, Proposal, VenueFact } from './planning.ts';
import { confirmPlan, loadPlanFeedback, loadPlanningSnapshot, publishPlan, readCurrentPlan, readOrganizerPublication, respondToOutcome, storeProposal, updateAgenda } from './planRepository.ts';
import type { ConfirmationStatus, RequestOutcome } from './planRepository.ts';
import { getSharing } from './sharing.ts';
import type { Event, SharedCard } from './sharing.ts';
import { OperationStatus } from './OperationStatus.tsx';

const defaults = (event: Event): Choice[] => event.agenda.map(slot => ({ slotId: slot.id, option: 'original' }));
const nextId = (prefix: string, items: { id: string }[]) => {
  return Array.from({ length: 99 }, (_, i) => prefix + String(i + 1).padStart(2, '0'))
    .find(id => !items.some(item => item.id === id))!;
};
const failure = (error: unknown) => {
  if (error instanceof Error && error.message === 'STALE_PLAN') return 'Event inputs changed. Refresh before continuing.';
  if (error instanceof Error && error.message === 'INVALID_EVENT_INPUTS') return 'Check agenda times, ordering, and venue facts for each alternate.';
  if (error instanceof Error && error.message === 'INVALID_PROPOSAL') return 'The proposal could not be verified against the current inputs.';
  if (error instanceof Error && error.message === 'TOO_MANY_CARDS') return 'This demo supports up to 25 participants per plan.';
  return 'The operation could not be confirmed. Try again or use the manual agenda controls.';
};

const requestResponseLabel = { met: 'Works for me', unmet: 'Still need help' };
const decisionLabel = { checking: 'Still checking', unavailable: 'Can’t provide' } as const;
const responseLabel = { met: 'Meets my needs', unmet: 'Does not meet my needs', unknown: 'I’m unsure' };

export function OrganizerPlanner({ event, eventId, uid, cards, refresh, onNotify }:
  { event: Event; eventId: string; uid: string; cards: SharedCard[]; refresh: () => void; onNotify: (message: string) => void }) {
  const { db, auth } = getSharing();
  const [agenda, setAgenda] = useState(event.agenda);
  const [facts, setFacts] = useState(event.venueFacts);
  const [choices, setChoices] = useState(defaults(event));
  const [snapshot, setSnapshot] = useState<Awaited<ReturnType<typeof loadPlanningSnapshot>> | null>(null);
  const [suggestion, setSuggestion] = useState<{ proposal: Proposal; input: PlanningInput } | null>(null);
  const [decisions, setDecisions] = useState(() => new Map<string, RequestOutcome[]>());
  const [confirm, setConfirm] = useState(false);
  const [editing, setEditing] = useState(!event.agenda.length);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [feedback, setFeedback] = useState<Awaited<ReturnType<typeof loadPlanFeedback>> | null>(null);
  const [loadingPublication, setLoadingPublication] = useState(!!event.currentPlanId);
  const initialPublication = useRef({ event, cards });
  const newField = useRef<string | null>(null);
  const cloud = organizerCloudEnabled();

  useEffect(() => {
    const { event, cards } = initialPublication.current;
    if (!event.currentPlanId) return;
    let active = true;
    readOrganizerPublication(db, eventId, event.currentPlanId, cards).then(({ plan, decisions }) => {
      if (!active) return;
      setDecisions(decisions);
      setChoices(event.agenda.map((slot, index) => ({ slotId: slot.id,
        option: slot.title === plan.agenda[index]?.title ? 'original' : 'alternate' })));
    }).catch(() => {
      if (active) setStatus('The published outcomes could not be loaded. Review each request before publishing again.');
    }).finally(() => { if (active) setLoadingPublication(false); });
    return () => { active = false; };
  }, [db, eventId]);

  useEffect(() => {
    if (!newField.current) return;
    document.getElementById(newField.current)?.focus();
    newField.current = null;
  }, [agenda.length, facts.length]);

  const plan = (() => { try { return publicAgenda(choices, event); } catch { return null; } })();
  const unverifiedFacts = event.venueFacts.filter(fact => fact.status === 'unknown');
  const conflicts = suggestion?.input.requirements.filter(item => suggestion.proposal.conflicts.includes(item.ref)) ?? [];
  const unknowns = suggestion?.input.requirements.filter(item => suggestion.proposal.unknowns.includes(item.ref)) ?? [];
  const undecided = cards.reduce((count, card) => count + card.requirements.filter((_, index) =>
    (decisions.get(card.ownerUid)?.[index] ?? 'checking') === 'checking').length, 0);
  const needsFollowUp = cards.length > 0 || conflicts.length > 0 || unknowns.length > 0 || unverifiedFacts.length > 0;

  async function perform(action: () => Promise<void>, message: string, pending = 'Working…') {
    if (!navigator.onLine) return;
    setBusy(true);
    setStatus(pending);
    try { await action(); setStatus(message); onNotify(message); }
    catch (error) { setStatus(failure(error)); }
    finally { setBusy(false); }
  }

  function editSlot(id: string, change: Partial<AgendaSlot>) {
    setAgenda(items => items.map(slot => slot.id === id ? { ...slot, ...change } : slot));
  }

  return <section className="export-preview" aria-labelledby="organizer-planning">
    <h3 id="organizer-planning">Plan the agenda</h3>
    <p>Active participants can access the agenda options and venue facts. Keep these entries about the event.</p>
    {event.currentPlanId ? <p>Agenda revision {event.planRevision} is published.</p> :
      event.planRevision > 0 && <p>The earlier agenda is out of date. Review current inputs before publishing again.</p>}
    {cards.length > 0 && <section className="export-preview" aria-labelledby="request-decisions">
      <h4 id="request-decisions">Needs a decision</h4>
      <p>{loadingPublication ? 'Loading published outcomes…' :
        <>{undecided === 1 ? '1 request is' : `${undecided} requests are`} waiting for an answer.</>}
        {' '}Outcomes are shared privately when you publish the agenda.</p>
      {cards.map(card => <fieldset key={card.ownerUid} disabled={busy || loadingPublication}>
        <legend>Participant <code>{card.ownerUid}</code></legend>
        {card.requirements.map(({ id, request }, index) => <label key={id}>
          {request}
          <select value={String(decisions.get(card.ownerUid)?.[index] ?? 'checking')} onChange={event => {
            const value = event.target.value;
            const outcome = value === 'checking' || value === 'unavailable' ? value : Number(value);
            setDecisions(previous => new Map(previous).set(card.ownerUid, card.requirements.map((_, position) =>
              position === index ? outcome : previous.get(card.ownerUid)?.[position] ?? 'checking')));
            setConfirm(false);
          }}>
            <option value="checking">{decisionLabel.checking}</option>
            <option value="unavailable">{decisionLabel.unavailable}</option>
            {plan?.map((slot, position) => <option key={slot.id} value={position}>Planned · {slot.start} {slot.title}</option>)}
          </select>
        </label>)}
      </fieldset>)}
    </section>}
    <button disabled={busy} aria-expanded={editing} aria-controls="agenda-editor" onClick={() => {
      setEditing(value => !value);
      setConfirm(false);
      setSnapshot(null);
    }}>{editing ? 'Close agenda editor' : 'Edit agenda and venue facts'}</button>
    <fieldset id="agenda-editor" disabled={busy} hidden={!editing}>
      <legend>Agenda and venue facts</legend>
      <h4>Venue facts</h4>
      {facts.map((fact, index) => <fieldset key={fact.id}>
        <legend>Venue fact {index + 1}</legend>
        <label>Fact <input id={`venue-${fact.id}`} name={`venue-${fact.id}`} autoComplete="off"
          value={fact.statement} maxLength={240} onChange={e => {
          const statement = e.target.value;
          setFacts(items => items.map(item => item.id === fact.id ? { ...item, statement } : item));
        }}/></label>
        <label>Status <select value={fact.status} onChange={e => {
          const status = e.target.value as VenueFact['status'];
          setFacts(items => items.map(item => item.id === fact.id ? { ...item, status } : item));
        }}><option value="unknown">Unknown</option><option value="verified">Verified</option></select></label>
        <button onClick={() => {
          setFacts(items => items.filter(item => item.id !== fact.id));
          setAgenda(items => items.map(slot => slot.factId === fact.id ? { ...slot, alternate: '', factId: '' } : slot));
        }}>Remove venue fact {index + 1}</button>
      </fieldset>)}
      <button disabled={facts.length >= maxPlanningItems} onClick={() => {
        const id = nextId('A', facts);
        newField.current = `venue-${id}`;
        setFacts(items => [...items, { id, statement: '', status: 'unknown' }]);
      }}>Add a venue fact</button>
      <h4>Agenda slots</h4>
      <p className="hint" id="agenda-time-hint">Enter times in 24-hour format, such as 09:30 or 14:00.</p>
      {agenda.map((slot, index) => <fieldset key={slot.id}>
        <legend>Agenda slot {index + 1}</legend>
        <label>Activity <input id={`activity-${slot.id}`} name={`activity-${slot.id}`} autoComplete="off"
          value={slot.title} maxLength={120} onChange={e => editSlot(slot.id, { title: e.target.value })}/></label>
        <label>Start time <input name={`start-${slot.id}`} autoComplete="off" aria-describedby="agenda-time-hint"
          value={slot.start} maxLength={5} onChange={e => editSlot(slot.id, { start: e.target.value })}/></label>
        <label>End time <input name={`end-${slot.id}`} autoComplete="off" aria-describedby="agenda-time-hint"
          value={slot.end} maxLength={5} onChange={e => editSlot(slot.id, { end: e.target.value })}/></label>
        <label>Alternate activity <input name={`alternate-${slot.id}`} autoComplete="off" value={slot.alternate} maxLength={120} onChange={e =>
          editSlot(slot.id, { alternate: e.target.value, factId: e.target.value ? slot.factId : '' })}/></label>
        {slot.alternate && <label>Supporting venue fact <select value={slot.factId} onChange={e => editSlot(slot.id, { factId: e.target.value })}>
          <option value="">Choose a fact</option>
          {facts.map(item => <option key={item.id} value={item.id}>{item.statement || 'Unnamed fact'} · {item.status}</option>)}
        </select></label>}
        <button onClick={() => setAgenda(items => items.filter(item => item.id !== slot.id))}>Remove agenda slot {index + 1}</button>
      </fieldset>)}
      <button disabled={agenda.length >= maxPlanningItems} onClick={() => {
        const id = nextId('S', agenda);
        newField.current = `activity-${id}`;
        setAgenda(items => [...items, { id, start: '', end: '', title: '', alternate: '', factId: '' }]);
      }}>Add an agenda slot</button>
      <button className="primary" onClick={() => void perform(async () => {
        await updateAgenda(db, eventId, event, agenda, facts);
        setEditing(false);
        refresh();
      }, 'Agenda saved.', 'Saving agenda and venue facts…')}>Save agenda and venue facts</button>
    </fieldset>
    {!editing && !loadingPublication && event.agenda.length > 0 && <>
      <h4>Choose activities to publish</h4>
      {event.agenda.map((slot, index) => <label key={slot.id}>
        {slot.start}–{slot.end}
        <select disabled={busy} value={choices[index]?.option ?? 'original'} onChange={e => {
          const option = e.target.value as Choice['option'];
          setChoices(items => items.map(item => item.slotId === slot.id ? { ...item, option } : item));
          setConfirm(false);
        }}>
          <option value="original">{slot.title}</option>
          {slot.alternate && <option value="alternate" disabled={!event.venueFacts.some(fact => fact.id === slot.factId && fact.status === 'verified')}>
            {slot.alternate}{event.venueFacts.some(fact => fact.id === slot.factId && fact.status === 'verified') ? '' : ' (venue fact unverified)'}
          </option>}
        </select>
      </label>)}
      {cloud && <button disabled={busy} onClick={() => void perform(async () => {
        setSuggestion(null); setConfirm(false);
        setSnapshot(await loadPlanningSnapshot(db, eventId, uid));
      }, 'Review the cloud inputs.')}>Preview cloud planning inputs</button>}
      {snapshot && <section className="panel">
        <h4>Cloud planning inputs</h4>
        <p>Generating sends these agenda options, venue facts, and {snapshot.input.requirements.length} approved requests to Firebase AI Logic.</p>
        <p>Use manual planning if these inputs contain private explanations.</p>
        <ul>{snapshot.input.requirements.map(item => <li key={item.ref}>{item.request}</li>)}</ul>
        <details><summary>Exact input sent to the model</summary><pre>{JSON.stringify(snapshot.input, null, 2)}</pre></details>
        <button disabled={busy || !snapshot.input.requirements.length} onClick={() => void perform(async () => {
          const live = await loadPlanningSnapshot(db, eventId, uid);
          if (JSON.stringify(live.input) !== JSON.stringify(snapshot.input)) throw new Error('STALE_PLAN');
          const result = await createCloudProposal(auth.app, snapshot.input);
          await storeProposal(db, eventId, snapshot, result.proposal, result.model);
          setSuggestion({ proposal: result.proposal, input: snapshot.input });
          setChoices(result.proposal.proposedAgenda);
          setConfirm(false);
          setSnapshot(null);
        }, 'Cloud proposal ready for organizer review.', 'Generating the cloud proposal…')}>Generate cloud proposal</button>
      </section>}
      {suggestion && <section className="panel">
        <h4>Cloud proposal reasoning</h4>
        {suggestion.proposal.changes.map(item => <p key={item.slotId}>
          {item.slotId} addresses {item.requirementRefs.join(', ')} using {item.factRefs.join(', ')}.
        </p>)}
        <details>
          <summary>Approved requests and venue facts</summary>
          <ul>
            {suggestion.input.requirements.map(item => <li key={item.ref}>{item.ref} · {item.request}</li>)}
            {suggestion.input.venueFacts.map(item => <li key={item.id}>{item.id} · {item.statement} ({item.status})</li>)}
          </ul>
        </details>
      </section>}
      {plan && <>
        <h4>Exact agenda participants will see</h4>
        <ol>{plan.map(slot => <li key={slot.id}>{slot.start}–{slot.end} {slot.title}</li>)}</ol>
        {needsFollowUp &&
          <section className="notice" aria-labelledby="publish-follow-up">
            <h4 id="publish-follow-up">Follow up before publishing</h4>
            {conflicts.length > 0 && <>
              <h5>Conflicting requests flagged in the proposal</h5>
              <ul>{conflicts.map(item => <li key={item.ref}>{item.ref} · {item.request}</li>)}</ul>
            </>}
            {unknowns.length > 0 && <>
              <h5>Requests the proposal flagged for more information</h5>
              <ul>{unknowns.map(item => <li key={item.ref}>{item.ref} · {item.request}</li>)}</ul>
            </>}
            {unverifiedFacts.length > 0 && <>
              <h5>Unverified venue facts</h5>
              <ul>{unverifiedFacts.map(fact => <li key={fact.id}>{fact.statement}</li>)}</ul>
            </>}
            {cards.length > 0 && <p>Check the <a href="#approved-cards">approved cards</a> against this exact agenda.</p>}
            <p id="publish-follow-up-instructions">Follow up on anything still open before you approve, or let affected participants know what is still pending.</p>
          </section>}
        <label className="check"><input type="checkbox" checked={confirm} disabled={busy}
          aria-describedby={needsFollowUp ? 'publish-follow-up-instructions' : undefined} onChange={e => setConfirm(e.target.checked)}/>
          I reviewed and approve this agenda and the private request outcomes.
        </label>
        <button className="primary" disabled={busy || !confirm} onClick={() => void perform(async () => {
          await publishPlan(db, eventId, event, choices, cards, decisions);
          setConfirm(false);
          refresh();
        }, 'Agenda published.', 'Publishing the agenda…')}>Publish agenda</button>
      </>}
    </>}
    {event.currentPlanId && <>
      <h4>Participant feedback</h4>
      <p>Responses apply to agenda revision {event.planRevision}. Earlier agendas may have a single response for the whole card.</p>
      <button disabled={busy} onClick={() => void perform(async () => {
        setFeedback(await loadPlanFeedback(db, eventId, event, cards));
      }, 'Feedback refreshed.')}>Refresh participant feedback</button>
      {feedback && (feedback.length ? feedback.map(row => <section className="panel" key={row.card.ownerUid}>
        <h5>Participant <code>{row.card.ownerUid}</code></h5>
        {row.responses ? <ul>{row.card.requirements.map(({ id, request }, index) => {
          const response = row.responses[index];
          return response ? <li key={id}>{request} · {requestResponseLabel[response]}</li> : null;
        })}</ul> : <p>{responseLabel[row.status]}</p>}
      </section>) : <p>No responses for this revision.</p>)}
    </>}
    <OperationStatus busy={busy} message={status}/>
  </section>;
}

export function ParticipantPlan({ event, eventId, uid, card, onNotify }:
  { event: Event; eventId: string; uid: string; card: SharedCard | null; onNotify: (message: string) => void }) {
  const { db } = getSharing();
  const [plan, setPlan] = useState<Awaited<ReturnType<typeof readCurrentPlan>>>(null);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    setPlan(null);
    setStatus('');
    readCurrentPlan(db, eventId, event, uid, card).then(value => {
      if (active) setPlan(value);
    }).catch(() => { if (active) setStatus('The current plan could not be loaded. Use Check event access to try again.'); });
    return () => { active = false; };
  }, [db, event, eventId, uid, card]);
  const current = plan?.id === event.currentPlanId && plan.inputRevision === event.inputRevision &&
    plan.planRevision === event.planRevision ? plan : null;

  async function submit(value: ConfirmationStatus) {
    if (!current || !card || busy || !navigator.onLine) return;
    setBusy(true);
    setStatus('Recording your response…');
    try {
      await confirmPlan(db, eventId, uid, current, card, value);
      setPlan({ ...current, confirmation: value });
      setStatus('Your confirmation was recorded.');
      onNotify('Your confirmation was recorded.');
    } catch (error) { setStatus(failure(error)); }
    finally { setBusy(false); }
  }

  async function submitRequest(index: number, value: 'met' | 'unmet') {
    if (!current?.publishedOutcomes || busy || !navigator.onLine) return;
    setBusy(true);
    setStatus('Recording your response…');
    try {
      const publishedOutcomes = await respondToOutcome(db, eventId, uid, current.id, index, value);
      setPlan(previous => previous?.id === current.id ? { ...previous, publishedOutcomes } : previous);
      setStatus('Your response was recorded.');
      onNotify('Your response was recorded.');
    } catch (error) { setStatus(failure(error)); }
    finally { setBusy(false); }
  }

  return <section className="export-preview">
    {current?.publishedOutcomes && card?.status === 'approved' && <section className="request-outcomes" aria-labelledby="request-outcomes">
      <h4 id="request-outcomes">What changed for you</h4>
      <p>These outcomes apply to your card and agenda revision {current.planRevision}.</p>
      {card.requirements.map(({ id, request }, index) => {
        const outcome = current.publishedOutcomes?.outcomes[index] ?? 'checking';
        const response = current.publishedOutcomes?.responses[index];
        const slot = typeof outcome === 'number' ? current.agenda[outcome] : null;
        return <section key={id} className="panel" aria-labelledby={`outcome-${id}`}>
          <h5 id={`outcome-${id}`}>{request}</h5>
          {slot ? <>
            <p>Planned · {slot.start}–{slot.end} {slot.title}</p>
            <div className="actions">{(['met', 'unmet'] as const).map(value =>
              <button key={value} disabled={busy} aria-pressed={response === value}
                aria-label={`${requestResponseLabel[value]}: ${request}`} onClick={() => void submitRequest(index, value)}>
                {requestResponseLabel[value]}
              </button>,
            )}</div>
          </> : <p>{typeof outcome === 'string' ? decisionLabel[outcome] : decisionLabel.checking}</p>}
        </section>;
      })}
    </section>}
    <h4>Published agenda</h4>
    {current ? <>
      <p>Revision {current.planRevision} · {event.timeZone}</p>
      <ol>{current.agenda.map(slot => <li key={slot.id}>{slot.start}–{slot.end} {slot.title}</li>)}</ol>
      {card?.status === 'approved' && !current.publishedOutcomes && <>
        <p>Does this agenda meet the requests on your shared card? Your response covers your whole card for this agenda revision.</p>
        <div className="actions">{(['met', 'unmet', 'unknown'] as const).map(value =>
          <button key={value} disabled={busy} aria-pressed={current.confirmation === value} onClick={() => void submit(value)}>
            {responseLabel[value]}
          </button>,
        )}</div>
        {current.confirmation && <p>Your recorded response: {current.confirmation}.</p>}
      </>}
    </> : !status && (event.currentPlanId
      ? <OperationStatus busy message="Loading the published agenda…"/>
      : <p>{event.planRevision ? 'An earlier agenda is out of date. The organizer can publish a new one.' : 'The organizer has not published an agenda.'}</p>)}
    <OperationStatus busy={busy} message={status}/>
  </section>;
}
