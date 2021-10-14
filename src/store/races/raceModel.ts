import { createSet } from 'lib/state/createSet';
import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';

import { _modelPrototype } from 'lib/state';
import { racialAbilityModel } from 'store/racialAbilities';

export const raceModel = _modelPrototype
  .named('raceModel')
  .props({
    description: types.string,
    abilities: createSet('raceAbilities', types.reference(racialAbilityModel)),
  })
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
