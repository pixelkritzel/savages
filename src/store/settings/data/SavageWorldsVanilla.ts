import { giantKiller } from './edges/giant_killer';
import { SIsetting } from './../settingModel';

import { doubleTap } from './edges/double_tap';

export const vanillaSetting: SIsetting = {
  _id: 'vanilla_setting',
  name: 'Savage Worlds Vanilla Rules',
  creation: {
    attributePoints: 5,
  },
  availableEdges: [doubleTap, giantKiller],
  availableHindrances: { array: [] },
  availableSkills: {
    array: [],
  },
  availableWeapons: {
    array: [
      // unarmed,
      // improvisedWeaponLight,
      // improvisedWeaponMedium,
      // improvisedWeaponHeavy,
    ],
  },
  availablePowers: { array: [] },
  rules: {
    skillSpezializations: ['fighting', 'shooting'],
  },
};
