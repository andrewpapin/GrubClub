import { describe, expect, it } from 'vitest';
import { isValidHouseholdStatePayload } from './sync';

describe('isValidHouseholdStatePayload', () => {
  it('accepts an object with a profiles array', () => {
    expect(isValidHouseholdStatePayload({ version: 2, activeProfileId: 'p1', profiles: [] })).toBe(true);
  });

  it('rejects null/undefined', () => {
    expect(isValidHouseholdStatePayload(null)).toBe(false);
    expect(isValidHouseholdStatePayload(undefined)).toBe(false);
  });

  it('rejects non-objects', () => {
    expect(isValidHouseholdStatePayload('not an object')).toBe(false);
    expect(isValidHouseholdStatePayload(42)).toBe(false);
  });

  it('rejects an array (even though typeof array === "object")', () => {
    expect(isValidHouseholdStatePayload([])).toBe(false);
  });

  it('rejects an object missing a profiles array', () => {
    expect(isValidHouseholdStatePayload({ version: 2 })).toBe(false);
    expect(isValidHouseholdStatePayload({ profiles: 'not-an-array' })).toBe(false);
  });
});
