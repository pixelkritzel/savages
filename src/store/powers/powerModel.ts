import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';

import { _modelPrototype } from 'lib/state';

export const powerModel = _modelPrototype.named('powerModel').props({
  name: types.string,
});

export interface Ipower extends Instance<typeof powerModel> {}
export interface SIpower extends SnapshotIn<typeof powerModel> {}
export interface SOpower extends SnapshotOut<typeof powerModel> {}

export function createPowerScaffold(): SIpower {
  return { _id: uuidv4(), name: '' };
}
