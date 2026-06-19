import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloud, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { useGravy, SYNC_SKIPPED_KEY } from '../state/GravyContext';
import { ConfirmDialog } from './ConfirmDialog';

export function SyncGateModal() {
  const { householdCode, syncStatus, createHousehold, joinHousehold } = useGravy();
  const [joinCode, setJoinCode] = useState('');
  const [pendingJoinCode, setPendingJoinCode] = useState('');
  const [confirmJoinOpen, setConfirmJoinOpen] = useState(false);
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(SYNC_SKIPPED_KEY) === 'true');

  if (householdCode || dismissed) return null;

  const syncing = syncStatus === 'syncing';

  const handleSkip = () => {
    localStorage.setItem(SYNC_SKIPPED_KEY, 'true');
    setDismissed(true);
  };

  const handleJoin = () => {
    if (!joinCode.trim()) return;
    setPendingJoinCode(joinCode);
    setConfirmJoinOpen(true);
  };

  const confirmJoin = () => {
    joinHousehold(pendingJoinCode).then((ok) => {
      if (ok) setJoinCode('');
    });
    setConfirmJoinOpen(false);
  };

  return (
    <div className="sync-gate-overlay">
      <div className="badge-popup sync-gate-card">
        <span className="badge-popup-icon"><FontAwesomeIcon icon={faCloud} /></span>
        <div className="badge-popup-name">Set Up Cloud Sync</div>
        <div className="badge-popup-desc">
          Keep this device in sync with the rest of the family. Create a new
          household code, or enter an existing one to join.
        </div>
        <button className="btn btn-primary" onClick={() => createHousehold()} disabled={syncing}>
          <FontAwesomeIcon icon={faCloud} /> Create New Household
        </button>
        <div className="flex-row-full sync-gate-join">
          <label htmlFor="sync-gate-join-code" className="sr-only">Household code to join</label>
          <input
            id="sync-gate-join-code"
            type="text"
            placeholder="Enter household code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
          />
          <button className="btn btn-primary" onClick={handleJoin} disabled={syncing || !joinCode.trim()}>
            Join
          </button>
        </div>
        {syncing && <div className="settings-sub sync-gate-status">Connecting…</div>}
        {!syncing && syncStatus === 'error' && (
          <div className="settings-sub sync-gate-status sync-gate-error">
            <FontAwesomeIcon icon={faTriangleExclamation} /> Couldn't connect — check the code and try again
          </div>
        )}
        <button className="btn btn-sm btn-ghost sync-gate-skip" onClick={handleSkip}>
          Maybe later — use this device only
        </button>
      </div>
      <ConfirmDialog
        open={confirmJoinOpen}
        icon={faCloud}
        title={`Join household ${pendingJoinCode}?`}
        message="This replaces all progress on this device with that household's data. This can't be undone."
        confirmLabel="Join"
        danger
        onConfirm={confirmJoin}
        onCancel={() => setConfirmJoinOpen(false)}
      />
    </div>
  );
}
