import { SImodifier } from '../modifierModel';

export const moreReach: SImodifier = {
  _id: 'more_reach',
  name: 'More Reach',
  isOptional: true,
  conditions: '+1d6 damage vs. creatures three Sizes larger or more',
  traitNames: { array: ['shooting'] },
  traitModifiers: { array: [] },
  technicalConditions: { array: [] },
  rangeModifier: { skill: 'shooting', range: [100, 100, 100] },
};
