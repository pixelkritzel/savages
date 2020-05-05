import { types } from 'mobx-state-tree';

export const rangedWeapon = types.model('rangedWeapon', {
  id: types.identifier,
  name: types.optional(types.string, ''),
});
