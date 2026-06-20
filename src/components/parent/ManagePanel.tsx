import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck, faCartShopping, faMedal, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { GoalsPanel } from './GoalsPanel';
import { StorePanel } from './StorePanel';
import { BadgesPanel } from './BadgesPanel';

export type ManageSub = 'menu' | 'goals' | 'store' | 'badges';

interface ManagePanelProps {
  sub: ManageSub;
  onNavigate: (sub: ManageSub) => void;
}

export function ManagePanel({ sub, onNavigate }: ManagePanelProps) {
  if (sub === 'goals') return <GoalsPanel />;
  if (sub === 'store') return <StorePanel />;
  if (sub === 'badges') return <BadgesPanel />;
  return <ManageMenu onNavigate={onNavigate} />;
}

function ManageMenu({ onNavigate }: { onNavigate: (sub: ManageSub) => void }) {
  return (
    <div>
      <button className="menu-card" onClick={() => onNavigate('goals')} type="button">
        <span className="menu-card-icon"><FontAwesomeIcon icon={faListCheck} /></span>
        <div className="menu-card-body">
          <div className="menu-card-title">Goals</div>
          <div className="menu-card-sub">Daily goals and bonus points</div>
        </div>
        <FontAwesomeIcon icon={faChevronRight} className="menu-card-chevron" />
      </button>
      <button className="menu-card" onClick={() => onNavigate('store')} type="button">
        <span className="menu-card-icon"><FontAwesomeIcon icon={faCartShopping} /></span>
        <div className="menu-card-body">
          <div className="menu-card-title">Store</div>
          <div className="menu-card-sub">Rewards your child can redeem</div>
        </div>
        <FontAwesomeIcon icon={faChevronRight} className="menu-card-chevron" />
      </button>
      <button className="menu-card" onClick={() => onNavigate('badges')} type="button">
        <span className="menu-card-icon"><FontAwesomeIcon icon={faMedal} /></span>
        <div className="menu-card-body">
          <div className="menu-card-title">Badges</div>
          <div className="menu-card-sub">Customize the badge library</div>
        </div>
        <FontAwesomeIcon icon={faChevronRight} className="menu-card-chevron" />
      </button>
    </div>
  );
}
