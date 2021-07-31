import { cast, Instance, SnapshotIn, types } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';

import { modifierModel } from 'store/modifier/modifierModel';

const diceType = types.union(
  types.literal(4),
  types.literal(6),
  types.literal(8),
  types.literal(10),
  types.literal(12)
);

export const settingEdgeModel = types
  .model('settingEdgeModel', {
    id: types.optional(types.identifier, uuidv4),
    name: types.string,
    summary: types.string,
    description: types.string,
    modifiers: types.array(types.reference(modifierModel)),
    requirements: types.model('edgeRequirementsModel', {
      rank: types.enumeration(['novice', 'seasoned', 'hardened', 'veteran', 'heroic', 'legendary']),
      attributes: types.array(
        types.model({
          attributeName: types.enumeration(['agility', 'smarts', 'spirit', 'strength', 'vigor']),
          value: diceType,
        })
      ),
      skills: types.array(
        types.model({
          skillName: types.string,
          value: diceType,
        })
      ),
      edges: types.array(types.string),
    }),
  })
  .actions((self) => ({
    afterCreate() {
      self.modifiers.forEach((modifier) => {
        modifier.set('name', self.name);
        modifier.set('reason', `edge_${self.id}`);
      });
    },
    set<K extends keyof SnapshotIn<typeof self>, T extends SnapshotIn<typeof self>>(
      key: K,
      value: T[K]
    ) {
      self[key] = cast(value);
    },
  }));

export interface IedgeModel extends Instance<typeof settingEdgeModel> {}
export interface SIedgeModel extends SnapshotIn<typeof settingEdgeModel> {}
