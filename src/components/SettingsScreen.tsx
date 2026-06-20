import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faGear } from '@fortawesome/free-solid-svg-icons';
import { useGravy } from '../state/GravyContext';
import type { Theme } from '../state/types';

const THEME_OPTIONS: { id: Theme; label: string }[] = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'rainbow', label: 'Rainbow' },
  { id: 'gold', label: 'Gold' },
];

interface SettingsScreenProps {
  onExit: () => void;
}

export function SettingsScreen({ onExit }: SettingsScreenProps) {
  const { state, saveSetting } = useGravy();
  const [childName, setChildName] = useState(state.settings.childName);
  const [savedField, setSavedField] = useState<string | null>(null);
  const savedTimerRef = useRef<number | null>(null);

  const flashSaved = (field: string) => {
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    setSavedField(field);
    savedTimerRef.current = window.setTimeout(() => setSavedField(null), 1400);
  };

  return (
    <div className="parent-screen-inner active">
      <div className="parent-topbar">
        <div className="parent-topbar-title">
          <FontAwesomeIcon icon={faGear} /> Settings
        </div>
        <button className="parent-topbar-exit-btn" onClick={onExit}>
          ← Exit
        </button>
      </div>
      <div className="scroll-area" style={{ background: 'var(--cream)' }}>
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
            <div className="settings-label">
              Child's name
              {savedField === 'childName' && <FontAwesomeIcon icon={faCheck} className="saved-flash" />}
            </div>
            <div className="settings-sub">Shown throughout the app</div>
          </div>
          <input
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
      </div>
    </div>
  );
}
