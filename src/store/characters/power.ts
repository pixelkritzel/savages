import { types } from 'mobx-state-tree';
import { v4 as uiidv4 } from 'uuid';

const powerModifierModel = types.model('powerModifier', {
  name: types.string,
  description: types.string,
  powerPoints: types.number,
});

export const powerModel = types.model('power', {
  _id: types.optional(types.identifier, uiidv4),
  name: types.string,
  rank: types.enumeration(['Novice', 'Seasoned', 'Veteran', 'Heroic', 'Legendary']),
  powerPoints: types.number,
  range: types.string,
  duration: types.string,
  summary: types.string,
  trapping: types.string,
  description: types.string,
  modifiers: types.array(powerModifierModel),
});
