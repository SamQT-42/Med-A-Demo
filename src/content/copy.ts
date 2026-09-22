/** All persistent UI wording, in one place. */
export const copy = {
  appName: 'Med-A',
  prototypeBadge: 'Interactive prototype · Sample data',
  scriptedBadge: 'Scripted assistant demo',

  library: {
    heading: 'Find support that fits you.',
    sub: 'Explore information, professional support and sensory tools at your own pace.',
    searchLabel: 'Search the library',
    tabs: { learn: 'Learn', providers: 'Professional support', sensory: 'Sensory pantry' },
  },

  assistant: {
    opening: 'What would you like help exploring today?',
    unsupported:
      'This prototype demonstrates a few guided conversations. Choose a topic below to continue.',
    relatedHeading: 'Related in the library',
    relatedEmpty: 'Resources mentioned in the conversation will appear here.',
    inputLabel: 'Type a message',
  },

  saved: {
    heading: 'Saved',
    sub: 'Everything you saved during this session.',
    empty: 'Nothing saved yet.',
    resetNote:
      'Saved items live in this browser tab only. Reloading the page or pressing Reset demo clears them. This is not an account and nothing is stored anywhere.',
  },

  labels: {
    prototypeSummary: 'Prototype summary based on public guidance',
    fictionalListing: 'Fictional listing',
    realListing: 'Real organisation · details not verified',
    exampleVendor: 'Example vendor',
    availability: 'Availability not connected',
    notAProduct: 'Workplace adjustment · not a product',
  },
} as const;
