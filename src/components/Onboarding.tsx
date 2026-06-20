import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHandSparkles,
  faUtensils,
  faFire,
  faGift,
  faChild,
  faCloud,
  faUsers,
  faChevronLeft,
  faChevronRight,
  faCheck,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { useGravy, SYNC_SKIPPED_KEY } from '../state/GravyContext';

export const ONBOARDING_DONE_KEY = 'gravy_onboarded';

interface WalkStep {
  icon: typeof faHandSparkles;
  title: string;
  desc: (childName: string) => string;
}

const STEPS: WalkStep[] = [
  {
    icon: faHandSparkles,
    title: 'Welcome!',
    desc: (childName) => `Hey ${childName}! This is your Gravy — let's take a quick look around.`,
  },
  {
    icon: faUtensils,
    title: 'Earn Points',
    desc: () => 'Tap each food group you eat and finish your goals to earn points. Eat all 5 for a bonus!',
  },
  {
    icon: faFire,
    title: 'Build Your Streak',
    desc: () => 'Come back and log something every day to grow your streak and unlock badges.',
  },
  {
    icon: faGift,
    title: 'Visit the Store',
    desc: () => 'Trade your points for rewards in the Store. A grown-up approves each request.',
  },
];

type Phase = 'splash' | 'join' | 'name' | 'walkthrough' | 'reveal';

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const { state, saveSetting, createHousehold, joinHousehold, syncStatus } = useGravy();
  const [phase, setPhase] = useState<Phase>('splash');
  const [skipSync, setSkipSync] = useState(false);
  const [walkStep, setWalkStep] = useState(0);
  const [name, setName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [revealCode, setRevealCode] = useState<string | null>(null);
  const [revealFailed, setRevealFailed] = useState(false);

  const nameTrimmed = name.trim();
  const syncing = syncStatus === 'syncing';

  const finish = () => {
    localStorage.setItem(ONBOARDING_DONE_KEY, 'true');
    onComplete();
  };

  const startCreate = () => {
    setPhase('reveal');
    setRevealFailed(false);
    createHousehold().then((code) => {
      if (code) setRevealCode(code);
      else setRevealFailed(true);
    });
  };

  const goName = (skip: boolean) => {
    setSkipSync(skip);
    setPhase('name');
  };

  const handleJoin = () => {
    if (!joinCode.trim()) return;
    joinHousehold(joinCode).then((ok) => {
      if (ok) finish();
    });
  };

  const handleNameNext = () => {
    if (!nameTrimmed) return;
    saveSetting('childName', nameTrimmed);
    setWalkStep(0);
    setPhase('walkthrough');
  };

  const handleWalkNext = () => {
    if (walkStep < STEPS.length - 1) {
      setWalkStep((s) => s + 1);
      return;
    }
    if (skipSync) {
      localStorage.setItem(SYNC_SKIPPED_KEY, 'true');
      finish();
    } else {
      startCreate();
    }
  };

  const handleBack = () => {
    if (phase === 'walkthrough') {
      if (walkStep === 0) setPhase('name');
      else setWalkStep((s) => s - 1);
    } else {
      setPhase('splash');
    }
  };

  const handleSkipForNow = () => {
    localStorage.setItem(SYNC_SKIPPED_KEY, 'true');
    finish();
  };

  const showBackArrow = phase === 'join' || phase === 'name' || phase === 'walkthrough';
  const showForwardArrow = phase === 'name' || phase === 'walkthrough';
  const onLastWalkStep = phase === 'walkthrough' && walkStep === STEPS.length - 1;

  return (
    <div className="sync-gate-overlay onboarding-overlay">
      <button
        className="onboarding-arrow onboarding-arrow-left"
        onClick={handleBack}
        aria-label="Back"
        style={{ visibility: showBackArrow ? 'visible' : 'hidden' }}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>

      <div className="badge-popup sync-gate-card">
        {phase === 'splash' && (
          <>
            <span className="badge-popup-icon"><FontAwesomeIcon icon={faHandSparkles} /></span>
            <div className="badge-popup-name">Welcome to Gravy!</div>
            <div className="badge-popup-desc">
              Is this your family's first Gravy, or do you already have one set up on another device?
            </div>
            <button className="btn btn-primary" onClick={() => goName(false)}>
              This is our first Gravy
            </button>
            <button className="btn btn-primary btn-dark" onClick={() => setPhase('join')}>
              <FontAwesomeIcon icon={faUsers} /> We already have one
            </button>
            <button className="btn btn-sm btn-ghost sync-gate-skip" onClick={() => goName(true)}>
              Just use this device
            </button>
          </>
        )}

        {phase === 'join' && (
          <>
            <span className="badge-popup-icon"><FontAwesomeIcon icon={faCloud} /></span>
            <div className="badge-popup-name">Join Your Family</div>
            <div className="badge-popup-desc">Enter the code from another device to sync up.</div>
            <div className="flex-row-full sync-gate-join">
              <input
                type="text"
                placeholder="Enter household code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => { if (e.key === 'Enter') handleJoin(); }}
                autoFocus
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
          </>
        )}

        {phase === 'name' && (
          <>
            <span className="badge-popup-icon"><FontAwesomeIcon icon={faChild} /></span>
            <div className="badge-popup-name">What's your kiddo's name?</div>
            <div className="badge-popup-desc">We'll use it to say hi and cheer them on.</div>
            <input
              type="text"
              className="onboarding-name-input"
              maxLength={20}
              placeholder="e.g. Zack"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleNameNext(); }}
              autoFocus
            />
          </>
        )}

        {phase === 'walkthrough' && (
          <>
            <span className="badge-popup-icon"><FontAwesomeIcon icon={STEPS[walkStep].icon} /></span>
            <div className="badge-popup-name">{STEPS[walkStep].title}</div>
            <div className="badge-popup-desc">{STEPS[walkStep].desc(state.settings.childName)}</div>
          </>
        )}

        {phase === 'reveal' && (
          <>
            <span className="badge-popup-icon"><FontAwesomeIcon icon={faCloud} /></span>
            {revealCode ? (
              <>
                <div className="badge-popup-name">Your Family Code</div>
                <div className="badge-popup-desc">Enter this on another device to keep everyone in sync.</div>
                <div className="household-code-display" style={{ margin: '4px 0 12px' }}>{revealCode}</div>
              </>
            ) : revealFailed ? (
              <>
                <div className="badge-popup-name">Couldn't Set Up Sync</div>
                <div className="settings-sub sync-gate-status sync-gate-error">
                  <FontAwesomeIcon icon={faTriangleExclamation} />{' '}
                  {navigator.onLine ? 'Server error' : 'No internet connection'} — try again
                </div>
              </>
            ) : (
              <>
                <div className="badge-popup-name">Setting Up Sync…</div>
                <div className="badge-popup-desc">One sec…</div>
              </>
            )}
          </>
        )}

        {(phase === 'name' || phase === 'walkthrough') && (
          <div className="onboarding-dots">
            {Array.from({ length: STEPS.length + 1 }).map((_, i) => (
              <span
                key={i}
                className={`onboarding-dot ${i === (phase === 'name' ? 0 : walkStep + 1) ? 'active' : ''}`}
              />
            ))}
          </div>
        )}

        {phase === 'name' && (
          <button className="btn btn-primary" onClick={handleNameNext} disabled={!nameTrimmed}>
            Next
          </button>
        )}
        {phase === 'walkthrough' && (
          <button className="btn btn-primary" onClick={handleWalkNext}>
            {onLastWalkStep ? "Let's go!" : 'Next'}
          </button>
        )}
        {phase === 'reveal' && revealCode && (
          <button className="btn btn-primary" onClick={finish}>
            Let's go!
          </button>
        )}
        {phase === 'reveal' && revealFailed && (
          <>
            <button className="btn btn-primary" onClick={startCreate}>
              Try Again
            </button>
            <button className="btn btn-sm btn-ghost sync-gate-skip" onClick={handleSkipForNow}>
              Skip for now
            </button>
          </>
        )}
      </div>

      <button
        className="onboarding-arrow onboarding-arrow-right"
        onClick={phase === 'name' ? handleNameNext : handleWalkNext}
        disabled={phase === 'name' && !nameTrimmed}
        aria-label={onLastWalkStep ? 'Finish' : 'Next'}
        style={{ visibility: showForwardArrow ? 'visible' : 'hidden' }}
      >
        <FontAwesomeIcon icon={onLastWalkStep ? faCheck : faChevronRight} />
      </button>
    </div>
  );
}
