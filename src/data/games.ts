import type { IconKey } from './icons';

export interface GameDef {
  id: string;
  emoji: string;
  icon: IconKey;
  name: string;
  description: string;
}

// The Games hub catalog — add new entries here to add a new game to the hub grid.
export const GAMES: GameDef[] = [
  {
    id: 'hangman',
    emoji: '🔤',
    icon: 'font',
    name: 'Hangman',
    description: 'Guess the word before you run out of tries!',
  },
];
