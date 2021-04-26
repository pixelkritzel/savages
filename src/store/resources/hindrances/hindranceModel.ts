import { SnapshotIn, types, Instance, cast } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';

import { modifierModel } from 'store/modifier';

export const hindranceModel = types
  .model('hindrance', {
    id: types.identifier,
    name: types.optional(types.string, ''),
    description: types.optional(types.string, ''),
    modifiers: types.array(modifierModel),
    isPlayerSelectable: true,
    impact: types.maybe(types.enumeration(['minor', 'major', 'maybe'])),
  })
  .actions((self) => ({
    set<K extends keyof SnapshotIn<typeof self>, T extends SnapshotIn<typeof self>>(
      key: K,
      value: T[K]
    ) {
      self[key] = cast(value);
    },
  }));

export type Thindrance = typeof hindranceModel;
export interface Ihindrance extends Instance<Thindrance> {}
export interface SIhindrance extends SnapshotIn<Thindrance> {}

export function createHindranceScaffold() {
  return {
    id: uuidv4(),
  };
}
