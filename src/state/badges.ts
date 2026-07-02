import { BADGE_MASTER, type BadgeDef } from '../data/badges';
import type { IconKey } from '../data/icons';
import type { GravyState } from './types';

export interface BadgeDisplay extends BadgeDef {
  enabled: boolean;
}

export function getBadgeDisplay(state: GravyState, id: string): BadgeDisplay | null {
  const master = BADGE_MASTER.find((b) => b.id === id);
  if (!master) return null;
  const cfg = state.badgeConfig[id] || {};
  return {
    ...master,
    emoji: cfg.emoji ?? master.emoji,
    icon: (cfg.icon as IconKey | undefined) ?? master.icon,
    name: cfg.name ?? master.name,
    enabled: cfg.enabled !== undefined ? cfg.enabled : true,
  };
}

export function getEnabledBadges(state: GravyState): BadgeDef[] {
  return BADGE_MASTER.filter((b) => {
    const cfg = state.badgeConfig[b.id];
    return cfg ? cfg.enabled !== false : true;
  });
}

export interface BadgeProgress {
  current: number;
  target: number;
}

// Returns current/target progress towards a badge, or null if it's not a
// progress-trackable badge (e.g. "first time" badges).
export function getBadgeProgress(state: GravyState, badge: BadgeDef): BadgeProgress | null {
  const c = state.counters;
  const [type, threshStr] = badge.trigger.split(':');
  const thresh = parseInt(threshStr) || 0;
  switch (type) {
    case 'fruit':
    case 'veggie':
    case 'protein':
    case 'dairy':
    case 'grain':
      return { current: c.foodLogs[type] || 0, target: thresh };
    case 'food_count': {
      const total = Object.values(c.foodLogs).reduce((s, v) => s + v, 0);
      return { current: total, target: thresh };
    }
    case 'full_tray':
      return { current: c.fullTrayDays, target: thresh };
    case 'chore_count':
      return { current: c.totalGoals, target: thresh };
    case 'all_chores':
      return { current: c.allGoalsDays, target: thresh };
    case 'pts':
      return { current: Math.max(0, state.totalPoints), target: thresh };
    case 'pts_day':
      return { current: c.maxDayPoints, target: thresh };
    case 'streak':
      return { current: state.streak, target: thresh };
    case 'reward_count':
      return { current: c.totalRewards, target: thresh };
    case 'combo':
      return { current: c.comboDays, target: thresh };
    case 'games_won':
      return { current: c.gamesWon, target: thresh };
    default:
      return null;
  }
}

// Whether a badge deserves full-size visual weight on the kid-facing badges screen:
// already earned, or the next unearned milestone actively in progress. Everything else
// collapses to a compact chip. Badges of the same trigger type (e.g. chore_count:5/10/25/...)
// share one underlying counter, so `current > 0` alone would light up an entire threshold
// ladder at once — only the nearest un-earned rung in each ladder counts as "in progress".
export function isBadgeSpotlighted(state: GravyState, badge: BadgeDef): boolean {
  if (state.earnedBadges.includes(badge.id)) return true;
  const progress = getBadgeProgress(state, badge);
  if (progress === null || progress.current <= 0) return false;
  const [type, threshStr] = badge.trigger.split(':');
  const thresh = parseInt(threshStr) || 0;
  return !BADGE_MASTER.some((other) => {
    if (other.id === badge.id || state.earnedBadges.includes(other.id)) return false;
    const [otherType, otherThreshStr] = other.trigger.split(':');
    return otherType === type && (parseInt(otherThreshStr) || 0) < thresh;
  });
}

export function getEnabledBadgeCount(state: GravyState): number {
  return BADGE_MASTER.filter((b) => {
    const cfg = state.badgeConfig[b.id];
    return cfg ? cfg.enabled !== false : true;
  }).length;
}

// Returns the ids of badges that newly become earned given the current state/counters.
export function findNewlyEarnedBadges(state: GravyState): string[] {
  const c = state.counters;
  const newlyEarned: string[] = [];
  BADGE_MASTER.forEach((b) => {
    if (state.earnedBadges.includes(b.id)) return;
    const [type, threshStr] = b.trigger.split(':');
    const thresh = parseInt(threshStr) || 0;
    let earned = false;
    switch (type) {
      case 'first_food':
        earned = Object.values(c.foodLogs).some((v) => v > 0);
        break;
      case 'first_chore':
        earned = c.totalGoals >= 1;
        break;
      case 'first_reward':
        earned = c.totalRewards >= 1;
        break;
      case 'fruit':
        earned = (c.foodLogs.fruit || 0) >= thresh;
        break;
      case 'veggie':
        earned = (c.foodLogs.veggie || 0) >= thresh;
        break;
      case 'protein':
        earned = (c.foodLogs.protein || 0) >= thresh;
        break;
      case 'dairy':
        earned = (c.foodLogs.dairy || 0) >= thresh;
        break;
      case 'grain':
        earned = (c.foodLogs.grain || 0) >= thresh;
        break;
      case 'food_count': {
        const total = Object.values(c.foodLogs).reduce((s, v) => s + v, 0);
        earned = total >= thresh;
        break;
      }
      case 'full_tray':
        earned = c.fullTrayDays >= thresh;
        break;
      case 'chore_count':
        earned = c.totalGoals >= thresh;
        break;
      case 'all_chores':
        earned = c.allGoalsDays >= thresh;
        break;
      case 'pts':
        earned = state.totalPoints >= thresh;
        break;
      case 'pts_day':
        earned = c.maxDayPoints >= thresh;
        break;
      case 'streak':
        earned = state.streak >= thresh;
        break;
      case 'reward_count':
        earned = c.totalRewards >= thresh;
        break;
      case 'combo':
        earned = c.comboDays >= thresh;
        break;
      case 'first_game':
        earned = c.gamesWon >= 1;
        break;
      case 'games_won':
        earned = c.gamesWon >= thresh;
        break;
    }
    if (earned) newlyEarned.push(b.id);
  });
  return newlyEarned;
}
