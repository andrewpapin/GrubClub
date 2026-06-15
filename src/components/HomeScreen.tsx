import { TopBar } from './TopBar';
import { RankBanner } from './RankBanner';
import { StreakCard } from './StreakCard';
import { FoodTray } from './FoodTray';
import { ChoreList } from './ChoreList';

interface HomeScreenProps {
  onEnterParent: () => void;
}

export function HomeScreen({ onEnterParent }: HomeScreenProps) {
  return (
    <div className="screen active">
      <TopBar title="Grub Club" highlightLast onEnterParent={onEnterParent} />
      <div className="scroll-area">
        <RankBanner />
        <StreakCard />
        <FoodTray />
        <ChoreList />
      </div>
    </div>
  );
}
