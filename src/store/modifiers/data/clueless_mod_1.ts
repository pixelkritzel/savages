import { SImodifier } from '../modifierModel';

export const cluelessMod1: SImodifier = {
  id: 'cluessless_mod_1',
  reason: 'Clueless',
  isOptional: false,
  traitNames: ['notice', 'common_knowledge'],
  traitModifiers: [
    { type: 'skill', traitName: 'notice', bonusValue: -1 },
    { type: 'skill', traitName: 'common_knowledge', bonusValue: -1 },
  ],
};
