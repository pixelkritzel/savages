import { SIrangedWeapon } from 'store/settings/settingRangedWeaponModel';

export const tommyGun: SIrangedWeapon = {
  id: 'ranged_weapon_tommy_gun',
  name: 'Tommy Gun (.45)',
  range: [12, 24, 48],
  damage: {
    dices: [{ sides: 6, numberOfDices: 2 }],
  },
  armorPiercing: 1,
  rateOfFire: 3,
  shots: 30,
  minimumStrength: 6,
  weight: 10,
  cost: 300,
};
