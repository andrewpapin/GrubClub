import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div className="update-prompt">
      <FontAwesomeIcon icon={faArrowsRotate} />
      <span>A new version of Gravy is ready.</span>
      <button className="update-prompt-action" onClick={() => updateServiceWorker(true)}>
        Refresh
      </button>
      <button
        className="update-prompt-dismiss"
        onClick={() => setNeedRefresh(false)}
        aria-label="Dismiss update notice"
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>
  );
}
