import { anemic } from './hindrances/anemic';
import { notice } from './skills/notice';
import { commonKnowledge } from './skills/common_knowledge';
import { taunt } from './skills/taunt';
import { fighting } from './skills/fighting';
import { clueless } from './hindrances/clueless';
import { nervesOfSteel } from './edges/nerves_of_steel';
import { strongWilled } from './edges/strongWilled';
import { SIsetting } from './../settingModel';

export const vanillaSetting: SIsetting = {
  id: 'vanilla-rules',
  name: 'Savage Worlds Vanilla Rules',
  creation: {
    attributePoints: 5,
  },
  availableEdges: [strongWilled, nervesOfSteel],
  availableHindrances: [anemic, clueless],
  availableSkills: [commonKnowledge, fighting, notice, taunt],
};
