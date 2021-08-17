import { capitalizeFirstLetter } from 'lib/strings';
import { IskillsCollection } from './../skills/skillsCollection';
import { createBoxedArray } from 'lib/state/createBoxedArray';
import { cast, getRoot, Instance, SnapshotIn, types } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';

import { modifierModel } from 'store/modifiers/modifierModel';
import merge from 'lodash/merge';
import { IedgesCollection } from '.';

export const RANKS = ['novice', 'seasoned', 'hardened', 'veteran', 'heroic', 'legendary'] as const;

const diceType = types.union(
  types.literal(4),
  types.literal(6),
  types.literal(8),
  types.literal(10),
  types.literal(12)
);

const requirementsModel = types
  .model('edgeRequirementsModel', {
    rank: types.enumeration([...RANKS]),
    attributes: createBoxedArray(
      '',
      types.model({
        name: types.enumeration(['agility', 'smarts', 'spirit', 'strength', 'vigor']),
        value: diceType,
      })
    ),
    skills: createBoxedArray(
      '',
      types.model({
        skillId: types.string,
        value: diceType,
      })
    ),
    edgesIds: createBoxedArray('', types.string),
  })
  .views((self) => ({
    includesAttribute(attributeName: string) {
      return self.attributes.array.some(({ name }) => name === attributeName);
    },
  }))
  .actions((self) => ({
    set<K extends keyof SnapshotIn<typeof self>, T extends SnapshotIn<typeof self>>(
      key: K,
      value: T[K]
    ) {
      self[key] = cast(value);
    },
  }));

export interface IedgeRequirement extends Instance<typeof requirementsModel> {}

export const edgeModel = types
  .model('settingEdgeModel', {
    _id: types.identifier,
    name: types.string,
    summary: '',
    description: '',
    modifiers: types.optional(createBoxedArray('', types.reference(modifierModel)), { array: [] }),
    requirements: requirementsModel,
  })
  .views((self) => ({
    get formattedRequirements(): string {
      const skillCollection = (getRoot(self) as any).skills as IskillsCollection;
      const edgesCollection = (getRoot(self) as any).skills as IedgesCollection;
      return `${capitalizeFirstLetter(
        self.requirements.rank
      )}; ${self.requirements.attributes.array.map(
        ({ name, value }) => `${capitalizeFirstLetter(name)} D${value};`
      )} ${self.requirements.skills.array.map(
        ({ skillId, value }) => `${skillCollection.get(skillId).displayName} D${value};`
      )} ${self.requirements.edgesIds.array.map((edgeId) => edgesCollection.get(edgeId))}`;
    },
  }))
  .actions((self) => ({
    set<K extends keyof SnapshotIn<typeof self>, T extends SnapshotIn<typeof self>>(
      key: K,
      value: T[K]
    ) {
      self[key] = cast(value);
    },
  }));

export interface Iedge extends Instance<typeof edgeModel> {}
export interface SIedge extends SnapshotIn<typeof edgeModel> {}

export function createEdgeScaffold(edgeData: Partial<SIedge> = {}): SIedge {
  return merge({ _id: uuidv4(), name: '', requirements: { rank: 'novice' } }, edgeData);
}
