import { types } from 'mobx-state-tree';
import { v4 as uuid4 } from 'uuid';

export const powerModel = types.model('powerModel', {
  id: types.optional(types.identifier, uuid4),
  name: types.string,
});
