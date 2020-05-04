import { types, Instance } from 'mobx-state-tree';

import { collectionScaffold } from 'lib/state/Collection';

import { charactersCollection } from './characters/charactersCollection';

const store = types.model('store', {
  characters: charactersCollection,
});

export type Istore = Instance<typeof store>;

export function createStore() {
  return store.create({
    characters: collectionScaffold,
  });
}
