import { initializeApp } from 'firebase/app';
import {
  connectAuthEmulator, GoogleAuthProvider, initializeAuth, inMemoryPersistence, signInAnonymously, signInWithPopup, signOut,
} from 'firebase/auth';
import {
  collection, connectFirestoreEmulator, doc, getDocFromServer, getDocsFromServer,
  initializeFirestore, memoryLocalCache, query, runTransaction, serverTimestamp, where,
} from 'firebase/firestore';
import type { DocumentSnapshot, Firestore, Transaction } from 'firebase/firestore';
import { makeApprovedCard } from './domain.ts';
import type { ApprovedCard, Requirement } from './domain.ts';
import type { PlanningEvent } from './planning.ts';

export type Event = PlanningEvent & {
  organizerUid: string;
  title: string;
  timeZone: string;
  status: 'open' | 'closed';
  currentPlanId: string | null;
  planRevision: number;
};

type SharedRequirement = Requirement & { id: string };
export type SharedCard = {
  schemaVersion: 1;
  ownerUid: string;
  revision: number;
  status: 'approved' | 'withdrawn';
  requirements: SharedRequirement[];
  consentVersion: 1;
  operationId: string;
};

export const emulatorProject = 'demo-quietneeds';
export const sharingEmulator = typeof window !== 'undefined' &&
  import.meta.env.DEV && import.meta.env.VITE_SHARING_EMULATORS === 'true';
let services: ReturnType<typeof createServices> | undefined;

export function sharingConfigured(): boolean {
  return sharingEmulator || (import.meta.env.VITE_SHARING_ENABLED === 'true' &&
    !!import.meta.env.VITE_FIREBASE_PROJECT_ID && !!import.meta.env.VITE_FIREBASE_API_KEY &&
    !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN && !!import.meta.env.VITE_FIREBASE_APP_ID);
}

function createServices() {
  const app = initializeApp(sharingEmulator ? { projectId: emulatorProject, apiKey: 'demo-key', authDomain: 'localhost' } : {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  }, 'quietneeds-sharing');
  const auth = initializeAuth(app, { persistence: inMemoryPersistence });
  const db = initializeFirestore(app, { localCache: memoryLocalCache() });
  if (sharingEmulator) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
  }
  return { auth, db };
}

export function getSharing() {
  if (!sharingConfigured()) throw new Error('SHARING_UNAVAILABLE');
  return services ??= createServices();
}

export function signIn() {
  const { auth } = getSharing();
  return sharingEmulator ? signInAnonymously(auth) : signInWithPopup(auth, new GoogleAuthProvider());
}

export function endSession() {
  return signOut(getSharing().auth);
}

export const eventIdPattern = /^[A-Za-z0-9]{20}$/;
const eventRef = (db: Firestore, eventId: string) => doc(db, 'events', eventId);
const cardRef = (db: Firestore, eventId: string, uid: string) => doc(eventRef(db, eventId), 'cards', uid);
const memberRef = (db: Firestore, eventId: string, uid: string) => doc(eventRef(db, eventId), 'members', uid);
const joinRef = (db: Firestore, eventId: string, uid: string) => doc(eventRef(db, eventId), 'joinRequests', uid);

export type EventAccess =
  | { role: 'request' | 'pending' | 'revoked' }
  | { role: 'participant'; event: Event; card: SharedCard | null }
  | { role: 'organizer'; event: Event; pending: string[]; members: string[]; cards: SharedCard[] };

function dataOrNull<T>(snapshot: DocumentSnapshot): T | null {
  return snapshot.exists() ? snapshot.data() as T : null;
}

export async function listOwnedEvents(db: Firestore, uid: string) {
  const snapshot = await getDocsFromServer(query(collection(db, 'events'), where('organizerUid', '==', uid)));
  return snapshot.docs.map(item => ({ id: item.id, title: (item.data() as Event).title }));
}

export async function createEvent(db: Firestore, uid: string, rawTitle: string, timeZone: string) {
  const title = rawTitle.trim();
  if (!title || title.length > 120) throw new Error('INVALID_TITLE');
  new Intl.DateTimeFormat(undefined, { timeZone });
  const event = doc(collection(db, 'events'));
  await runTransaction(db, async transaction => {
    transaction.set(event, {
      organizerUid: uid, title, timeZone, agenda: [], venueFacts: [], agendaRevision: 1, inputRevision: 0,
      currentPlanId: null, planRevision: 0, status: 'open', createdAt: serverTimestamp(),
    });
  });
  return event.id;
}

export async function readEventAccess(db: Firestore, eventId: string, uid: string): Promise<EventAccess> {
  if (!eventIdPattern.test(eventId)) throw new Error('INVALID_EVENT');
  const reference = eventRef(db, eventId);
  const member = await getDocFromServer(memberRef(db, eventId, uid));
  if (member.exists() && member.data().active !== true) return { role: 'revoked' };
  if (member.exists()) {
    const [event, card] = await Promise.all([getDocFromServer(reference), getDocFromServer(cardRef(db, eventId, uid))]);
    return { role: 'participant', event: event.data() as Event, card: dataOrNull<SharedCard>(card) };
  }
  try {
    const event = await getDocFromServer(reference);
    const [pending, members, cards] = await Promise.all([
      getDocsFromServer(query(collection(reference, 'joinRequests'), where('status', '==', 'pending'))),
      getDocsFromServer(query(collection(reference, 'members'), where('active', '==', true))),
      getDocsFromServer(query(collection(reference, 'cards'), where('status', '==', 'approved'))),
    ]);
    return { role: 'organizer', event: event.data() as Event, pending: pending.docs.map(item => item.id),
      members: members.docs.map(item => item.id), cards: cards.docs.map(item => item.data() as SharedCard) };
  } catch (error) {
    if (!(error instanceof Error) || !('code' in error) || error.code !== 'permission-denied') throw error;
    const pending = await getDocFromServer(joinRef(db, eventId, uid));
    return { role: pending.exists() ? 'pending' : 'request' };
  }
}

export async function requestToJoin(db: Firestore, eventId: string, uid: string) {
  const reference = joinRef(db, eventId, uid);
  await runTransaction(db, async transaction => {
    const existing = await transaction.get(reference);
    if (!existing.exists()) transaction.set(reference, { requestedAt: serverTimestamp(), status: 'pending' });
  });
}

function advanceEvent(transaction: Transaction, reference: ReturnType<typeof eventRef>, snapshot: DocumentSnapshot) {
  const event = dataOrNull<Event>(snapshot);
  if (!event) throw new Error('UNKNOWN_EVENT');
  transaction.update(reference, { inputRevision: event.inputRevision + 1, currentPlanId: null });
}

export async function admit(db: Firestore, eventId: string, uid: string) {
  const event = eventRef(db, eventId);
  const membership = memberRef(db, eventId, uid);
  const join = joinRef(db, eventId, uid);
  await runTransaction(db, async transaction => {
    const [eventSnapshot, existing, request] = await Promise.all([
      transaction.get(event), transaction.get(membership), transaction.get(join),
    ]);
    if (existing.data()?.active && request.data()?.status === 'approved') return;
    if (request.data()?.status !== 'pending' || existing.exists()) throw new Error('MEMBERSHIP_CHANGED');
    advanceEvent(transaction, event, eventSnapshot);
    transaction.set(membership, { active: true, joinedAt: serverTimestamp() });
    transaction.update(join, { status: 'approved' });
  });
}

export async function revoke(db: Firestore, eventId: string, uid: string) {
  const event = eventRef(db, eventId);
  const membership = memberRef(db, eventId, uid);
  const card = cardRef(db, eventId, uid);
  const operationId = crypto.randomUUID();
  await runTransaction(db, async transaction => {
    const [eventSnapshot, member, cardSnapshot] = await Promise.all([
      transaction.get(event), transaction.get(membership), transaction.get(card),
    ]);
    if (!member.data()?.active) return;
    advanceEvent(transaction, event, eventSnapshot);
    transaction.update(membership, { active: false });
    const previous = dataOrNull<SharedCard>(cardSnapshot);
    if (previous?.status === 'approved') transaction.update(card, withdrawal(previous, operationId));
  });
}

function withdrawal(previous: SharedCard, operationId: string) {
  return { revision: previous.revision + 1, requirements: [], status: 'withdrawn',
    approvedAt: null, updatedAt: serverTimestamp(), operationId };
}

export async function changeSharedCard(db: Firestore, eventId: string, uid: string,
  expectedRevision: number, operationId: string, approved: ApprovedCard | null): Promise<void> {
  const safe = approved && makeApprovedCard({ requirements: approved.requirements, questions: [] }, true);
  const event = eventRef(db, eventId);
  const card = cardRef(db, eventId, uid);
  const newIds = safe?.requirements.map(() => crypto.randomUUID()) ?? [];
  try {
    await runTransaction(db, async transaction => {
      const [eventSnapshot, cardSnapshot] = await Promise.all([transaction.get(event), transaction.get(card)]);
      const previous = dataOrNull<SharedCard>(cardSnapshot);
      if (previous?.operationId === operationId) return;
      if ((previous?.revision ?? 0) !== expectedRevision) throw new Error('CARD_CHANGED');
      if (!safe && previous?.status !== 'approved') return;
      advanceEvent(transaction, event, eventSnapshot);
      if (!safe && previous) {
        transaction.update(card, withdrawal(previous, operationId));
        return;
      }
      if (!safe) return;
      const unused = [...(previous?.requirements ?? [])];
      const requirements = safe.requirements.map(({ category, request }, index) => {
        const match = unused.findIndex(old => old.category === category && old.request === request);
        const id = match < 0 ? newIds[index] : unused.splice(match, 1)[0].id;
        return { id, category, request };
      });
      transaction.set(card, { schemaVersion: 1, ownerUid: uid, revision: expectedRevision + 1, requirements,
        status: 'approved', consentVersion: 1, approvedAt: serverTimestamp(), updatedAt: serverTimestamp(), operationId });
    });
  } catch (error) {
    // A lost acknowledgement can leave the operation applied. Confirm it with a server read.
    try {
      const observed = await getDocFromServer(card);
      if (observed.data()?.operationId === operationId) return;
    } catch { /* Original error is the actionable failure. */ }
    throw error;
  }
}
