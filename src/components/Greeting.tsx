import { useGravy } from '../state/GravyContext';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getFriendlyDate(): string {
  return new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function Greeting() {
  const { state } = useGravy();

  return (
    <div className="home-greeting">
      <div className="home-greeting-name">
        {getGreeting()}, {state.settings.childName}!
      </div>
      <div className="home-greeting-date">{getFriendlyDate()}</div>
    </div>
  );
}
