import {
  character as characterModel,
  Icharacter,
  SIcharacter,
  createCharacterScaffold,
} from './character';
import { types, SnapshotIn } from 'mobx-state-tree';

export const charactersCollection = types
  .model('characters', {
    all: types.map(characterModel),
    newCharacter: types.maybe(characterModel),
  })
  .views((self) => ({
    get asArray() {
      const array: Icharacter[] = [];
      for (const [, value] of self.all) {
        array.push(value);
      }
      return array;
    },
    get(id: Icharacter['id']) {
      const character = self.all.get(id);
      if (!character) {
        throw new Error(`Character ${id} was not found!`);
      }
      return character;
    },
  }))
  .actions((self) => ({
    set(character: Icharacter | SIcharacter) {
      self.all.set(character.id, character);
    },
    new() {
      self.newCharacter = characterModel.create(createCharacterScaffold());
      return self.newCharacter;
    },
  }));

type scaffold = SnapshotIn<typeof charactersCollection>;

export const charactersCollectionScaffold: scaffold = {
  all: {
    '0': {
      id: '0',
      name: 'Jerjer',
      attributes: {
        agility: { name: 'agility' },
        smarts: { name: 'smarts' },
        spirit: { name: 'spirit' },
        strength: { name: 'strength' },
        vigor: { name: 'vigor' },
      },
    },
  },
};
