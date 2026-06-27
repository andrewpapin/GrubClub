import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faCloudArrowUp, faCalendarDays, faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { useGravy } from '../state/GravyContext';
import { AppIcon } from './AppIcon';
import { Greeting } from './Greeting';

interface TopBarProps {
  dateStr: string;
  onOpenAccountMenu?: () => void;
  onOpenStore?: () => void;
  onOpenHistory?: () => void;
}

export function TopBar({ dateStr, onOpenAccountMenu, onOpenStore, onOpenHistory }: TopBarProps) {
  const { state, householdCode, syncStatus, grownUpUnlocked } = useGravy();
  const syncError = !!householdCode && syncStatus === 'error';
  const pendingCount = state.pendingRewards.length;
  // The internal balance can dip below zero after a large deduction; never show negative.
  const displayPoints = Math.max(0, state.points);

  return (
    <div className="topbar">
      <div
        className="topbar-avatar"
        aria-hidden="true"
        style={{ background: state.settings.avatarBgColor, color: state.settings.avatarIconColor }}
      >
        <AppIcon iconKey={state.settings.avatarIcon} emojiFallback="😊" />
      </div>
      <Greeting dateStr={dateStr} />
      <div className="topbar-pills">
        <button
          type="button"
          className="points-pill"
          onClick={onOpenStore}
          aria-label={`${displayPoints} points — open Reward Store`}
        >
          <FontAwesomeIcon icon={faCoins} /> <span>{displayPoints}</span>
          {syncError && (
            <span
              className="sync-warning-icon"
              title="Sync issue — your progress is saved here and will sync once connection is back"
              aria-label="Sync issue — progress saved locally"
              role="img"
            >
              <FontAwesomeIcon icon={faCloudArrowUp} aria-hidden="true" />
            </span>
          )}
        </button>
        {onOpenAccountMenu && (
          <button
            className="topbar-icon-btn"
            onClick={onOpenAccountMenu}
            aria-label="Open grown-up menu"
            type="button"
          >
            <span
              className="nav-badge"
              data-count={pendingCount}
              title={pendingCount > 0 ? `${pendingCount} request${pendingCount === 1 ? '' : 's'} waiting for approval` : undefined}
            >
              <FontAwesomeIcon icon={grownUpUnlocked ? faLockOpen : faLock} />
            </span>
          </button>
        )}
        {onOpenHistory && (
          <button
            className="topbar-icon-btn"
            onClick={onOpenHistory}
            aria-label="View history calendar"
            type="button"
          >
            <FontAwesomeIcon icon={faCalendarDays} />
          </button>
        )}
      </div>
    </div>
  );
}
