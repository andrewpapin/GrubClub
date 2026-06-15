import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBroom, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useGrubClub } from '../state/GrubClubContext';

export function ChoreList() {
  const { state, toggleChore } = useGrubClub();
  const completed = state.chores.filter((c) => state.todayChores.includes(c.id)).length;

  return (
    <div className="card">
      <div className="flex-between" style={{ marginBottom: 12 }}>
        <div className="chore-card-title"><FontAwesomeIcon icon={faBroom} /> Chores</div>
        {state.chores.length > 0 && (
          <div className="chore-progress-badge">{completed}/{state.chores.length} done</div>
        )}
      </div>
      {state.chores.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-emoji"><FontAwesomeIcon icon={faMoon} /></span>
          <div className="empty-state-text">
            No chores yet!
            <br />
            Ask a grown-up to add some.
          </div>
        </div>
      ) : (
        <div>
          {state.chores.map((c) => {
            const checked = state.todayChores.includes(c.id);
            return (
              <div key={c.id} className={`chore-item ${checked ? 'checked' : ''}`} onClick={() => toggleChore(c.id)}>
                <div className="chore-check">{checked ? '✓' : ''}</div>
                <div className="chore-emoji">{c.emoji}</div>
                <div className="chore-info">
                  <div className="chore-name">{c.name}</div>
                </div>
                <div className="pts-badge">+{c.pts}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
