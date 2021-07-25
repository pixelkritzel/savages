import { SIweapon } from 'store/settings/settingWeaponModel';

export const improvisedWeaponHeavy: SIweapon = {
  id: 'improvised_weapon_heavy',
  name: 'Improvised Weapon: Heavy',
  weaponType: ['melee', 'throwable'],
  range: [1, 2, 4],
  minimumStrength: 8,
  isImprovisedWeapon: true,
  damage: {
    dices: [{ sides: 8, numberOfDices: 1 }],
    strength: true,
    bonus: 0,
  },
};
