import { types } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';

import { createCollection } from 'lib/state/Collection';

const setting = types
  .model('setting', {
    id: types.identifier,
  })
  .views((self) => ({
    get hasErrors() {
      return false;
    },
  }));

function createSettingsScaffold() {
  return {
    id: uuidv4(),
  };
}

export const charactersCollection = createCollection('settings', setting, createSettingsScaffold);
