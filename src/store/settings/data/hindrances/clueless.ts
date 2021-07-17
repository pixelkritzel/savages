import { SIhindrance } from 'store/settings/settingHindranceModel';

export const clueless: SIhindrance = {
  id: 'clueless',
  name: 'Clueless',
  impact: 'major',
  summary: '–1 to Common Knowledge and Notice rolls.',
  description: `Your hero doesn’t pay much attention to the world around him and can’t seem to find
  a haystack in a small pile of needles.

  He suffers a −1 penalty to Common Knowledge and Notice rolls.`,
  modifiers: [
    {
      reason: 'Clueless',
      optional: false,
      traitModifiers: [
        { type: 'skill', traitName: 'notice', bonusValue: -1 },
        { type: 'skill', traitName: 'common_knowledge', bonusValue: -1 },
      ],
    },
  ],
};
