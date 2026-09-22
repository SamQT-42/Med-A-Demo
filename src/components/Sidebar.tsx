import { copy } from '../content/copy';
import { useStore } from '../state/store';
import type { Section } from '../types';

/**
 * The only chrome in the app.
 *
 * There is no top header bar: breadcrumbs and a header-mounted Reset were
 * removed as visual clutter. The persistent prototype badge and Reset demo sit
 * at the foot of the sidebar, visually secondary but always present.
 */
const ITEMS: { id: Section; label: string; icon: string }[] = [
  { id: 'library', label: 'Library', icon: '☰' },
  { id: 'assistant', label: 'Assistant', icon: '◇' },
  { id: 'saved', label: 'Saved', icon: '☆' },
];

export function Sidebar() {
  const { state, dispatch } = useStore();

  return (
    <nav className="sidebar" aria-label="Main">
      <div className="logo">
        <span className="logo-mark" aria-hidden="true">M</span>
        <span className="logo-name">{copy.appName}</span>
      </div>

      <div className="nav">
        {ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-current={state.section === item.id ? 'page' : undefined}
            onClick={() => dispatch({ type: 'setSection', section: item.id })}
          >
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
            {item.id === 'saved' && state.saved.length > 0 ? (
              <span className="nav-count" aria-label={`${state.saved.length} saved`}>
                {state.saved.length}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="sidebar-foot">
        <p className="badge-proto">{copy.prototypeBadge}</p>
        <button type="button" className="btn-reset" onClick={() => dispatch({ type: 'reset' })}>
          Reset demo
        </button>
      </div>
    </nav>
  );
}
