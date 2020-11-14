import { Icharacter, SIcharacter } from 'store/characters';
import { characterModel, createCharacterScaffold, Tcharacter } from './characterModel';
import { createCollection } from 'lib/state/createCollection';

export const charactersCollection = createCollection<Tcharacter, Icharacter, SIcharacter>(
  'characters',
  characterModel,
  createCharacterScaffold
);
