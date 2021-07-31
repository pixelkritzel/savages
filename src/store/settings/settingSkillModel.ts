import { cast, Instance, SnapshotIn, types } from 'mobx-state-tree';
import { attributeNames } from 'store/consts';

export const settingsSkillModel = types
  .model('settingSkillModel', {
    id: types.identifier,
    name: types.string,
    description: types.string,
    associatedAttribute: types.enumeration(attributeNames),
  })
  .actions((self) => ({
    set<K extends keyof SnapshotIn<typeof self>, T extends SnapshotIn<typeof self>>(
      key: K,
      value: T[K]
    ) {
      self[key] = cast(value);
    },
  }));

export interface IskillSetting extends Instance<typeof settingsSkillModel> {}
export interface SIskillSetting extends SnapshotIn<typeof settingsSkillModel> {}
