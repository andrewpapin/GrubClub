import { TopBar } from './TopBar';
import { Greeting } from './Greeting';
import { StatsCard } from './StatsCard';
import { FoodTray } from './FoodTray';
import { DailyGoals } from './DailyGoals';
import { BonusPoints } from './BonusPoints';

interface HomeScreenProps {
  onOpenAvatarMenu: () => void;
  onOpenBadges: () => void;
  selectedDate: string;
}

export function HomeScreen({ onOpenAvatarMenu, onOpenBadges, selectedDate }: HomeScreenProps) {
  return (
    <div className="screen active">
      <TopBar title="Gravy" highlightLast onOpenAvatarMenu={onOpenAvatarMenu} />
      <div className="scroll-area">
        <Greeting />
        <StatsCard onOpenBadges={onOpenBadges} />
        <FoodTray dateStr={selectedDate} />
        <DailyGoals dateStr={selectedDate} />
        <BonusPoints dateStr={selectedDate} />
      </div>
    </div>
  );
}
