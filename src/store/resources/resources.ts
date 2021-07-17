import { types } from 'mobx-state-tree';

import { collectionScaffold } from 'lib/state/createCollection';

export const resources = types.model('resorces', {});

export const resourcesScaffold = {
  hindrances: collectionScaffold,
};
