import { SIweapon } from 'store/settings/settingWeaponModel';

export const unarmed: SIweapon = {
  _id: 'unarmed',
  name: 'Unarmed',
  weaponType: ['melee'],
  damage: {
    dices: [],
    strength: true,
    bonus: 0,
  },
};
