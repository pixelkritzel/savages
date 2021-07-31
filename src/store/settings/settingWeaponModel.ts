import { types, Instance, SnapshotIn } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';

import { modifierModel } from 'store/modifier/modifierModel';

import { damageModel } from './damageModel';
import { diceType } from 'store/consts';

export const WEAPON_TYPES = ['melee', 'throwable', 'shotgun', 'ranged'] as const;

const SPENT_AMMUNITION_BY_RATE_FIRE = {
  1: 1,
  2: 5,
  3: 10,
  4: 20,
  5: 40,
  6: 50,
} as const;

export function getSpentAmmunitionByRateOfFire({
  rateOfFire,
  isThreeRoundBurst,
}: {
  rateOfFire: keyof typeof SPENT_AMMUNITION_BY_RATE_FIRE;
  isThreeRoundBurst: boolean;
}) {
  return rateOfFire === 1 && isThreeRoundBurst ? 3 : SPENT_AMMUNITION_BY_RATE_FIRE[rateOfFire];
}

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
    isThreeRoundBurstSelectable: false,
    armorPiercing: 0,
    rateOfFire: types.optional(
      types.union(
        types.literal(1),
        types.literal(2),
        types.literal(3),
        types.literal(4),
        types.literal(5),
        types.literal(6)
      ),
      1
    ),
    shots: 1,
    spentAmmunition: 0,
    minimumStrength: types.optional(diceType, 4),
    weight: 1,
    cost: 100,
    modifiers: types.array(types.reference(modifierModel)),
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
    get remainingAmmunition() {
      return self.shots - self.spentAmmunition;
    },
    get maxRateOfFire() {
      return Object.values(SPENT_AMMUNITION_BY_RATE_FIRE)
        .sort((a, b) => a - b)
        .filter((bullets) => bullets <= self.shots).length;
    },
  }))
  .actions((self) => ({
    set<K extends keyof Instance<typeof self>, T extends Instance<typeof self>>(
      key: K,
      value: T[K]
    ) {
      self[key] = value;
    },
    shoot({ rateOfFire, isThreeRoundBurst }: Parameters<typeof getSpentAmmunitionByRateOfFire>[0]) {
      self.spentAmmunition =
        self.spentAmmunition + getSpentAmmunitionByRateOfFire({ rateOfFire, isThreeRoundBurst });
    },
    reload() {
      self.spentAmmunition = 0;
    },
  }));

export interface Iweapon extends Instance<typeof weaponModel> {}
export interface SIweapon extends SnapshotIn<typeof weaponModel> {}
