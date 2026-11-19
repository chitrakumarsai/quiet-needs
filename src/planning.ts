import { parseDraft } from './domain.ts';
import type { Requirement } from './domain.ts';

export type VenueFact = { id: string; statement: string; status: 'verified' | 'unknown' };
export type AgendaSlot = { id: string; start: string; end: string; title: string; alternate: string; factId: string };
export type PlanningEvent = {
  inputRevision: number;
  agendaRevision: number;
  timeZone: string;
  agenda: AgendaSlot[];
  venueFacts: VenueFact[];
};
type CardInput = { status: string; ownerUid: string; revision: number; requirements: (Requirement & { id: string })[] };
export type PlanningInput = PlanningEvent & { schemaVersion: 1; requirements: (Requirement & { ref: string })[] };
export type Choice = { slotId: string; option: 'original' | 'alternate' };
export type Proposal = {
  proposedAgenda: Choice[];
  changes: { slotId: string; requirementRefs: string[]; factRefs: string[] }[];
  conflicts: string[];
  unknowns: string[];
};
export type PublicSlot = Pick<AgendaSlot, 'id' | 'start' | 'end' | 'title'>;

// shortcut: three slots and facts fit a single Firestore rules check; revisit when input storage is split.
export const maxPlanningItems = 3;
const clock = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
const slotId = /^S\d{2}$/;
const factId = /^A\d{2}$/;
const text = (value: unknown, limit: number): value is string =>
  typeof value === 'string' && value.trim().length > 0 && value.length <= limit;

export function validateEventInputs(agenda: AgendaSlot[], facts: VenueFact[]) {
  if (agenda.length > maxPlanningItems || facts.length > maxPlanningItems || new Set(agenda.map(slot => slot.id)).size !== agenda.length ||
      new Set(facts.map(fact => fact.id)).size !== facts.length ||
      facts.some(fact => !factId.test(fact.id) || !text(fact.statement, 240) || !['verified', 'unknown'].includes(fact.status))) {
    throw new Error('INVALID_EVENT_INPUTS');
  }
  for (const [index, slot] of agenda.entries()) {
    if (!slotId.test(slot.id) || !clock.test(slot.start) || !clock.test(slot.end) || slot.start >= slot.end ||
        (index > 0 && agenda[index - 1].end > slot.start) || !text(slot.title, 120) ||
        (slot.alternate ? !text(slot.alternate, 120) || slot.alternate === slot.title ||
          !facts.some(fact => fact.id === slot.factId) : !!slot.factId)) {
      throw new Error('INVALID_EVENT_INPUTS');
    }
  }
}

export function buildPlanningSnapshot(event: PlanningEvent, cards: CardInput[], activeMembers: string[]) {
  validateEventInputs(event.agenda, event.venueFacts);
  const active = new Set(activeMembers);
  const approved = cards.filter(card => card.status === 'approved' && active.has(card.ownerUid));
  if (approved.length > 25) throw new Error('TOO_MANY_CARDS');
  const referenceMap: Record<string, { ownerUid: string; cardRevision: number; requirementId: string }> = {};
  const requirements: PlanningInput['requirements'] = [];
  for (const card of approved) {
    const draft = parseDraft({ requirements: card.requirements, questions: [] });
    for (const [index, { category, request }] of draft.requirements.entries()) {
      const ref = 'R' + String(requirements.length + 1).padStart(2, '0');
      requirements.push({ ref, category, request });
      referenceMap[ref] = { ownerUid: card.ownerUid, cardRevision: card.revision, requirementId: card.requirements[index].id };
    }
  }
  const { inputRevision, agendaRevision, timeZone } = event;
  const input: PlanningInput = {
    schemaVersion: 1, inputRevision, agendaRevision, timeZone,
    agenda: event.agenda.map(({ id, start, end, title, alternate, factId }) => ({ id, start, end, title, alternate, factId })),
    venueFacts: event.venueFacts.map(({ id, statement, status }) => ({ id, statement, status })),
    requirements,
  };
  return { input, referenceMap };
}

function row(value: unknown, keys: string[]): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value) ||
      Object.keys(value).length !== keys.length || keys.some(key => !Object.hasOwn(value, key))) throw new Error('INVALID_PROPOSAL');
  return value as Record<string, unknown>;
}
function list(value: unknown, max: number): unknown[] {
  if (!Array.isArray(value) || value.length > max) throw new Error('INVALID_PROPOSAL');
  return value;
}
function references(value: unknown, allowed: Set<string>): string[] {
  const refs = list(value, allowed.size);
  if (new Set(refs).size !== refs.length || refs.some(ref => typeof ref !== 'string' || !allowed.has(ref))) throw new Error('INVALID_PROPOSAL');
  return refs as string[];
}

export function publicAgenda(choices: Choice[], event: PlanningEvent): PublicSlot[] {
  if (!event.agenda.length || choices.length !== event.agenda.length) throw new Error('INVALID_PROPOSAL');
  return event.agenda.map((slot, index) => {
    const choice = choices[index];
    if (choice.slotId !== slot.id || !['original', 'alternate'].includes(choice.option) ||
        (choice.option === 'alternate' && (!slot.alternate || !event.venueFacts.some(fact => fact.id === slot.factId && fact.status === 'verified')))) {
      throw new Error('INVALID_PROPOSAL');
    }
    return { id: slot.id, start: slot.start, end: slot.end, title: choice.option === 'alternate' ? slot.alternate : slot.title };
  });
}

export function validateProposal(value: unknown, input: PlanningInput): Proposal {
  const payload = row(value, ['proposedAgenda', 'changes', 'conflicts', 'unknowns']);
  const proposedAgenda = list(payload.proposedAgenda, maxPlanningItems).map((value): Choice => {
    const item = row(value, ['slotId', 'option']);
    if (typeof item.slotId !== 'string' || (item.option !== 'original' && item.option !== 'alternate')) throw new Error('INVALID_PROPOSAL');
    return { slotId: item.slotId, option: item.option };
  });
  publicAgenda(proposedAgenda, input);
  const selected = proposedAgenda.filter(choice => choice.option === 'alternate');
  const changeIds = new Set(selected.map(choice => choice.slotId));
  const refs = new Set(input.requirements.map(requirement => requirement.ref));
  const verifiedFacts = new Set(input.venueFacts.filter(fact => fact.status === 'verified').map(fact => fact.id));
  const changes = list(payload.changes, maxPlanningItems).map(value => {
    const item = row(value, ['slotId', 'requirementRefs', 'factRefs']);
    if (typeof item.slotId !== 'string' || !changeIds.delete(item.slotId)) throw new Error('INVALID_PROPOSAL');
    const requirementRefs = references(item.requirementRefs, refs);
    const factRefs = references(item.factRefs, verifiedFacts);
    if (!requirementRefs.length || !factRefs.includes(input.agenda.find(slot => slot.id === item.slotId)?.factId ?? '')) throw new Error('INVALID_PROPOSAL');
    return { slotId: item.slotId, requirementRefs, factRefs };
  });
  if (changeIds.size) throw new Error('INVALID_PROPOSAL');
  const conflicts = references(payload.conflicts, refs);
  const unknowns = references(payload.unknowns, refs);
  return { proposedAgenda, changes, conflicts, unknowns };
}
