import type { ColorOption } from '../components/ColorPicker';

// Curated swatch palette shared by the avatar pickers (ProfilesManager) and the per-goal
// color picker (GoalsPanel). Lives here, alongside icons.ts, as the single home for curated
// pickable assets so the two surfaces don't duplicate the list.
export const AVATAR_COLORS: ColorOption[] = [
  { hex: '#2F3E46', label: 'Charcoal' },
  { hex: '#FFFFFF', label: 'White' },
  { hex: '#F28482', label: 'Coral' },
  { hex: '#F6BD60', label: 'Yellow' },
  { hex: '#84A59D', label: 'Sage' },
  { hex: '#D4AF37', label: 'Gold' },
  { hex: '#8EC5F6', label: 'Sky blue' },
  { hex: '#B388EB', label: 'Lavender' },
  { hex: '#F4A6C6', label: 'Pink' },
  { hex: '#FF8C42', label: 'Orange' },
  { hex: '#6FCF97', label: 'Green' },
  { hex: '#161B1F', label: 'Black' },
];

// Kid-facing goal/bonus rows are ALWAYS filled with their accent color and render white text,
// so the goal palette drops the near-white / near-black avatar swatches (which would either
// wash out the white text or read as a colorless row) and keeps the saturated mid-tones where
// white stays legible across every theme.
export const GOAL_COLORS: ColorOption[] = [
  { hex: '#F28482', label: 'Coral' },
  { hex: '#E07A5F', label: 'Terracotta' },
  { hex: '#FF8C42', label: 'Orange' },
  { hex: '#E6A817', label: 'Gold' },
  { hex: '#6FCF97', label: 'Green' },
  { hex: '#84A59D', label: 'Sage' },
  { hex: '#3D9BB5', label: 'Teal' },
  { hex: '#5B8DEF', label: 'Blue' },
  { hex: '#8E7DEF', label: 'Indigo' },
  { hex: '#B388EB', label: 'Lavender' },
  { hex: '#D86FB0', label: 'Magenta' },
  { hex: '#7A8290', label: 'Slate' },
];

// Default row accent for goals created before per-item colors existed (additive field, never
// backfilled into storage) and for the goal add-form's initial selection. Resolved at render
// time so saved state keeps `color` undefined when unset. Sage reads with white text on all themes.
export const DEFAULT_GOAL_COLOR = '#84A59D';
