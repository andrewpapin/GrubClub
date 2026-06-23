// Wraps localStorage access so a disabled or full store (iOS private browsing, quota
// exceeded, a browser setting blocking storage) degrades to "didn't persist" instead of
// throwing and crashing whatever called it.
export function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function safeRemoveItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Nothing to clean up if storage is inaccessible.
  }
}
