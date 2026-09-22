import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Detail drawer shared by Library, Assistant and Saved.
 *
 * Accessibility contract: it is a modal dialog, Escape closes it, focus moves
 * in on open and returns to the control that opened it on close, and focus is
 * kept inside while it is open.
 */
export function Drawer({
  title,
  badge,
  onClose,
  openerId,
  children,
  footer,
}: {
  title: string;
  badge?: ReactNode;
  onClose: () => void;
  openerId: string | null;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
    const panel = panelRef.current;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      // Return focus to whatever opened the drawer.
      if (openerId) {
        const opener = document.getElementById(openerId);
        if (opener) opener.focus();
      }
    };
  }, [onClose, openerId]);

  return (
    <>
      <div className="scrim" onClick={onClose} aria-hidden="true" />
      <div
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        ref={panelRef}
      >
        <div className="drawer-head">
          <div>
            <h2 id="drawer-title" ref={headingRef} tabIndex={-1}>
              {title}
            </h2>
            {badge ? <div className="row" style={{ marginTop: 8 }}>{badge}</div> : null}
          </div>
          <button type="button" className="drawer-close" onClick={onClose} aria-label="Close details">
            ✕
          </button>
        </div>
        <div className="drawer-body">{children}</div>
        {footer ? <div className="drawer-foot">{footer}</div> : null}
      </div>
    </>
  );
}
