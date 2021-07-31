import { SImodifier } from '../modifierModel';

export const giantKillerMod1: SImodifier = {
  id: 'giant_killer_mod_1',
  isOptional: true,
  conditions: '+1d6 damage vs. creatures three Sizes larger or more',
  traitNames: ['shooting', 'fighting', 'athletics'],
  traitModifiers: [],
  bonusDamageDices: [6],
  technicalConditions: [],
};
