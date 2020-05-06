import { types, Instance } from 'mobx-state-tree';

export const meleeWeapon = types.model('meleeWeapon', {
  id: types.identifier,
  name: types.optional(types.string, ''),
});

export type ImeleeWeapon = Instance<typeof meleeWeapon>;
