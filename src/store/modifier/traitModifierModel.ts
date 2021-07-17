import { v4 as uuid4 } from 'uuid';
import { types, Instance } from 'mobx-state-tree';

export const traitModifierModel = types.model('traitModifierModel', {
  id: types.optional(types.identifier, uuid4),
  type: types.enumeration(['attribute', 'skill', 'pace']),
  traitName: types.string,
  bonusValue: 0,
  bonusDice: 0,
});

export interface ItraitModifier extends Instance<typeof traitModifierModel> {}
