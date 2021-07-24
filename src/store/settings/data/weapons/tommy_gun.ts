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
  specialization: 'longarms',
  rateOfFire: 3,
  shots: 30,
  minimumStrength: 6,
  weight: 10,
  cost: 300,
  modifiers: [
    {
      name: 'Foregrip',
      ignoreRecoil: 1,
      isOptional: false,
    },
    {
      name: 'Scope',
      isOptional: true,
      aimingHelp: 2,
    },
    {
      name: 'Laser Dot',
      isOptional: true,
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
