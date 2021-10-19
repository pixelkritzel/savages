import { createBoxedArray } from 'lib/state/createBoxedArray';
import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';

import { _modelPrototype } from 'lib/state';
import { racialAbilityModel } from 'store/racialAbilities';

export const raceModel = _modelPrototype
  .named('raceModel')
  .props({
    description: types.string,
    abilities: createBoxedArray('raceAbilities', types.reference(racialAbilityModel)),
  })
  .views((self) => ({
    get invalidFields() {
      const invalidFields: Partial<Record<keyof typeof self, boolean>> = {};
      invalidFields.name = self.name.length < 2;
      invalidFields.description = self.description.length === 0;
      invalidFields.abilities = self.abilities.array.length === 0;
      return invalidFields;
    },
  }))
  .views((self) => ({
    get isInvalid() {
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

export interface IRace extends Instance<typeof raceModel> {}
export interface SIRace extends SnapshotIn<typeof raceModel> {}
export interface SORace extends SnapshotOut<typeof raceModel> {}

export function createRaceScaffold(initalValue?: Partial<SIRace>): SIRace {
  return {
    _id: uuidv4(),
    name: '',
    description: '',
    abilities: { array: [] },
  };
}
