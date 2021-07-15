import { Isetting } from 'store/settings';
import { createCollection } from 'lib/state/createCollection';
import { settingModel, createSettingsScaffold, Tsetting, SIsetting } from './settingModel';

export const settingsCollection = createCollection<Tsetting, Isetting, SIsetting>(
  'settings',
  settingModel,
  createSettingsScaffold
);
