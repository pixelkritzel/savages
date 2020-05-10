import { characterModel, createCharacterScaffold } from './characterModel';
import { createCollection } from 'lib/state/createCollection';

export const charactersCollection = createCollection<typeof characterModel>(
  'characters',
  characterModel,
  createCharacterScaffold
);
