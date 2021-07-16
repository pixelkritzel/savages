import { types } from 'mobx-state-tree';

import { traitModel } from './traitModel';

export const attributesModel = types.model({
  agility: traitModel,
  smarts: traitModel,
  spirit: traitModel,
  strength: traitModel,
  vigor: traitModel,
});

export const attributeNames = ['agility', 'smarts', 'spirit', 'strength', 'vigor'];
