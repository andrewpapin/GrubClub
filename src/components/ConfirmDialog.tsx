import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface ConfirmDialogProps {
  open: boolean;
  icon: IconDefinition;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  icon,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  danger,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div
      className={`badge-popup-overlay ${open ? 'show' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      {open && (
        <div className="badge-popup">
          <span className="badge-popup-icon"><FontAwesomeIcon icon={icon} /></span>
          <div className="badge-popup-name">{title}</div>
          <div className="badge-popup-desc">{message}</div>
          <div className="confirm-dialog-btns">
            <button className="btn btn-sm btn-ghost" onClick={onCancel}>
              {cancelLabel}
            </button>
            <button className={`btn btn-sm ${danger ? 'btn-pink' : 'btn-green'}`} onClick={onConfirm}>
              {confirmLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
