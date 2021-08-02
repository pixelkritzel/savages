import { improvisedWeaponHeavy } from './weapons/improvised_weapon_heavy';
import { improvisedWeaponMedium } from './weapons/improvised_weapon_medium';
import { improvisedWeaponLight } from './weapons/improvised_weapon_light';
import { giantKiller } from './edges/giant_killer';
import { shotgun } from './weapons/shotgun';
import { timmyGun } from './weapons/timmy_gun';
import { unarmed } from './weapons/unarmed';

import { anemic } from './hindrances/anemic';

import { clueless } from './hindrances/clueless';
import { SIsetting } from './../settingModel';
import { tommyGun } from './weapons/tommy_gun';
import { doubleTap } from './edges/double_tap';

export const vanillaSetting: SIsetting = {
  _id: 'vanilla_setting',
  name: 'Savage Worlds Vanilla Rules',
  creation: {
    attributePoints: 5,
  },
  availableEdges: [doubleTap, giantKiller],
  availableHindrances: [anemic, clueless],
  availableSkills: {
    array: ['common_knowledge', 'fighting', 'notice', 'taunt', 'shooting', 'athletics'],
  },
  availableWeapons: [
    unarmed,
    tommyGun,
    timmyGun,
    shotgun,
    improvisedWeaponLight,
    improvisedWeaponMedium,
    improvisedWeaponHeavy,
  ],
  availablePowers: { array: [] },
  rules: {
    skillSpezializations: ['fighting', 'shooting'],
  },
};
