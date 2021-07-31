import { types } from 'mobx-state-tree';

import { Itrait } from 'store/characters/traitModel';

export const ATTACK_SKILLS = ['athletics', 'fighting', 'shooting'] as const;

export const DICE_TYPES: Itrait['dice'][] = [4, 6, 8, 10, 12];

export const diceType = types.union(
  types.literal(4),
  types.literal(6),
  types.literal(8),
  types.literal(10),
  types.literal(12)
);

export const sizeType = types.optional(
  types.enumeration(['-6', '-4', '-2', '0', '+2', '+4', '+6']),
  '0'
);

export const attributeNames = ['agility', 'smarts', 'spirit', 'strength', 'vigor'];
