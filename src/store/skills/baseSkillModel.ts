import { createSet } from 'lib/state/createSet';
import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';

import { _modelPrototype } from 'lib/state';

import { attributeNames } from 'store/consts';

export const specializationModel = types
  .model({
    _id: types.optional(types.identifier, uuidv4),
    name: '',
    description: '',
  })
  .actions((self) => ({
    set<K extends keyof Instance<typeof self>, T extends Instance<typeof self>>(
      key: K,
      value: T[K]
    ) {
      self[key] = value;
    },
  }));

export interface SIspezialization extends SnapshotIn<typeof specializationModel> {}
export interface Ispezialization extends Instance<typeof specializationModel> {}

export function createSpecializationScaffold(
  initalValue?: Partial<SIspezialization>
): SIspezialization {
  return {
    _id: uuidv4(),
    name: '',
    description: '',
    ...initalValue,
  };
}

export const baseSkillModel = _modelPrototype
  .named('skillModel')
  .props({
    displayName: types.string,
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

export interface IbaseSkill extends Instance<typeof baseSkillModel> {}
export interface SIbaseSkill extends SnapshotIn<typeof baseSkillModel> {}
export interface SObaseSkill extends SnapshotOut<typeof baseSkillModel> {}

export function createBaseSkillScaffold(initalValue?: Partial<SIbaseSkill>): SIbaseSkill {
  return {
    _id: uuidv4(),
    displayName: '',
    name: '',
    description: '',
    associatedAttribute: 'agility',
    availableSkillSpezializations: { array: [] },
    ...initalValue,
  };
}
