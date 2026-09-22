import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';
import type {
  ChatMessage,
  DrawerTarget,
  LibraryTab,
  SavedItem,
  SavedKind,
  Section,
} from '../types';
import { openingMessage } from '../data/script';

/**
 * All interaction state lives here, in memory only.
 *
 * There is deliberately no persistence: reloading the page or pressing Reset
 * demo returns the prototype to exactly this initial state. Saved items are
 * not an account and are never written anywhere.
 */
export interface AppState {
  section: Section;
  libraryTab: LibraryTab;
  query: string;
  filters: { area: string; service: string; format: string; category: string; topic: string };
  drawer: DrawerTarget;
  /** The control that opened the drawer, so focus can be restored on close. */
  drawerOpener: string | null;
  messages: ChatMessage[];
  /** Free-text box in the assistant. */
  input: string;
  saved: SavedItem[];
  /** Editable support-request drafts, keyed by the option that seeded them. */
  drafts: Record<string, string>;
  /** Draft currently open in the editor, if any. */
  activeDraft: string | null;
  notice: string | null;
}

export function initialState(): AppState {
  return {
    section: 'library',
    libraryTab: 'learn',
    query: '',
    filters: { area: 'all', service: 'all', format: 'all', category: 'all', topic: 'all' },
    drawer: null,
    drawerOpener: null,
    messages: [openingMessage()],
    input: '',
    saved: [],
    drafts: {},
    activeDraft: null,
    notice: null,
  };
}

export type Action =
  | { type: 'reset' }
  | { type: 'setSection'; section: Section }
  | { type: 'setTab'; tab: LibraryTab }
  | { type: 'setQuery'; query: string }
  | { type: 'setFilter'; key: keyof AppState['filters']; value: string }
  | { type: 'clearFilters' }
  | { type: 'openDrawer'; target: DrawerTarget; opener?: string }
  | { type: 'closeDrawer' }
  | { type: 'addMessage'; message: ChatMessage }
  | { type: 'setInput'; input: string }
  | { type: 'toggleSave'; item: Omit<SavedItem, 'key' | 'savedAt'> }
  | { type: 'removeSaved'; key: string }
  | { type: 'setDraft'; id: string; text: string }
  | { type: 'openDraft'; id: string; seed: string }
  | { type: 'closeDraft' }
  | { type: 'notice'; text: string | null };

/** One stable key per saved thing, so the same record cannot be saved twice. */
export function savedKey(kind: SavedKind, id: string): string {
  return `${kind}:${id}`;
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'reset':
      return initialState();

    case 'setSection':
      return { ...state, section: action.section, drawer: null, notice: null };

    case 'setTab':
      // Each tab has its own filters; clear them so results are never
      // silently narrowed by a control the user cannot see.
      return {
        ...state,
        libraryTab: action.tab,
        filters: initialState().filters,
        drawer: null,
      };

    case 'setQuery':
      return { ...state, query: action.query };

    case 'setFilter':
      return { ...state, filters: { ...state.filters, [action.key]: action.value } };

    case 'clearFilters':
      return { ...state, filters: initialState().filters, query: '' };

    case 'openDrawer':
      return { ...state, drawer: action.target, drawerOpener: action.opener ?? null };

    case 'closeDrawer':
      return { ...state, drawer: null };

    case 'addMessage':
      return { ...state, messages: [...state.messages, action.message] };

    case 'setInput':
      return { ...state, input: action.input };

    case 'toggleSave': {
      const key = savedKey(action.item.kind, action.item.id);
      const existing = state.saved.find((s) => s.key === key);
      if (existing) {
        return {
          ...state,
          saved: state.saved.filter((s) => s.key !== key),
          notice: `Removed “${action.item.title}” from Saved.`,
        };
      }
      return {
        ...state,
        saved: [...state.saved, { ...action.item, key, savedAt: Date.now() }],
        notice: `Saved “${action.item.title}”.`,
      };
    }

    case 'removeSaved':
      return { ...state, saved: state.saved.filter((s) => s.key !== action.key), notice: null };

    case 'setDraft':
      return { ...state, drafts: { ...state.drafts, [action.id]: action.text } };

    case 'openDraft':
      return {
        ...state,
        activeDraft: action.id,
        drafts: { ...state.drafts, [action.id]: state.drafts[action.id] ?? action.seed },
      };

    case 'closeDraft':
      return { ...state, activeDraft: null };

    case 'notice':
      return { ...state, notice: action.text };

    default:
      return state;
  }
}

interface Ctx {
  state: AppState;
  dispatch: (a: Action) => void;
  isSaved: (kind: SavedKind, id: string) => boolean;
}

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const value = useMemo<Ctx>(
    () => ({
      state,
      dispatch,
      isSaved: (kind, id) => state.saved.some((s) => s.key === savedKey(kind, id)),
    }),
    [state],
  );
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Ctx {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
