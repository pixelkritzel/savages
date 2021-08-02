import { createSet } from 'lib/state/createSet';
import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';

import { _modelPrototype } from 'lib/state';

import { attributeNames } from 'store/consts';

export const specializationModel = types.model({
  _id: types.optional(types.identifier, uuidv4),
  name: '',
  description: '',
});

export const baseSkillModel = _modelPrototype
  .named('skillModel')
  .props({
    name: types.string,
    description: types.string,
    associatedAttribute: types.enumeration(attributeNames),
    availableSkillSpezializations: createSet('', specializationModel),
  })
  .actions((self) => ({
    set<K extends keyof Instance<typeof self>, T extends Instance<typeof self>>(
      key: K,
      value: T[K]
    ) {
      self[key] = value;
    },
  }));

export interface Iskill extends Instance<typeof baseSkillModel> {}
export interface SIskill extends SnapshotIn<typeof baseSkillModel> {}
export interface SOskill extends SnapshotOut<typeof baseSkillModel> {}

export function createSkillScaffold(): SIskill {
  return {
    _id: uuidv4(),
    name: '',
    description: '',
    associatedAttribute: 'agility',
    availableSkillSpezializations: { array: [] },
  };
}
