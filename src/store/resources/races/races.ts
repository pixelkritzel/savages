import { types, Instance, SnapshotIn } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';

import { hindranceModel } from 'store/resources/hindrances';
import { createCollection } from 'lib/state/createCollection';

const raceModel = types.model('race', {
  id: types.identifier,
  name: types.optional(types.string, ''),
  hindrances: types.array(hindranceModel),
});

type Trace = typeof raceModel;
interface Irace extends Instance<typeof raceModel> {}
interface SIrace extends SnapshotIn<typeof raceModel> {}

const createRaceModelScaffold = () => ({
  id: uuidv4(),
});

export const racesCollection = createCollection<Trace, Irace, SIrace>(
  'races',
  raceModel,
  createRaceModelScaffold
);

export const resourcesScaffold = { all: {} };
