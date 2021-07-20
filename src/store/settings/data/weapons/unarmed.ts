import { SIweapon } from 'store/settings/settingWeaponModel';

export const unarmed: SIweapon = {
  id: 'unarmed',
  name: 'Unarmed',
  weaponType: ['melee'],
  damage: {
    dices: [],
    strength: true,
    bonus: 0,
  },
};
