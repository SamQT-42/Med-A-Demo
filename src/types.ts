/** Shared record types. The same record object is reused by Library, Assistant and Saved. */

export type Section = 'library' | 'assistant' | 'saved';
export type LibraryTab = 'learn' | 'providers' | 'sensory';

/** Anything that can be saved. One union so Saved can hold them all. */
export type SavedKind = 'resource' | 'provider' | 'sensory' | 'draft';

export interface SavedItem {
  key: string;
  kind: SavedKind;
  id: string;
  title: string;
  subtitle: string;
  savedAt: number;
}

/* ------------------------------------------------------------------ */

export interface Resource {
  id: string;
  title: string;
  shortDescription: string;
  topic: string;
  /** Publisher name, stated plainly. No endorsement is implied. */
  sourceName: string;
  sourceUrl: string;
  /** Prototype summary. Never a quotation or a research finding. */
  summary: string[];
  scopeNote: string;
  /** Scripted assistant answer used by "Ask about this resource". */
  askResponse: string;
}

/* ------------------------------------------------------------------ */

/**
 * Two kinds of directory entry, kept apart on purpose:
 *
 * - 'real'   an organisation that genuinely exists. Only the website address
 *            is asserted, because that is all that has been verified. Every
 *            other field renders as UNVERIFIED until a person checks the
 *            official site and fills it in.
 * - 'sample' an invented listing, labelled "Fictional listing", present so the
 *            area / service / format filters can be demonstrated.
 */
export type ProviderKind = 'real' | 'sample';

/** Sentinel for a field nobody has verified yet. Never guess in its place. */
export const UNVERIFIED = 'To be confirmed from the official website' as const;

export type AreaId = 'central' | 'north' | 'unverified';
export type FormatId = 'in_person' | 'online' | 'unverified';

export interface Provider {
  id: string;
  kind: ProviderKind;
  /** For a real entry this is the website address, not a claimed trading name. */
  displayName: string;
  /** Only set for sample listings. Real entries keep UNVERIFIED. */
  organisationName: string;
  websiteUrl: string | null;
  area: AreaId;
  areaLabel: string;
  services: string[];
  formats: FormatId[];
  formatLabel: string;
  intendedService: string;
  /** Neutral questions a person could ask. Not a script, not advice. */
  questionsToAsk: string[];
  note: string;
}

export const AREAS: { id: AreaId; label: string }[] = [
  { id: 'central', label: 'Central area' },
  { id: 'north', label: 'North area' },
  { id: 'unverified', label: 'Area not verified' },
];

export const FORMATS: { id: FormatId; label: string }[] = [
  { id: 'in_person', label: 'In person' },
  { id: 'online', label: 'Online' },
  { id: 'unverified', label: 'Format not verified' },
];

/* ------------------------------------------------------------------ */

export type SensoryKind = 'product' | 'adjustment';
export type SensoryCategory = 'noise' | 'tactile' | 'workspace';

export interface Vendor {
  id: string;
  name: string;
  note: string;
  availability: string;
}

export interface SensoryOption {
  id: string;
  /** A product can be obtained. An adjustment is something to discuss at work. */
  kind: SensoryKind;
  category: SensoryCategory;
  title: string;
  shortDescription: string;
  intendedUse: string;
  /** Preference framing, never "recommended because you have X". */
  preferenceConsiderations: string[];
  vendorId: string | null;
  /** Only for adjustments: seeds the editable request draft. */
  draftSeed: string | null;
}

export const CATEGORIES: { id: SensoryCategory; label: string }[] = [
  { id: 'noise', label: 'Noise reduction' },
  { id: 'tactile', label: 'Tactile tools' },
  { id: 'workspace', label: 'Workspace comfort' },
];

/* ------------------------------------------------------------------ */

export interface ChatMessage {
  id: string;
  author: 'user' | 'assistant';
  text: string;
  /** Rendered as buttons under the message. One question at a time. */
  options?: ChatOption[];
  /** Record ids surfaced in the related-resources panel alongside this turn. */
  related?: { kind: 'resource' | 'provider' | 'sensory'; ids: string[] };
  /** Offers the editable support-request draft. */
  offerDraft?: string;
}

export interface ChatOption {
  label: string;
  /** Deterministic intent id handled by the scripted script. */
  intent: string;
}

/** What the detail drawer is currently showing. */
export type DrawerTarget =
  | { kind: 'resource'; id: string }
  | { kind: 'provider'; id: string }
  | { kind: 'sensory'; id: string }
  | null;
