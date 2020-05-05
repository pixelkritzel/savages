import { types, Instance } from 'mobx-state-tree';

import { collectionScaffold } from 'lib/state/createCollection';

import { charactersCollection } from './characters/charactersCollection';
import { settingsCollection } from './settings/settingsCollection';

const store = types
  .model('store', {
    characters: charactersCollection,
    settings: settingsCollection,
  })
  .actions((self) => ({
    afterCreate() {
      // MST creates instances lazily but we need this instance for reference
      self.settings; // eslint-disable-line @typescript-eslint/no-unused-expressions
    },
  }));

export type Istore = Instance<typeof store>;

export function createStore() {
  return store.create({
    characters: collectionScaffold,
    settings: collectionScaffold,
  });
}
