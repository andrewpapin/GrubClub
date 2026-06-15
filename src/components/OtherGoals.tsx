import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck } from '@fortawesome/free-solid-svg-icons';
import { useGrubClub } from '../state/GrubClubContext';

export function OtherGoals() {
  const { state, toggleGoal } = useGrubClub();
  const otherGoals = state.goals.filter((g) => g.isDaily === false);

  if (otherGoals.length === 0) return null;

  const completed = otherGoals.filter((g) => state.todayGoals.includes(g.id)).length;

  return (
    <div className="card">
      <div className="flex-between" style={{ marginBottom: 12 }}>
        <div className="goal-card-title"><FontAwesomeIcon icon={faListCheck} /> Other Goals</div>
        <div className="goal-progress-badge">{completed}/{otherGoals.length} done</div>
      </div>
      <div>
        {otherGoals.map((g) => {
          const checked = state.todayGoals.includes(g.id);
          return (
            <div key={g.id} className={`goal-item ${checked ? 'checked' : ''}`} onClick={() => toggleGoal(g.id)}>
              <div className="goal-check">{checked ? '✓' : ''}</div>
              <div className="goal-emoji">{g.emoji}</div>
              <div className="goal-info">
                <div className="goal-name">{g.name}</div>
              </div>
              <div className="pts-badge">+{g.pts}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
