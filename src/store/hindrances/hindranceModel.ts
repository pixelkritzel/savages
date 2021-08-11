import { createBoxedArray } from 'lib/state/createBoxedArray';
import { types, Instance, SnapshotIn } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';

import { modifierModel } from 'store/modifiers';

export const hindranceModel = types
  .model('hindranceModel', {
    _id: types.identifier,
    name: types.string,
    impact: types.enumeration(['minor', 'major']),
    description: types.string,
    summary: types.string,
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

export interface Ihindrance extends Instance<typeof hindranceModel> {}
export interface SIhindrance extends SnapshotIn<typeof hindranceModel> {}

export function createHindranceScaffold(initialValues: Partial<SIhindrance> = {}): SIhindrance {
  return {
    _id: uuidv4(),
    name: '',
    impact: 'minor',
    description: '',
    summary: '',
    modifiers: { array: [] },
    ...initialValues,
  };
}
