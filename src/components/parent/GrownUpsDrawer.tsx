import { lazy, Suspense, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Modal } from '../Modal';

// Loaded on demand so the parent dashboard's weight stays out of the initial bundle the
// kid-facing app ships.
const ParentDashboard = lazy(() =>
  import('./ParentDashboard').then((m) => ({ default: m.ParentDashboard })),
);

interface HeaderState {
  title: string;
  onBack?: () => void;
}

interface GrownUpsDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function GrownUpsDrawer({ open, onClose }: GrownUpsDrawerProps) {
  const [header, setHeader] = useState<HeaderState>({ title: 'Grown-Up Mode' });

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeLabel="Close grown-up mode"
      title={
        <div className="calendar-modal-header-titles">
          {header.onBack && (
            <button className="calendar-modal-back" onClick={header.onBack} aria-label="Back" type="button">
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
          )}
          <span className="calendar-modal-title">{header.title}</span>
        </div>
      }
    >
      <Suspense fallback={<div className="pin-screen"><div className="pin-sub">Loading…</div></div>}>
        <ParentDashboard onHeaderChange={setHeader} />
      </Suspense>
    </Modal>
  );
}
