import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from '@fortawesome/free-solid-svg-icons';
import { useGravy } from '../state/GravyContext';
import { getDayLog } from '../state/dayLog';
import { todayStr } from '../state/defaultState';
import { DEFAULT_GOAL_COLOR } from '../data/colors';
import { triggerHaptic } from '../lib/haptics';
import { CollapsibleSection } from './CollapsibleSection';
import { HomeRow } from './HomeRow';

interface DailyGoalsProps {
  dateStr?: string;
  editable?: boolean;
}

export function DailyGoals({ dateStr, editable = true }: DailyGoalsProps = {}) {
  const { state, incrementGoal, decrementGoal, toggleGoalForDay } = useGravy();
  const today = todayStr(state.settings.timezone);
  const day = dateStr ?? today;
  const isToday = day === today;
  const dailyGoals = state.goals.filter((g) => g.isDaily !== false);
  const goalCounts = state.todayGoalCounts || {};
  const goalIds = getDayLog(state, day, today)?.goalIds ?? [];
  const isDone = (goalId: number, target: number) =>
    isToday ? (goalCounts[goalId] || 0) >= target : goalIds.includes(goalId);
  const completedGoals = dailyGoals.filter((g) => isDone(g.id, g.target || 1)).length;
  const allDone = dailyGoals.length > 0 && completedGoals === dailyGoals.length;

  return (
    <CollapsibleSection
      title="Daily Goals"
      storageKey="daily"
      headerRight={
        dailyGoals.length > 0 ? (
          <div className={`goal-progress-badge ${allDone ? 'done' : ''}`}>{completedGoals}/{dailyGoals.length} done</div>
        ) : undefined
      }
    >
      {dailyGoals.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-emoji"><FontAwesomeIcon icon={faMoon} /></span>
          <div className="empty-state-text">
            No daily goals yet!
            <br />
            Ask a grown-up to add some.
          </div>
        </div>
      ) : (
        <div className="gravy-row-list">
          {dailyGoals.map((g) => {
            const target = g.target || 1;
            const count = goalCounts[g.id] || 0;
            const done = isDone(g.id, target);
            const color = g.color || DEFAULT_GOAL_COLOR;

            // Multi-step goals (today only) keep a +/− stepper instead of swipe/check.
            if (isToday && target > 1) {
              return (
                <HomeRow
                  key={g.id}
                  color={color}
                  iconKey={g.icon}
                  emoji={g.emoji}
                  title={g.name}
                  sub={`+${g.pts}`}
                  done={done}
                  trailing={
                    <div className="goal-stepper">
                      <button
                        type="button"
                        className="stepper-btn"
                        onClick={() => { triggerHaptic(); decrementGoal(g.id); }}
                        disabled={count === 0}
                        aria-label={`Undo ${g.name}`}
                      >−</button>
                      <span className="stepper-count">{count}/{target}</span>
                      <button
                        type="button"
                        className="stepper-btn"
                        onClick={() => { triggerHaptic(); incrementGoal(g.id); }}
                        aria-label={`Complete ${g.name}`}
                      >+</button>
                    </div>
                  }
                />
              );
            }

            return (
              <HomeRow
                key={g.id}
                color={color}
                iconKey={g.icon}
                emoji={g.emoji}
                title={g.name}
                sub={`+${g.pts}`}
                complete={{
                  editable,
                  done,
                  onComplete: () => (isToday ? incrementGoal(g.id) : toggleGoalForDay(day, g.id)),
                  onUndo: () => (isToday ? decrementGoal(g.id) : toggleGoalForDay(day, g.id)),
                  ariaLabel: editable
                    ? (done ? `${g.name}, done. Tap to undo.` : `${g.name}. Tap to complete.`)
                    : `${g.name}${done ? ', done' : ', not done'}`,
                }}
              />
            );
          })}
        </div>
      )}
    </CollapsibleSection>
  );
}
