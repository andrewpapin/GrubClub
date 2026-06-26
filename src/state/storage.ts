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

// Same degrade-on-failure behavior as above, but for sessionStorage — used for state that
// should follow the current browser tab/PWA session instead of persisting forever.
export function safeSessionGetItem(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSessionSetItem(key: string, value: string): boolean {
  try {
    sessionStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function safeSessionRemoveItem(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // Nothing to clean up if storage is inaccessible.
  }
}
