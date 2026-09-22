import { useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Details } from './components/Details';
import { RequestDraft } from './components/RequestDraft';
import { Library } from './views/Library';
import { Assistant } from './views/Assistant';
import { Saved } from './views/Saved';
import { StoreProvider, useStore } from './state/store';
import './styles/app.css';

function Main() {
  const { state, dispatch } = useStore();

  useEffect(() => {
    if (!state.notice) return;
    const t = setTimeout(() => dispatch({ type: 'notice', text: null }), 4000);
    return () => clearTimeout(t);
  }, [state.notice, dispatch]);

  return (
    <>
      {state.notice ? (
        <div className="notice" role="status">
          {state.notice}
        </div>
      ) : null}
      {state.section === 'library' ? <Library /> : null}
      {state.section === 'assistant' ? <Assistant /> : null}
      {state.section === 'saved' ? <Saved /> : null}
    </>
  );
}

function Shell() {
  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <Sidebar />
      <main className="main" id="main" tabIndex={-1}>
        <Main />
      </main>
      <Details />
      <RequestDraft />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
