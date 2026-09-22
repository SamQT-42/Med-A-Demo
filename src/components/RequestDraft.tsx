import { sensoryById } from '../data/sensory';
import { useStore } from '../state/store';
import { Drawer } from './Drawer';

/**
 * Editable support-request draft.
 *
 * It can be edited, saved to this session, and copied. It is never sent, and
 * nothing in this prototype simulates an employer receiving or approving it.
 */
export function RequestDraft() {
  const { state, dispatch } = useStore();
  const id = state.activeDraft;
  if (!id) return null;

  const option = sensoryById(id);
  const text = state.drafts[id] ?? '';

  return (
    <Drawer
      title="Draft a support request"
      openerId={null}
      onClose={() => dispatch({ type: 'closeDraft' })}
      badge={<span className="tag tag-outline">Nothing is sent from this prototype</span>}
      footer={
        <div className="row">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              dispatch({
                type: 'toggleSave',
                item: {
                  kind: 'draft',
                  id,
                  title: 'Support request draft',
                  subtitle: option?.title ?? 'Workplace adjustment',
                },
              });
              dispatch({ type: 'closeDraft' });
            }}
          >
            Save to this session
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              void navigator.clipboard?.writeText(text);
              dispatch({ type: 'notice', text: 'Draft copied to your clipboard. Nothing was sent.' });
            }}
          >
            Copy draft
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => dispatch({ type: 'closeDraft' })}>
            Close
          </button>
        </div>
      }
    >
      <p>
        A starting point you can change however you like. It stays on this screen — Med-A has no way to
        send it, and does not simulate anyone approving it.
      </p>

      <label htmlFor="draft-text" style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--c-text-muted)' }}>
        Your request
      </label>
      <textarea
        id="draft-text"
        value={text}
        onChange={(e) => dispatch({ type: 'setDraft', id, text: e.target.value })}
      />

      <p className="note note-strong">
        You decide what to share. A request like this can describe the work situation without mentioning
        health at all.
      </p>
    </Drawer>
  );
}
