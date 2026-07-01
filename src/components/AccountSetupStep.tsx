import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faEnvelope, faCircleCheck, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { useGravy } from '../state/GravyContext';

interface AccountSetupStepProps {
  initialMode?: 'signup' | 'signin';
  // Called once the parent finishes signing in — reports which mode they used so Onboarding can
  // branch (signup: auto-create+own a new household; signin: prompt for a family code to join).
  onDone: (mode: 'signup' | 'signin') => void;
}

// Mandatory parent-account step shown during onboarding, BEFORE the household is created — so a
// signed-in parent's new household is owned from the start (createHousehold sets owner_id
// automatically), with no separate "claim" needed later. COPPA: collects only a parent email,
// never any child data.
export function AccountSetupStep({ initialMode = 'signup', onDone }: AccountSetupStepProps) {
  const { authUser, signUp, signIn, sendSignInLink } = useGravy();
  const [mode, setMode] = useState<'signup' | 'signin'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkSent, setLinkSent] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSubmit = emailValid && password.length >= 6 && !busy;

  const run = async (fn: () => Promise<{ ok: boolean; error?: string }>) => {
    setBusy(true);
    setError(null);
    const res = await fn();
    setBusy(false);
    if (!res.ok && res.error) setError(res.error);
    return res.ok;
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    run(() => (mode === 'signup' ? signUp(email, password) : signIn(email, password)));
  };

  const handleMagicLink = async () => {
    if (!emailValid || busy) return;
    const ok = await run(() => sendSignInLink(email));
    if (ok) setLinkSent(true);
  };

  // Once signed in, confirm and let them continue into household setup.
  if (authUser) {
    return (
      <>
        <span className="onb-icon-badge"><FontAwesomeIcon icon={faCircleCheck} /></span>
        <div className="onb-title">You're Signed In</div>
        <div className="onb-desc">
          {mode === 'signup'
            ? `Signed in as ${authUser.email ?? 'your account'}. We'll set up your family's code next.`
            : `Signed in as ${authUser.email ?? 'your account'}. Enter your family code next to join.`}
        </div>
        <div className="onb-actions">
          <button className="btn btn-primary" onClick={() => onDone(mode)}>Continue</button>
        </div>
      </>
    );
  }

  return (
    <>
      <span className="onb-icon-badge"><FontAwesomeIcon icon={faUserShield} /></span>
      <div className="onb-title">{mode === 'signup' ? 'Create a Parent Account' : 'Sign In'}</div>
      <div className="onb-desc">
        For grown-ups only. An account secures your family's data — you'll create or join a family
        right after this. We only store your email — never your child's information.
      </div>
      <input
        type="email"
        autoComplete="email"
        className="onb-input"
        placeholder="Parent email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setError(null); setLinkSent(false); }}
      />
      <input
        type="password"
        autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
        className="onb-input"
        placeholder="Password (at least 6 characters)"
        value={password}
        onChange={(e) => { setPassword(e.target.value); setError(null); }}
        onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
      />
      {error && (
        <div className="settings-sub sync-gate-status sync-gate-error">
          <FontAwesomeIcon icon={faTriangleExclamation} /> {error}
        </div>
      )}
      {linkSent && (
        <div className="settings-sub sync-gate-status">
          <FontAwesomeIcon icon={faEnvelope} /> Check your email and tap the link to finish signing
          in — this screen will continue automatically.
        </div>
      )}
      <div className="onb-actions">
        <button className="btn btn-primary" onClick={handleSubmit} disabled={!canSubmit}>
          {mode === 'signup' ? 'Create account' : 'Sign in'}
        </button>
        <button className="btn btn-sm btn-ghost" onClick={handleMagicLink} disabled={!emailValid || busy}>
          <FontAwesomeIcon icon={faEnvelope} /> Email me a sign-in link instead
        </button>
        <button className="onb-link" onClick={() => { setMode((m) => (m === 'signup' ? 'signin' : 'signup')); setError(null); }}>
          {mode === 'signup' ? 'Already have an account? Sign in' : 'No account yet? Create one'}
        </button>
      </div>
    </>
  );
}
