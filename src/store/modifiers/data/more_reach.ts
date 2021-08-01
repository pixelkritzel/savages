import { SImodifier } from '../modifierModel';

export const moreReach: SImodifier = {
  _id: 'more_reach',
  name: 'More Reach',
  isOptional: true,
  conditions: '+1d6 damage vs. creatures three Sizes larger or more',
  traitNames: ['shooting'],
  traitModifiers: [],
  bonusDamageDices: [6],
  technicalConditions: [],
  rangeModifiers: [
    { skill: 'shooting', range: [100, 100, 100] },
    { skill: 'shooting', range: [1000, 1000, 1000] },
  ],
};
