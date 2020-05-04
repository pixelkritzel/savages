import { types, SnapshotIn, destroy, Instance, detach, getSnapshot } from 'mobx-state-tree';
import { persistence } from 'lib/persistence';

// This just provides the base type for the model
const _modelPrototype = types
  .model({
    id: types.identifier,
  })
  .views((self) => ({
    get hasErrors() {
      return Math.random() > 0.5;
    },
  }));

type TmodelPrototype = typeof _modelPrototype;
export type SImodelPrototype = SnapshotIn<typeof _modelPrototype>;

export function createCollection<T extends TmodelPrototype>(
  name: string,
  model: TmodelPrototype,
  createModelScaffoldFn: () => SnapshotIn<T>
) {
  type ImodelPrototype = Instance<T>;
  return types
    .model(name, {
      all: types.map(model),
      newModel: types.maybe(model),
    })
    .views((self) => ({
      get asArray() {
        return Array.from(self.all).map(([, value]) => value) as ImodelPrototype[];
      },
      get(id: ImodelPrototype['id']) {
        const model = self.all.get(id);
        if (!model) {
          throw new Error(`Model ${id} was not found!`);
        }
        return model as ImodelPrototype;
      },
    }))
    .actions((self) => ({
      discardNewModel() {
        if (self.newModel) {
          destroy(self.newModel);
        }
      },
      new() {
        self.newModel = model.create(createModelScaffoldFn());
        return self.newModel as ImodelPrototype;
      },
      async saveNewModel() {
        if (self.newModel && !self.newModel.hasErrors) {
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
      set(character: ImodelPrototype | SImodelPrototype) {
        self.all.set(character.id, character);
      },
    }))
    .actions((self) => {
      function afterCreate() {
        loadCollection();
      }

      async function loadCollection() {
        const collectionData = await persistence.loadCollection(name);
        collectionData.forEach((modelData) => self.set(modelData));
      }

      return { afterCreate };
    });
}

export const collectionScaffold = {
  all: {},
};
