import { Ihindrance } from 'store/resources/hindrances';
import { createCollection } from 'lib/state/createCollection';

import { hindranceModel, createHindranceScaffold, Thindrance, SIhindrance } from './hindranceModel';

export const hindrancesCollection = createCollection<Thindrance, Ihindrance, SIhindrance>(
  'settings',
  hindranceModel,
  createHindranceScaffold
);
