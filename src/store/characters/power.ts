import { types } from 'mobx-state-tree';

const powerModifierModel = types.model('powerModifier', {
  name: types.string,
  description: types.string,
  powerPoints: types.number,
});

export const powerModel = types.model('power', {
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
