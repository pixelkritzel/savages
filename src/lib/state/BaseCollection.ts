import { persistence } from 'lib/persistence';
import { action, computed, observable, runInAction } from 'mobx';

import { BaseModel, BaseModelParams } from './BaseModel';

export class BaseCollection<
  GenericModelType extends BaseModel,
  GenericParamsType extends BaseModelParams
> {
  constructor(
    public readonly name: string,
    private Model: new (params: GenericParamsType) => GenericModelType,
    private modelScaffold: GenericParamsType
  ) {
    queueMicrotask(() => this.loadCollection());
  }

  @observable
  private all: Map<string, GenericModelType> = new Map();

  @observable
  public isLoaded = false;

  @observable
  public newModel?: GenericModelType;

  @computed
  get asArray() {
    return Array.from(this.all).map(([, value]) => value);
  }

  @action
  add = (params: GenericParamsType) => {
    const newModel = new this.Model(params ?? this.modelScaffold);
    this.all.set(newModel.id, newModel);
  };

  @action
  deleteModel(id: GenericModelType['id']) {
    this.all.delete(id);
    persistence.deleteItem(this.name, id);
  }

  @action
  discardNewModel() {
    this.newModel = undefined;
  }

  @action
  get = (id: GenericModelType['id']) => {
    const model = this.all.get(id);
    if (!model) {
      throw new Error(`Model ${id} was not found!`);
    }
    return model;
  };

  @action
  loadCollection = async () => {
    const collectionData = await persistence.loadCollection(this.name);
    collectionData.forEach((modelData) => this.set(modelData));
    runInAction(() => (this.isLoaded = true));
  };

  @action
  new = (params?: GenericParamsType) => {
    this.newModel = new this.Model(params ?? this.modelScaffold);
  };

  @action
  saveNewModel = async () => {
    if (this.newModel) {
      this.all.set(this.newModel.id, this.newModel);
      try {
        await persistence.saveItem(this.name, this.newModel);
      } catch (e) {
        return 'ERROR';
      }
      this.discardNewModel();
      return 'SUCCESS';
    }
    return 'ERROR';
  };

  @action
  set(modelOrParams: (GenericModelType & { id: string }) | (GenericParamsType & { id: string })) {
    this.all.set(
      modelOrParams.id,
      // @ts-ignore
      modelOrParams.__IS_BASE_MODEL_INSTANCE ? modelOrParams : new this.Model(modelOrParams)
    );
  }
}
