import { types, SnapshotIn, destroy, Instance, detach, getSnapshot } from 'mobx-state-tree';
import { persistence } from 'lib/persistence';

// This just provides the base type for the model
const _modelPrototype = types.model({
  id: types.identifier,
  name: types.optional(types.string, ''),
});

type TmodelPrototype = typeof _modelPrototype;
export type ImodelPrototype = Instance<TmodelPrototype>;
export type SImodelPrototype = SnapshotIn<TmodelPrototype>;

export function createCollection<T extends TmodelPrototype>(
  name: string,
  model: TmodelPrototype,
  createModelScaffoldFn: () => SnapshotIn<T>
) {
  type IActualModel = Instance<T>;
  type SIActualModel = SnapshotIn<T>;
  return types
    .model(name, {
      all: types.map(model as T),
      name: types.optional(types.literal(name), name),
      isLoaded: false,
      newModel: types.maybe(model as T),
    })
    .views((self) => ({
      get asArray() {
        return Array.from(self.all).map(([, value]) => value) as IActualModel[];
      },
      get(id: IActualModel['id']) {
        const model = self.all.get(id);
        if (!model) {
          throw new Error(`Model ${id} was not found!`);
        }
        return model as IActualModel;
      },
    }))
    .actions((self) => ({
      deleteModel(id: IActualModel['id']) {
        self.all.delete(id);
        persistence.deleteItem(name, id);
      },
      discardNewModel() {
        if (self.newModel) {
          destroy(self.newModel);
        }
      },
      new() {
        self.newModel = model.create(createModelScaffoldFn()) as any;
        return self.newModel as IActualModel;
      },
      async saveNewModel() {
        if (self.newModel) {
          const newModel = detach(self.newModel);
          self.all.set(newModel.id, newModel);
          try {
            persistence.saveItem(name, getSnapshot(newModel)!);
          } catch (e) {
            return 'ERROR';
          }
          return 'SUCCESS';
        }
        return 'ERROR';
      },
      set(character: IActualModel | SIActualModel) {
        self.all.set(character.id, character);
      },
      setIsLoaded(isLoaded: typeof self['isLoaded']) {
        self.isLoaded = isLoaded;
      },
    }))
    .actions((self) => {
      function afterCreate() {
        loadCollection();
      }

      async function loadCollection() {
        const collectionData = await persistence.loadCollection(name);
        collectionData.forEach((modelData) => self.set(modelData));
        self.setIsLoaded(true);
      }

      return { afterCreate };
    });
}

export type Icollection = Instance<ReturnType<typeof createCollection>>;

export const collectionScaffold = {
  all: {},
};
