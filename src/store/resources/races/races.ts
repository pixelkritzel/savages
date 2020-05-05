import { types } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';

import { hindranceModel } from 'store/resources/hindrances';
import { createCollection } from 'lib/state/createCollection';

const raceModel = types.model('race', {
  id: types.identifier,
  name: types.optional(types.string, ''),
  hindrances: types.array(hindranceModel),
});

const createRaceModelScaffold = () => ({
  id: uuidv4(),
});

export const racesCollection = createCollection('races', raceModel, createRaceModelScaffold);

export const resourcesScaffold = { all: {} };
