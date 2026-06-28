import { type ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { AppIcon } from './AppIcon';
import { useSwipeComplete } from '../hooks/useSwipeComplete';
import { triggerHaptic } from '../lib/haptics';

interface CompleteConfig {
  /** When false the row is read-only (past days): no swipe, disabled check. */
  editable: boolean;
  done: boolean;
  onComplete: () => void;
  onUndo: () => void;
  ariaLabel: string;
}

interface HomeRowProps {
  color: string;
  iconKey?: string;
  emoji: string;
  title: string;
  sub?: ReactNode;
  /** Drives the completed look (dim + strikethrough); also the check fill for swipe rows. */
  done?: boolean;
  /** Present => swipeable single-tap row with a checkmark button. */
  complete?: CompleteConfig;
  /** Present (and no `complete`) => trailing control, e.g. a +/− stepper. */
  trailing?: ReactNode;
}

/**
 * Full-width accent row shared by the kid home screen's Food / Daily Goals / Bonus lists.
 * The whole row is filled with `color` and renders white text (theme-independent by design —
 * see CLAUDE.md Theming). Single-tap items pass `complete` to get swipe-to-toggle (via
 * useSwipeComplete) plus a focusable checkmark button; multi-step goals and bonus items pass a
 * `trailing` stepper instead.
 */
export function HomeRow({ color, iconKey, emoji, title, sub, done, complete, trailing }: HomeRowProps) {
  const swipe = useSwipeComplete({
    done: complete?.done ?? false,
    disabled: !complete?.editable,
    onComplete: () => { triggerHaptic(); complete?.onComplete(); },
    onUndo: () => { triggerHaptic(); complete?.onUndo(); },
  });

  const isDone = complete ? complete.done : !!done;

  return (
    <div
      className={`gravy-row ${isDone ? 'done' : ''} ${complete ? 'gravy-row-swipeable' : ''}`}
      style={{
        background: color,
        transform: swipe.dragOffset ? `translateX(${swipe.dragOffset}px)` : undefined,
        transition: swipe.swiping ? 'none' : undefined,
      }}
      {...(complete ? swipe.handlers : {})}
    >
      <span className="gravy-row-chip" aria-hidden="true">
        <AppIcon iconKey={iconKey} emojiFallback={emoji} />
      </span>
      <div className="gravy-row-body">
        <div className="gravy-row-title">{title}</div>
        {sub != null && <div className="gravy-row-sub">{sub}</div>}
      </div>
      {complete ? (
        <button
          type="button"
          className={`gravy-row-check ${complete.done ? 'checked' : ''}`}
          disabled={!complete.editable}
          aria-pressed={complete.done}
          aria-label={complete.ariaLabel}
          onClick={() => {
            triggerHaptic();
            if (complete.done) complete.onUndo(); else complete.onComplete();
          }}
        >
          <FontAwesomeIcon icon={faCheck} aria-hidden="true" />
        </button>
      ) : (
        trailing
      )}
    </div>
  );
}
