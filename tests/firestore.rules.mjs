import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import assert from 'node:assert/strict';
import test from 'node:test';
import { assertFails, initializeTestEnvironment } from '@firebase/rules-unit-testing';
import {
  collection, doc, getDocFromServer, getDocsFromServer, runTransaction, serverTimestamp, setDoc, updateDoc, writeBatch,
} from 'firebase/firestore';

const projectId = 'demo-quietneeds';
const eventId = 'abcdefghijklmnopqrst';
const otherEvent = 'ABCDEFGHIJKLMNOPQRST';
const owner = 'organizer';
const participant = 'participant';
const outsider = 'outsider';
const event = (db, id = eventId) => doc(db, 'events', id);
const nested = (db, name, uid = participant, id = eventId) => doc(event(db, id), name, uid);
const newEvent = uid => ({
  organizerUid: uid, title: 'Fictional workshop', timeZone: 'UTC', agenda: [], venueFacts: [],
  agendaRevision: 1, inputRevision: 0, currentPlanId: null, planRevision: 0, status: 'open', createdAt: serverTimestamp(),
});
const bump = (batch, db, revision) => batch.update(event(db), { inputRevision: revision, currentPlanId: null });
const newCard = (revision, operationId = randomUUID()) => ({
  schemaVersion: 1, ownerUid: participant, revision, status: 'approved',
  requirements: [{ id: randomUUID(), category: 'timing', request: 'Please let me leave at 3 pm.' }],
  consentVersion: 1, approvedAt: serverTimestamp(), updatedAt: serverTimestamp(), operationId,
});
const withdrawCard = revision => ({
  status: 'withdrawn', requirements: [], revision, approvedAt: null, updatedAt: serverTimestamp(), operationId: randomUUID(),
});

test('event isolation, enrollment, approved revisions, publication, confirmation and revocation', async () => {
  const environment = await initializeTestEnvironment({
    projectId, firestore: { rules: readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8') },
  });
  try {
    await environment.clearFirestore();
    const admin = environment.authenticatedContext(owner).firestore();
    const member = environment.authenticatedContext(participant).firestore();
    const other = environment.authenticatedContext(outsider).firestore();
    const anonymous = environment.unauthenticatedContext().firestore();
    await setDoc(event(admin), newEvent(owner));
    await setDoc(event(other, otherEvent), newEvent(outsider));
    await assertFails(setDoc(event(member, '12345678901234567890'), newEvent(owner)));
    await assertFails(getDocFromServer(event(anonymous)));
    await assertFails(getDocFromServer(event(member)));
    await assertFails(getDocFromServer(event(admin, otherEvent)));
    await assertFails(setDoc(nested(member, 'joinRequests', outsider), { requestedAt: serverTimestamp(), status: 'pending' }));
    await assertFails(setDoc(nested(anonymous, 'joinRequests'), { requestedAt: serverTimestamp(), status: 'pending' }));
    await setDoc(nested(member, 'joinRequests'), { status: 'pending', requestedAt: serverTimestamp() });
    await assertFails(getDocFromServer(event(member)));
    await assertFails(setDoc(nested(member, 'members'), { active: true, joinedAt: serverTimestamp() }));
    await assertFails(setDoc(nested(member, 'cards'), newCard(1)));
    await assertFails(getDocsFromServer(collection(event(member), 'joinRequests')));
    await assertFails(setDoc(nested(admin, 'members'), { active: true, joinedAt: serverTimestamp() }));

    const admission = writeBatch(admin);
    bump(admission, admin, 1);
    admission.update(nested(admin, 'joinRequests'), { status: 'approved' });
    admission.set(nested(admin, 'members'), { active: true, joinedAt: serverTimestamp() });
    await admission.commit();
    assert.equal((await getDocFromServer(event(member))).data().title, 'Fictional workshop');
    await assertFails(getDocFromServer(event(other)));
    await assertFails(getDocFromServer(nested(member, 'cards', outsider)));
    await assertFails(getDocsFromServer(collection(event(member), 'cards')));
    await assertFails(updateDoc(event(member), { inputRevision: 2 }));
    await assertFails(setDoc(nested(member, 'cards'), newCard(1)));

    const invalidCards = [
      { ...newCard(1), ownerUid: outsider }, { ...newCard(1), rawNote: 'Synthetic private text' },
      { ...newCard(1), revision: 2 }, { ...newCard(1), requirements: [] },
      { ...newCard(1), requirements: [{ ...newCard(1).requirements[0], request: ' ' }] },
      { ...newCard(1), requirements: [{ ...newCard(1).requirements[0], evidence: 'Synthetic private text' }] },
      { ...newCard(1), requirements: [{ ...newCard(1).requirements[0], request: 'x'.repeat(501) }] },
      { ...newCard(1), requirements: Array.from({length:9}, () => newCard(1).requirements[0]) },
    ];
    for (const card of invalidCards) {
      const bad = writeBatch(member);
      bump(bad, member, 2);
      bad.set(nested(member, 'cards'), card);
      await assertFails(bad.commit());
    }
    const takeover = writeBatch(member);
    takeover.update(event(member), { inputRevision: 2, organizerUid: participant });
    takeover.set(nested(member, 'cards'), newCard(1));
    await assertFails(takeover.commit());

    const operationId = randomUUID();
    const share = writeBatch(member);
    bump(share, member, 2);
    share.set(nested(member, 'cards'), newCard(1, operationId));
    await share.commit();
    const ownCard = (await getDocFromServer(nested(member, 'cards'))).data();
    assert.equal(ownCard.revision, 1);
    assert.equal(ownCard.operationId, operationId);
    assert.equal((await getDocsFromServer(collection(event(admin), 'cards'))).size, 1);
    await assertFails(getDocFromServer(nested(other, 'cards')));
    await assertFails(getDocsFromServer(collection(event(other), 'cards')));
    const duplicate = writeBatch(member);
    bump(duplicate, member, 3);
    duplicate.set(nested(member, 'cards'), newCard(2, operationId));
    await assertFails(duplicate.commit());
    const organizerEdit = writeBatch(admin);
    bump(organizerEdit, admin, 3);
    organizerEdit.set(nested(admin, 'cards'), newCard(2));
    await assertFails(organizerEdit.commit());

    const competingChange = () => runTransaction(member, async transaction => {
      const current = await transaction.get(nested(member, 'cards'));
      const parent = await transaction.get(event(member));
      if (current.data().revision !== 1) throw new Error('STALE_REVISION');
      transaction.update(event(member), { inputRevision: parent.data().inputRevision + 1, currentPlanId: null });
      const replacement = newCard(2);
      replacement.requirements = Array.from({ length: 8 }, (_, index) => ({
        id: randomUUID(), category: 'other', request: 'Fictional request ' + (index + 1),
      }));
      transaction.set(nested(member, 'cards'), replacement);
    });
    const contenders = await Promise.allSettled([competingChange(), competingChange()]);
    assert.equal(contenders.filter(result => result.status === 'fulfilled').length, 1);
    const replaced = (await getDocFromServer(nested(admin, 'cards'))).data();
    assert.equal(replaced.revision, 2);
    assert.equal(replaced.requirements.length, 8);

    const withdrawal = writeBatch(member);
    bump(withdrawal, member, 4);
    withdrawal.update(nested(member, 'cards'), withdrawCard(3));
    await withdrawal.commit();
    assert.deepEqual((await getDocFromServer(nested(admin, 'cards'))).data().requirements, []);
    const again = writeBatch(member);
    bump(again, member, 5);
    again.set(nested(member, 'cards'), newCard(4));
    await again.commit();

    const slot = { id: 'S01', start: '10:00', end: '10:30', title: 'Gallery walk',
      alternate: 'Seated discussion', factId: 'A01' };
    const { alternate, factId, ...original } = slot;
    const agenda = [...Array.from({ length: 2 }, (_, index) => ({ ...slot,
      id: 'S0' + (index + 1), start: (10 + index) + ':00', end: (10 + index) + ':30', factId: 'A03',
    })), { ...slot, id: 'S03', start: '12:00', end: '12:30' }];
    const venueFacts = Array.from({ length: 3 }, (_, index) => ({
      id: 'A0' + (index + 1), statement: 'Chairs are available.', status: index === 0 ? 'unknown' : 'verified',
    }));
    const edit = { agenda, venueFacts, agendaRevision: 2, inputRevision: 6, currentPlanId: null };
    await assertFails(updateDoc(event(member), edit));
    await updateDoc(event(admin), edit);
    const proposalId = 'proposal';
    const proposal = {
      inputRevision: 6, agendaRevision: 2, referenceMap: {},
      proposal: { proposedAgenda: [], changes: [], conflicts: [], unknowns: [] },
      modelMetadata: { source: 'IN_CLOUD', model: 'synthetic-model' }, status: 'draft',
    };
    await assertFails(setDoc(nested(member, 'proposals', proposalId), proposal));
    await assertFails(setDoc(nested(admin, 'proposals', proposalId), { ...proposal, inputRevision: 5 }));
    await setDoc(nested(admin, 'proposals', proposalId), proposal);
    await assertFails(getDocFromServer(nested(member, 'proposals', proposalId)));
    const first = 'aaaaaaaaaaaaaaaaaaaa';
    const second = 'bbbbbbbbbbbbbbbbbbbb';
    const plan = (revision, agenda) => ({ inputRevision: 6, planRevision: revision, agenda, publishedAt: serverTimestamp() });
    const originals = agenda.map(({ id, start, end, title }) => ({ id, start, end, title }));
    const withFirst = value => [value, ...originals.slice(1)];
    const publish = (id, value) => {
      const batch = writeBatch(admin);
      batch.update(event(admin), { currentPlanId: id, planRevision: value.planRevision });
      batch.set(nested(admin, 'publishedPlans', id), value);
      return batch.commit();
    };
    await assertFails(setDoc(nested(admin, 'publishedPlans', first), plan(1, [original])));
    await assertFails(publish(first, { ...plan(1, originals), inputRevision: 5 }));
    await assertFails(publish(first, plan(1, withFirst({ ...original, end: '10:31' }))));
    await assertFails(publish(first, plan(1, withFirst({ ...original, title: 'Invented activity' }))));
    await assertFails(publish(first, plan(1, withFirst({ ...original, requirement: 'Private reasoning' }))));
    const verifiedAlternates = originals.map((item, index) => index < 2 ? { ...item, title: alternate } : item);
    await assertFails(publish(first, plan(1, [...verifiedAlternates.slice(0, 2), { ...originals[2], title: alternate }])));
    await publish(first, plan(1, verifiedAlternates));
    assert.deepEqual((await getDocFromServer(nested(member, 'publishedPlans', first))).data().agenda,
      verifiedAlternates);
    await assertFails(getDocFromServer(nested(other, 'publishedPlans', first)));
    const confirmation = {
      planId: first, planRevision: 1, inputRevision: 6, cardRevision: 4,
      status: 'met', comment: '', updatedAt: serverTimestamp(),
    };
    assert.equal((await getDocFromServer(nested(member, 'confirmations'))).exists(), false);
    await assertFails(setDoc(nested(admin, 'confirmations'), confirmation));
    await assertFails(setDoc(nested(member, 'confirmations'), { ...confirmation, cardRevision: 3 }));
    await assertFails(setDoc(nested(member, 'confirmations'), { ...confirmation, comment: 'Private comment' }));
    await setDoc(nested(member, 'confirmations'), confirmation);
    assert.equal((await getDocFromServer(nested(admin, 'confirmations'))).data().status, 'met');
    await publish(second, plan(2, originals));
    await assertFails(getDocFromServer(nested(member, 'publishedPlans', first)));
    await assertFails(getDocFromServer(nested(member, 'confirmations')));
    await assertFails(setDoc(nested(member, 'confirmations'), confirmation));
    await setDoc(nested(member, 'confirmations'), { ...confirmation, planId: second, planRevision: 2, status: 'unknown' });

    const revokeWithoutWithdrawal = writeBatch(admin);
    bump(revokeWithoutWithdrawal, admin, 7);
    revokeWithoutWithdrawal.update(nested(admin, 'members'), { active: false });
    await assertFails(revokeWithoutWithdrawal.commit());
    const revoke = writeBatch(admin);
    bump(revoke, admin, 7);
    revoke.update(nested(admin, 'members'), { active: false });
    revoke.update(nested(admin, 'cards'), withdrawCard(5));
    await revoke.commit();
    await assertFails(getDocFromServer(event(member)));
    await assertFails(getDocFromServer(nested(member, 'cards')));
    assert.deepEqual((await getDocFromServer(nested(admin, 'cards'))).data().requirements, []);
    assert.equal((await getDocFromServer(event(admin))).data().inputRevision, 7);
    await assertFails(getDocFromServer(nested(admin, 'publishedPlans', second)));
    await assertFails(getDocFromServer(nested(admin, 'confirmations')));
    await assertFails(getDocFromServer(nested(admin, 'proposals', proposalId)));
  } finally {
    await environment.cleanup();
  }
});
