import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from '@fortawesome/free-solid-svg-icons';
import { AppIcon } from './AppIcon';
import { Modal } from './Modal';
import { getBadgeDisplay, getBadgeProgress, getEnabledBadges, isBadgeSpotlighted } from '../state/badges';
import { useGravy } from '../state/GravyContext';

interface BadgesScreenProps {
  open: boolean;
  onClose: () => void;
  onShowBadge: (id: string) => void;
}

export function BadgesScreen({ open, onClose, onShowBadge }: BadgesScreenProps) {
  const { state } = useGravy();
  const [activeGroup, setActiveGroup] = useState('All');
  const visible = getEnabledBadges(state);
  const groups = ['All', ...new Set(visible.map((b) => b.group))];
  const filtered = activeGroup === 'All' ? visible : visible.filter((b) => b.group === activeGroup);
  const spotlight = filtered.filter((b) => isBadgeSpotlighted(state, b));
  const compact = filtered.filter((b) => !isBadgeSpotlighted(state, b));

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeLabel="Close badges"
      title="My Badges"
    >
      {visible.length === 0 ? (
        <div className="empty-state empty-state--bare" style={{ gridColumn: '1 / -1' }}>
          <span className="empty-state-emoji"><FontAwesomeIcon icon={faMoon} /></span>
          <div className="empty-state-text">
            No badges enabled yet.
            <br />
            Ask a grown-up to turn some on!
          </div>
        </div>
      ) : (
        <>
          <div className="badges-summary">
            <span className="badges-summary-count">{state.earnedBadges.length}</span>
            {` / ${visible.length} badges earned`}
          </div>
          <div className="badges-filter-row">
            {groups.map((g) => (
              <button
                key={g}
                type="button"
                className={`group-pill ${activeGroup === g ? 'active' : ''}`}
                onClick={() => setActiveGroup(g)}
              >
                {g}
              </button>
            ))}
          </div>

          {spotlight.length > 0 && (
            <>
              <div className="section-label">Earned &amp; In Progress</div>
              <div className="badges-grid">
                {spotlight.map((b) => {
                  const display = getBadgeDisplay(state, b.id);
                  if (!display) return null;
                  const earned = state.earnedBadges.includes(b.id);
                  const progress = getBadgeProgress(state, b);
                  return (
                    <div key={b.id} className={`badge-tile ${earned ? 'unlocked' : 'locked'}`}>
                      <button className="badge-info-btn" onClick={() => onShowBadge(b.id)} aria-label={`Info about ${display.name} badge`} type="button">
                        ?
                      </button>
                      <AppIcon iconKey={display.icon} emojiFallback={display.emoji} className="badge-icon" />
                      <div className="badge-name">{display.name}</div>
                      {progress && !earned && (
                        <>
                          <div className="badge-progress">
                            <div
                              className="badge-progress-fill"
                              style={{ width: `${Math.min(100, (progress.current / progress.target) * 100)}%` }}
                            />
                          </div>
                          <div className="badge-progress-label">
                            {Math.min(progress.current, progress.target)}/{progress.target}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {compact.length > 0 && (
            <>
              <div className="section-label">More Badges</div>
              <div className="badge-chip-grid">
                {compact.map((b) => {
                  const display = getBadgeDisplay(state, b.id);
                  if (!display) return null;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      className="badge-chip"
                      onClick={() => onShowBadge(b.id)}
                      aria-label={`Info about ${display.name} badge (locked)`}
                    >
                      <AppIcon iconKey={display.icon} emojiFallback={display.emoji} className="badge-chip-icon" />
                      <div className="badge-chip-name">{display.name}</div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </Modal>
  );
}
