import { SnapshotIn, types } from 'mobx-state-tree';

import { customTypes } from 'lib/state/cumstomTypes';

export const creationRulesModel = types
  .model('creationRules', {
    attributePoints: customTypes.positiveNumber,
  })
  .actions((self) => ({
    set<K extends keyof SnapshotIn<typeof self>, T extends SnapshotIn<typeof self>>(
      key: K,
      value: T[K]
    ) {
      if (typeof value === 'number' && value < 1) {
        return;
      }
      // @ts-ignore
      self[key] = value;
    },
  }));
