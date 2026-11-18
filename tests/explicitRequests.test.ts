import assert from 'node:assert/strict';
import test from 'node:test';
import { draftExplicitRequests } from '../src/explicitRequests.ts';
import { parseDraft } from '../src/domain.ts';

test('explicit recognition keeps list items, personal amounts and departure scope', () => {
  const examples = [
    ['I need both a seat and written instructions!', ['Please provide a seat.', 'Please provide written instructions.']],
    ['My equipment budget is 1,250.50 GBP.', ['Please keep my equipment costs within 1,250.50 GBP.']],
    ['I must depart at 11:25 a.m.', ['Please let me leave at 11:25 a.m.']],
    ['I can only join if supplies cost nothing.', ['Please provide supplies at no cost to me so I can participate.']],
    ['I need a 15-minute break every half hour.', ['Please allow me to take a 15-minute break every half hour.']],
    ['I can’t stand during the training session.', ['Please offer me a seated way to take part in the training session.']],
    ['I need to avoid strobe lights.', ['Please avoid strobe lights.']],
    ['I need a quiet break and a seat.', ['Please allow me to take a quiet break.', 'Please provide a seat.']],
  ] as const;
  for (const [note, expected] of examples) {
    const draft = parseDraft(draftExplicitRequests(note));
    assert.deepEqual(draft.requirements.map(item => item.request), expected, note);
  }
});

test('unrecognized clauses, negation and private explanations stay on the normal path', () => {
  const examples = [
    'Please provide a seat and a sign-language interpreter.',
    'I do not need a seat.',
    'I need a seat if the floor is wet.',
    'I need a seat. Here is why.',
    'My family needs care, so I must depart at 11:25 am.',
    'I need toString.',
    'My supplies budget is 500 INR and I may need time to rest.',
    'Please avoid loud music if you can keep the lights dim.',
    'I need a quiet break. Please also leave the doors open.',
  ];
  for (const note of examples) assert.equal(draftExplicitRequests(note), null, note);
});
