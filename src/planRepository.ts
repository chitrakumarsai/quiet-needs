import {
  collection, doc, getDocFromServer, getDocsFromServer, limit, query, runTransaction, serverTimestamp, where,
} from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import { buildPlanningSnapshot, publicAgenda, validateEventInputs, validateProposal } from './planning.ts';
import type { AgendaSlot, Choice, PlanningEvent, Proposal, PublicSlot, VenueFact } from './planning.ts';
import type { Event, SharedCard } from './sharing.ts';

export type PublishedPlan = { inputRevision: number; planRevision: number; agenda: PublicSlot[] };
type StoredProposal = {
  inputRevision: number; agendaRevision: number; referenceMap: Awaited<ReturnType<typeof loadPlanningSnapshot>>['referenceMap'];
  proposal: Proposal; modelMetadata: { source: 'IN_CLOUD'; model: string }; status: 'draft';
};
export type ConfirmationStatus = 'met' | 'unmet' | 'unknown';
export type RequestOutcome = number | 'checking' | 'unavailable';
export type RequestResponse = '' | 'met' | 'unmet';
export type PublishedOutcomes = { cardRevision: number; outcomes: RequestOutcome[]; responses: RequestResponse[] };
const eventDoc = (db: Firestore, id: string) => doc(db, 'events', id);
const outcomesDoc = (db: Firestore, id: string, planId: string, uid: string) =>
  doc(eventDoc(db, id), 'publishedPlans', planId, 'requestOutcomes', uid);

async function readPublishedOutcomes(db: Firestore, id: string, planId: string, uid: string) {
  return (await getDocFromServer(outcomesDoc(db, id, planId, uid))).data() as PublishedOutcomes | undefined;
}

export async function loadPlanningSnapshot(db: Firestore, id: string, ownerUid: string) {
  const ref = eventDoc(db, id);
  const first = (await getDocFromServer(ref)).data() as Event | undefined;
  if (!first || first.organizerUid !== ownerUid) throw new Error('ORGANIZER_REQUIRED');
  const [cards, members] = await Promise.all([
    getDocsFromServer(query(collection(ref, 'cards'), where('status', '==', 'approved'), limit(26))),
    getDocsFromServer(query(collection(ref, 'members'), where('active', '==', true), limit(26))),
  ]);
  if (cards.size > 25 || members.size > 25) throw new Error('TOO_MANY_CARDS');
  const current = (await getDocFromServer(ref)).data() as Event | undefined;
  if (current?.inputRevision !== first.inputRevision || current.agendaRevision !== first.agendaRevision) throw new Error('STALE_PLAN');
  return buildPlanningSnapshot(first, cards.docs.map(doc => doc.data() as SharedCard), members.docs.map(doc => doc.id));
}

export async function updateAgenda(db: Firestore, id: string, original: PlanningEvent, agenda: AgendaSlot[], venueFacts: VenueFact[]) {
  validateEventInputs(agenda, venueFacts);
  const ref = eventDoc(db, id);
  await runTransaction(db, async transaction => {
    const event = (await transaction.get(ref)).data() as Event;
    if (event.agendaRevision !== original.agendaRevision || event.inputRevision !== original.inputRevision) throw new Error('STALE_PLAN');
    transaction.update(ref, { agenda, venueFacts, agendaRevision: event.agendaRevision + 1,
      inputRevision: event.inputRevision + 1, currentPlanId: null });
  });
}

export async function storeProposal(db: Firestore, id: string, snapshot: Awaited<ReturnType<typeof loadPlanningSnapshot>>,
  proposal: Proposal, model: string) {
  const ref = eventDoc(db, id);
  const proposalRef = doc(collection(ref, 'proposals'));
  const validated = validateProposal(proposal, snapshot.input);
  await runTransaction(db, async transaction => {
    const event = (await transaction.get(ref)).data() as Event;
    if (event.inputRevision !== snapshot.input.inputRevision || event.agendaRevision !== snapshot.input.agendaRevision) throw new Error('STALE_PLAN');
    const saved: StoredProposal = { inputRevision: event.inputRevision, agendaRevision: event.agendaRevision,
      referenceMap: snapshot.referenceMap, proposal: validated, modelMetadata: { source: 'IN_CLOUD', model }, status: 'draft' };
    transaction.set(proposalRef, saved);
  });
}

export async function publishPlan(db: Firestore, id: string, expected: Event, selections: Choice[],
  cards: SharedCard[], decisions: ReadonlyMap<string, RequestOutcome[]>) {
  if (cards.length > 25) throw new Error('TOO_MANY_CARDS');
  const eventRef = eventDoc(db, id);
  const ref = doc(collection(eventRef, 'publishedPlans'));
  await runTransaction(db, async transaction => {
    const current = (await transaction.get(eventRef)).data() as Event;
    if (expected.inputRevision !== current.inputRevision || expected.agendaRevision !== current.agendaRevision ||
        expected.planRevision !== current.planRevision) throw new Error('STALE_PLAN');
    const agenda = publicAgenda(selections, current);
    transaction.set(ref, { inputRevision: current.inputRevision, planRevision: current.planRevision + 1,
      agenda, publishedAt: serverTimestamp() });
    for (const card of cards) {
      const outcomes = card.requirements.map((_, index) => decisions.get(card.ownerUid)?.[index] ?? 'checking');
      if (card.status !== 'approved' || outcomes.some(outcome => outcome !== 'checking' && outcome !== 'unavailable' && !agenda[outcome])) {
        throw new Error('STALE_PLAN');
      }
      const published: PublishedOutcomes = { cardRevision: card.revision, outcomes, responses: outcomes.map(() => '') };
      transaction.set(outcomesDoc(db, id, ref.id, card.ownerUid), published);
    }
    transaction.update(eventRef, { currentPlanId: ref.id, planRevision: current.planRevision + 1 });
  });
}

async function readConfirmation(db: Firestore, id: string, uid: string) {
  const snapshot = await getDocFromServer(doc(eventDoc(db, id), 'confirmations', uid)).catch(error => {
    if (error.code === 'permission-denied') return null;
    throw error;
  });
  return snapshot?.data();
}

export async function readOrganizerPublication(db: Firestore, id: string, planId: string, cards: SharedCard[]) {
  const [plan, results] = await Promise.all([
    getDocFromServer(doc(eventDoc(db, id), 'publishedPlans', planId)),
    Promise.all(cards.slice(0, 25).map(async card => {
      const data = await readPublishedOutcomes(db, id, planId, card.ownerUid);
      return data ? [card.ownerUid, data.outcomes] as const : null;
    })),
  ]);
  return { plan: plan.data() as PublishedPlan, decisions: new Map(results.filter(result => result !== null)) };
}

export async function loadPlanFeedback(db: Firestore, id: string, event: Event, cards: SharedCard[]) {
  const planId = event.currentPlanId;
  if (!planId) return [];
  const rows = await Promise.all(cards.slice(0, 25).map(async card => {
    const outcomes = await readPublishedOutcomes(db, id, planId, card.ownerUid);
    if (outcomes) return outcomes.responses.some(Boolean) ? { card, responses: outcomes.responses } : null;
    const response = await readConfirmation(db, id, card.ownerUid);
    return response?.planId === event.currentPlanId && response.planRevision === event.planRevision &&
      response.inputRevision === event.inputRevision && response.cardRevision === card.revision
      ? { card, status: response.status as ConfirmationStatus } : null;
  }));
  return rows.filter(row => row !== null);
}

export async function readCurrentPlan(db: Firestore, id: string, event: Event, uid: string, card: SharedCard | null) {
  if (!event.currentPlanId) return null;
  const ref = eventDoc(db, id);
  const [plan, publishedOutcomes] = await Promise.all([
    getDocFromServer(doc(ref, 'publishedPlans', event.currentPlanId)),
    card?.status === 'approved' ? readPublishedOutcomes(db, id, event.currentPlanId, uid) : undefined,
  ]);
  const data = plan.data() as PublishedPlan | undefined;
  if (!data || data.planRevision !== event.planRevision || data.inputRevision !== event.inputRevision) throw new Error('STALE_PLAN');
  const last = card?.status === 'approved' && !publishedOutcomes ? await readConfirmation(db, id, uid) : undefined;
  const status = last?.planId === plan.id && last.planRevision === data.planRevision &&
    last.inputRevision === data.inputRevision && last.cardRevision === card?.revision ? last.status as ConfirmationStatus : undefined;
  return { ...data, id: plan.id, confirmation: status, publishedOutcomes };
}

export async function respondToOutcome(db: Firestore, id: string, uid: string, planId: string, index: number,
  response: Exclude<RequestResponse, ''>) {
  const ref = outcomesDoc(db, id, planId, uid);
  return runTransaction(db, async transaction => {
    const data = (await transaction.get(ref)).data() as PublishedOutcomes | undefined;
    if (!data || typeof data.outcomes[index] !== 'number') throw new Error('STALE_PLAN');
    const responses = data.responses.map((previous, position) => position === index ? response : previous);
    transaction.update(ref, { responses });
    return { ...data, responses };
  });
}

export async function confirmPlan(db: Firestore, id: string, uid: string, plan: PublishedPlan & { id: string },
  card: SharedCard, status: ConfirmationStatus) {
  const ref = eventDoc(db, id);
  await runTransaction(db, async transaction => {
    const [event, currentCard] = await Promise.all([transaction.get(ref), transaction.get(doc(ref, 'cards', uid))]);
    if (event.data()?.currentPlanId !== plan.id || event.data()?.planRevision !== plan.planRevision ||
        event.data()?.inputRevision !== plan.inputRevision || currentCard.data()?.revision !== card.revision ||
        currentCard.data()?.status !== 'approved') throw new Error('STALE_PLAN');
    transaction.set(doc(ref, 'confirmations', uid), {
      cardRevision: card.revision, planId: plan.id, planRevision: plan.planRevision, inputRevision: plan.inputRevision,
      status, comment: '', updatedAt: serverTimestamp(),
    });
  });
}
