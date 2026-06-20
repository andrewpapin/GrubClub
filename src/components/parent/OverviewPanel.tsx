import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar, faTrophy, faUtensils, faListCheck, faFire,
  faCircleCheck, faCartShopping, faMedal, faGear, faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { useGravy } from '../../state/GravyContext';
import { useTodaySnapshot } from '../../state/useTodaySnapshot';
import { FOODS } from '../../data/foods';
import type { ManageSub } from './ManagePanel';

interface OverviewPanelProps {
  onReviewApprovals: () => void;
  onOpenManage: (sub: Exclude<ManageSub, 'menu'>) => void;
  onOpenSettings: () => void;
}

export function OverviewPanel({ onReviewApprovals, onOpenManage, onOpenSettings }: OverviewPanelProps) {
  const { state } = useGravy();
  const { eatenCount, foodDone, dailyGoals, goalsDone, goalsAllDone } = useTodaySnapshot();
  const pendingCount = state.pendingRewards.length;

  return (
    <div>
      <div className="overview-points-row">
        <div className="overview-points-cell">
          <div className="overview-points-value"><FontAwesomeIcon icon={faStar} /> {state.points}</div>
          <div className="overview-points-label">Spendable</div>
        </div>
        <div className="overview-points-cell">
          <div className="overview-points-value"><FontAwesomeIcon icon={faTrophy} /> {state.totalPoints}</div>
          <div className="overview-points-label">Lifetime earned</div>
        </div>
      </div>

      <div className="section-label">Today</div>
      <div className="overview-stat-row">
        <span className="overview-stat-icon"><FontAwesomeIcon icon={faUtensils} /></span>
        <div className="overview-stat-name">Food tray</div>
        <div className={`overview-stat-value ${foodDone ? 'done' : ''}`}>{eatenCount}/{FOODS.length}</div>
      </div>
      <div className="overview-stat-row">
        <span className="overview-stat-icon"><FontAwesomeIcon icon={faListCheck} /></span>
        <div className="overview-stat-name">Daily goals</div>
        <div className={`overview-stat-value ${goalsAllDone ? 'done' : ''}`}>{goalsDone}/{dailyGoals.length}</div>
      </div>

      <div className="overview-streaks">
        <span className={`stats-today-chip ${foodDone ? 'done' : ''}`} title="Food streak">
          <FontAwesomeIcon icon={faUtensils} aria-hidden="true" /> {state.foodStreak}
        </span>
        <span className={`stats-today-chip ${goalsAllDone ? 'done' : ''}`} title="Goal streak">
          <FontAwesomeIcon icon={faListCheck} aria-hidden="true" /> {state.goalStreak}
        </span>
        <span className="stats-today-chip" title="Day streak">
          <FontAwesomeIcon icon={faFire} aria-hidden="true" /> {state.streak}
        </span>
        <span className="stats-today-chip" title="Mega streak">
          <FontAwesomeIcon icon={faStar} aria-hidden="true" /> {state.megaStreak}
        </span>
      </div>

      {pendingCount > 0 && (
        <button className="btn btn-primary btn-pink overview-cta" onClick={onReviewApprovals} type="button">
          <span>
            <FontAwesomeIcon icon={faCircleCheck} /> Review {pendingCount} request{pendingCount === 1 ? '' : 's'}
          </span>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      )}

      <div className="section-label">Manage</div>
      <div className="overview-quick-grid">
        <button className="overview-quick-link" onClick={() => onOpenManage('goals')} type="button">
          <FontAwesomeIcon icon={faListCheck} />
          <span>Goals</span>
        </button>
        <button className="overview-quick-link" onClick={() => onOpenManage('store')} type="button">
          <FontAwesomeIcon icon={faCartShopping} />
          <span>Store</span>
        </button>
        <button className="overview-quick-link" onClick={() => onOpenManage('badges')} type="button">
          <FontAwesomeIcon icon={faMedal} />
          <span>Badges</span>
        </button>
        <button className="overview-quick-link" onClick={onOpenSettings} type="button">
          <FontAwesomeIcon icon={faGear} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}
