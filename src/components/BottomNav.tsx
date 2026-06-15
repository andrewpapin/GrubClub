import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faCartShopping, faMedal, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { useGrubClub } from '../state/GrubClubContext';

export type Tab = 'home' | 'store' | 'badges' | 'calendar';

interface BottomNavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  const { state } = useGrubClub();
  const pendingCount = state.pendingRewards.length;

  return (
    <nav className="bottom-nav">
      <button className={`nav-btn ${active === 'home' ? 'active' : ''}`} onClick={() => onChange('home')}>
        <span className="nav-icon"><FontAwesomeIcon icon={faHouse} /></span>Home
      </button>
      <button className={`nav-btn ${active === 'store' ? 'active' : ''}`} onClick={() => onChange('store')}>
        <span
          className="nav-icon nav-badge"
          data-count={pendingCount}
          title={pendingCount > 0 ? `${pendingCount} request${pendingCount === 1 ? '' : 's'} waiting for approval` : undefined}
        >
          <FontAwesomeIcon icon={faCartShopping} />
        </span>
        Store
      </button>
      <button className={`nav-btn ${active === 'badges' ? 'active' : ''}`} onClick={() => onChange('badges')}>
        <span className="nav-icon"><FontAwesomeIcon icon={faMedal} /></span>Badges
      </button>
      <button className={`nav-btn ${active === 'calendar' ? 'active' : ''}`} onClick={() => onChange('calendar')}>
        <span className="nav-icon"><FontAwesomeIcon icon={faCalendarDays} /></span>Calendar
      </button>
    </nav>
  );
}
