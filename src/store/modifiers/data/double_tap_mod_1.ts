import { SImodifier } from '../modifierModel';

export const doubleTapMod1: SImodifier = {
  _id: 'double_tap_mod_1',
  isOptional: true,
  conditions: '+1 to hit and damage when firing no more than RoF 1 per action.',
  traitNames: { array: ['shooting'] },
  traitModifiers: {
    array: [
      {
        type: 'skill',
        traitName: 'shooting',
        bonusValue: 1,
      },
    ],
  },
  bonusDamage: 1,
  bonusDamageDices: { 4: 1, 6: 2, 8: 3, 10: 4, 12: 5 },
  technicalConditions: { array: [{ rateOfFire: 1 }] },
};
