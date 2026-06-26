export function triggerHaptic(durationMs = 12): void {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(durationMs);
  }
}
