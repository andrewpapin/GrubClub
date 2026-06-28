import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FOODS } from '../data/foods';
import { useGravy } from '../state/GravyContext';
import { getDayLog } from '../state/dayLog';
import { todayStr } from '../state/defaultState';
import { CollapsibleSection } from './CollapsibleSection';
import { HomeRow } from './HomeRow';

interface FoodTrayProps {
  dateStr?: string;
  editable?: boolean;
}

export function FoodTray({ dateStr, editable = true }: FoodTrayProps = {}) {
  const { state, logFood, removeFood, logFoodForDay, removeFoodForDay } = useGravy();
  const today = todayStr(state.settings.timezone);
  const day = dateStr ?? today;
  const isToday = day === today;
  const foodCounts = getDayLog(state, day, today)?.foodCounts ?? {};
  const eatenCount = Object.values(foodCounts).filter((v) => v > 0).length;
  const allEaten = eatenCount === FOODS.length;

  return (
    <CollapsibleSection
      title="Food Goals"
      storageKey="food"
      headerRight={
        <div className={`goal-progress-badge ${allEaten ? 'done' : ''}`}>{eatenCount}/{FOODS.length} done</div>
      }
    >
      {allEaten && (
        <div className="tray-progress-bonus" style={{ marginBottom: 10 }}>
          <FontAwesomeIcon icon={faStar} aria-hidden="true" /> Full Tray Bonus!
        </div>
      )}

      <div className="gravy-row-list">
        {FOODS.map((f) => {
          const logged = (foodCounts[f.id] || 0) > 0;
          return (
            <HomeRow
              key={f.id}
              color={f.color}
              iconKey={f.icon}
              emoji={f.emoji}
              title={f.label}
              complete={{
                editable,
                done: logged,
                onComplete: () => (isToday ? logFood(f.id) : logFoodForDay(day, f.id)),
                onUndo: () => (isToday ? removeFood(f.id) : removeFoodForDay(day, f.id)),
                ariaLabel: editable
                  ? (logged ? `${f.label}, logged. Tap to undo.` : `${f.label}. Tap to log.`)
                  : `${f.label}${logged ? ', logged' : ', not logged'}`,
              }}
            />
          );
        })}
      </div>
    </CollapsibleSection>
  );
}
