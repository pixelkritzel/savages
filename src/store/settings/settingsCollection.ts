import { Instance } from 'mobx-state-tree';

import {
  settingModel,
  SIsetting,
  createSettingScaffold,
  Isetting,
} from 'store/settings/settingModel';
import { createCollection } from 'lib/state';

export const settingsCollectionModel = createCollection<typeof settingModel, Isetting, SIsetting>(
  'settingsCollection',
  settingModel,
  createSettingScaffold
);

export interface Isettings extends Instance<typeof settingsCollectionModel> {}
