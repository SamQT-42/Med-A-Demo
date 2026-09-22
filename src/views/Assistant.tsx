import { useEffect, useRef } from 'react';
import { copy } from '../content/copy';
import { fallback, intentFromText, respond, userMessage } from '../data/script';
import { resourceById } from '../data/resources';
import { providerById } from '../data/providers';
import { sensoryById } from '../data/sensory';
import { useStore } from '../state/store';
import type { ChatMessage } from '../types';

export function Assistant() {
  const { state, dispatch } = useStore();
  const logEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEnd.current?.scrollIntoView({ block: 'end' });
  }, [state.messages.length]);

  function send(intent: string, label: string) {
    dispatch({ type: 'addMessage', message: userMessage(label) });
    const reply = respond(intent);
    dispatch({ type: 'addMessage', message: reply ?? fallback() });
  }

  function sendFreeText() {
    const text = state.input.trim();
    if (!text) return;
    dispatch({ type: 'addMessage', message: userMessage(text) });
    dispatch({ type: 'setInput', input: '' });
    const intent = intentFromText(text);
    const reply = intent ? respond(intent) : null;
    dispatch({ type: 'addMessage', message: reply ?? fallback() });
  }

  // The related panel reflects the most recent assistant turn that named records.
  const lastRelated = [...state.messages].reverse().find((m) => m.related)?.related;

  return (
    <div className="wrap" style={{ maxWidth: 1120 }}>
      <div className="page-head">
        <h1>Assistant</h1>
        <p className="lede">
          A guided walkthrough of the library. It does not diagnose, and it is not a live model.
        </p>
      </div>

      <div className="assistant-layout">
        <section className="chat" aria-label="Conversation">
          <div className="chat-log" role="log" aria-live="polite">
            <p className="tag tag-outline" style={{ alignSelf: 'flex-start' }}>
              {copy.scriptedBadge}
            </p>
            {state.messages.map((m) => (
              <Message key={m.id} message={m} onOption={send} />
            ))}
            <div ref={logEnd} />
          </div>

          <form
            className="chat-input"
            onSubmit={(e) => {
              e.preventDefault();
              sendFreeText();
            }}
          >
            <div className="grow">
              <label htmlFor="chat-text" style={{ position: 'absolute', left: -9999 }}>
                {copy.assistant.inputLabel}
              </label>
              <input
                id="chat-text"
                type="text"
                value={state.input}
                placeholder="Type a message, or use the options above"
                onChange={(e) => dispatch({ type: 'setInput', input: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={!state.input.trim()}>
              Send
            </button>
          </form>
        </section>

        <aside className="related" aria-label={copy.assistant.relatedHeading}>
          <h2>{copy.assistant.relatedHeading}</h2>
          {!lastRelated ? (
            <p style={{ fontSize: '0.875rem', color: 'var(--c-text-muted)', margin: 0 }}>
              {copy.assistant.relatedEmpty}
            </p>
          ) : (
            lastRelated.ids.map((id) => {
              const entry =
                lastRelated.kind === 'resource'
                  ? resourceById(id)
                  : lastRelated.kind === 'provider'
                    ? providerById(id)
                    : sensoryById(id);
              if (!entry) return null;
              const title =
                'displayName' in entry ? entry.displayName : entry.title;
              const desc =
                'shortDescription' in entry
                  ? entry.shortDescription
                  : 'note' in entry
                    ? entry.note
                    : '';
              return (
                <button
                  key={id}
                  type="button"
                  className="card"
                  id={`related-${id}`}
                  onClick={() =>
                    dispatch({
                      type: 'openDrawer',
                      target: { kind: lastRelated.kind, id },
                      opener: `related-${id}`,
                    })
                  }
                >
                  <h3>{title}</h3>
                  <p>{desc}</p>
                  <div className="card-foot">
                    <span className="tag tag-outline">Open details</span>
                  </div>
                </button>
              );
            })
          )}
        </aside>
      </div>
    </div>
  );
}

function Message({
  message,
  onOption,
}: {
  message: ChatMessage;
  onOption: (intent: string, label: string) => void;
}) {
  const { dispatch } = useStore();
  const isUser = message.author === 'user';
  return (
    <div className={`msg ${isUser ? 'msg-user' : ''}`}>
      <p className="msg-who">{isUser ? 'You' : `Assistant · ${copy.scriptedBadge}`}</p>
      <div className="msg-body">
        <p>{message.text}</p>
      </div>

      {message.offerDraft ? (
        <div className="chat-options">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              const opt = sensoryById(message.offerDraft!);
              if (opt?.draftSeed) dispatch({ type: 'openDraft', id: opt.id, seed: opt.draftSeed });
            }}
          >
            Draft a support request
          </button>
        </div>
      ) : null}

      {message.options && message.options.length > 0 ? (
        <div className="chat-options">
          {message.options.map((o) => (
            <button key={o.intent} type="button" className="btn" onClick={() => onOption(o.intent, o.label)}>
              {o.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
