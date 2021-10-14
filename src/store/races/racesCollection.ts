import { SnapshotIn, Instance } from 'mobx-state-tree';
import { createCollection } from 'lib/state';

import { createRaceScaffold, raceModel, IRace, SIRace } from './raceModel';

export const racessCollection = createCollection<typeof raceModel, IRace, SIRace>(
  'racesCollection',
  raceModel,
  createRaceScaffold
);

export interface IracesCollection extends Instance<typeof racessCollection> {}
export interface SIracesCollection extends SnapshotIn<typeof racessCollection> {}

export function createSkillsCollection(): SIracesCollection {
  return {
    all: {},
  };
}
