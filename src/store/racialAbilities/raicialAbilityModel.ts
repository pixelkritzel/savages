import { modifierModel } from './../modifiers/modifierModel';
import { createBoxedArray } from 'lib/state/createBoxedArray';
import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';

import { _modelPrototype } from 'lib/state';

export const racialAbilityModel = _modelPrototype
  .named('racialAbilityModel')
  .props({
    description: '',
    value: 0,
    noOfApplications: types.optional(types.union(types.number, types.literal('unlimited')), 1),
    modifiers: createBoxedArray('', types.reference(modifierModel)),
  })
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
