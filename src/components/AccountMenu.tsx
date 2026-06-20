import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faLock } from '@fortawesome/free-solid-svg-icons';

interface AccountMenuProps {
  open: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onOpenGrownUps: () => void;
}

export function AccountMenu({ open, onClose, onOpenSettings, onOpenGrownUps }: AccountMenuProps) {
  return (
    <div
      className={`badge-popup-overlay ${open ? 'show' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {open && (
        <div className="badge-popup account-menu">
          <button type="button" className="account-menu-option" onClick={onOpenSettings}>
            <span className="account-menu-option-icon"><FontAwesomeIcon icon={faGear} /></span>
            <span className="account-menu-option-text">
              <span className="account-menu-option-title">Settings</span>
              <span className="account-menu-option-sub">No PIN needed</span>
            </span>
          </button>
          <button type="button" className="account-menu-option" onClick={onOpenGrownUps}>
            <span className="account-menu-option-icon"><FontAwesomeIcon icon={faLock} /></span>
            <span className="account-menu-option-text">
              <span className="account-menu-option-title">Grown ups</span>
              <span className="account-menu-option-sub">Enter PIN</span>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
