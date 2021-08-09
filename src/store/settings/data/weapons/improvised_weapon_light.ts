import { SIweapon } from 'store/weapons/weaponModel';

export const improvisedWeaponLight: SIweapon = {
  _id: 'improvised_weapon_light',
  name: 'Improvised Weapon: Light',
  weaponType: ['melee', 'throwable'],
  range: [3, 6, 12],
  minimumStrength: 4,
  isImprovisedWeapon: true,
  damage: {
    dices: [{ sides: 4, numberOfDices: 2 }],
    strength: true,
    bonus: 0,
  },
  specializations: {
    athletics: { array: [] },
    fighting: { array: [] },
    shooting: { array: [] },
  },
};
