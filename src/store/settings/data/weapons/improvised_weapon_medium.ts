import { SIweapon } from 'store/settings/settingWeaponModel';

export const improvisedWeaponMedium: SIweapon = {
  id: 'improvised_weapon_medium',
  name: 'Improvised Weapon: Medium',
  weaponType: ['melee', 'throwable'],
  range: [2, 4, 8],
  minimumStrength: 6,
  isImprovisedWeapon: true,
  damage: {
    dices: [{ sides: 6, numberOfDices: 1 }],
    strength: true,
    bonus: 0,
  },
};
