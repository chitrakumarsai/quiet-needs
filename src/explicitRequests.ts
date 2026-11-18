import type { Draft, Requirement } from './domain.ts';

const listedRequests: Record<string, Requirement> = {
  'a chair': { category: 'seating', request: 'Please provide a chair.' },
  'a seat': { category: 'seating', request: 'Please provide a seat.' },
  'written instructions': { category: 'other', request: 'Please provide written instructions.' },
  'a quiet space': { category: 'sensory', request: 'Please provide a quiet space.' },
  'a quiet place': { category: 'sensory', request: 'Please provide a quiet place.' },
  'a quiet break': { category: 'sensory', request: 'Please allow me to take a quiet break.' },
  'to hear the group discussion': { category: 'sensory', request: 'Please help me hear the group discussion.' },
};

// shortcut: interpret only complete recognized notes; broader phrasing needs coverage and privacy evidence.
function draftClause(note: string): Draft | null {
  const text = note.trim().replace(/[.!;]$/, '').replace(/\s+/g, ' ');
  const departure = text.match(/^I (?:need to|must|have to) (?:leave|depart) (at (?:1[0-2]|[1-9])(?::[0-5]\d)?\s*[ap]\.?m\.?|early)$/i);
  if (departure) return { requirements: [{ category: 'timing', request: `Please let me leave ${departure[1].replace(/\.$/, '')}.` }], questions: [] };

  const budget = text.match(/^my (materials|supplies|equipment) budget is (\d{1,9}(?:,\d{3}){0,3}(?:\.\d{1,2})?\s+(?:INR|USD|GBP|EUR|CAD|AUD))$/i);
  if (budget) return { requirements: [{ category: 'cost', request: `Please keep my ${budget[1].toLowerCase()} costs within ${budget[2].toUpperCase()}.` }], questions: [] };

  const free = text.match(/^I can only (?:attend|participate|join) if (materials|supplies|equipment) (?:are free|cost nothing)$/i);
  if (free) return { requirements: [{ category: 'cost', request: `Please provide ${free[1].toLowerCase()} at no cost to me so I can participate.` }], questions: [] };

  const standing = text.match(/^I (?:cannot|can't|can’t) stand (?:for|during) the ((?:walking |training )?(?:session|activity)|workshop)$/i);
  if (standing) return { requirements: [{ category: 'seating', request: `Please offer me a seated way to take part in the ${standing[1].toLowerCase()}.` }], questions: [] };

  const recurringBreak = text.match(/^I need a (\d{1,3}[- ](?:minute|hour) break every (?:hour|half hour|\d{1,3} (?:minutes|hours)))$/i);
  if (recurringBreak) return { requirements: [{ category: 'timing', request: `Please allow me to take a ${recurringBreak[1].toLowerCase()}.` }], questions: [] };

  const avoid = text.match(/^(?:please avoid|i need to avoid) (flashing lights|strobe lights|loud music)$/i);
  if (avoid) return { requirements: [{ category: 'sensory', request: `Please avoid ${avoid[1].toLowerCase()}.` }], questions: [] };

  const stepOut = text.match(/^(i (?:may|might) (?:also )?need to|i need to|could i|(?:just |please )?let me) (step (?:out(?:side)?|away))( briefly| sometimes| occasionally| if needed| during the (?:talk|discussion|workshop))?\??$/i);
  if (stepOut) {
    const optional = /\b(?:may|might)\b/i.test(stepOut[1]);
    const detail = stepOut[3]?.toLowerCase() ?? '';
    const condition = optional && detail !== ' if needed' ? ' if needed' : '';
    return { requirements: [{ category: 'participation', request: `Please let me ${stepOut[2].toLowerCase()}${detail}${condition}.` }], questions: [] };
  }

  const noBreak = /^(?:please )?(?:do not|don['’]t) (?:schedule (?:a|an extra) break|add (?:a scheduled|an extra) break) (?:(?:just|specifically) )?for me$/i;
  if (noBreak.test(text)) return { requirements: [{ category: 'timing', request: 'Please do not schedule a separate break for me.' }], questions: [] };

  const list = text.toLowerCase().match(/^(?:please (?:provide|bring|send) |i need (?:both )?|i['’]d (?:also )?like )(.+)$/);
  if (!list) return null;
  const items = [...new Set(list[1].split(' and '))];
  if (items.length > 8 || items.some(item => !Object.hasOwn(listedRequests, item))) return null;
  return { requirements: items.map(item => ({ ...listedRequests[item] })), questions: [] };
}

export function draftExplicitRequests(note: string): Draft | null {
  const clauses = note.trim().split(/(?<=[.!?])\s+(?=[A-Z])|(?<=;)\s+/);
  const requirements = new Map<string, Requirement>();
  for (const clause of clauses) {
    const draft = draftClause(clause);
    if (!draft) return null;
    for (const item of draft.requirements) requirements.set(item.request, item);
  }
  if (requirements.size > 8) return null;
  return { requirements: [...requirements.values()], questions: [] };
}
