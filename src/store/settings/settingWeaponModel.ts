import { types, Instance, SnapshotIn } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';

import { modifierModel } from 'store/modifier/modifierModel';

import { damageModel } from './damageModel';

export const WEAPON_TYPES = ['melee', 'throwable', 'shotgun', 'ranged'] as const;

export const weaponModel = types
  .model('weaponModel', {
    id: types.optional(types.identifier, uuidv4),
    name: types.string,
    damage: types.late(() => damageModel),
    notes: '',
    weaponType: types.array(types.enumeration([...WEAPON_TYPES])),
    specialization: '',
    range: types.optional(types.array(types.number), []),
    isImprovisedWeapon: false,
    isTwoHanded: false,
    armorPiercing: 0,
    rateOfFire: 1,
    shots: 1,
    minimumStrength: 4,
    weight: 1,
    cost: 100,
    modifiers: types.array(modifierModel),
  })
  .views((self) => ({
    get isRangedWeapon() {
      return (
        self.weaponType.includes('shotgun') ||
        self.weaponType.includes('ranged') ||
        self.weaponType.includes('throwable')
      );
    },
    get isMeleeWeapon() {
      return self.weaponType.includes('melee');
    },
    isForSkill(skillName: string) {
      switch (skillName) {
        case 'athletics':
          return self.weaponType.includes('throwable');
        case 'fighting':
          return self.weaponType.includes('melee');
        case 'shooting':
          return self.weaponType.includes('shotgun') || self.weaponType.includes('ranged');
        default:
          return false;
      }
    },
  }))
  .actions((self) => ({
    set<K extends keyof Instance<typeof self>, T extends Instance<typeof self>>(
      key: K,
      value: T[K]
    ) {
      self[key] = value;
    },
  }));

export interface Iweapon extends Instance<typeof weaponModel> {}
export interface SIweapon extends SnapshotIn<typeof weaponModel> {}
