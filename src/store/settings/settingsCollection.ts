import { types } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';

import { createCollection } from 'lib/state/createCollection';

const setting = types
  .model('setting', {
    id: types.identifier,
    name: types.optional(types.string, ''),
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

export const settingsCollection = createCollection('settings', setting, createSettingsScaffold);
