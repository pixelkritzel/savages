import { SImodifier } from '../modifierModel';

export const cluelessMod1: SImodifier = {
  _id: 'cluessless_mod_1',
  reason: 'Clueless',
  isOptional: false,
  traitNames: { array: ['notice', 'common_knowledge'] },
  traitModifiers: {
    array: [
      { type: 'skill', traitName: 'notice', bonusValue: -1 },
      { type: 'skill', traitName: 'common_knowledge', bonusValue: -1 },
    ],
  },
};
