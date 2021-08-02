import { SImodifier } from '../modifierModel';

export const giantKillerMod1: SImodifier = {
  _id: 'giant_killer_mod_1',
  isOptional: true,
  conditions: '+1d6 damage vs. creatures three Sizes larger or more',
  traitNames: { array: ['shooting', 'fighting', 'athletics'] },
  traitModifiers: { array: [] },
  bonusDamageDices: { 4: 0, 6: 1, 8: 0, 10: 0, 12: 0 },
  technicalConditions: { array: [] },
};
