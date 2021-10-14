import {
  types,
  SnapshotIn,
  Instance,
  flow,
  getSnapshot,
  isStateTreeNode,
  detach,
  SnapshotOut,
} from 'mobx-state-tree';
import PouchDB from 'pouchdb';

import { createPouchAdapter } from 'persistence/pouchAdapter';

// import { persistence } from 'lib/persistence';

// This just provides the base type for the model
export const _modelPrototype = types.model({
  _id: types.identifier,
  name: types.string,
});

export type Tmodel = typeof _modelPrototype;
export interface ImodelPrototype extends Instance<Tmodel> {}
export interface SOmodelPrototype extends SnapshotOut<Tmodel> {}

export function createCollection<
  T extends Tmodel,
  IActualModel extends Instance<T>,
  SIActualModel extends SnapshotIn<T>
>(
  name: string,
  model: T,
  createModelScaffoldFn: (snapshotIn?: Partial<SIActualModel>) => SIActualModel
) {
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
      _set(id: string, value: IActualModel | SIActualModel) {
        self.all.set(id, value);
      },
    }))
    .actions((self) => {
      return {
        deleteModel(id: IActualModel['_id']) {
          self.all.delete(id);
          pouchAdapter.delete(id);
        },
        async saveModel(id: string) {
          return await pouchAdapter.set(id, getSnapshot(self.get(id)) as any);
        },
        async set(id: string, value: IActualModel) {
          const pouchModel = await pouchAdapter.set(id, getSnapshot(value) as any);
          self._set(id, pouchModel);
        },
        async add(value: SIActualModel | IActualModel) {
          if (self.has(value._id)) {
            throw new Error(`collectionModel ${name} tried to add already existing model!`);
          }
          let dbModel: SIActualModel | undefined = undefined;
          try {
            dbModel = await pouchAdapter.add(
              (isStateTreeNode(value) ? getSnapshot(value) : value) as any
            );
          } catch (_) {}
          if (dbModel) {
            self._set(value._id, dbModel);
            console.log(JSON.stringify(self, undefined, 2));

            return self.get(dbModel._id);
          }
        },
        setIsLoaded(isLoaded: typeof self['isLoaded']) {
          self.isLoaded = isLoaded;
        },
        new() {
          // @ts-expect-error
          self.newModel = model.create(createModelScaffoldFn() as SIActualModel) as IActualModel;
        },
        async saveNewModel() {
          if (self.newModel) {
            const newModel = detach(self.newModel);
            // @ts-expect-error
            return await this.add(newModel);
          }
        },
        async discardNewModel() {
          self.newModel = undefined;
        },
      };
    })
    .actions((self) => {
      const loadCollection = flow(function* () {
        const collectionData = (yield pouchAdapter.loadAll()) as SIActualModel[];
        collectionData.forEach((modelData) => self.all.set(modelData._id, modelData));
        self.setIsLoaded(true);
      });

      return { loadCollection };
    })
    .actions((self) => {
      function afterCreate() {
        self.loadCollection();
      }

      return { afterCreate };
    });
}

export interface Icollection extends Instance<ReturnType<typeof createCollection>> {}
export interface SIcollection extends SnapshotIn<ReturnType<typeof createCollection>> {}

export const createCollectionScaffold = () => ({
  all: {},
});
