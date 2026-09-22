import { copy } from '../content/copy';
import { providerById, SAMPLE_ENQUIRY } from '../data/providers';
import { resourceById } from '../data/resources';
import { sensoryById, vendorById } from '../data/sensory';
import { askAboutResource } from '../data/script';
import { useStore } from '../state/store';
import { UNVERIFIED } from '../types';
import { Drawer } from './Drawer';
import { SaveButton } from './SaveButton';

/** Renders a field that may be unverified, without ever inventing a value. */
function Field({ label, value }: { label: string; value: string }) {
  const unverified = value === UNVERIFIED;
  return (
    <>
      <dt>{label}</dt>
      <dd className={unverified ? 'unverified' : undefined}>{value}</dd>
    </>
  );
}

export function Details() {
  const { state, dispatch } = useStore();
  const target = state.drawer;
  if (!target) return null;

  const close = () => dispatch({ type: 'closeDrawer' });

  /* ---------------- Resource ---------------- */
  if (target.kind === 'resource') {
    const r = resourceById(target.id);
    if (!r) return null;
    return (
      <Drawer
        title={r.title}
        openerId={state.drawerOpener}
        onClose={close}
        badge={
          <>
            <span className="tag">{r.topic}</span>
            <span className="tag tag-outline">{copy.labels.prototypeSummary}</span>
          </>
        }
        footer={
          <div className="row">
            <SaveButton kind="resource" id={r.id} title={r.title} subtitle={r.topic} />
            <button
              type="button"
              className="btn"
              onClick={() => {
                for (const m of askAboutResource(r.title, r.askResponse)) {
                  dispatch({ type: 'addMessage', message: m });
                }
                dispatch({ type: 'closeDrawer' });
                dispatch({ type: 'setSection', section: 'assistant' });
              }}
            >
              Ask about this resource
            </button>
          </div>
        }
      >
        {r.summary.map((p, i) => (
          <p key={i}>{p}</p>
        ))}

        <dl className="field-list" style={{ marginTop: 24 }}>
          <Field label="Source" value={r.sourceName} />
          <dt>Read the original</dt>
          <dd>
            <a href={r.sourceUrl} target="_blank" rel="noreferrer noopener">
              {r.sourceUrl}
            </a>
          </dd>
          <Field label="How far this applies" value={r.scopeNote} />
        </dl>

        <p className="note note-strong">
          A prototype summary written from public guidance. It is not reviewed by a clinician, not endorsed
          by the publisher, and contains no quotations or research findings.
        </p>
      </Drawer>
    );
  }

  /* ---------------- Provider ---------------- */
  if (target.kind === 'provider') {
    const p = providerById(target.id);
    if (!p) return null;
    const real = p.kind === 'real';
    return (
      <Drawer
        title={p.displayName}
        openerId={state.drawerOpener}
        onClose={close}
        badge={
          <span className={`tag ${real ? 'tag-solid' : ''}`}>
            {real ? copy.labels.realListing : copy.labels.fictionalListing}
          </span>
        }
        footer={
          <div className="row">
            <SaveButton
              kind="provider"
              id={p.id}
              title={p.displayName}
              subtitle={real ? 'Real organisation · details not verified' : 'Fictional listing'}
            />
            {p.websiteUrl ? (
              <a className="btn" href={p.websiteUrl} target="_blank" rel="noreferrer noopener">
                Open official website
              </a>
            ) : null}
          </div>
        }
      >
        <p>{p.intendedService}</p>

        <dl className="field-list">
          <Field label="Organisation name" value={p.organisationName} />
          <Field label="Example area" value={p.areaLabel} />
          <Field label="Example services" value={p.services.length ? p.services.join(', ') : UNVERIFIED} />
          <Field label="Consultation format" value={p.formatLabel} />
        </dl>

        {real ? (
          <p className="note note-strong">
            This organisation is real, but Med-A has not verified anything about it beyond its web address,
            and has no relationship or partnership with it. Please read the official website for accurate
            information.
          </p>
        ) : (
          <p className="note">
            An invented listing used to show how the directory behaves. It is not a real place and cannot
            be contacted.
          </p>
        )}

        <h3 style={{ marginTop: 24 }}>Questions to ask before arranging an assessment</h3>
        <ul className="plain">
          {p.questionsToAsk.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ul>

        <h3 style={{ marginTop: 24 }}>Sample enquiry</h3>
        <p className="small" style={{ fontSize: '0.875rem', color: 'var(--c-text-muted)' }}>
          A neutral message you could adapt and send yourself. Med-A does not send anything — there is no
          contact form, no recipient, and no transmission from this prototype.
        </p>
        <div className="pre">{SAMPLE_ENQUIRY}</div>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => {
            void navigator.clipboard?.writeText(SAMPLE_ENQUIRY);
            dispatch({ type: 'notice', text: 'Sample enquiry copied to your clipboard. Nothing was sent.' });
          }}
        >
          Copy sample enquiry
        </button>
      </Drawer>
    );
  }

  /* ---------------- Sensory option ---------------- */
  const s = sensoryById(target.id);
  if (!s) return null;
  const vendor = vendorById(s.vendorId);
  const isAdjustment = s.kind === 'adjustment';

  return (
    <Drawer
      title={s.title}
      openerId={state.drawerOpener}
      onClose={close}
      badge={
        <span className={`tag ${isAdjustment ? 'tag-solid' : ''}`}>
          {isAdjustment ? copy.labels.notAProduct : 'Product'}
        </span>
      }
      footer={
        <div className="row">
          <SaveButton
            kind="sensory"
            id={s.id}
            title={s.title}
            subtitle={isAdjustment ? 'Workplace adjustment' : 'Sensory option'}
          />
          {isAdjustment && s.draftSeed ? (
            <button
              type="button"
              className="btn"
              onClick={() => {
                dispatch({ type: 'openDraft', id: s.id, seed: s.draftSeed! });
                dispatch({ type: 'closeDrawer' });
              }}
            >
              Draft a support request
            </button>
          ) : null}
        </div>
      }
    >
      <p>{s.shortDescription}</p>

      <dl className="field-list">
        <Field label="Intended use" value={s.intendedUse} />
      </dl>

      <h3>Preference considerations</h3>
      <ul className="plain">
        {s.preferenceConsiderations.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>

      {isAdjustment ? (
        <p className="note note-strong">
          This is not a product and has no vendor. It is a change to discuss with your workplace. Med-A
          cannot arrange it and does not contact anyone on your behalf.
        </p>
      ) : vendor ? (
        <>
          <h3 style={{ marginTop: 24 }}>Vendor details</h3>
          <dl className="field-list">
            <Field label={copy.labels.exampleVendor} value={vendor.name} />
            <Field label="About this record" value={vendor.note} />
            <Field label="Availability" value={vendor.availability} />
          </dl>
          <p className="note">
            A placeholder supplier record. No price, rating, stock level or purchase route is connected,
            and no claim is made about how well anything works.
          </p>
        </>
      ) : null}
    </Drawer>
  );
}
