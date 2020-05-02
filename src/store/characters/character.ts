import { trait } from './trait';
import { types, Instance, SnapshotIn } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';

export const character = types
  .model('character', {
    id: types.identifier,
    name: types.optional(types.string, ''),
    advances: 0,
    attributes: types.model({
      agility: trait,
      smarts: trait,
      spirit: trait,
      strength: trait,
      vigor: trait
    }),
    skills: types.map(trait)
  })
  .views((self) => ({
    get hasErrors() {
      return self.name.length < 2;
    }
  }))
  .actions((self) => ({
    set<K extends keyof SnapshotIn<typeof self>, T extends SnapshotIn<typeof self>>(
      key: K,
      value: T[K]
    ) {
      // @ts-ignore
      self[key] = value;
    }
  }));

export type Icharacter = Instance<typeof character>;
export type SIcharacter = SnapshotIn<typeof character>;

export const createCharacterScaffold = () => ({
  id: uuidv4(),
  name: '',
  attributes: {
    agility: { name: 'agility' },
    smarts: { name: 'smarts' },
    spirit: { name: 'spirit' },
    strength: { name: 'strength' },
    vigor: { name: 'vigor' }
  }
});
