import type { IconKey } from './icons';

export interface Food {
  id: string;
  emoji: string;   // legacy fallback
  icon: IconKey;   // registered icon key (see data/icons.ts)
  label: string;
  color: string;   // static hex accent for the kid-facing full-width row (white text on top)
}

export const FOODS: Food[] = [
  { id: 'fruit', emoji: '🍎', icon: 'appleWhole', label: 'Fruit', color: '#F28482' },
  { id: 'veggie', emoji: '🥦', icon: 'carrot', label: 'Veggie', color: '#6FCF97' },
  { id: 'protein', emoji: '🍗', icon: 'drumstickBite', label: 'Protein', color: '#E07A5F' },
  { id: 'dairy', emoji: '🥛', icon: 'glassWater', label: 'Dairy', color: '#5B8DEF' },
  { id: 'grain', emoji: '🍞', icon: 'breadSlice', label: 'Grain', color: '#E6A817' },
];
