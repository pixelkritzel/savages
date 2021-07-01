import { types } from 'mobx-state-tree';
import { trait } from './trait';

export const attributesModel = types.model({
  agility: trait,
  smarts: trait,
  spirit: trait,
  strength: trait,
  vigor: trait,
});
