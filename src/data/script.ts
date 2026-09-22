import { copy } from '../content/copy';
import type { ChatMessage } from '../types';

/**
 * The scripted assistant.
 *
 * This is a deterministic intent map, not a model. Every reply below is written
 * by hand and labelled "Scripted assistant demo" in the UI. It never diagnoses,
 * never scores, and never claims to be answering freely.
 *
 * Two complete paths are implemented:
 *   Path 1  understanding difficulties  → information / assessment / practical
 *   Path 2  sensory support at work     → products / workplace adjustment
 *
 * Practical support is reachable without going through the diagnosis path.
 */

let seq = 0;
const nextId = () => `m${(seq += 1)}`;

function assistant(text: string, extra: Partial<ChatMessage> = {}): ChatMessage {
  return { id: nextId(), author: 'assistant', text, ...extra };
}

export function userMessage(text: string): ChatMessage {
  return { id: nextId(), author: 'user', text };
}

export const STARTERS = [
  { label: 'Could my difficulties be related to ADHD?', intent: 'path1.start' },
  { label: 'Noise at work makes it hard to focus.', intent: 'path2.start' },
  { label: 'Show me sensory support options.', intent: 'path2.browse' },
  { label: 'I would rather speak with a person.', intent: 'people' },
];

export function openingMessage(): ChatMessage {
  seq = 0;
  return {
    id: 'm0',
    author: 'assistant',
    text: copy.assistant.opening,
    options: STARTERS,
  };
}

/**
 * Maps an intent to the assistant's reply. Returns null for anything the
 * prototype does not cover, so the caller can show the honest fallback.
 */
export function respond(intent: string): ChatMessage | null {
  switch (intent) {
    /* ---------------- Path 1 — understanding difficulties ---------------- */

    case 'path1.start':
      return assistant(
        'Difficulty focusing can have several explanations. This conversation cannot determine whether you have ADHD, but I can help you explore reliable information and professional assessment options.',
        {
          options: [
            { label: 'Learn more', intent: 'path1.learn' },
            { label: 'Find professional support', intent: 'path1.providers' },
            { label: 'Explore practical support', intent: 'path2.browse' },
          ],
        },
      );

    case 'path1.learn':
      return assistant(
        'Here are the two resources people usually start with. The first covers what the term describes; the second covers how an assessment actually works, and why a questionnaire on its own cannot settle anything.',
        {
          related: { kind: 'resource', ids: ['res-understanding-adhd', 'res-professional-assessment'] },
          options: [
            { label: 'Find professional support', intent: 'path1.providers' },
            { label: 'Explore practical support', intent: 'path2.browse' },
          ],
        },
      );

    case 'path1.providers':
      return assistant(
        'Which area would you like to look at? These are sample locations used to show how filtering works — the prototype has no map and no location access.',
        {
          options: [
            { label: 'Central area', intent: 'path1.area.central' },
            { label: 'North area', intent: 'path1.area.north' },
            { label: 'Show everything', intent: 'path1.area.all' },
          ],
        },
      );

    case 'path1.area.central':
      return assistant(
        'Here is the listing in the central area. Opening it shows what to ask before arranging an assessment. Nothing is booked and no enquiry is sent from this prototype.',
        {
          related: { kind: 'provider', ids: ['prov-sample-central'] },
          options: [
            { label: 'Show the real organisations too', intent: 'path1.area.real' },
            { label: 'Explore practical support', intent: 'path2.browse' },
          ],
        },
      );

    case 'path1.area.north':
      return assistant(
        'Here is the listing in the north area. Opening it shows what to ask before arranging an assessment. Nothing is booked and no enquiry is sent from this prototype.',
        {
          related: { kind: 'provider', ids: ['prov-sample-north'] },
          options: [
            { label: 'Show the real organisations too', intent: 'path1.area.real' },
            { label: 'Explore practical support', intent: 'path2.browse' },
          ],
        },
      );

    case 'path1.area.real':
      return assistant(
        'These two are real organisations the team asked to include. Their details have not been verified in this prototype, so each one links to its official website rather than repeating anything Med-A cannot stand behind.',
        {
          related: { kind: 'provider', ids: ['prov-tamlyhoasung', 'prov-bvdaihoc'] },
          options: [{ label: 'Explore practical support', intent: 'path2.browse' }],
        },
      );

    case 'path1.area.all':
      return assistant(
        'Here is the full directory. The two real organisations link out to their own websites; the two sample listings exist to show how the filters behave.',
        {
          related: {
            kind: 'provider',
            ids: ['prov-tamlyhoasung', 'prov-bvdaihoc', 'prov-sample-central', 'prov-sample-north'],
          },
          options: [{ label: 'Explore practical support', intent: 'path2.browse' }],
        },
      );

    /* ---------------- Path 2 — sensory support at work ---------------- */

    case 'path2.start':
      return assistant(
        'Would you prefer to explore a quieter workspace, noise-reducing tools, or both?',
        {
          options: [
            { label: 'A quieter workspace', intent: 'path2.workspace' },
            { label: 'Noise-reducing tools', intent: 'path2.tools' },
            { label: 'Both', intent: 'path2.both' },
          ],
        },
      );

    case 'path2.browse':
      return assistant(
        'You can look at practical support directly — there is no need to discuss diagnosis first. What sounds most relevant?',
        {
          options: [
            { label: 'Noise-reducing tools', intent: 'path2.tools' },
            { label: 'A quieter workspace', intent: 'path2.workspace' },
            { label: 'Workspace comfort', intent: 'path2.comfort' },
          ],
        },
      );

    case 'path2.tools':
      return assistant(
        'Two options people try for noise. Which suits you depends on whether you still need to hear speech, and on how visible you want it to be — people differ a lot here, so it is worth picking what appeals to you rather than what is most common.',
        {
          related: { kind: 'sensory', ids: ['sen-headphones', 'sen-earplugs'] },
          options: [
            { label: 'What about a quieter workspace?', intent: 'path2.workspace' },
            { label: 'Show workspace comfort options', intent: 'path2.comfort' },
          ],
        },
      );

    case 'path2.workspace':
      return assistant(
        'A quieter place for focused work is not something you buy — it is a change to agree with your workplace. If it would help, I can open an editable draft you can use as a starting point.',
        {
          related: { kind: 'sensory', ids: ['sen-quieter-workspace'] },
          offerDraft: 'sen-quieter-workspace',
          options: [{ label: 'Show noise-reducing tools instead', intent: 'path2.tools' }],
        },
      );

    case 'path2.both':
      return assistant(
        'Here are all three: two things you could obtain, and one change to discuss at work. The workplace option comes with an editable draft request if you want one.',
        {
          related: { kind: 'sensory', ids: ['sen-headphones', 'sen-earplugs', 'sen-quieter-workspace'] },
          offerDraft: 'sen-quieter-workspace',
          options: [{ label: 'Show workspace comfort options', intent: 'path2.comfort' }],
        },
      );

    case 'path2.comfort':
      return assistant(
        'Workspace comfort covers your own desk setup rather than the whole room. A desk light lets you change your own lighting without affecting anyone else.',
        {
          related: { kind: 'sensory', ids: ['sen-desk-light', 'sen-quieter-workspace'] },
          options: [{ label: 'Show noise-reducing tools', intent: 'path2.tools' }],
        },
      );

    /* ---------------- Speaking with a person ---------------- */

    case 'people':
      return assistant(
        'Med-A cannot connect you to anyone — nobody is on the other end of this prototype. What it can do is show the professional support directory, so you can see the organisations and what to ask before you contact them yourself.',
        {
          related: {
            kind: 'provider',
            ids: ['prov-tamlyhoasung', 'prov-bvdaihoc', 'prov-sample-central', 'prov-sample-north'],
          },
          options: [
            { label: 'Read about how assessment works', intent: 'path1.learn' },
            { label: 'Explore practical support', intent: 'path2.browse' },
          ],
        },
      );

    default:
      return null;
  }
}

/** The honest fallback for anything outside the scripted paths. */
export function fallback(): ChatMessage {
  return assistant(copy.assistant.unsupported, { options: STARTERS });
}

/**
 * A very small keyword map for free text. It only routes to paths that exist;
 * anything it cannot place falls through to the honest fallback above rather
 * than improvising a reply.
 */
const KEYWORDS: { intent: string; words: string[] }[] = [
  { intent: 'path1.start', words: ['adhd', 'diagnos', 'assess', 'condition', 'attention'] },
  { intent: 'path2.start', words: ['noise', 'noisy', 'loud', 'interrupt', 'concentrate', 'focus'] },
  { intent: 'path2.browse', words: ['sensory', 'headphone', 'earplug', 'fidget', 'tool', 'light', 'desk'] },
  { intent: 'people', words: ['person', 'someone', 'human', 'talk to', 'speak'] },
];

export function intentFromText(text: string): string | null {
  const lower = text.toLowerCase();
  for (const entry of KEYWORDS) {
    if (entry.words.some((w) => lower.includes(w))) return entry.intent;
  }
  return null;
}

/** Assistant reply used by "Ask about this resource" in the library drawer. */
export function askAboutResource(title: string, answer: string): ChatMessage[] {
  return [userMessage(`Tell me about “${title}”.`), assistant(answer, { options: STARTERS })];
}
