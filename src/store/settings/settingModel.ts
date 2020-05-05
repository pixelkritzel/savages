import { Instance, SnapshotIn, types } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';

import savageWorldsVanilla from './data/SavageWorldsVanilla.json';
import { creationRulesModel } from './creationRulesModel';

export const settingModel = types
  .model('setting', {
    id: types.identifier,
    name: types.optional(types.string, ''),
    creation: creationRulesModel,
    log: types.array(
      types.model({
        date: types.number,
        message: types.string,
      })
    ),
  })
  .views((self) => ({
    get errors() {
      const errors: string[] = [];
      return errors;
    },
  }))
  .actions((self) => ({
    set<K extends keyof SnapshotIn<typeof self>, T extends SnapshotIn<typeof self>>(
      key: K,
      value: T[K]
    ) {
      // @ts-ignore
      self[key] = value;
    },
  }));

export function createSettingsScaffold() {
  return {
    id: uuidv4(),
    ...savageWorldsVanilla,
  };
}

export type Isetting = Instance<typeof settingModel>;
