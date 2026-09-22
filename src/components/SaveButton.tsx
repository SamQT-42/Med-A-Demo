import { useStore } from '../state/store';
import type { SavedKind } from '../types';

/**
 * Save / remove toggle. Saving the same record twice is impossible because the
 * store keys items by kind and id.
 */
export function SaveButton({
  kind,
  id,
  title,
  subtitle,
  size = 'md',
}: {
  kind: SavedKind;
  id: string;
  title: string;
  subtitle: string;
  size?: 'sm' | 'md';
}) {
  const { dispatch, isSaved } = useStore();
  const saved = isSaved(kind, id);
  return (
    <button
      type="button"
      className={`btn ${size === 'sm' ? 'btn-sm' : ''} ${saved ? '' : 'btn-primary'}`}
      aria-pressed={saved}
      onClick={(e) => {
        e.stopPropagation();
        dispatch({ type: 'toggleSave', item: { kind, id, title, subtitle } });
      }}
    >
      {saved ? 'Saved ✓ — remove' : 'Save'}
    </button>
  );
}
