import { useEffect, useId } from 'react';
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
  const titleId = useId();
  const messageId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onCancel]);

  return (
    <div
      className={`badge-popup-overlay ${open ? 'show' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      {open && (
        <div className="badge-popup" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={messageId}>
          <span className="badge-popup-icon"><FontAwesomeIcon icon={icon} /></span>
          <div className="badge-popup-name" id={titleId}>{title}</div>
          <div className="badge-popup-desc" id={messageId}>{message}</div>
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
