import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from '@fortawesome/free-solid-svg-icons';
import { useGravy } from '../state/GravyContext';
import { getDayLog } from '../state/dayLog';
import { todayStr } from '../state/defaultState';
import { DEFAULT_GOAL_COLOR } from '../data/colors';
import { triggerHaptic } from '../lib/haptics';
import { CollapsibleSection } from './CollapsibleSection';
import { HomeRow } from './HomeRow';

interface BonusPointsProps {
  dateStr?: string;
  editable?: boolean;
}

export function BonusPoints({ dateStr, editable = true }: BonusPointsProps = {}) {
  const { state, logBonusItem, undoBonusItem, logBonusItemForDay, undoBonusItemForDay } = useGravy();
  const today = todayStr(state.settings.timezone);
  const day = dateStr ?? today;
  const isToday = day === today;
  const bonusItems = state.goals.filter((g) => g.isDaily === false);
  const goalCounts = isToday ? (state.todayGoalCounts || {}) : (getDayLog(state, day, today)?.bonusCounts ?? {});
  const loggedCount = bonusItems.filter((g) => (goalCounts[g.id] || 0) > 0).length;
  const allLogged = bonusItems.length > 0 && loggedCount === bonusItems.length;

  return (
    <CollapsibleSection
      title="Bonus Points"
      storageKey="bonus"
      headerRight={
        bonusItems.length > 0 ? (
          <div className={`goal-progress-badge ${allLogged ? 'done' : ''}`}>{loggedCount}/{bonusItems.length} logged</div>
        ) : undefined
      }
    >
      {bonusItems.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-emoji"><FontAwesomeIcon icon={faMoon} /></span>
          <div className="empty-state-text">
            No bonus items yet!
            <br />
            Ask a grown-up to add some.
          </div>
        </div>
      ) : (
        <div className="gravy-row-list">
          {bonusItems.map((g) => {
            const count = goalCounts[g.id] || 0;
            const color = g.color || DEFAULT_GOAL_COLOR;
            return (
              <HomeRow
                key={g.id}
                color={color}
                iconKey={g.icon}
                emoji={g.emoji}
                title={g.name}
                sub={`${g.pts < 0 ? '−' : '+'}${Math.abs(g.pts)}`}
                trailing={
                  <div className="goal-stepper">
                    <button
                      type="button"
                      className="stepper-btn"
                      onClick={() => {
                        triggerHaptic();
                        if (isToday) undoBonusItem(g.id); else undoBonusItemForDay(day, g.id);
                      }}
                      disabled={!editable || count === 0}
                      aria-label={`Undo ${g.name}`}
                    >−</button>
                    <span className="stepper-count">{count}</span>
                    <button
                      type="button"
                      className="stepper-btn"
                      onClick={() => {
                        triggerHaptic();
                        if (isToday) logBonusItem(g.id); else logBonusItemForDay(day, g.id);
                      }}
                      disabled={!editable}
                      aria-label={`Log ${g.name}`}
                    >+</button>
                  </div>
                }
              />
            );
          })}
        </div>
      )}
    </CollapsibleSection>
  );
}
