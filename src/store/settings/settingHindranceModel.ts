import { types, Instance, SnapshotIn } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';

import { modifierModel } from 'store/modifiers';

export const settingHindranceModel = types
  .model('hindranceModel', {
    _id: types.optional(types.identifier, uuidv4),
    name: types.string,
    impact: types.enumeration(['minor', 'major']),
    description: types.string,
    summary: types.string,
    modifiers: types.array(types.reference(modifierModel)),
  })
  .actions((self) => ({
    afterCreate() {
      self.modifiers.forEach((modifier) => {
        modifier.set('name', self.name);
        modifier.set('reason', `hindrance_${self._id}`);
      });
    },
  }));

export interface Ihindrance extends Instance<typeof settingHindranceModel> {}
export interface SIhindrance extends SnapshotIn<typeof settingHindranceModel> {}
