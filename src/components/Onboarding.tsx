import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandSparkles, faUtensils, faFire, faGift } from '@fortawesome/free-solid-svg-icons';
import { useGrubClub } from '../state/GrubClubContext';

export const ONBOARDING_DONE_KEY = 'grubclub_onboarded';

interface Step {
  icon: typeof faHandSparkles;
  title: string;
  desc: (childName: string) => string;
}

const STEPS: Step[] = [
  {
    icon: faHandSparkles,
    title: 'Welcome!',
    desc: (childName) => `Hey ${childName}! This is your GrubClub — let's take a quick look around.`,
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

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const { state } = useGrubClub();
  const [step, setStep] = useState(0);
  const last = step === STEPS.length - 1;
  const current = STEPS[step];

  const finish = () => {
    localStorage.setItem(ONBOARDING_DONE_KEY, 'true');
    onComplete();
  };

  return (
    <div className="sync-gate-overlay">
      <div className="badge-popup sync-gate-card">
        <span className="badge-popup-icon"><FontAwesomeIcon icon={current.icon} /></span>
        <div className="badge-popup-name">{current.title}</div>
        <div className="badge-popup-desc">{current.desc(state.settings.childName)}</div>
        <div className="onboarding-dots">
          {STEPS.map((_, i) => (
            <span key={i} className={`onboarding-dot ${i === step ? 'active' : ''}`} />
          ))}
        </div>
        <button
          className="btn btn-primary"
          onClick={() => (last ? finish() : setStep((s) => s + 1))}
        >
          {last ? "Let's go!" : 'Next'}
        </button>
        {!last && (
          <button className="btn btn-sm btn-ghost sync-gate-skip" onClick={finish}>
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
