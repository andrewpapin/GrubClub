import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { useGravy } from '../state/GravyContext';

type Step = 'pin' | 'recovery';

interface PinSetupStepProps {
  // Called once the parent either finishes or skips PIN/recovery setup — the caller decides
  // what "done" means (close a modal, advance to the next onboarding phase, etc).
  onDone: () => void;
}

// Shown right after a household is newly created (onboarding's sync step, or the SyncGateModal
// nudge) so a parent sets a real PIN — and ideally a recovery question — at the moment sync is
// turned on, instead of only being reachable later via the PIN-gated Settings screen.
export function PinSetupStep({ onDone }: PinSetupStepProps) {
  const { saveSetting, showToast } = useGravy();
  const [step, setStep] = useState<Step>('pin');
  const [newPin, setNewPin] = useState('');
  const [newPinConfirm, setNewPinConfirm] = useState('');
  const [recoveryQuestion, setRecoveryQuestion] = useState('');
  const [recoveryAnswer, setRecoveryAnswer] = useState('');

  const pinMismatch = newPin.length === 4 && newPinConfirm.length === 4 && newPin !== newPinConfirm;
  const pinValid = newPin.length === 4 && newPin === newPinConfirm;

  const handlePinNext = () => {
    if (!pinValid) return;
    saveSetting('pin', newPin);
    setStep('recovery');
  };

  const finishRecovery = () => {
    if (recoveryQuestion.trim() && recoveryAnswer.trim()) {
      saveSetting('recoveryQuestion', recoveryQuestion);
      saveSetting('recoveryAnswer', recoveryAnswer);
    }
    showToast(faKey, 'PIN set!');
    onDone();
  };

  if (step === 'pin') {
    return (
      <>
        <span className="onb-icon-badge"><FontAwesomeIcon icon={faKey} /></span>
        <div className="onb-title">Set a Grown-up PIN</div>
        <div className="onb-desc">
          Now that the family's in sync, pick a PIN every device will use to unlock parent settings.
        </div>
        <div className="flex-row-full">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            className="onb-input"
            placeholder="New PIN"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            autoFocus
          />
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            className="onb-input"
            placeholder="Confirm"
            value={newPinConfirm}
            onChange={(e) => setNewPinConfirm(e.target.value.replace(/\D/g, '').slice(0, 4))}
          />
        </div>
        {pinMismatch && <div className="pin-error show">PINs don't match</div>}
        <div className="onb-actions">
          <button className="btn btn-primary" onClick={handlePinNext} disabled={!pinValid}>
            Next
          </button>
          <button className="btn btn-sm btn-ghost" onClick={onDone}>
            Skip for now
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <span className="onb-icon-badge"><FontAwesomeIcon icon={faShieldHalved} /></span>
      <div className="onb-title">Add a Recovery Question</div>
      <div className="onb-desc">So a grown-up can reset the PIN later without losing any progress.</div>
      <input
        type="text"
        className="onb-input"
        maxLength={60}
        placeholder="What's our dog's name?"
        value={recoveryQuestion}
        onChange={(e) => setRecoveryQuestion(e.target.value)}
        autoFocus
      />
      <input
        type="text"
        className="onb-input"
        maxLength={60}
        placeholder="Answer"
        value={recoveryAnswer}
        onChange={(e) => setRecoveryAnswer(e.target.value)}
      />
      <div className="onb-actions">
        <button
          className="btn btn-primary"
          onClick={finishRecovery}
          disabled={!!recoveryQuestion.trim() !== !!recoveryAnswer.trim()}
        >
          {recoveryQuestion.trim() && recoveryAnswer.trim() ? 'Save & Finish' : 'Skip & Finish'}
        </button>
      </div>
    </>
  );
}
