import { createSet } from 'lib/state/createSet';
import { IskillsCollection, skillsCollection } from './../skills/skillsCollection';
import { createBoxedArray } from 'lib/state/createBoxedArray';
import { types, Instance, SnapshotIn, SnapshotOut, getRoot } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';

import { modifierModel } from 'store/modifiers/modifierModel';

import { createDamageScaffold, damageModel } from '../settings/damageModel';
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

export const weaponTypeFields = {
  melee: false,
  throwable: false,
  shotgun: false,
  ranged: false,
} as const;

const weaponTypeModel = types.model('weaponTypeModel', weaponTypeFields).actions((self) => ({
  set<K extends keyof Instance<typeof self>, T extends Instance<typeof self>>(key: K, value: T[K]) {
    self[key] = value;
  },
}));

export const weaponModel = types
  .model('weaponModel', {
    _id: types.identifier,
    name: types.string,
    damage: damageModel,
    notes: '',
    weaponType: weaponTypeModel,
    specializations: types.model({
      athletics: createSet('', types.string),
      fighting: createSet('', types.string),
      shooting: createSet('', types.string),
    }),
    range: types.optional(createBoxedArray('', types.number), { array: [0, 0, 0] }),
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
    modifiers: createBoxedArray('', types.reference(modifierModel)),
  })
  .views((self) => ({
    get isRangedWeapon() {
      return this.isShootingWeapon || self.weaponType.throwable;
    },
    get isShootingWeapon() {
      return self.weaponType.shotgun || self.weaponType.ranged;
    },
    get isMeleeWeapon() {
      return self.weaponType.melee;
    },
    isForSkill(skillName: string) {
      switch (skillName) {
        case 'athletics':
          return self.weaponType.throwable;
        case 'fighting':
          return self.weaponType.melee;
        case 'shooting':
          return self.weaponType.shotgun || self.weaponType.ranged;
        default:
          return false;
      }
    },
    get availableSkills() {
      return ['athletics', 'fighting', 'shooting'] as const;
      // return (['athletics', 'fighting', 'shooting'] as const).filter((skillName) =>
      //   this.isForSkill(skillName)
      // );
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
export interface SOweapon extends SnapshotOut<typeof weaponModel> {}

export function createWeaponScaffold(value?: Partial<SIweapon>): SIweapon {
  return {
    _id: uuidv4(),
    name: '',
    modifiers: { array: [] as any[] },
    damage: createDamageScaffold(),
    weaponType: {},
    specializations: {
      athletics: { array: [] },
      fighting: { array: [] },
      shooting: { array: [] },
    },
  };
}
