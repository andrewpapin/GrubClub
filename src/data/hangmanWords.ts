export interface HangmanWord {
  word: string;
  category: string;
}

// Curated, 3rd-grade-reading-level nouns (4-8 letters) shown as the Hangman answer.
// `category` is shown to the player as a clue, classic-Hangman style.
export const HANGMAN_WORDS: HangmanWord[] = [
  // Animals
  { word: 'DOLPHIN', category: 'Animals' },
  { word: 'RABBIT', category: 'Animals' },
  { word: 'TURTLE', category: 'Animals' },
  { word: 'PENGUIN', category: 'Animals' },
  { word: 'GIRAFFE', category: 'Animals' },
  { word: 'ELEPHANT', category: 'Animals' },
  { word: 'CHEETAH', category: 'Animals' },
  { word: 'OCTOPUS', category: 'Animals' },
  { word: 'SQUIRREL', category: 'Animals' },
  // Food
  { word: 'PANCAKE', category: 'Food' },
  { word: 'SANDWICH', category: 'Food' },
  { word: 'BANANA', category: 'Food' },
  { word: 'PRETZEL', category: 'Food' },
  { word: 'POPCORN', category: 'Food' },
  { word: 'BURRITO', category: 'Food' },
  { word: 'WAFFLE', category: 'Food' },
  { word: 'NOODLES', category: 'Food' },
  // School
  { word: 'PENCIL', category: 'School' },
  { word: 'CRAYON', category: 'School' },
  { word: 'TEACHER', category: 'School' },
  { word: 'NOTEBOOK', category: 'School' },
  { word: 'BACKPACK', category: 'School' },
  { word: 'SCISSORS', category: 'School' },
  { word: 'STAPLER', category: 'School' },
  { word: 'MARKER', category: 'School' },
  // Nature
  { word: 'RAINBOW', category: 'Nature' },
  { word: 'MOUNTAIN', category: 'Nature' },
  { word: 'VOLCANO', category: 'Nature' },
  { word: 'THUNDER', category: 'Nature' },
  { word: 'BLOSSOM', category: 'Nature' },
  { word: 'MEADOW', category: 'Nature' },
  { word: 'GLACIER', category: 'Nature' },
  { word: 'FOREST', category: 'Nature' },
  { word: 'TORNADO', category: 'Nature' },
  // Space
  { word: 'ROCKET', category: 'Space' },
  { word: 'PLANET', category: 'Space' },
  { word: 'METEOR', category: 'Space' },
  { word: 'COMET', category: 'Space' },
  { word: 'GALAXY', category: 'Space' },
  { word: 'SATURN', category: 'Space' },
  { word: 'ASTEROID', category: 'Space' },
  { word: 'SHUTTLE', category: 'Space' },
  // Sports
  { word: 'SOCCER', category: 'Sports' },
  { word: 'HOCKEY', category: 'Sports' },
  { word: 'TENNIS', category: 'Sports' },
  { word: 'BASEBALL', category: 'Sports' },
  { word: 'FOOTBALL', category: 'Sports' },
  { word: 'HELMET', category: 'Sports' },
  { word: 'STADIUM', category: 'Sports' },
  { word: 'WHISTLE', category: 'Sports' },
];

export function pickHangmanWord(exclude?: string): HangmanWord {
  let pool = HANGMAN_WORDS;
  if (exclude) {
    const filtered = HANGMAN_WORDS.filter((w) => w.word !== exclude);
    if (filtered.length > 0) pool = filtered;
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

export const pickWord = pickHangmanWord;
