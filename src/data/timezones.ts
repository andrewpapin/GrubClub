// Household-wide day-boundary timezone — see Settings.timezone (src/state/types.ts) and
// SHARED_SETTING_KEYS (src/state/defaultState.ts). Defaults to Eastern time per product
// decision: most households don't need to think about this, but an adult can change it.
export const DEFAULT_TIMEZONE = 'America/New_York';

// Used only if the runtime has no Intl.supportedValuesOf (older Safari/WebKit). A reasonably
// representative spread of zones so the picker still has useful options on those runtimes.
const FALLBACK_TIMEZONES = [
  'Pacific/Midway', 'Pacific/Honolulu', 'America/Anchorage', 'America/Los_Angeles',
  'America/Denver', 'America/Chicago', 'America/New_York', 'America/Halifax',
  'America/St_Johns', 'America/Sao_Paulo', 'Atlantic/Azores', 'UTC',
  'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Athens', 'Europe/Moscow',
  'Asia/Dubai', 'Asia/Karachi', 'Asia/Kolkata', 'Asia/Dhaka', 'Asia/Bangkok',
  'Asia/Shanghai', 'Asia/Tokyo', 'Australia/Sydney', 'Pacific/Auckland',
];

function listSupportedTimezones(): string[] {
  try {
    if (typeof Intl.supportedValuesOf === 'function') {
      return Intl.supportedValuesOf('timeZone');
    }
  } catch {
    // fall through to the static fallback below
  }
  return FALLBACK_TIMEZONES;
}

export const TIMEZONES: string[] = listSupportedTimezones();

export function isValidTimezone(tz: unknown): tz is string {
  if (typeof tz !== 'string' || !tz) return false;
  try {
    new Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}
