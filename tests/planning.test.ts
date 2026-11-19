import assert from 'node:assert/strict';
import test from 'node:test';
import { buildPlanningSnapshot, publicAgenda, validateEventInputs, validateProposal } from '../src/planning.ts';
import type { PlanningEvent } from '../src/planning.ts';

const event: PlanningEvent = {
  inputRevision: 3, agendaRevision: 2, timeZone: 'UTC',
  agenda: [{ id: 'S01', start: '10:00', end: '10:30', title: 'Standing discussion', alternate: 'Seated discussion', factId: 'A01' }],
  venueFacts: [{ id: 'A01', statement: 'Chairs available', status: 'verified' }],
};
const approved = { ownerUid: 'owner', revision: 1, status: 'approved', privateNote: 'PRIVATE_CANARY',
  requirements: [{ id: 'id', category: 'other' as const, request: 'Please provide a chair.' }] };
const proposal = {
  proposedAgenda: [{ slotId: 'S01', option: 'alternate' }],
  changes: [{ slotId: 'S01', requirementRefs: ['R01'], factRefs: ['A01'] }],
  conflicts: [], unknowns: [],
};

test('cloud input reconstructs approved active requests and organizer fields only', () => {
  const { input, referenceMap } = buildPlanningSnapshot({
    ...event,
    agenda: [{ ...event.agenda[0], ...{ privateNote: 'PRIVATE_CANARY' } }],
  }, [
    approved,
    { ...approved, ownerUid: 'withdrawn', status: 'withdrawn' },
    { ...approved, ownerUid: 'inactive' },
  ], ['owner', 'withdrawn']);
  assert.deepEqual(input, {
    ...event, schemaVersion: 1,
    requirements: [{ ref: 'R01', category: 'other', request: 'Please provide a chair.' }],
  });
  assert.deepEqual(referenceMap, { R01: { ownerUid: 'owner', cardRevision: 1, requirementId: 'id' } });
});

test('proposal evidence cannot add an option, requirement, venue claim, or time', () => {
  const { input } = buildPlanningSnapshot(event, [approved], ['owner']);
  const validated = validateProposal(proposal, input);
  assert.deepEqual(publicAgenda(validated.proposedAgenda, event),
    [{ id: 'S01', start: '10:00', end: '10:30', title: 'Seated discussion' }]);
  assert.throws(() => validateProposal({ ...proposal, conflicts: ['R99'] }, input), /INVALID_PROPOSAL/);
  assert.throws(() => validateProposal({ ...proposal, proposedAgenda: [{ ...proposal.proposedAgenda[0], price: 5 }] }, input), /INVALID_PROPOSAL/);
  assert.throws(() => validateProposal({ ...proposal, changes: [] }, input), /INVALID_PROPOSAL/);
  assert.throws(() => validateProposal(proposal, { ...input, venueFacts: [{ ...input.venueFacts[0], status: 'unknown' }] }), /INVALID_PROPOSAL/);
  assert.throws(() => validateEventInputs([{ ...event.agenda[0], end: '09:30' }], event.venueFacts), /INVALID_EVENT_INPUTS/);
});
