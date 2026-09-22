import { UNVERIFIED, type Provider } from '../types';

/**
 * ============================================================================
 * TEAM ACTION REQUIRED BEFORE THE PITCH — about 5 minutes
 * ============================================================================
 *
 * The first two entries are REAL organisations, added at the team's request.
 * The build environment could not reach either website (network policy), so
 * nothing about them has been verified beyond the address itself.
 *
 * Every unverified field below is set to UNVERIFIED and renders in the UI as
 * "To be confirmed from the official website". That is deliberate: inventing a
 * service, a location or a consultation format for a real medical provider
 * would be exactly the kind of fabrication this prototype must not do.
 *
 * To fill them in: open each site, then replace UNVERIFIED with what the site
 * actually says, and set `area`, `services` and `formats` accordingly. Leave
 * anything the site does not state as UNVERIFIED.
 *
 * Do NOT add phone numbers, practitioner credentials, prices, appointment
 * availability, or any claim of partnership with Med-A.
 * ============================================================================
 */

export const PROVIDERS: Provider[] = [
  {
    id: 'prov-tamlyhoasung',
    kind: 'real',
    displayName: 'tamlyhoasung.com',
    organisationName: UNVERIFIED,
    websiteUrl: 'https://tamlyhoasung.com/',
    area: 'unverified',
    areaLabel: UNVERIFIED,
    services: [],
    formats: ['unverified'],
    formatLabel: UNVERIFIED,
    intendedService:
      'A real organisation suggested by the team. Med-A has not verified what it offers, and has no relationship with it. Please open the official website to see its services in its own words.',
    questionsToAsk: [
      'What does an assessment or a first appointment actually involve?',
      'Who carries it out, and what are their qualifications?',
      'How long does the process take, and what does it cost?',
      'What happens after — is there follow-up, or a written summary?',
    ],
    note: 'Listed at the team’s request. Details not verified in this prototype.',
  },
  {
    id: 'prov-bvdaihoc',
    kind: 'real',
    displayName: 'bvdaihoc.com.vn',
    organisationName: UNVERIFIED,
    websiteUrl: 'https://bvdaihoc.com.vn/',
    area: 'unverified',
    areaLabel: UNVERIFIED,
    services: [],
    formats: ['unverified'],
    formatLabel: UNVERIFIED,
    intendedService:
      'A real organisation suggested by the team. Med-A has not verified its departments or services, and has no relationship with it. Please open the official website for accurate information.',
    questionsToAsk: [
      'Which department handles this, and do I need a referral?',
      'What does the first appointment involve?',
      'How long does the process take, and what does it cost?',
      'Will I receive anything in writing afterwards?',
    ],
    note: 'Listed at the team’s request. Details not verified in this prototype.',
  },

  /* The two below are invented, and labelled as such in the UI. They exist so
     the area / service / format filters can be demonstrated while the real
     entries are still unverified. Delete them once real data is filled in. */
  {
    id: 'prov-sample-central',
    kind: 'sample',
    displayName: 'Sample Clinic A',
    organisationName: 'Sample Clinic A',
    websiteUrl: null,
    area: 'central',
    areaLabel: 'Central area',
    services: ['Adult assessment', 'Follow-up consultation'],
    formats: ['in_person', 'online'],
    formatLabel: 'In person and online',
    intendedService:
      'An invented listing used to demonstrate how filtering and the detail view behave. It is not a real place and cannot be contacted.',
    questionsToAsk: [
      'What does an assessment involve, and how long does it take?',
      'Who carries it out?',
      'What does it cost, and is anything covered?',
      'What do I receive at the end?',
    ],
    note: 'Fictional listing created for this prototype.',
  },
  {
    id: 'prov-sample-north',
    kind: 'sample',
    displayName: 'Sample Centre B',
    organisationName: 'Sample Centre B',
    websiteUrl: null,
    area: 'north',
    areaLabel: 'North area',
    services: ['Adult assessment', 'Counselling'],
    formats: ['in_person'],
    formatLabel: 'In person',
    intendedService:
      'An invented listing used to demonstrate how filtering and the detail view behave. It is not a real place and cannot be contacted.',
    questionsToAsk: [
      'What does a first appointment involve?',
      'Who would I be seeing?',
      'What does it cost?',
      'What are the next steps afterwards?',
    ],
    note: 'Fictional listing created for this prototype.',
  },
];

export function providerById(id: string): Provider | undefined {
  return PROVIDERS.find((p) => p.id === id);
}

/** Every service named by any listing, for the service filter. */
export const PROVIDER_SERVICES = [...new Set(PROVIDERS.flatMap((p) => p.services))].sort();

/** A neutral enquiry template. Nothing is ever transmitted from this prototype. */
export const SAMPLE_ENQUIRY = `Hello,

I am looking for information about arranging an adult assessment.

Could you tell me what a first appointment involves, who carries it out, how long the process usually takes, and what it costs?

Thank you.`;
