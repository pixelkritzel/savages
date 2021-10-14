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

export const traitModifierModelTypes = ['attribute', 'skill', 'pace', 'all'] as const;

export const traitModifierModel = types
  .model('traitModifierModel', {
    _id: types.optional(types.identifier, uuid4),
    type: types.optional(
      types.enumeration((traitModifierModelTypes as unknown) as string[]),
      'all'
    ),
    traitName: 'all',
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
    getValidationErrors() {
      return {
        traitName: !Boolean(self.traitName) ? ('trait_name_missing' as const) : false,
      };
    },
    get isValid() {
      return Object.values(this.getValidationErrors()).every((value) => !value);
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
      self[key] = value;
    },
    setType(type: typeof traitModifierModelTypes[number]) {
      if (type === 'all' || type === 'pace') {
        self.traitName = type;
      } else {
        self.traitName = '';
      }
      self.type = type;
    },
  }));

export interface ItraitModifier extends Instance<typeof traitModifierModel> {}
