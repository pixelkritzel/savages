import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';

import { createBoxedArray } from 'lib/state/createBoxedArray';
import { customTypes, _modelPrototype } from 'lib/state';

import { modifierModel } from 'store/modifiers/modifierModel';

export const racialAbilityModel = _modelPrototype
  .named('racialAbilityModel')
  .props({
    description: '',
    value: 1,
    noOfApplications: types.optional(
      types.union(customTypes.positiveNumber, types.literal('unlimited')),
      1
    ),
    modifiers: createBoxedArray('', types.reference(modifierModel)),
  })
  .views((self) => ({
    get invalidFields() {
      const invalidFields: Partial<Record<keyof typeof self, boolean>> = {};
      invalidFields.name = self.name.length < 2;
      invalidFields.description = self.description.length === 0;
      invalidFields.value = self.value === 0;
      return invalidFields;
    },
  }))
  .views((self) => ({
    get isInvalid() {
      console.log(Object.values(self.invalidFields));
      return Object.values(self.invalidFields).some((isInvalid) => isInvalid);
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

export interface IRacialAbility extends Instance<typeof racialAbilityModel> {}
export interface SIRacialAbility extends SnapshotIn<typeof racialAbilityModel> {}
export interface SORacialAbility extends SnapshotOut<typeof racialAbilityModel> {}

export function createracialAbilityScaffold(
  initalValue?: Partial<SIRacialAbility>
): SIRacialAbility {
  return {
    _id: uuidv4(),
    name: '',
    description: '',
    ...initalValue,
  };
}
