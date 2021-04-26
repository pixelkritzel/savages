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
      (['base', 'swimming', 'flying'] as const).forEach((name) => {
        if (self[name] !== 0) {
          modifications.push({ name, value: self[name] });
        }
      });
      return modifications;
    },
  }))
  .actions((self) => ({
    set(key: any, value: any) {
      // @ts-ignore
      self[key] = value;
    },
  }));
