import { safeSessionGetItem, safeSessionRemoveItem, safeSessionSetItem } from './storage';

// Session-scoped (sessionStorage, not localStorage) so unlocking grown-up access doesn't
// persist once the browser tab/PWA window closes — reopening the app always starts locked.
const UNLOCK_KEY = 'gravy_grownup_unlocked';

export function readGrownUpUnlocked(): boolean {
  return safeSessionGetItem(UNLOCK_KEY) === 'true';
}

export function writeGrownUpUnlocked(unlocked: boolean): void {
  if (unlocked) {
    safeSessionSetItem(UNLOCK_KEY, 'true');
  } else {
    safeSessionRemoveItem(UNLOCK_KEY);
  }
}
