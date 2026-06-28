import { useState, type ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { safeGetItem, safeSetItem } from '../state/storage';

interface CollapsibleSectionProps {
  title: string;
  /** Rendered on the right of the header (e.g. the progress badge). */
  headerRight?: ReactNode;
  children: ReactNode;
  /** localStorage key suffix; collapse state is a per-device view preference, not synced. */
  storageKey: string;
  defaultOpen?: boolean;
}

const KEY_PREFIX = 'gravy_section_open_';

/**
 * Collapsible card section used by the kid home screen's Food / Daily Goals / Bonus rows.
 * Default expanded (this is the kid's primary daily action surface); collapse state persists
 * to localStorage per section so a home-screen-installed PWA remembers it across relaunches.
 * Deliberately kept out of synced household state — it's a per-device preference.
 */
export function CollapsibleSection({ title, headerRight, children, storageKey, defaultOpen = true }: CollapsibleSectionProps) {
  const fullKey = KEY_PREFIX + storageKey;
  const [open, setOpen] = useState(() => {
    const saved = safeGetItem(fullKey);
    return saved === null ? defaultOpen : saved === '1';
  });

  const toggle = () => {
    setOpen((prev) => {
      const next = !prev;
      safeSetItem(fullKey, next ? '1' : '0');
      return next;
    });
  };

  return (
    <div className={`card collapsible-section ${open ? 'open' : 'collapsed'}`}>
      <button
        type="button"
        className="collapsible-header"
        onClick={toggle}
        aria-expanded={open}
      >
        <span className="goal-card-title">{title}</span>
        <span className="collapsible-header-right">
          {headerRight}
          <FontAwesomeIcon icon={faChevronDown} className="collapsible-chevron" aria-hidden="true" />
        </span>
      </button>
      {open && <div className="collapsible-body">{children}</div>}
    </div>
  );
}
