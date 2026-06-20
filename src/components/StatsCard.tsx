import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faUtensils, faListCheck, faStar, faMedal, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { AppIcon } from './AppIcon';
import { useGravy } from '../state/GravyContext';
import { useTodaySnapshot } from '../state/useTodaySnapshot';
import { getEnabledBadgeCount } from '../state/badges';

interface StatsCardProps {
  onOpenBadges: () => void;
}

export function StatsCard({ onOpenBadges }: StatsCardProps) {
  const { state } = useGravy();
  const { rank, xpText, pct, foodDone, dailyGoals, goalsAllDone, streakAtRisk } = useTodaySnapshot();
  const earnedCount = state.earnedBadges.length;
  const totalBadgeCount = getEnabledBadgeCount(state);

  return (
    <div className="stats-card">
      <div className="stats-rank">
        <div className="stats-rank-header">
          <div className="stats-rank-icon-circle">
            <AppIcon iconKey={rank.icon} emojiFallback={rank.emoji} className="stats-rank-emoji" />
          </div>
          <div className="stats-rank-info">
            <div className="stats-rank-name-row">
              <span className="stats-rank-name">{rank.name}</span>
              <span className="stats-rank-xp">{xpText}</span>
            </div>
            <div className="xp-bar-track">
              <div className="xp-bar-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
        <div className="stats-today" aria-label={`Food streak ${state.foodStreak}, goal streak ${state.goalStreak}, streak ${state.streak}, mega streak ${state.megaStreak}`}>
          <span className={`stats-today-chip ${foodDone ? 'done' : ''}`} title="Food streak">
            <FontAwesomeIcon icon={faUtensils} aria-hidden="true" /> {state.foodStreak}
          </span>
          {dailyGoals.length > 0 && (
            <span className={`stats-today-chip ${goalsAllDone ? 'done' : ''}`} title="Goal streak">
              <FontAwesomeIcon icon={faListCheck} aria-hidden="true" /> {state.goalStreak}
            </span>
          )}
          {state.streak > 0 && (
            <span
              className={`stats-today-chip streak-badge${streakAtRisk ? ' streak-badge--risk' : ''}`}
              title={streakAtRisk ? `Log something today to keep your ${state.streak}-day streak!` : `${state.streak} day streak`}
            >
              <FontAwesomeIcon icon={faFire} /> {state.streak}
            </span>
          )}
          <span className="stats-today-chip" title="Mega streak">
            <FontAwesomeIcon icon={faStar} aria-hidden="true" /> {state.megaStreak}
          </span>
        </div>
        {streakAtRisk && (
          <div className="streak-risk-nudge">
            <FontAwesomeIcon icon={faFire} /> Log something today to keep your streak going!
          </div>
        )}
      </div>
      <button className="stats-badges-bar" onClick={onOpenBadges} type="button">
        <span className="stats-badges-bar-label">
          <FontAwesomeIcon icon={faMedal} /> {earnedCount}/{totalBadgeCount} Badges
        </span>
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
}
