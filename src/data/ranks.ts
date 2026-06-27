import type { IconKey } from './icons';

export interface Rank {
  name: string;
  emoji: string;   // legacy fallback
  icon: IconKey;   // registered icon key (see data/icons.ts)
  min: number;
  max: number;
}

// Thresholds are gap(n) = 250 * n between consecutive ranks (5x the original 50n
// placeholder curve from PR #90), landing max rank at 69,000 total points. Chosen so a
// consistently-engaged kid (~150-200 pts/day, the realistic ceiling once food, daily
// goals, bonus items, and the 3-win/day game cap are all in play — see BACKLOG.md Epic 4)
// reaches max rank in roughly a school year (~11-13 months) instead of ~2-3 months, while
// the first rank-up still lands within a couple of days to hook early engagement.
export const RANKS: Rank[] = [
  { name: 'Noob', emoji: '👶', icon: 'baby', min: 0, max: 250 },
  { name: 'Granny', emoji: '👵', icon: 'personCane', min: 250, max: 750 },
  { name: 'Green Monkey', emoji: '🐒', icon: 'paw', min: 750, max: 1500 },
  { name: 'Orange Iguana', emoji: '🦎', icon: 'dragon', min: 1500, max: 2500 },
  { name: 'Purple Parrot', emoji: '🦜', icon: 'crow', min: 2500, max: 3750 },
  { name: 'Blue Barracuda', emoji: '🐠', icon: 'fishFins', min: 3750, max: 5250 },
  { name: 'Red Jaguar', emoji: '🐆', icon: 'cat', min: 5250, max: 7000 },
  { name: 'Aura Farmer', emoji: '✨', icon: 'handSparkles', min: 7000, max: 9000 },
  { name: 'Silver Snake', emoji: '🐍', icon: 'staffSnake', min: 9000, max: 11250 },
  { name: 'Turbo Toad', emoji: '🐸', icon: 'frog', min: 11250, max: 13750 },
  { name: 'Shadow Shark', emoji: '🦈', icon: 'mask', min: 13750, max: 16500 },
  { name: 'Neon Narwhal', emoji: '🐬', icon: 'fish', min: 16500, max: 19500 },
  { name: 'Pixel Pirate', emoji: '🏴‍☠️', icon: 'skullCrossbones', min: 19500, max: 22750 },
  { name: 'Cyber Lotl', emoji: '🤖', icon: 'robot', min: 22750, max: 26250 },
  { name: 'Glitched Gamer', emoji: '🕹️', icon: 'microchip', min: 26250, max: 30000 },
  { name: 'Lava Llama', emoji: '🌋', icon: 'volcano', min: 30000, max: 34000 },
  { name: 'Cosmic Capybara', emoji: '🐹', icon: 'userAstronaut', min: 34000, max: 38250 },
  { name: 'Techno Tiger', emoji: '🐯', icon: 'robot', min: 38250, max: 42750 },
  { name: 'Static Squirrel', emoji: '🐿️', icon: 'bolt', min: 42750, max: 47500 },
  { name: 'Electric Eel', emoji: '⚡', icon: 'boltLightning', min: 47500, max: 52500 },
  { name: 'Retro Raptor', emoji: '🦖', icon: 'dragon', min: 52500, max: 57750 },
  { name: 'Frosty Fox', emoji: '🦊', icon: 'snowflake', min: 57750, max: 63250 },
  { name: 'Nitro Newt', emoji: '🏎️', icon: 'gaugeHigh', min: 63250, max: 69000 },
  { name: 'Sonic Snail', emoji: '🐌', icon: 'worm', min: 69000, max: 999999 },
];

export function getRank(pts: number): { rank: Rank; index: number } {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (pts >= RANKS[i].min) return { rank: RANKS[i], index: i };
  }
  return { rank: RANKS[0], index: 0 };
}
