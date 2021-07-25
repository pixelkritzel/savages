import { v4 as uuid4 } from 'uuid';
import { types, Instance, getParent } from 'mobx-state-tree';

export const traitModifierModel = types
  .model('traitModifierModel', {
    id: types.optional(types.identifier, uuid4),
    type: types.enumeration(['attribute', 'skill', 'pace']),
    traitName: types.string,
    bonusValue: 0,
    bonusDice: 0,
    diceMinimum: 0,
    diceMaximum: 0,
    bonusMinimum: 0,
    bonusMaximum: 0,
  })
  .views((self) => ({
    get source() {
      return getParent(self, 2);
    },
  }))
  .actions((self) => ({
    set<K extends keyof Instance<typeof self>, T extends Instance<typeof self>>(
      key: K,
      value: T[K]
    ) {
      self[key] = value;
    },
  }));

export interface ItraitModifier extends Instance<typeof traitModifierModel> {}
