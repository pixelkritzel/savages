import { types, SnapshotIn, destroy, Instance, detach, cast } from 'mobx-state-tree';

// import { persistence } from 'lib/persistence';

// This just provides the base type for the model
export const _modelPrototype = types.model({
  _id: types.identifier,
});

type Tmodel = typeof _modelPrototype;

export function createCollection<
  T extends Tmodel,
  IActualModel extends Instance<T>,
  SIActualModel extends SnapshotIn<T>
>(name: string, model: T, createModelScaffoldFn: () => SIActualModel) {
  return types
    .model(name, {
      all: types.map(model),
      name: types.optional(types.literal(name), name),
      isLoaded: false,
      newModel: types.maybe(model),
    })
    .views((self) => ({
      get asArray() {
        return Array.from(self.all).map(([, value]) => value) as IActualModel[];
      },
      get(id: IActualModel['_id']) {
        const model = self.all.get(id);
        if (!model) {
          throw new Error(`Model ${id} was not found!`);
        }
        return model as IActualModel;
      },
    }))
    .actions((self) => ({
      deleteModel(id: IActualModel['_id']) {
        self.all.delete(id);
        // persistence.deleteItem(name, id);
      },
      discardNewModel() {
        if (self.newModel) {
          destroy(self.newModel);
        }
      },
      new() {
        self.newModel = cast(model.create(createModelScaffoldFn()));
        return self.newModel!;
      },
      async saveNewModel() {
        if (self.newModel) {
          const newModel = detach(self.newModel);
          self.all.set(newModel._id, newModel);
          try {
            // persistence.saveItem(name, getSnapshot(newModel)!);
          } catch (e) {
            return 'ERROR';
          }
          return 'SUCCESS';
        }
        return 'ERROR';
      },
      set(character: IActualModel | SIActualModel) {
        self.all.set(character._id, character);
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
        // const collectionData = await persistence.loadCollection(name);
        // collectionData.forEach((modelData) => self.set(modelData));
        self.setIsLoaded(true);
      }

      return { afterCreate };
    });
}

export interface Icollection extends Instance<ReturnType<typeof createCollection>> {}

export const createCollectionScaffold = () => ({
  all: {},
});
