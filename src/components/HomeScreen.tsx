import { TopBar } from './TopBar';
import { StatsCard } from './StatsCard';
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
        <StatsCard />
        <FoodTray />
        <ChoreList />
      </div>
    </div>
  );
}
