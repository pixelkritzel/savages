import { damageModel } from './damageModel';
import { types, Instance, SnapshotIn } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';

export const settingMeleeWeaponModel = types.model('settingMeleeWeaponModel', {
  id: types.optional(types.identifier, uuidv4),
  name: types.string,
  damage: damageModel,
});

export interface ImeleeWeapon extends Instance<typeof settingMeleeWeaponModel> {}
export interface SImeleeWeapon extends SnapshotIn<typeof settingMeleeWeaponModel> {}
