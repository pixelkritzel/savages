import { SIweapon } from 'store/weapons/weaponModel';

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
