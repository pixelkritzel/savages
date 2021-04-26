import { resources, resourcesScaffold } from './resources/resources';
import { types, Instance } from 'mobx-state-tree';

import { collectionScaffold } from 'lib/state/createCollection';

import { charactersCollection } from './characters/charactersCollection';
import { settingsCollection } from './settings/settingsCollection';

const store = types
  .model('stores', {
    characters: charactersCollection,
    resources,
    settings: settingsCollection,
  })
  .actions((self) => ({
    afterCreate() {
      // MST creates instances lazily but we need this instance for reference
      self.settings; // eslint-disable-line @typescript-eslint/no-unused-expressions
    },
  }));

export interface Istore extends Instance<typeof store> {}

export function createStore() {
  return {
    characters: [],
    resources: resourcesScaffold,
    settings: collectionScaffold,
  };
}
