import { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { useGravy } from '../state/GravyContext';

interface CopyCodeButtonProps {
  code: string;
}

export function CopyCodeButton({ code }: CopyCodeButtonProps) {
  const { showToast } = useGravy();
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      showToast(faTriangleExclamation, "Couldn't copy — write it down instead");
      return;
    }
    showToast(faCheck, 'Code copied!');
    if (timerRef.current) clearTimeout(timerRef.current);
    setCopied(true);
    timerRef.current = window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <button
      type="button"
      className="copy-code-btn"
      onClick={handleCopy}
      aria-label="Copy household code to clipboard"
    >
      <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
    </button>
  );
}
