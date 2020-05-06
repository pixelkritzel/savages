import { SnapshotIn, types } from 'mobx-state-tree';
export const paceModel = types
  .model({
    base: 0,
    swimming: 0,
    flying: 0,
  })
  .views((self) => ({
    get modifications() {
      const modifications: {
        name: string;
        value: number | string;
      }[] = [];
      (['base', 'swimming', 'flying'] as ['base', 'swimming', 'flying']).forEach((name) => {
        if (self[name] !== 0) {
          modifications.push({ name, value: self[name] });
        }
      });
      return modifications;
    },
  }))
  .actions((self) => ({
    set<K extends keyof SnapshotIn<typeof self>, T extends SnapshotIn<typeof self>>(
      key: K,
      value: T[K]
    ) {
      self[key] = value;
    },
  }));
