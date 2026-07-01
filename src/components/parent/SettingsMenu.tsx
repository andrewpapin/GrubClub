import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGlobe, faUser, faCloud, faRotate, faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

export type SettingsDest = 'timezone' | 'account' | 'sync' | 'reset';

interface SettingsMenuProps {
  onNavigate: (dest: SettingsDest) => void;
}

export function SettingsMenu({ onNavigate }: SettingsMenuProps) {
  return (
    <div>
      <button className="menu-card" onClick={() => onNavigate('timezone')} type="button">
        <span className="menu-card-icon"><FontAwesomeIcon icon={faGlobe} /></span>
        <div className="menu-card-body">
          <div className="menu-card-title">Time Zone</div>
          <div className="menu-card-sub">Controls when each day starts/ends for streaks and goals</div>
        </div>
        <FontAwesomeIcon icon={faChevronRight} className="menu-card-chevron" />
      </button>
      <button className="menu-card" onClick={() => onNavigate('account')} type="button">
        <span className="menu-card-icon"><FontAwesomeIcon icon={faUser} /></span>
        <div className="menu-card-body">
          <div className="menu-card-title">Parent Account</div>
          <div className="menu-card-sub">Manage your signed-in parent account</div>
        </div>
        <FontAwesomeIcon icon={faChevronRight} className="menu-card-chevron" />
      </button>
      <button className="menu-card" onClick={() => onNavigate('sync')} type="button">
        <span className="menu-card-icon"><FontAwesomeIcon icon={faCloud} /></span>
        <div className="menu-card-body">
          <div className="menu-card-title">Family Code</div>
          <div className="menu-card-sub">Sync your household across phones</div>
        </div>
        <FontAwesomeIcon icon={faChevronRight} className="menu-card-chevron" />
      </button>
      <button className="menu-card menu-card--danger" onClick={() => onNavigate('reset')} type="button">
        <span className="menu-card-icon"><FontAwesomeIcon icon={faRotate} /></span>
        <div className="menu-card-body">
          <div className="menu-card-title">Reset</div>
          <div className="menu-card-sub">Reset today's progress or start over</div>
        </div>
        <FontAwesomeIcon icon={faChevronRight} className="menu-card-chevron" />
      </button>
    </div>
  );
}
