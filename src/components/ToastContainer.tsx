import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGravy } from '../state/GravyContext';

export function ToastContainer() {
  const { toasts, dismissToast } = useGravy();
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div className={`toast ${t.action ? 'toast-action-toast' : ''}`} key={t.id}>
          <span>{typeof t.icon === 'string' ? t.icon : <FontAwesomeIcon icon={t.icon} />}</span>
          <span>{t.msg}</span>
          {t.action && (
            <button
              className="toast-action"
              onClick={() => {
                t.action!.onClick();
                dismissToast(t.id);
              }}
            >
              {t.action.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
