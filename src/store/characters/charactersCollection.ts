import { character, Icharacter, SIcharacter } from './character';
import { types } from 'mobx-state-tree';

export const charactersCollection = types
  .model('characters', {
    all: types.map(character),
  })
  .views((self) => ({
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
  }));

export const charactersCollectionScaffold = {
  all: {
    '0': {
      id: '0',
      name: 'Jerjer',
    },
  },
};
