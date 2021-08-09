import { SnapshotIn, Instance } from 'mobx-state-tree';
import { createCollection } from 'lib/state';

import {
  createBaseSkillScaffold,
  baseSkillModel,
  SIbaseSkill,
  SObaseSkill,
} from './baseSkillModel';

export const skillsCollection = createCollection<
  typeof baseSkillModel,
  // @ts-expect-error
  SIbaseSkill,
  SObaseSkill
>('skillsCollection', baseSkillModel, createBaseSkillScaffold);

export interface IskillsCollection extends Instance<typeof skillsCollection> {}
export interface SIskillsCollection extends SnapshotIn<typeof skillsCollection> {}

export function createSkillsCollection(): SIskillsCollection {
  return {
    all: {},
  };
}
