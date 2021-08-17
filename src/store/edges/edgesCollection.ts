import { Instance } from 'mobx-state-tree';

import { createCollection } from 'lib/state';

import { createEdgeScaffold, edgeModel, Iedge, SIedge } from './edgeModel';

export const edgesCollectionModel = createCollection<typeof edgeModel, Iedge, SIedge>(
  'edgesCollection',
  edgeModel,
  createEdgeScaffold
).views((self) => ({
  get allEdgesIds() {
    return self.asArray.map(({ _id }) => _id);
  },
}));

export interface IedgesCollection extends Instance<typeof edgesCollectionModel> {}
