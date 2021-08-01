import { SImodifier } from '../modifierModel';

export const anemicMod1: SImodifier = {
  _id: 'anemic_mod_1',
  reason: 'Anemic',
  traitNames: ['vigor'],
  isOptional: true,
  conditions: '–2 Vigor when resisting Fatigue.',
  traitModifiers: [{ type: 'attribute', traitName: 'vigor', bonusValue: -2 }],
};
