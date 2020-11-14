import { Instance, types } from 'mobx-state-tree';

export const rangedWeapon = types.model('rangedWeapon', {
  id: types.identifier,
  name: types.optional(types.string, ''),
});

export interface IrangedWeapon extends Instance<typeof rangedWeapon> {}
