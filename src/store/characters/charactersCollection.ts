import { character, createCharacterScaffold } from './character';
import { createCollection } from 'lib/state/createCollection';

export const charactersCollection = createCollection<typeof character>(
  'characters',
  character,
  createCharacterScaffold
);
