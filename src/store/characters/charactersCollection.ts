import { character, createCharacterScaffold } from './character';
import { createCollection } from 'lib/state/Collection';

export const charactersCollection = createCollection<typeof character>(
  'characters',
  character,
  createCharacterScaffold
);
