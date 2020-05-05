import { createCollection } from 'lib/state/createCollection';

import { hindranceModel, createHindranceScaffold } from './hindranceModel';

export const hindrancesCollection = createCollection<typeof hindranceModel>(
  'settings',
  hindranceModel,
  createHindranceScaffold
);
