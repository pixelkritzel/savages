import { SIweapon } from 'store/settings/settingWeaponModel';

export const timmyGun: SIweapon = {
  id: 'ranged_weapon_timmy_gun',
  name: 'Timmy Gun (.45)',
  range: [12, 24, 48],
  weaponType: ['ranged'],
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
