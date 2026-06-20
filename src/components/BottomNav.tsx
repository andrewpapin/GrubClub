import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faGift } from '@fortawesome/free-solid-svg-icons';
import { useGravy } from '../state/GravyContext';

export type Tab = 'home' | 'store';

interface BottomNavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  const { state } = useGravy();
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
          <FontAwesomeIcon icon={faGift} />
        </span>
        Store
      </button>
    </nav>
  );
}
