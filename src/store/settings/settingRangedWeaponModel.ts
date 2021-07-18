import { damageModel } from './damageModel';
import { modifierModel } from 'store/modifier/modifierModel';
import { Instance, types, SnapshotIn, IAnyStateTreeNode, getType } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';

export const settingRangedWeaponModel = types
  .model('rangedWeaponModel', {
    id: types.optional(types.identifier, uuidv4),
    name: types.string,
    notes: '',
    isShotgun: false,
    specialization: '',
    range: types.array(types.number),
    damage: damageModel,
    armorPiercing: 0,
    rateOfFire: 1,
    shots: 1,
    minimumStrength: 4,
    weight: 1,
    cost: 100,
    modifiers: types.array(modifierModel),
  })
  .actions((self) => ({
    set<K extends keyof Instance<typeof self>, T extends Instance<typeof self>>(
      key: K,
      value: T[K]
    ) {
      self[key] = value;
    },
  }));

export interface IrangedWeapon extends Instance<typeof settingRangedWeaponModel> {}
export interface SIrangedWeapon extends SnapshotIn<typeof settingRangedWeaponModel> {}

export function isRangedWeapon(weapon: IAnyStateTreeNode): weapon is IrangedWeapon {
  return getType(weapon) === settingRangedWeaponModel;
}
