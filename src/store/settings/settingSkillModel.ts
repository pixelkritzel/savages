import { cast, Instance, SnapshotIn, types } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';

import { attributeNames } from 'store/consts';

export const specializationModel = types.model({
  _id: types.optional(types.identifier, uuidv4),
  name: '',
  description: '',
});

export const settingsSkillModel = types
  .model('settingSkillModel', {
    _id: types.identifier,
    name: types.string,
    description: types.string,
    associatedAttribute: types.enumeration(attributeNames),
    availableSkillSpezializations: types.array(specializationModel),
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
