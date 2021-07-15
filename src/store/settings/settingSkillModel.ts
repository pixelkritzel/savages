import { cast, SnapshotIn, getPropertyMembers, types } from 'mobx-state-tree';
import { attributesModel } from 'store/characters/attributesModel';

const { properties: attributes } = getPropertyMembers(attributesModel);

export const settingsSkillModel = types
  .model('settingSkillModel', {
    id: types.identifier,
    name: types.string,
    description: types.string,
    associatedAttribute: types.enumeration(Object.keys(attributes)),
  })
  .actions((self) => ({
    set<K extends keyof SnapshotIn<typeof self>, T extends SnapshotIn<typeof self>>(
      key: K,
      value: T[K]
    ) {
      self[key] = cast(value);
    },
  }));
