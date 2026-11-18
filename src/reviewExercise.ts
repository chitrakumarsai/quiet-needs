import { makeApprovedCard } from './domain.ts';

// Prepared fictional examples keep the exercise comparable across reviewers.
const originalCases = [
  { id: 'QN-R01', source: 'If the rehearsal gets loud, please let me move to the hallway. Please send the room number before class.', draft: ['Please let me step out if the rehearsal gets loud.', 'Please send the room number before class.'] },
  { id: 'QN-R02', source: 'Please send the warm-up instructions in advance. I need to leave at 2:30 pm.', draft: ['Please send the warm-up instructions in advance.', 'Please let me leave at 2:30 pm.'] },
  { id: 'QN-R03', source: 'If the kit costs more than 20 USD, I need to borrow one. Please arrange live captions for the discussion.', draft: ['Please keep the kit price below 20 USD.'] },
  { id: 'QN-R04', source: 'Could my support person join me? Please keep the workshop ending at the advertised time.', draft: ['Please let my support person join me.', 'Please provide a seat for my support person.', 'Please keep the workshop ending at the advertised time.'] },
];

const freshCases = [
  { id: 'QN-G01', source: 'If the hall gets crowded, please let me wait by the main entrance. Please send the schedule before class.', draft: ['Please let me wait somewhere quieter if the hall gets crowded.', 'Please send the schedule before class.'] },
  { id: 'QN-G02', source: 'Please share the exercise instructions in advance. I need a step-free route to the demonstration room.', draft: ['Please send the exercise instructions in advance.', 'Please provide a step-free route to the demonstration room.'] },
  { id: 'QN-G03', source: 'If the workbook costs more than 15 GBP, I need to use a shared copy. Please provide large-print handouts.', draft: ['Please keep the workbook price below 15 GBP.'] },
  { id: 'QN-G04', source: 'Please let my interpreter join me. Please keep the demonstration ending at the published time.', draft: ['Please let my interpreter join me.', 'Please reserve a parking space for my interpreter.', 'Please keep the demonstration ending at the published time.'] },
];

type Review = {
  caseId: string;
  approvedRequests: string[] | null;
  seconds: number;
  friction: string;
};

const requestCases = [
  { id: 'QN-J01', source: 'If the studio fills up, please let me wait beside the reception desk. Please send a map before the session.', draft: ['Please let me wait in another quiet area if the studio fills up.', 'Please send a map before the session.'] },
  { id: 'QN-J02', source: 'Please send me the slides in advance. I need a seat near the presenter.', draft: ['Please send me the slides in advance.', 'Please provide a seat near the presenter.'] },
  { id: 'QN-J03', source: 'If the equipment rental costs more than 12 GBP, I need to bring my own headphones. Please provide captions for the video.', draft: ['Please keep the equipment rental fee below 12 GBP.'] },
  { id: 'QN-J04', source: 'Please allow my support person to join me. Please keep the session ending at the scheduled time.', draft: ['Please allow my support person to join me.', 'Please provide a meal for my support person.', 'Please keep the session ending at the scheduled time.'] },
];

const authoredCases = [
  { id: 'QN-K01', source: 'If the gallery becomes crowded, please let me wait by the coat rack. Please send a floor plan before the tour.', draft: ['Please let me wait in a quiet spot if the gallery becomes crowded.', 'Please send a floor plan before the tour.'] },
  { id: 'QN-K02', source: 'Please send me the reading list in advance. I need to leave at 3:15 pm.', draft: ['Please send me the reading list in advance.', 'Please let me leave at 3:15 pm.'] },
  { id: 'QN-K03', source: 'If the materials kit costs more than 18 GBP, I need permission to bring my own supplies. Please provide a transcript of the recording.', draft: ['Please keep the materials kit price below 18 GBP.'] },
  { id: 'QN-K04', source: 'Please let my support person attend. Please keep the class ending at its scheduled time.', draft: ['Please let my support person attend.', 'Please provide a travel pass for my support person.', 'Please keep the class ending at its scheduled time.'] },
];

export function renderReviewExercise(root: HTMLElement, variant: 'original' | 'comparison' | 'guided' | 'request-review' | 'request-comparison' | 'authored-review' | 'authored-comparison' = 'original'): void {
  const authored = variant === 'authored-review';
  const reviewEach = variant === 'request-review';
  const cases = authored || variant === 'authored-comparison' ? authoredCases : variant === 'original' ? originalCases : reviewEach || variant === 'request-comparison' ? requestCases : freshCases;
  const reviews: Review[] = [];
  const title = document.createElement('h1');
  title.textContent = 'Review a fictional participation card';
  title.tabIndex = -1;
  const intro = document.createElement('p');
  intro.textContent = 'Read the source beside the prepared draft. Edit the draft until it includes each intended request and preserves its conditions. Use one request per line. Work with the fictional text on the page.';
  if (reviewEach) intro.textContent = 'Read the source beside the draft. Check, edit, or remove each request. Add anything missing before you approve. Work with the fictional text on the page.';
  if (authored) intro.textContent = 'Read the fictional source. Write one requested action at a time, with any condition, place, time, or amount. Preview your wording before you approve.';
  const form = document.createElement('form');
  const count = document.createElement('h2');
  count.tabIndex = -1;
  const comparison = document.createElement('div');
  comparison.className = 'grid';
  const source = document.createElement('section');
  source.className = 'panel';
  const sourceTitle = document.createElement('h3');
  sourceTitle.textContent = 'Source passages';
  const sourceText = document.createElement('p');
  source.append(sourceTitle, sourceText);
  const editor = document.createElement('section');
  editor.className = 'panel';
  const label = document.createElement('label');
  label.htmlFor = 'review-draft';
  label.textContent = 'Draft requests';
  const draft = document.createElement('textarea');
  draft.id = 'review-draft';
  draft.spellcheck = false;
  draft.setAttribute('autocomplete', 'off');
  const frictionLabel = document.createElement('label');
  frictionLabel.htmlFor = 'review-friction';
  frictionLabel.textContent = 'Where did you get stuck? (optional)';
  const friction = document.createElement('select');
  friction.id = 'review-friction';
  for (const [value, label] of [['', 'Choose if applicable'], ['understanding', 'Understanding the passage'], ['comparison', 'Comparing the draft and source'], ['editing', 'Editing the draft'], ['approval', 'Deciding whether to approve']]) {
    friction.add(new Option(label, value));
  }
  const requestList = document.createElement('div');
  const add = document.createElement('button');
  add.type = 'button';
  add.textContent = authored ? 'Add another request' : 'Add a missing request';
  const omission = document.createElement('input');
  omission.type = 'checkbox';
  const omissionLabel = document.createElement('label');
  omissionLabel.className = 'check';
  omissionLabel.append(omission, 'I checked the source and included every requested action.');
  const rows: { field: HTMLTextAreaElement; detail: HTMLTextAreaElement; check: HTMLInputElement }[] = [];
  let nextRowId = 0;
  function addRequest(value: string): HTMLTextAreaElement {
    const panel = document.createElement('div'); panel.className = 'request';
    const field = document.createElement('textarea');
    field.id = 'review-request-' + ++nextRowId;
    field.value = value;
    field.maxLength = 500;
    field.spellcheck = false;
    const fieldLabel = document.createElement('label');
    fieldLabel.htmlFor = field.id;
    fieldLabel.textContent = authored ? 'Requested action' : 'Draft request';
    const detail = document.createElement('textarea');
    detail.id = field.id + '-detail';
    detail.maxLength = 500;
    detail.spellcheck = false;
    const detailLabel = document.createElement('label');
    detailLabel.htmlFor = detail.id;
    detailLabel.textContent = 'Condition, place, time, or amount (optional)';
    const check = document.createElement('input'); check.type = 'checkbox';
    const checkLabel = document.createElement('label'); checkLabel.className = 'check';
    checkLabel.append(check, 'This request matches the source, including its conditions and details.');
    const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = 'Remove this request';
    const row = { field, detail, check };
    rows.push(row);
    panel.append(fieldLabel, field);
    if (authored) panel.append(detailLabel, detail);
    else panel.append(checkLabel);
    panel.append(remove);
    requestList.append(panel);
    add.disabled = rows.length >= 8;
    field.oninput = () => { check.checked = false; omission.checked = false; };
    remove.onclick = () => {
      const index = rows.indexOf(row);
      rows.splice(index, 1);
      panel.remove();
      add.disabled = false;
      omission.checked = false;
      (rows[index]?.field ?? rows[index - 1]?.field ?? add).focus();
    };
    return field;
  }
  add.onclick = () => {
    omission.checked = false;
    addRequest('').focus();
  };
  if (authored) editor.append(requestList, add);
  else if (reviewEach) editor.append(requestList, add, omissionLabel);
  else editor.append(label, draft);
  comparison.append(source, editor);
  const actions = document.createElement('div');
  actions.className = 'actions';
  const approve = document.createElement('button');
  approve.className = 'primary';
  approve.textContent = 'Approve this draft';
  const preview = document.createElement('section');
  preview.className = 'panel';
  const previewTitle = document.createElement('h3');
  previewTitle.textContent = 'Card preview';
  previewTitle.tabIndex = -1;
  const previewList = document.createElement('ul');
  previewList.className = 'export-preview';
  const edit = document.createElement('button');
  edit.type = 'button';
  edit.textContent = 'Edit requests';
  preview.append(previewTitle, previewList, edit);
  if (authored) comparison.append(preview);
  let previewRequests: string[] | null = null;
  function resetPreview(): void {
    previewRequests = null;
    preview.hidden = true;
    editor.hidden = false;
    approve.textContent = 'Preview my requests';
  }
  edit.onclick = () => {
    resetPreview();
    (rows[0]?.field ?? add).focus();
  };
  const skip = document.createElement('button');
  skip.type = 'button';
  skip.textContent = 'Skip this card';
  actions.append(approve, skip);
  const status = document.createElement('p');
  status.setAttribute('role', 'status');
  form.append(count, comparison);
  const checks: HTMLInputElement[] = [];
  if (variant === 'guided') {
    const checklist = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.textContent = 'Check the current draft before approving';
    checklist.append(legend);
    for (const prompt of [
      'Each action requested in the source appears in the draft.',
      'Any conditions, amounts, times, and locations keep the same meaning.',
      'Every draft request is supported by the source.',
    ]) {
      const check = document.createElement('input');
      check.type = 'checkbox';
      const item = document.createElement('label');
      item.className = 'check';
      item.append(check, prompt);
      checklist.append(item);
      checks.push(check);
    }
    form.append(checklist);
  }
  form.append(frictionLabel, friction, actions, status);
  root.append(title, intro, form);

  function clearChecks(): void {
    for (const check of checks) check.checked = false;
  }
  draft.oninput = clearChecks;

  let started = 0;
  function showCase(): void {
    const item = cases[reviews.length];
    count.textContent = `Card ${reviews.length + 1} of ${cases.length}`;
    sourceText.textContent = item.source;
    draft.value = item.draft.join('\n');
    if (reviewEach || authored) {
      rows.length = 0;
      requestList.replaceChildren();
      for (const request of authored ? [''] : item.draft) addRequest(request);
      omission.checked = false;
    }
    if (authored) resetPreview();
    clearChecks();
    friction.value = '';
    status.textContent = '';
    started = performance.now();
    count.focus();
  }

  function record(approvedRequests: string[] | null): void {
    reviews.push({ caseId: cases[reviews.length].id, approvedRequests, seconds: Math.round((performance.now() - started) / 1000), friction: friction.value });
    if (reviews.length < cases.length) {
      showCase();
      return;
    }
    form.remove();
    title.textContent = 'Review complete';
    intro.textContent = 'Download the fictional review results for the study facilitator.';
    const download = document.createElement('button');
    download.textContent = 'Download review results';
    download.onclick = () => {
      const result = variant === 'original' ? { experiment: 'participant-review', reviews } : { experiment: 'participant-review', variant, reviews };
      const url = URL.createObjectURL(new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'quietneeds-review-exercise.json';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
    root.append(download);
    title.focus();
  }

  form.onsubmit = event => {
    event.preventDefault();
    if (previewRequests) {
      record(previewRequests);
      return;
    }
    if (reviewEach || authored) {
      const empty = rows.find(row => !row.field.value.trim());
      if (!rows.length || empty) {
        status.textContent = 'Complete or remove empty requests before approving.';
        (empty?.field ?? add).focus();
        return;
      }
      const incomplete = reviewEach ? rows.find(row => !row.check.checked)?.check ?? (!omission.checked ? omission : undefined) : undefined;
      if (incomplete) {
        status.textContent = 'Confirm each request and check for missing requests, or skip this card.';
        incomplete.focus();
        return;
      }
    }
    const incomplete = checks.find(check => !check.checked);
    if (incomplete) {
      status.textContent = 'Complete the checks for this draft or skip the card.';
      incomplete.focus();
      return;
    }
    try {
      const values = authored ? rows.map(row => [row.field.value.trim(), row.detail.value.trim()].filter(Boolean).join('\n')) : reviewEach ? rows.map(row => row.field.value) : draft.value.split('\n');
      const requirements = values.map(request => request.trim()).filter(Boolean)
        .map(request => ({ category: 'other' as const, request }));
      const approved = makeApprovedCard({ requirements, questions: [] }, true);
      const requests = approved.requirements.map(({ request }) => request);
      if (authored) {
        previewRequests = requests;
        previewList.replaceChildren(...requests.map(request => {
          const item = document.createElement('li');
          const text = document.createElement('p');
          text.textContent = request;
          item.append(text);
          return item;
        }));
        editor.hidden = true;
        preview.hidden = false;
        approve.textContent = 'Approve this card';
        status.textContent = '';
        previewTitle.focus();
      } else record(requests);
    } catch {
      status.textContent = authored ? 'Keep each action and its details within 500 characters total, or skip this card.' : 'Enter one to eight requests, each up to 500 characters, or skip this card.';
      (reviewEach || authored ? rows[0]?.field ?? add : draft).focus();
    }
  };
  skip.onclick = () => record(null);
  showCase();
}
