import { types, Instance } from 'mobx-state-tree';

export const traitModifierModel = types.model('traitModifierModel', {
  type: types.enumeration(['attribute', 'skill', 'pace']),
  traitName: types.string,
  bonusValue: 0,
  bonusDice: 0,
});

export interface ItraitModifier extends Instance<typeof traitModifierModel> {}
