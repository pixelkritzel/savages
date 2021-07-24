import { SIhindrance } from 'store/settings/settingHindranceModel';

export const test_die_difference: SIhindrance = {
  id: 'test_die_difference',
  name: 'test_die_difference',
  impact: 'major',
  summary: '',
  description: ``,
  modifiers: [
    {
      reason: 'test_die_difference',
      isOptional: true,
      traitModifiers: [
        { type: 'attribute', traitName: 'agility', bonusDice: -2 },
        { type: 'skill', traitName: 'common_knowledge', bonusDice: -1 },
      ],
    },
  ],
};
