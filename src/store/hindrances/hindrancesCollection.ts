import { Instance } from 'mobx-state-tree';

import { createCollection } from 'lib/state';

import { createHindranceScaffold, hindranceModel, Ihindrance, SIhindrance } from './hindranceModel';

export const hindrancesCollectionModel = createCollection<
  typeof hindranceModel,
  Ihindrance,
  SIhindrance
>('hindrancesCollection', hindranceModel, createHindranceScaffold);

export interface Imodifiers extends Instance<typeof hindrancesCollectionModel> {}
