import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';

interface UseSwipeCompleteArgs {
  /** Whether the item is currently completed (drives whether a full swipe completes or undoes). */
  done: boolean;
  /** When true, the gesture is inert (e.g. read-only past days). */
  disabled?: boolean;
  onComplete: () => void;
  onUndo: () => void;
}

interface UseSwipeCompleteResult {
  handlers: {
    onPointerDown: (e: ReactPointerEvent) => void;
    onPointerMove: (e: ReactPointerEvent) => void;
    onPointerUp: (e: ReactPointerEvent) => void;
    onPointerCancel: (e: ReactPointerEvent) => void;
  };
  /** Current horizontal drag offset in px (0 when idle); drive a translateX on the row. */
  dragOffset: number;
  /** True while an active horizontal swipe is in progress (suppresses the row's tap handler). */
  swiping: boolean;
}

// Past this fraction of the row's width, releasing toggles completion; otherwise it springs back.
const COMPLETE_FRACTION = 0.4;
const COMPLETE_MAX_PX = 110;
// Horizontal travel (px) before we commit to "this is a swipe, not a scroll/tap".
const AXIS_LOCK_PX = 10;

/**
 * Swipe-to-complete for the full-width kid rows, built on Pointer Events so mouse, touch and
 * pen all share one path. Returns handlers to spread on the row plus a live `dragOffset` for the
 * translateX. The row must set `touch-action: pan-y` so vertical scrolling stays native; we
 * additionally axis-lock here — if vertical intent wins early we bail and let the page scroll,
 * which is the key mitigation for swipe-vs-scroll on a vertical list.
 */
export function useSwipeComplete({ done, disabled, onComplete, onUndo }: UseSwipeCompleteArgs): UseSwipeCompleteResult {
  const [dragOffset, setDragOffset] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const widthRef = useRef(0);
  // null = not yet decided, true = horizontal swipe, false = abandoned (vertical/scroll).
  const axis = useRef<boolean | null>(null);
  const activeId = useRef<number | null>(null);

  const reset = () => {
    setDragOffset(0);
    setSwiping(false);
    axis.current = null;
    activeId.current = null;
  };

  const onPointerDown = (e: ReactPointerEvent) => {
    if (disabled) return;
    startX.current = e.clientX;
    startY.current = e.clientY;
    widthRef.current = e.currentTarget.getBoundingClientRect().width;
    axis.current = null;
    activeId.current = e.pointerId;
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (disabled || activeId.current !== e.pointerId) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;

    if (axis.current === null) {
      if (Math.abs(dx) < AXIS_LOCK_PX && Math.abs(dy) < AXIS_LOCK_PX) return;
      // First decisive movement decides the axis. Vertical wins => let the page scroll.
      axis.current = Math.abs(dx) > Math.abs(dy);
      if (axis.current) {
        setSwiping(true);
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* not capturable */ }
      } else {
        activeId.current = null;
        return;
      }
    }

    if (!axis.current) return;
    setDragOffset(dx);
  };

  const finish = (e: ReactPointerEvent) => {
    if (activeId.current !== e.pointerId) return;
    const committed = axis.current === true;
    const dx = dragOffset;
    const threshold = Math.min(widthRef.current * COMPLETE_FRACTION, COMPLETE_MAX_PX);
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* already released */ }
    reset();
    if (committed && Math.abs(dx) >= threshold) {
      if (done) onUndo(); else onComplete();
    }
  };

  return {
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: finish,
      onPointerCancel: finish,
    },
    dragOffset,
    swiping,
  };
}
