import { SIhindrance } from 'store/settings/settingHindranceModel';

export const anemic: SIhindrance = {
  id: 'anemic',
  name: 'Anemic',
  impact: 'minor',
  summary: '–2 Vigor when resisting Fatigue.',
  description: `Anemic characters are particularly susceptible to sickness, disease, environmental effects, and fatigue. They subtract 2 from Vigor rolls made to resist Fatigue.`,
  modifiers: [
    {
      id: '',
      reason: 'Anemic',
      traitNames: ['vigor'],
      isOptional: true,
      conditions: '–2 Vigor when resisting Fatigue.',
      traitModifiers: [{ type: 'attribute', traitName: 'vigor', bonusValue: -2 }],
    },
  ],
};
