import { SnapshotIn, SnapshotOut } from 'mobx-state-tree';
import { Tmodel } from 'lib/state';

export function createPouchAdapter<ModelType extends Tmodel>(db: PouchDB.Database<ModelType>) {
  type SIModelType = SnapshotIn<ModelType>;
  type SOModelType = SnapshotOut<ModelType>;
  async function loadAll() {
    return ((await db.allDocs({ include_docs: true })).rows
      .map(({ doc }) => doc)
      .filter((doc) => Boolean(doc)) as unknown) as SIModelType[];
  }

  async function add<T extends SOModelType | SIModelType>(
    model: T
  ): Promise<SOModelType | SIModelType> {
    await db.put<SOModelType>(model as any);
    return await db.get(model._id);
  }

  async function set<T extends SOModelType | SIModelType>(
    id: string,
    model: T
  ): Promise<SOModelType | SIModelType> {
    const storedModel = await db.get<SOModelType>(id);
    const updatedModel = { ...storedModel, ...model };
    await db.put<SOModelType>(updatedModel as any);
    return await db.get(model._id);
  }

  async function deleteFn(id: string) {
    const pouchModel = await db.get(id);
    return db.remove(pouchModel);
  }

  return {
    add,
    delete: deleteFn,
    loadAll,
    set,
  };
}
