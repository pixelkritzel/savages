import { Isetting } from 'store/settings';
import { createCollection } from 'lib/state/createCollection';
import { settingModel, createSettingsScaffold, Tsetting, SIsetting } from './settingModel';

export const settingsCollection = createCollection<Tsetting, Isetting, SIsetting>(
  'settings',
  settingModel,
  createSettingsScaffold
).actions((self) => ({
  afterCreate() {
    self.set({ ...createSettingsScaffold(), id: 'vanilla-rules' });
    console.log(JSON.stringify(self.all, undefined, 2));
  },
}));
