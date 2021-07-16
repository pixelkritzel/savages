import { SIedgeModel } from 'store/settings/settingEdgeModel';

export const strongWilled: SIedgeModel = {
  id: 'strong_willed',
  name: 'Strong Willed',
  summary: '+2 to resist Smarts or Spirit-based Tests.',
  description: `Self-confidence is powerful armor against those who attempt to attack this individual’s will. He adds +2 to his total when resisting Tests with Smarts or Spirit.`,
  requirements: {
    rank: 'novice',
    attributes: [{ attributeName: 'spirit', value: 8 }],
    skills: [],
  },
  modifiers: [
    {
      optional: true,
      conditions: 'Resisting Smarts or Spirit-based Tests',
      traitModifiers: [
        {
          type: 'attribute',
          traitName: 'spirit',
          bonusValue: 2,
        },
        {
          type: 'attribute',
          traitName: 'smarts',
          bonusValue: 2,
        },
      ],
    },
  ],
};
