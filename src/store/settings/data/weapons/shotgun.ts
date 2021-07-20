import { SIweapon } from 'store/settings/settingWeaponModel';

export const shotgun: SIweapon = {
  id: 'shotgun',
  name: 'Shotgun',
  range: [12, 24, 48],
  weaponType: ['shotgun'],
  damage: {
    dices: [{ sides: 6, numberOfDices: 2 }],
  },
  armorPiercing: 1,
  rateOfFire: 1,
  shots: 30,
  minimumStrength: 6,
  weight: 10,
  cost: 300,
};
