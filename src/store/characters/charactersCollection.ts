import { firestore } from 'myFirebase/firebase';
import { detach, SnapshotIn, types, destroy, getSnapshot } from 'mobx-state-tree';
import {
  character as characterModel,
  createCharacterScaffold,
  Icharacter,
  SIcharacter,
} from './character';

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
    discardNewCharacter() {
      if (self.newCharacter) {
        destroy(self.newCharacter);
      }
    },
    new() {
      self.newCharacter = characterModel.create(createCharacterScaffold());
      return self.newCharacter;
    },
    async saveNewCharacter() {
      if (self.newCharacter && !self.newCharacter.hasErrors) {
        const newCharacter = detach(self.newCharacter);
        self.all.set(newCharacter.id, newCharacter);
        try {
          firestore.collection('characters').doc(newCharacter.id).set(getSnapshot(newCharacter)!);
        } catch (e) {
          return 'ERROR';
        }
        return 'SUCCESS';
      }
      return 'ERROR';
    },
    set(character: Icharacter | SIcharacter) {
      self.all.set(character.id, character);
    },
  }))
  .actions((self) => {
    function afterCreate() {
      loadAllCharacters();
    }

    async function loadAllCharacters() {
      const docs = await firestore.collection('characters').get();
      docs.forEach((doc) => self.set(doc.data() as Icharacter));
    }

    return { afterCreate, loadAllCharacters };
  });

type scaffold = SnapshotIn<typeof charactersCollection>;

export const charactersCollectionScaffold: scaffold = {
  all: {},
};
