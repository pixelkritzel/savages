import { SImodifier } from '../modifierModel';

export const doubleTapMod1: SImodifier = {
  _id: 'double_tap_mod_1',
  isOptional: true,
  conditions: '+1 to hit and damage when firing no more than RoF 1 per action.',
  traitNames: ['shooting'],
  traitModifiers: [
    {
      type: 'skill',
      traitName: 'shooting',
      bonusValue: 1,
    },
  ],
  bonusDamage: 1,
  technicalConditions: [{ rateOfFire: 1 }],
};
