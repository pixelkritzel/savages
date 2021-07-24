import { types } from 'mobx-state-tree';

import { traitModel } from './traitModel';

export const attributesModel = types.model({
  agility: types.late(() => traitModel),
  smarts: types.late(() => traitModel),
  spirit: types.late(() => traitModel),
  strength: types.late(() => traitModel),
  vigor: types.late(() => traitModel),
});

export const attributeNames = ['agility', 'smarts', 'spirit', 'strength', 'vigor'];
