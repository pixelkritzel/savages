import { types, Instance, SnapshotIn } from 'mobx-state-tree';

import { modifierModel } from 'store/modifier';

export const settingHindranceModel = types
  .model('hindranceModel', {
    id: types.identifier,
    name: types.string,
    impact: types.enumeration(['minor', 'major']),
    description: types.string,
    summary: types.string,
    modifiers: types.array(modifierModel),
  })
  .actions((self) => ({
    afterCreate() {
      self.modifiers.forEach((modifier) => {
        modifier.set('name', self.name);
        modifier.set('reason', `hindrance_${self.id}`);
      });
    },
  }));

export interface Ihindrance extends Instance<typeof settingHindranceModel> {}
export interface SIhindrance extends SnapshotIn<typeof settingHindranceModel> {}
