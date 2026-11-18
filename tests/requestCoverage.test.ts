import assert from 'node:assert/strict';
import test from 'node:test';
import { checkRequestCoverage, parseRequestEvidence, preservesConfirmedPassage, requestSourcePassages, resolveRequestSourceIds } from '../src/requestCoverage.ts';
import type { Draft } from '../src/domain.ts';

test('source passages must be bounded, unique and quoted verbatim', () => {
  const note = 'Please send notes. My paper budget is 20 USD.';
  assert.deepEqual(parseRequestEvidence(['send notes', 'paper budget is 20 USD'], note), ['send notes', 'paper budget is 20 USD']);
  for (const invalid of [['send minutes'], ['send notes', 'send notes'], [' '], [42], 'send notes']) {
    assert.throws(() => parseRequestEvidence(invalid, note), /UNVERIFIED_DRAFT_DETAILS/);
  }
});

test('coverage catches count mismatches and limits moved onto another request', () => {
  const note = 'I need to leave at 3 pm. Paper costs must stay within 20 USD.';
  const evidence = ['I need to leave at 3 pm', 'Paper costs must stay within 20 USD'];
  const draft: Draft = { requirements: [
    { category: 'timing', request: 'Please let me leave at 3 pm.' },
    { category: 'cost', request: 'Please keep my paper costs within 20 USD.' },
  ], questions: [] };
  assert.deepEqual(checkRequestCoverage(draft, evidence, note), draft);
  assert.throws(() => checkRequestCoverage({ ...draft, requirements: draft.requirements.slice(0, 1) }, evidence, note), /UNVERIFIED_DRAFT_DETAILS/);
  assert.throws(() => checkRequestCoverage(draft, [...evidence].reverse(), note), /UNVERIFIED_DRAFT_DETAILS/);
});

test('source IDs must resolve in order and keep conditions with their request', () => {
  const note = 'If it rains, I need a lift. Keep the 2 p.m. wrap-up, and please send the notes.';
  const passages = requestSourcePassages(note);
  assert.deepEqual(resolveRequestSourceIds([1, 2, 3], passages), [
    'If it rains, I need a lift.', 'Keep the 2 p.m. wrap-up,', 'and please send the notes.',
  ]);
  assert.deepEqual(resolveRequestSourceIds([1, 1], passages), [passages[0], passages[0]]);
  for (const ids of [[0], [4], [2, 1], ['1'], [1.5]]) {
    assert.throws(() => resolveRequestSourceIds(ids, passages), /UNVERIFIED_DRAFT_DETAILS/);
  }
});

test('confirmed passage checks catch the wording drift observed in Chrome', () => {
  const examples = [
    ["If the kit costs more than 20 USD, I'll need to borrow one.", 'Please provide a kit if the kit costs more than 20 USD.', 'Please let me borrow a kit if it costs more than 20 USD.'],
    ['Please keep the activity ending at the advertised time.', 'Please ensure the activity ends by the advertised time.', 'Please ensure the activity ends at the advertised time.'],
    ['Let me move to the hallway if things get loud.', 'Please let me move to the hallway if it becomes too loud.', 'Please let me move to the hallway if it gets loud.'],
    ['Let me move to the hallway if things get loud.', 'Please let me move to a quieter area if it gets loud.', 'Please let me go to the hallway if it becomes loud.'],
    ["If the rental fee exceeds 15 GBP, I'd like to bring my own headset.", 'Please increase the rental fee if it exceeds 15 GBP.', 'Please let me bring my own headset if the rental fee exceeds 15 GBP.'],
  ];
  const asDraft = (request: string): Draft => ({ requirements: [{ category: 'other', request }], questions: [] });
  for (const [passage, drifted, faithful] of examples) {
    assert.equal(preservesConfirmedPassage(asDraft(drifted), passage), false);
    assert.equal(preservesConfirmedPassage(asDraft(faithful), passage), true);
  }
  assert.equal(preservesConfirmedPassage(asDraft('Please send the timetable in advance.'), 'Send the timetable.'), true);
  assert.equal(preservesConfirmedPassage({ requirements: [], questions: [] }, 'Send the timetable.'), false);
  const [headsetPassage, , faithfulHeadset] = examples[4];
  const duplicate = asDraft(faithfulHeadset);
  duplicate.requirements.push({ category: 'cost', request: 'Please calculate the rental fee if it exceeds 15 GBP.' });
  assert.equal(preservesConfirmedPassage(duplicate, headsetPassage), false);
});
