import { SIweapon } from 'store/settings/settingWeaponModel';

export const tommyGun: SIweapon = {
  id: 'ranged_weapon_tommy_gun',
  name: 'Tommy Gun (.45)',
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
  modifiers: [
    {
      name: 'Fore Grip',
      ignoreRecoil: 1,
      optional: false,
    },
    {
      name: 'Scope',
      optional: true,
      traitModifiers: [
        {
          type: 'skill',
          traitName: 'shooting',
          bonusValue: 2,
          technicalConditions: {
            aimingOptions: 'ignore',
          },
        },
      ],
    },
    {
      name: 'Laser Dot',
      optional: true,
      traitModifiers: [
        {
          type: 'skill',
          traitName: 'shooting',
          bonusValue: 1,
          technicalConditions: [
            {
              range: '0',
            },
            { range: '-2' },
          ],
        },
      ],
    },
  ],
};
