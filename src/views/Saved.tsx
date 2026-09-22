import { copy } from '../content/copy';
import { useStore } from '../state/store';
import type { SavedItem } from '../types';

const KIND_LABEL: Record<SavedItem['kind'], string> = {
  resource: 'Resource',
  provider: 'Professional support',
  sensory: 'Sensory option',
  draft: 'Support request draft',
};

export function Saved() {
  const { state, dispatch } = useStore();

  return (
    <div className="wrap">
      <div className="page-head">
        <h1>{copy.saved.heading}</h1>
        <p className="lede">{copy.saved.sub}</p>
      </div>

      {state.saved.length === 0 ? (
        <div className="empty">
          <h3>{copy.saved.empty}</h3>
          <p>
            Anything you save from the library or the assistant will collect here — resources, listings,
            sensory options and request drafts.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => dispatch({ type: 'setSection', section: 'library' })}
          >
            Back to the library
          </button>
        </div>
      ) : (
        <div className="saved-list">
          {state.saved.map((item) => (
            <div className="saved-row" key={item.key}>
              <div className="saved-main">
                <h3>{item.title}</h3>
                <p>
                  {KIND_LABEL[item.kind]} · {item.subtitle}
                </p>
              </div>
              <div className="row">
                <button
                  type="button"
                  className="btn btn-sm"
                  id={`saved-open-${item.key.replace(':', '-')}`}
                  onClick={() => {
                    if (item.kind === 'draft') {
                      dispatch({ type: 'openDraft', id: item.id, seed: '' });
                    } else {
                      dispatch({
                        type: 'openDrawer',
                        target: { kind: item.kind, id: item.id },
                        opener: `saved-open-${item.key.replace(':', '-')}`,
                      });
                    }
                  }}
                >
                  Open
                </button>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => dispatch({ type: 'removeSaved', key: item.key })}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="note" style={{ marginTop: 24 }}>
        {copy.saved.resetNote}
      </p>
    </div>
  );
}
