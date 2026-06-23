import { afterEach, describe, expect, it, vi } from 'vitest';
import { safeGetItem, safeRemoveItem, safeSetItem } from './storage';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('safeGetItem/safeSetItem/safeRemoveItem', () => {
  it('pass through to a working localStorage', () => {
    const store = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => store.set(k, v),
      removeItem: (k: string) => store.delete(k),
    });

    expect(safeSetItem('k', 'v')).toBe(true);
    expect(safeGetItem('k')).toBe('v');
    safeRemoveItem('k');
    expect(safeGetItem('k')).toBeNull();
  });

  it('returns null/false instead of throwing when storage is disabled', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => { throw new DOMException('disabled', 'SecurityError'); },
      setItem: () => { throw new DOMException('disabled', 'SecurityError'); },
      removeItem: () => { throw new DOMException('disabled', 'SecurityError'); },
    });

    expect(safeGetItem('k')).toBeNull();
    expect(safeSetItem('k', 'v')).toBe(false);
    expect(() => safeRemoveItem('k')).not.toThrow();
  });

  it('returns false instead of throwing when the quota is exceeded', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => { throw new DOMException('quota exceeded', 'QuotaExceededError'); },
      removeItem: () => {},
    });

    expect(safeSetItem('k', 'v')).toBe(false);
  });
});
