import { useMemo } from 'react';
import { copy } from '../content/copy';
import { RESOURCES, RESOURCE_TOPICS } from '../data/resources';
import { PROVIDERS, PROVIDER_SERVICES } from '../data/providers';
import { SENSORY } from '../data/sensory';
import { useStore } from '../state/store';
import { AREAS, CATEGORIES, FORMATS, type LibraryTab } from '../types';
import { SaveButton } from '../components/SaveButton';

const TABS: { id: LibraryTab; label: string }[] = [
  { id: 'learn', label: copy.library.tabs.learn },
  { id: 'providers', label: copy.library.tabs.providers },
  { id: 'sensory', label: copy.library.tabs.sensory },
];

function matches(haystack: string[], query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  return haystack.some((h) => h.toLowerCase().includes(q));
}

export function Library() {
  const { state, dispatch } = useStore();
  const { query, filters, libraryTab } = state;

  const learn = useMemo(
    () =>
      RESOURCES.filter(
        (r) =>
          (filters.topic === 'all' || r.topic === filters.topic) &&
          matches([r.title, r.shortDescription, r.topic, r.sourceName], query),
      ),
    [query, filters.topic],
  );

  const providers = useMemo(
    () =>
      PROVIDERS.filter(
        (p) =>
          (filters.area === 'all' || p.area === filters.area) &&
          (filters.service === 'all' || p.services.includes(filters.service)) &&
          (filters.format === 'all' || p.formats.includes(filters.format as never)) &&
          matches([p.displayName, p.organisationName, p.areaLabel, ...p.services], query),
      ),
    [query, filters.area, filters.service, filters.format],
  );

  const sensory = useMemo(
    () =>
      SENSORY.filter(
        (s) =>
          (filters.category === 'all' || s.category === filters.category) &&
          matches([s.title, s.shortDescription, s.intendedUse], query),
      ),
    [query, filters.category],
  );

  const count = libraryTab === 'learn' ? learn.length : libraryTab === 'providers' ? providers.length : sensory.length;
  const total = libraryTab === 'learn' ? RESOURCES.length : libraryTab === 'providers' ? PROVIDERS.length : SENSORY.length;
  const filtered = count !== total;

  return (
    <div className="wrap">
      <div className="page-head">
        <h1>{copy.library.heading}</h1>
        <p className="lede">{copy.library.sub}</p>
      </div>

      <div className="tabs" role="tablist" aria-label="Library sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={libraryTab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => dispatch({ type: 'setTab', tab: t.id })}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="toolbar">
        <div className="search">
          <label htmlFor="library-search">{copy.library.searchLabel}</label>
          <input
            id="library-search"
            type="search"
            value={query}
            placeholder="Search titles and descriptions"
            onChange={(e) => dispatch({ type: 'setQuery', query: e.target.value })}
          />
        </div>

        {libraryTab === 'learn' ? (
          <div className="filter">
            <label htmlFor="f-topic">Topic</label>
            <select
              id="f-topic"
              value={filters.topic}
              onChange={(e) => dispatch({ type: 'setFilter', key: 'topic', value: e.target.value })}
            >
              <option value="all">All topics</option>
              {RESOURCE_TOPICS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        ) : null}

        {libraryTab === 'providers' ? (
          <>
            <div className="filter">
              <label htmlFor="f-area">Example area</label>
              <select
                id="f-area"
                value={filters.area}
                onChange={(e) => dispatch({ type: 'setFilter', key: 'area', value: e.target.value })}
              >
                <option value="all">All areas</option>
                {AREAS.map((a) => (
                  <option key={a.id} value={a.id}>{a.label}</option>
                ))}
              </select>
            </div>
            <div className="filter">
              <label htmlFor="f-service">Service</label>
              <select
                id="f-service"
                value={filters.service}
                onChange={(e) => dispatch({ type: 'setFilter', key: 'service', value: e.target.value })}
              >
                <option value="all">All services</option>
                {PROVIDER_SERVICES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="filter">
              <label htmlFor="f-format">Consultation format</label>
              <select
                id="f-format"
                value={filters.format}
                onChange={(e) => dispatch({ type: 'setFilter', key: 'format', value: e.target.value })}
              >
                <option value="all">All formats</option>
                {FORMATS.map((f) => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>
            </div>
          </>
        ) : null}

        {libraryTab === 'sensory' ? (
          <div className="filter">
            <label htmlFor="f-category">Category</label>
            <select
              id="f-category"
              value={filters.category}
              onChange={(e) => dispatch({ type: 'setFilter', key: 'category', value: e.target.value })}
            >
              <option value="all">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
        ) : null}

        {filtered ? (
          <div className="filter">
            <button type="button" className="btn" onClick={() => dispatch({ type: 'clearFilters' })}>
              Clear filters
            </button>
          </div>
        ) : null}
      </div>

      <p className="result-count" aria-live="polite">
        Showing {count} of {total}
        {filtered ? ' — filters applied' : ''}
      </p>

      {/* ---------------- Learn ---------------- */}
      {libraryTab === 'learn' ? (
        <div role="tabpanel" id="panel-learn" aria-labelledby="tab-learn">
          {learn.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid">
              {learn.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className="card"
                  id={`card-${r.id}`}
                  onClick={() => dispatch({ type: 'openDrawer', target: { kind: 'resource', id: r.id }, opener: `card-${r.id}` })}
                >
                  <h3>{r.title}</h3>
                  <p>{r.shortDescription}</p>
                  <div className="card-foot">
                    <span className="tag">{r.topic}</span>
                    <span className="tag tag-outline">{r.sourceName}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {/* ---------------- Professional support ---------------- */}
      {libraryTab === 'providers' ? (
        <div role="tabpanel" id="panel-providers" aria-labelledby="tab-providers">
          <p className="note">
            “Central area” and “North area” are sample locations used to demonstrate filtering. Med-A does
            not use your location, calculate distance, or show a map.
          </p>
          {providers.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid">
              {providers.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="card"
                  id={`card-${p.id}`}
                  onClick={() => dispatch({ type: 'openDrawer', target: { kind: 'provider', id: p.id }, opener: `card-${p.id}` })}
                >
                  <h3>{p.displayName}</h3>
                  <p>{p.kind === 'real' ? p.note : `${p.areaLabel} · ${p.formatLabel}`}</p>
                  <div className="card-foot">
                    <span className={`tag ${p.kind === 'real' ? 'tag-solid' : ''}`}>
                      {p.kind === 'real' ? copy.labels.realListing : copy.labels.fictionalListing}
                    </span>
                    {p.services.slice(0, 1).map((s) => (
                      <span key={s} className="tag tag-outline">{s}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {/* ---------------- Sensory pantry ---------------- */}
      {libraryTab === 'sensory' ? (
        <div role="tabpanel" id="panel-sensory" aria-labelledby="tab-sensory">
          <p className="note">
            Descriptions are written around preference, not around any condition. Nothing here can be
            bought through Med-A and no availability or price is connected.
          </p>
          {sensory.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid">
              {sensory.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className="card"
                  id={`card-${s.id}`}
                  onClick={() => dispatch({ type: 'openDrawer', target: { kind: 'sensory', id: s.id }, opener: `card-${s.id}` })}
                >
                  <h3>{s.title}</h3>
                  <p>{s.shortDescription}</p>
                  <div className="card-foot">
                    <span className={`tag ${s.kind === 'adjustment' ? 'tag-solid' : ''}`}>
                      {s.kind === 'adjustment' ? copy.labels.notAProduct : 'Product'}
                    </span>
                    <span className="tag tag-outline">
                      {CATEGORIES.find((c) => c.id === s.category)?.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function EmptyState() {
  const { dispatch } = useStore();
  return (
    <div className="empty">
      <h3>No matches</h3>
      <p>
        Nothing in this tab matches your search and filters. Try a different word, or clear the filters to
        see everything again.
      </p>
      <button type="button" className="btn btn-primary" onClick={() => dispatch({ type: 'clearFilters' })}>
        Clear search and filters
      </button>
    </div>
  );
}

export { SaveButton };
