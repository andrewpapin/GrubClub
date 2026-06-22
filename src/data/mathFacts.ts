import { shuffle } from './shuffle';

export interface MathQuestion {
  prompt: string;
  choices: number[];
  correctIndex: number;
}

type Op = '+' | '-' | '×';

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildFact(): { a: number; b: number; op: Op; answer: number } {
  const op: Op = (['+', '-', '×'] as Op[])[randInt(0, 2)];
  if (op === '+') {
    const a = randInt(1, 50);
    const b = randInt(1, 50);
    return { a, b, op, answer: a + b };
  }
  if (op === '-') {
    const a = randInt(1, 100);
    const b = randInt(1, a);
    return { a, b, op, answer: a - b };
  }
  const a = randInt(1, 10);
  const b = randInt(1, 10);
  return { a, b, op, answer: a * b };
}

function distractorsFor(a: number, b: number, op: Op, answer: number): number[] {
  const candidates = new Set<number>();
  const tryAdd = (n: number) => {
    if (n !== answer && n >= 0) candidates.add(n);
  };

  if (op === '+') {
    tryAdd(answer + 1);
    tryAdd(answer - 1);
    tryAdd(answer + 10);
    tryAdd(answer - 10);
  } else if (op === '-') {
    tryAdd(answer + 1);
    tryAdd(answer - 1);
    tryAdd(b - a < 0 ? a + b : b - a);
    tryAdd(answer + 10);
  } else {
    tryAdd(a * (b + 1));
    tryAdd(a * (b - 1));
    tryAdd((a + 1) * b);
    tryAdd((a - 1) * b);
    tryAdd(answer + a);
    tryAdd(answer - a);
  }

  const pool = Array.from(candidates);
  while (pool.length < 3) {
    const filler = answer + randInt(-12, 12);
    if (filler !== answer && filler >= 0 && !pool.includes(filler)) pool.push(filler);
  }
  return shuffle(pool).slice(0, 3);
}

export function generateMathQuestion(): MathQuestion {
  const { a, b, op, answer } = buildFact();
  const distractors = distractorsFor(a, b, op, answer);
  const choices = shuffle([answer, ...distractors]);
  return {
    prompt: `${a} ${op} ${b} = ?`,
    choices,
    correctIndex: choices.indexOf(answer),
  };
}
