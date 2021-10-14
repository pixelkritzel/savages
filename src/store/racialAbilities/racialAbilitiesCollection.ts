import { SnapshotIn, Instance } from 'mobx-state-tree';
import { createCollection } from 'lib/state';

import {
  createracialAbilityScaffold,
  racialAbilityModel,
  IRacialAbility,
  SIRacialAbility,
} from './raicialAbilityModel';

export const racialAbilitiesCollection = createCollection<
  typeof racialAbilityModel,
  IRacialAbility,
  SIRacialAbility
>('racialAbilitiesCollection', racialAbilityModel, createracialAbilityScaffold);

export interface IracialAbilitiesCollection extends Instance<typeof racialAbilitiesCollection> {}
export interface SIracialAbilitiesCollection extends SnapshotIn<typeof racialAbilitiesCollection> {}

export function createSkillsCollection(): SIracialAbilitiesCollection {
  return {
    all: {},
  };
}
