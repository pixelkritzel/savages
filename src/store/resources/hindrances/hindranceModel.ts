import { SnapshotIn, types, Instance } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';

import { modifierModel, Imodifier } from 'store/modifier';

export const hindranceModel = types
  .model('hindrance', {
    id: types.identifier,
    name: types.optional(types.string, ''),
    description: types.optional(types.string, ''),
    modifiers: types.array(modifierModel),
    isPlayerSelectable: true,
    impact: types.maybe(types.enumeration(['minor', 'major'])),
  })
  .actions((self) => ({
    addModifier(modifier: Imodifier) {
      self.modifiers.push(modifier);
    },
    set<K extends keyof SnapshotIn<typeof self>, T extends SnapshotIn<typeof self>>(
      key: K,
      value: T[K]
    ) {
      // @ts-ignore
      self[key] = value;
    },
  }));

export type Ihindrance = Instance<typeof hindranceModel>;

export function createHindranceScaffold() {
  return {
    id: uuidv4(),
  };
}