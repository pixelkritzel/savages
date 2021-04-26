import { v4 as uuid4 } from 'uuid';

import { OnlyProperties } from 'lib/types/OnlyProperties';

export interface BaseModelParams {
  id?: string;
  [key: string]: any;
}

export class BaseModel {
  id: string;
  readonly __IS_BASE_MODEL_INSTANCE = true;

  constructor(params: BaseModelParams = {}) {
    Object.assign(this, params);
    this.id = params.id ?? uuid4();
  }

  set(key: keyof Omit<OnlyProperties<this>, 'id'>, value: this[typeof key]) {
    this[key] = value;
  }
}
