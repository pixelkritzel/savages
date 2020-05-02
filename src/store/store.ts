import { types, Instance } from 'mobx-state-tree';

import {
  charactersCollection,
  charactersCollectionScaffold
} from './characters/charactersCollection';

const store = types.model('store', {
  characters: charactersCollection
});

export type Istore = Instance<typeof store>;

export function createStore() {
  return store.create({
    characters: charactersCollectionScaffold
  });
}
