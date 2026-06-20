import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faCheck, faCloud } from '@fortawesome/free-solid-svg-icons';
import { useGravy } from '../../state/GravyContext';
import { ConfirmDialog } from '../ConfirmDialog';

export function SyncPanel() {
  const { householdCode, syncStatus, createHousehold, joinHousehold, leaveHousehold } = useGravy();
  const [joinCode, setJoinCode] = useState('');
  const [confirmLeave, setConfirmLeave] = useState(false);

  const handleJoin = () => {
    if (!joinCode.trim()) return;
    joinHousehold(joinCode).then((ok) => {
      if (ok) setJoinCode('');
    });
  };

  return (
    <div>
      <div className="section-label">Cloud Sync</div>
      {householdCode ? (
        <div className="settings-row settings-row--col">
          <div>
            <div className="settings-label">Household code</div>
            <div className="household-code-display">{householdCode}</div>
            <div className="settings-sub">
              {syncStatus === 'syncing' && 'Syncing…'}
              {syncStatus === 'idle' && <><FontAwesomeIcon icon={faCheck} /> Synced — enter this code on other phones to sync them</>}
              {syncStatus === 'error' && (
                <>
                  <FontAwesomeIcon icon={faTriangleExclamation} />{' '}
                  {navigator.onLine ? 'Sync error — will retry' : 'Offline — will sync when back online'}
                </>
              )}
            </div>
          </div>
          <button className="btn btn-primary btn-ghost" onClick={() => setConfirmLeave(true)}>
            Turn off cloud sync
          </button>
        </div>
      ) : (
        <div className="settings-row settings-row--col">
          <div>
            <div className="settings-label">Sync across phones</div>
            <div className="settings-sub">Create a household code, then enter it on other devices</div>
          </div>
          <button className="btn btn-primary" onClick={() => createHousehold()} disabled={syncStatus === 'syncing'}>
            <FontAwesomeIcon icon={faCloud} /> Enable cloud sync
          </button>
          <div className="flex-row-full">
            <input
              type="text"
              placeholder="Enter household code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => { if (e.key === 'Enter') handleJoin(); }}
            />
            <button className="btn btn-primary" onClick={handleJoin} disabled={syncStatus === 'syncing'}>
              Join
            </button>
          </div>
        </div>
      )}
      <ConfirmDialog
        open={confirmLeave}
        icon={faCloud}
        title="Turn off cloud sync?"
        message="This device will stop syncing with the rest of the household. Your data stays on this device."
        confirmLabel="Turn off"
        danger
        onConfirm={() => {
          leaveHousehold();
          setConfirmLeave(false);
        }}
        onCancel={() => setConfirmLeave(false)}
      />
    </div>
  );
}
