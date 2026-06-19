import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faCheck, faCloud, faRotate } from '@fortawesome/free-solid-svg-icons';
import { useGravy } from '../../state/GravyContext';
import { ConfirmDialog } from '../ConfirmDialog';
import type { Theme } from '../../state/types';

type ConfirmStep = 'none' | 'resetToday' | 'resetAll1' | 'resetAll2' | 'leaveSync' | 'joinHousehold';

const THEME_OPTIONS: { id: Theme; label: string }[] = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'rainbow', label: 'Rainbow' },
  { id: 'gold', label: 'Gold' },
];

export function SettingsPanel() {
  const {
    state,
    saveSetting,
    resetToday,
    resetAll,
    householdCode,
    syncStatus,
    createHousehold,
    joinHousehold,
    leaveHousehold,
  } = useGravy();
  const [foodPts, setFoodPts] = useState(String(state.settings.foodPts));
  const [bonusPts, setBonusPts] = useState(String(state.settings.bonusPts));
  const [pin, setPin] = useState(String(state.settings.pin));
  const [childName, setChildName] = useState(state.settings.childName);
  const [recoveryQuestion, setRecoveryQuestion] = useState(state.settings.recoveryQuestion);
  const [recoveryAnswer, setRecoveryAnswer] = useState(state.settings.recoveryAnswer);
  const [joinCode, setJoinCode] = useState('');
  const [pendingJoinCode, setPendingJoinCode] = useState('');
  const [confirmStep, setConfirmStep] = useState<ConfirmStep>('none');
  const [savedField, setSavedField] = useState<string | null>(null);
  const savedTimerRef = useRef<number | null>(null);

  const flashSaved = (field: string) => {
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    setSavedField(field);
    savedTimerRef.current = window.setTimeout(() => setSavedField(null), 1400);
  };

  const handleJoin = () => {
    if (!joinCode.trim()) return;
    setPendingJoinCode(joinCode);
    setConfirmStep('joinHousehold');
  };

  const confirmJoin = () => {
    joinHousehold(pendingJoinCode).then((ok) => {
      if (ok) setJoinCode('');
    });
    setConfirmStep('none');
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
          <button className="btn btn-primary btn-ghost" onClick={() => setConfirmStep('leaveSync')}>
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
            <label htmlFor="settings-join-code" className="sr-only">Household code to join</label>
            <input
              id="settings-join-code"
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
      <div className="section-label">Appearance</div>
      <div className="settings-row settings-row--col">
        <div>
          <div className="settings-label">
            Theme
            {savedField === 'theme' && <FontAwesomeIcon icon={faCheck} className="saved-flash" />}
          </div>
          <div className="settings-sub">Changes the look of the app for everyone</div>
        </div>
        <div className="theme-swatch-grid">
          {THEME_OPTIONS.map((opt) => (
            <button
              type="button"
              key={opt.id}
              className={`theme-swatch ${state.settings.theme === opt.id ? 'active' : ''}`}
              onClick={() => {
                saveSetting('theme', opt.id);
                flashSaved('theme');
              }}
              aria-pressed={state.settings.theme === opt.id}
            >
              <span className={`theme-swatch-preview theme-swatch-preview--${opt.id}`} />
              <span className="theme-swatch-label">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="section-label">Profile</div>
      <div className="settings-row">
        <div>
          <label className="settings-label" htmlFor="settings-child-name">
            Child's name
            {savedField === 'childName' && <FontAwesomeIcon icon={faCheck} className="saved-flash" />}
          </label>
          <div className="settings-sub">Shown throughout the app</div>
        </div>
        <input
          id="settings-child-name"
          type="text"
          maxLength={20}
          placeholder="Zack"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          onBlur={(e) => {
            saveSetting('childName', e.target.value);
            flashSaved('childName');
          }}
        />
      </div>
      <div className="section-label">Points</div>
      <div className="settings-row">
        <div>
          <label className="settings-label" htmlFor="settings-food-pts">
            Points per food group
            {savedField === 'foodPts' && <FontAwesomeIcon icon={faCheck} className="saved-flash" />}
          </label>
          <div className="settings-sub">Awarded when {state.settings.childName} taps each food group</div>
        </div>
        <input
          id="settings-food-pts"
          type="number"
          min={1}
          max={100}
          value={foodPts}
          onChange={(e) => setFoodPts(e.target.value)}
          onBlur={(e) => {
            const clamped = Math.min(100, Math.max(1, parseInt(e.target.value) || 1));
            setFoodPts(String(clamped));
            saveSetting('foodPts', String(clamped));
            flashSaved('foodPts');
          }}
        />
      </div>
      <div className="settings-row">
        <div>
          <label className="settings-label" htmlFor="settings-bonus-pts">
            Full tray bonus
            {savedField === 'bonusPts' && <FontAwesomeIcon icon={faCheck} className="saved-flash" />}
          </label>
          <div className="settings-sub">Bonus for eating all 5 food groups</div>
        </div>
        <input
          id="settings-bonus-pts"
          type="number"
          min={0}
          max={500}
          value={bonusPts}
          onChange={(e) => setBonusPts(e.target.value)}
          onBlur={(e) => {
            const clamped = Math.min(500, Math.max(0, parseInt(e.target.value) || 0));
            setBonusPts(String(clamped));
            saveSetting('bonusPts', String(clamped));
            flashSaved('bonusPts');
          }}
        />
      </div>
      <div className="section-label">PIN</div>
      <div className="settings-row">
        <div>
          <label className="settings-label" htmlFor="settings-pin">
            Change PIN
            {savedField === 'pin' && <FontAwesomeIcon icon={faCheck} className="saved-flash" />}
          </label>
          <div className="settings-sub">Enter a new 4-digit PIN</div>
        </div>
        <input
          id="settings-pin"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          placeholder="1234"
          value={pin}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
            setPin(digits);
          }}
          onBlur={() => {
            if (pin.length === 4) {
              saveSetting('pin', pin);
              flashSaved('pin');
            } else {
              setPin(String(state.settings.pin));
            }
          }}
        />
      </div>
      <div className="settings-row">
        <div>
          <label className="settings-label" htmlFor="settings-recovery-question">
            Recovery question
            {savedField === 'recoveryQuestion' && <FontAwesomeIcon icon={faCheck} className="saved-flash" />}
          </label>
          <div className="settings-sub">Shown if "Forgot PIN?" is tapped on the PIN screen</div>
        </div>
        <input
          id="settings-recovery-question"
          type="text"
          maxLength={60}
          placeholder="What's our dog's name?"
          value={recoveryQuestion}
          onChange={(e) => setRecoveryQuestion(e.target.value)}
          onBlur={(e) => {
            saveSetting('recoveryQuestion', e.target.value);
            flashSaved('recoveryQuestion');
          }}
        />
      </div>
      <div className="settings-row">
        <div>
          <label className="settings-label" htmlFor="settings-recovery-answer">
            Recovery answer
            {savedField === 'recoveryAnswer' && <FontAwesomeIcon icon={faCheck} className="saved-flash" />}
          </label>
          <div className="settings-sub">Not case-sensitive. Leave blank to disable PIN recovery</div>
        </div>
        <input
          id="settings-recovery-answer"
          type="text"
          maxLength={60}
          placeholder="Rex"
          value={recoveryAnswer}
          onChange={(e) => setRecoveryAnswer(e.target.value)}
          onBlur={(e) => {
            saveSetting('recoveryAnswer', e.target.value);
            flashSaved('recoveryAnswer');
          }}
        />
      </div>
      {(recoveryQuestion.trim() !== '') !== (recoveryAnswer.trim() !== '') && (
        <div className="settings-sub">Fill in both fields to enable PIN recovery</div>
      )}
      <div className="section-label">Reset</div>
      <button className="btn btn-primary btn-pink mt-8" onClick={() => setConfirmStep('resetToday')}>
        <FontAwesomeIcon icon={faRotate} /> Reset Today's Progress
      </button>
      <button className="btn btn-primary btn-dark mt-8" style={{ marginTop: 8 }} onClick={() => setConfirmStep('resetAll1')}>
        <FontAwesomeIcon icon={faTriangleExclamation} /> Reset Everything
      </button>

      <ConfirmDialog
        open={confirmStep === 'resetToday'}
        icon={faRotate}
        title="Reset today's progress?"
        message="This will clear today's food and goal checkmarks. Points already earned today will be removed."
        confirmLabel="Reset"
        danger
        onConfirm={() => {
          resetToday();
          setConfirmStep('none');
        }}
        onCancel={() => setConfirmStep('none')}
      />
      <ConfirmDialog
        open={confirmStep === 'resetAll1'}
        icon={faTriangleExclamation}
        title="Reset everything?"
        message="This will delete ALL progress — points, badges, history, goals, and rewards. This can't be undone."
        confirmLabel="Continue"
        danger
        onConfirm={() => setConfirmStep('resetAll2')}
        onCancel={() => setConfirmStep('none')}
      />
      <ConfirmDialog
        open={confirmStep === 'resetAll2'}
        icon={faTriangleExclamation}
        title="Are you really sure?"
        message="All points, badges, and history will be gone for good."
        confirmLabel="Yes, reset everything"
        danger
        onConfirm={() => {
          resetAll();
          setConfirmStep('none');
        }}
        onCancel={() => setConfirmStep('none')}
      />
      <ConfirmDialog
        open={confirmStep === 'leaveSync'}
        icon={faCloud}
        title="Turn off cloud sync?"
        message="This device will stop syncing with the rest of the household. Your data stays on this device."
        confirmLabel="Turn off"
        danger
        onConfirm={() => {
          leaveHousehold();
          setConfirmStep('none');
        }}
        onCancel={() => setConfirmStep('none')}
      />
      <ConfirmDialog
        open={confirmStep === 'joinHousehold'}
        icon={faCloud}
        title={`Join household ${pendingJoinCode}?`}
        message="This replaces all progress on this device — points, badges, history, goals, and rewards — with that household's data. This can't be undone."
        confirmLabel="Join"
        danger
        onConfirm={confirmJoin}
        onCancel={() => setConfirmStep('none')}
      />
    </div>
  );
}
