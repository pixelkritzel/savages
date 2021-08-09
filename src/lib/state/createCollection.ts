import { types, SnapshotIn, Instance, flow, getSnapshot, isStateTreeNode } from 'mobx-state-tree';
import PouchDB from 'pouchdb';

import { createPouchAdapter } from 'persistence/pouchAdapter';

// import { persistence } from 'lib/persistence';

// This just provides the base type for the model
export const _modelPrototype = types.model({
  _id: types.identifier,
  name: types.string,
});

export type Tmodel = typeof _modelPrototype;

export function createCollection<
  T extends Tmodel,
  IActualModel extends Instance<T>,
  SIActualModel extends SnapshotIn<T>
>(name: string, model: T, createModelScaffoldFn: () => SIActualModel) {
  const db = new PouchDB<SIActualModel>(name);
  const pouchAdapter = createPouchAdapter(db);

  return types
    .model(name, {
      all: types.map(model),
      name: types.optional(types.literal(name), name),
      isLoaded: false,
      newModel: types.maybe(model),
    })
    .views((self) => ({
      get asArray(): IActualModel[] {
        return Array.from(self.all).map(([, value]) => value) as IActualModel[];
      },
      get(id: IActualModel['_id']): IActualModel {
        const model = self.all.get(id);
        if (!model) {
          throw new Error(`Model ${id} was not found!`);
        }
        return model as IActualModel;
      },
      has(value: string | IActualModel) {
        return self.all.has(typeof value === 'string' ? value : value._id);
      },
    }))
    .actions((self) => ({
      deleteModel(id: IActualModel['_id']) {
        self.all.delete(id);
        pouchAdapter.delete(id);
      },
      set: flow(function* (id: string, value: IActualModel) {
        const pouchModel = yield pouchAdapter.set(id, getSnapshot(value) as any);
        self.all.set(id, pouchModel);
      }),
      add: flow(function* (value: SIActualModel | IActualModel) {
        if (self.has(value._id)) {
          throw new Error(`collectionModel ${name} tried to add already existing model!`);
        }
        const dbModel = yield pouchAdapter.add(
          (isStateTreeNode(value) ? getSnapshot(value) : value) as any
        );
        self.all.set(value._id, dbModel);
      }),
      setIsLoaded(isLoaded: typeof self['isLoaded']) {
        self.isLoaded = isLoaded;
      },
    }))
    .actions((self) => {
      function afterCreate() {
        loadCollection();
      }

      const loadCollection = flow(function* () {
        const collectionData = (yield pouchAdapter.loadAll()) as SIActualModel[];
        collectionData.forEach((modelData) => self.all.set(modelData._id, modelData));
        self.setIsLoaded(true);
      });

      return { afterCreate };
    });
}

export interface Icollection extends Instance<ReturnType<typeof createCollection>> {}

export const createCollectionScaffold = () => ({
  all: {},
});
