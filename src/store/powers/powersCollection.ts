import { createCollection } from 'lib/state';

import { createPowerScaffold, powerModel, SIpower, SOpower } from './powerModel';

export const powersCollection = createCollection<typeof powerModel, SIpower, SOpower>(
  'powersCollection',
  powerModel,
  createPowerScaffold
);
