import { SIweapon } from 'store/weapons/weaponModel';

export const tommyGun: SIweapon = {
  _id: 'ranged_weapon_tommy_gun',
  name: 'Tommy Gun (.45)',
  range: [12, 24, 48],
  weaponType: ['ranged'],
  damage: {
    dices: [{ sides: 6, numberOfDices: 2 }],
  },
  armorPiercing: 1,
  specialization: 'longarms',
  rateOfFire: 3,
  shots: 30,
  minimumStrength: 6,
  weight: 10,
  isTwoHanded: true,
  cost: 300,
  modifiers: [],
};
