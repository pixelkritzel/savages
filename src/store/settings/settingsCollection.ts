import { createCollection } from 'lib/state/createCollection';
import { settingModel, createSettingsScaffold } from './settingModel';

export const settingsCollection = createCollection<typeof settingModel>(
  'settings',
  settingModel,
  createSettingsScaffold
).actions((self) => ({
  afterCreate() {
    self.set({ ...createSettingsScaffold(), id: 'vanilla-rules' });
    console.log(JSON.stringify(self.all, undefined, 2));
  },
}));
