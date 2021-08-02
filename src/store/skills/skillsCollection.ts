import { SnapshotIn } from 'mobx-state-tree';
import { createCollection } from 'lib/state';

import { createSkillScaffold, baseSkillModel, SIskill, SOskill } from './baseSkillModel';

// TODO: remove pseudo data
import { notice } from './data/notice';
import { commonKnowledge } from './data/common_knowledge';
import { taunt } from './data/taunt';
import { fighting } from './data/fighting';
import { shooting } from './data/shooting';
import { athletics } from './data/athletics';

export const skillsCollection = createCollection<
  typeof baseSkillModel,
  // @ts-expect-error
  SIskill,
  SOskill
>('skillsCollection', baseSkillModel, createSkillScaffold);

export interface SIskillsCollection extends SnapshotIn<typeof skillsCollection> {}

export function createSkillsCollection(): SIskillsCollection {
  return {
    all: {
      // TODO: remove pseudo data
      commonKnowledge,
      fighting,
      notice,
      taunt,
      shooting,
      athletics,
    },
  };
}
