import { types, SnapshotIn, destroy, Instance, detach, getSnapshot, cast } from 'mobx-state-tree';
import { persistence } from 'lib/persistence';

// This just provides the base type for the model
const _modelPrototype = types.model({
  id: types.identifier,
  name: types.optional(types.string, ''),
});

type TmodelPrototype = typeof _modelPrototype;
export interface ImodelPrototype extends Instance<TmodelPrototype> {}
export interface SImodelPrototype extends SnapshotIn<TmodelPrototype> {}

export function createCollection<
  T extends TmodelPrototype,
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
        self.newModel = cast(model.create(createModelScaffoldFn()));
        return self.newModel!;
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

export interface Icollection extends Instance<ReturnType<typeof createCollection>> {}

export const collectionScaffold = {
  all: {},
};
