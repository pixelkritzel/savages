import { improvisedWeaponHeavy } from './weapons/improvised_weapon_heavy';
import { improvisedWeaponMedium } from './weapons/improvised_weapon_medium';
import { improvisedWeaponLight } from './weapons/improvised_weapon_light';
import { giantKiller } from './edges/giant_killer';
import { shotgun } from './weapons/shotgun';
import { timmyGun } from './weapons/timmy_gun';
import { unarmed } from './weapons/unarmed';
import { shooting } from './skills/shooting';
import { test_die_difference } from './hindrances/test_die_difference';
import { anemic } from './hindrances/anemic';
import { notice } from './skills/notice';
import { commonKnowledge } from './skills/common_knowledge';
import { taunt } from './skills/taunt';
import { fighting } from './skills/fighting';
import { clueless } from './hindrances/clueless';
import { nervesOfSteel } from './edges/nerves_of_steel';
import { strongWilled } from './edges/strongWilled';
import { SIsetting } from './../settingModel';
import { athletics } from './skills/athletics';
import { tommyGun } from './weapons/tommy_gun';
import { doubleTap } from './edges/double_tap';

export const vanillaSetting: SIsetting = {
  id: 'vanilla_setting',
  name: 'Savage Worlds Vanilla Rules',
  creation: {
    attributePoints: 5,
  },
  availableEdges: [strongWilled, nervesOfSteel, doubleTap, giantKiller],
  availableHindrances: [anemic, clueless, test_die_difference],
  availableSkills: [commonKnowledge, fighting, notice, taunt, shooting, athletics],
  availableWeapons: [
    unarmed,
    tommyGun,
    timmyGun,
    shotgun,
    improvisedWeaponLight,
    improvisedWeaponMedium,
    improvisedWeaponHeavy,
  ],
  rules: {
    skillSpezializations: ['fighting', 'shooting'],
  },
};
