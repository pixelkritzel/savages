import { timmyGun } from './rangedWeapons/timmy_gun';
import { unarmed } from './meleeWeapons/unarmed';
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
import { tommyGun } from './rangedWeapons/tommy_gun';

export const vanillaSetting: SIsetting = {
  id: 'vanilla_setting',
  name: 'Savage Worlds Vanilla Rules',
  creation: {
    attributePoints: 5,
  },
  availableEdges: [strongWilled, nervesOfSteel],
  availableHindrances: [anemic, clueless, test_die_difference],
  availableSkills: [commonKnowledge, fighting, notice, taunt, shooting, athletics],
  availableRangedWeapons: [tommyGun, timmyGun],
  availableMeleeWeapons: [unarmed],
  rules: {
    skillSpezializations: ['fighting', 'shooting'],
  },
};
