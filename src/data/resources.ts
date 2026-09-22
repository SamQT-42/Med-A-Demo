import type { Resource } from '../types';

/**
 * Six prototype summaries written from public guidance.
 *
 * Rules applied to every entry: no invented research findings, no quotations,
 * no medical reviewer, no partner endorsement, no efficacy claim. Each card is
 * labelled "Prototype summary based on public guidance" in the UI.
 */
export const RESOURCES: Resource[] = [
  {
    id: 'res-understanding-adhd',
    title: 'Understanding ADHD',
    shortDescription:
      'What the term describes, why difficulties vary from person to person, and why self-recognition is a starting point rather than an answer.',
    topic: 'Understanding',
    sourceName: 'National Institute of Mental Health (NIMH)',
    sourceUrl: 'https://www.nimh.nih.gov/health/publications/adhd-what-you-need-to-know',
    summary: [
      'ADHD is a term used for a pattern of difficulties with attention, activity and impulsivity that shows up across more than one part of a person’s life.',
      'The same label covers very different day-to-day experiences. Two people described the same way can struggle with completely different tasks.',
      'Recognising yourself in a description is a reasonable reason to look further. It is not the same as having a condition, and it is not something an app can settle.',
    ],
    scopeNote:
      'General public information. It cannot tell you whether it applies to you, and nothing here is an assessment.',
    askResponse:
      'That resource covers what the term describes and why experiences differ so much between people. It deliberately stops short of telling anyone whether it applies to them — that is what a professional assessment is for. Would you like to look at assessment options, or at practical support you can use now?',
  },
  {
    id: 'res-professional-assessment',
    title: 'How professional assessment works',
    shortDescription:
      'Who carries out an assessment, what it typically draws on, and why a questionnaire alone does not produce a diagnosis.',
    topic: 'Assessment',
    sourceName: 'NICE guideline NG87',
    sourceUrl: 'https://www.nice.org.uk/guidance/ng87/chapter/recommendations',
    summary: [
      'An assessment is carried out by a qualified clinician, not by software and not by a checklist.',
      'It generally draws on personal history and on how difficulties affect more than one setting over time, rather than on a single conversation.',
      'A questionnaire or an online score cannot establish a diagnosis on its own. Med-A does not administer any test.',
    ],
    scopeNote:
      'Describes how assessment works in general. Practice, waiting times and referral routes differ by country and by provider.',
    askResponse:
      'Assessment is done by a qualified clinician and looks at history and day-to-day impact, not a single score. This prototype does not run any test or screening. If it would help, I can show the professional support directory so you can see what to ask before arranging anything.',
  },
  {
    id: 'res-distractions',
    title: 'Working with distractions',
    shortDescription:
      'Practical ways people reduce interruptions, and why the right answer depends on what actually breaks your concentration.',
    topic: 'Focus',
    sourceName: 'Acas — Adjustments for neurodiversity',
    sourceUrl: 'https://www.acas.org.uk/reasonable-adjustments/adjustments-for-neurodiversity',
    summary: [
      'Common approaches include a quieter place for focused work, agreed periods without interruption, and tools that reduce background sound.',
      'Which one helps depends on what is actually interrupting you. Sound, movement and being spoken to are different problems with different answers.',
      'Adjustments are agreed case by case. Nobody has to disclose a diagnosis to ask for one.',
    ],
    scopeNote:
      'Workplace examples vary by person and by workplace. This is reference material, not employment law for any particular country.',
    askResponse:
      'It covers quieter places to work, agreed focus periods, and tools that cut background sound. Which of those sounds closest to your situation? I can show sensory options, or help you draft a request for a quieter workspace.',
  },
  {
    id: 'res-clearer-instructions',
    title: 'Asking for clearer instructions',
    shortDescription:
      'Why written priorities and a named first step help when several requests arrive together, and how to ask without over-explaining.',
    topic: 'Communication',
    sourceName: 'Acas — Adjustments for neurodiversity',
    sourceUrl: 'https://www.acas.org.uk/reasonable-adjustments/adjustments-for-neurodiversity',
    summary: [
      'When several urgent requests arrive at once, the hardest part is often deciding what to start, not doing the work.',
      'A written priority order and a named first step remove that decision, and give you something to point back to later.',
      'Asking for clarity is a normal work request. It does not require explaining anything personal.',
    ],
    scopeNote:
      'General workplace guidance. What is reasonable depends on the role and the organisation.',
    askResponse:
      'The short version: asking which task comes first is an ordinary work request, and getting it in writing means you can refer back to it. You do not need to explain anything personal to ask. Want me to open the resource, or draft a request?',
  },
  {
    id: 'res-work-organisation',
    title: 'Organising your work',
    shortDescription:
      'Externalising what you are holding in your head — and why the method matters less than whether you will actually use it.',
    topic: 'Organisation',
    sourceName: 'National Institute of Mental Health (NIMH)',
    sourceUrl: 'https://www.nimh.nih.gov/health/publications/adhd-what-you-need-to-know',
    summary: [
      'Writing down what you are tracking takes the load off memory, whether that is a list, a calendar or notes.',
      'A system you will keep using beats a better system you will abandon after a week.',
      'Breaking a task down to a first concrete action tends to be the part that gets things moving.',
    ],
    scopeNote:
      'General strategies. They are not a treatment and they will not suit everyone equally.',
    askResponse:
      'The main idea is getting what you are tracking out of your head and into something you will actually keep using. Med-A does not manage your tasks for you — this is reading material, not a to-do app.',
  },
  {
    id: 'res-support-conversations',
    title: 'Conversations about support at work',
    shortDescription:
      'Deciding what you do and do not want to share, and keeping a request focused on the work rather than on yourself.',
    topic: 'Communication',
    sourceName: 'Acas — Adjustments for neurodiversity',
    sourceUrl: 'https://www.acas.org.uk/reasonable-adjustments/adjustments-for-neurodiversity',
    summary: [
      'You decide what to share. A request can describe the work situation without mentioning health at all.',
      'Requests that name a specific change, and a period to try it, are easier to say yes to than general ones.',
      'Agreeing to review it after a set time makes it a trial rather than a permanent commitment for either side.',
    ],
    scopeNote:
      'General guidance on workplace conversations. Rights and obligations differ by country and are not covered here.',
    askResponse:
      'The useful part is that a request can stay entirely about the work — what changes, and for how long you would try it. You choose what to share. I can open an editable draft if you would like a starting point.',
  },
];

export function resourceById(id: string): Resource | undefined {
  return RESOURCES.find((r) => r.id === id);
}

export const RESOURCE_TOPICS = [...new Set(RESOURCES.map((r) => r.topic))].sort();
