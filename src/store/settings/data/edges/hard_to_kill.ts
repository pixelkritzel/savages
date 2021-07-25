import { SIedgeModel } from 'store/settings/settingEdgeModel';

export const hardToKill: SIedgeModel = {
  id: 'hard_to_kill',
  name: 'Hard To Kill',
  summary: 'Ignore one level of Wound penalties',
  description: `This adventurer has more lives than a herd of cats. He may ignore his Wound penalties when making Vigor rolls to avoid Bleeding Out (see page 95).`,
  requirements: {
    rank: 'novice',
    attributes: [{ attributeName: 'spirit', value: 8 }],
    skills: [],
  },
  modifiers: [
    {
      isOptional: true,
      traitNames: ['vigot'],
      conditions: 'Ignore Wound penalties when making Vigor rolls to avoid Bleeding Out.',
      traitModifiers: [],
      ignoreWounds: 3,
    },
  ],
};
