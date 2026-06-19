import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { todayStr } from '../state/defaultState';
import { useGravy } from '../state/GravyContext';

interface DateNavProps {
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
}

function shiftDateStr(dateStr: string, deltaDays: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + deltaDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function DateNav({ selectedDate, onSelectDate }: DateNavProps) {
  const { showToast } = useGravy();
  const today = todayStr();
  const isToday = selectedDate === today;

  const dateObj = new Date(selectedDate + 'T00:00:00');
  const label = isToday
    ? 'Today'
    : dateObj.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  const goNext = () => {
    if (isToday) {
      showToast(faCalendarDays, "Can't peek into the future yet!");
      return;
    }
    onSelectDate(shiftDateStr(selectedDate, 1));
  };

  return (
    <div className="date-nav-card">
      <button className="date-nav-btn" onClick={() => onSelectDate(shiftDateStr(selectedDate, -1))} aria-label="Previous day" type="button">
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <span className="date-nav-label">{label}</span>
      <button
        className={`date-nav-btn ${isToday ? 'muted' : ''}`}
        onClick={goNext}
        aria-label={isToday ? "Can't view future days" : 'Next day'}
        type="button"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
}
