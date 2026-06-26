import { useGravy } from '../state/GravyContext';

function getGreeting(timezone: string): string {
  const hour = Number(
    new Intl.DateTimeFormat('en-US', { timeZone: timezone, hour: 'numeric', hourCycle: 'h23' }).format(new Date()),
  );
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getFriendlyDate(timezone: string): string {
  return new Date().toLocaleDateString(undefined, {
    timeZone: timezone,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function Greeting() {
  const { state } = useGravy();
  const timezone = state.settings.timezone;

  return (
    <div className="home-greeting">
      <div className="home-greeting-name">
        {getGreeting(timezone)}, {state.settings.childName}!
      </div>
      <div className="home-greeting-date">{getFriendlyDate(timezone)}</div>
    </div>
  );
}
