import { types } from 'mobx-state-tree';

import { collectionScaffold } from 'lib/state/createCollection';

import { hindrancesCollection } from './hindrances/hindrancesCollection';

export const resources = types.model('resorces', {
  hindrances: hindrancesCollection,
});

export const resourcesScaffold = {
  hindrances: collectionScaffold,
};
