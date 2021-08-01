import { v4 as uuid4 } from 'uuid';
import { types, Instance, getParent } from 'mobx-state-tree';

const traitModifierSpecializationModel = types
  .model({
    specializationName: '',
    specializationBonus: 0,
    specializationDiceDifference: 0,
  })
  .actions((self) => ({
    set<K extends keyof Instance<typeof self>, T extends Instance<typeof self>>(
      key: K,
      value: T[K]
    ) {
      self[key] = value;
    },
  }));

export const traitModifierModelTypes = ['attribute', 'skill', 'pace'] as const;

export const traitModifierModel = types
  .model('traitModifierModel', {
    _id: types.optional(types.identifier, uuid4),
    type: types.optional(
      types.enumeration((traitModifierModelTypes as unknown) as string[]),
      'attribute'
    ),
    traitName: '',
    bonusValue: 0,
    bonusDice: 0,
    diceMinimum: 0,
    diceMaximum: 0,
    bonusMinimum: 0,
    bonusMaximum: 0,
    specialization: types.optional(traitModifierSpecializationModel, {}),
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
      if (key === 'traitName' && value !== self.traitName) {
        self.specialization = traitModifierSpecializationModel.create({});
      }
      if (key === 'type' && value !== 'skill') {
        self.specialization = traitModifierSpecializationModel.create({});
        self.traitName = '';
      }
      self[key] = value;
    },
  }));

export interface ItraitModifier extends Instance<typeof traitModifierModel> {}
