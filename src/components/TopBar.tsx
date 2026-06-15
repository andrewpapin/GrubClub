import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useGrubClub } from '../state/GrubClubContext';

interface TopBarProps {
  title: string;
  highlightLast?: boolean;
}

export function TopBar({ title, highlightLast }: TopBarProps) {
  const { state } = useGrubClub();
  const splitIndex = title.lastIndexOf(' ');
  return (
    <div className="topbar">
      {highlightLast && splitIndex !== -1 ? (
        <span className="topbar-title">
          {title.slice(0, splitIndex)}{' '}
          <span className="topbar-title-accent">{title.slice(splitIndex + 1)}</span>
        </span>
      ) : (
        <span className="topbar-title">{title}</span>
      )}
      <div className="points-pill">
        <FontAwesomeIcon icon={faStar} /> <span>{state.points}</span>
      </div>
    </div>
  );
}
