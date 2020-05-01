import { types, Instance, SnapshotIn } from 'mobx-state-tree';

export const character = types.model('character', {
  id: types.identifier,
  name: types.string,
});

export type Icharacter = Instance<typeof character>;
export type SIcharacter = SnapshotIn<typeof character>;
