import { SIedgeModel } from 'store/settings/settingEdgeModel';

export const nervesOfSteel: SIedgeModel = {
  id: 'nerves_of_steel',
  name: 'Nerves of Steel',
  summary: 'Ignore one level of Wound penalties',
  description: `Your hero has learned to fight on through the
  most intense pain. He may ignore 1 point of Wound penalties.`,
  requirements: {
    rank: 'novice',
    attributes: [{ attributeName: 'vigor', value: 8 }],
    skills: [],
  },
  modifiers: [
    {
      optional: true,
      conditions: 'Ignore one level of Wound penalties',
      traitModifiers: [],
      ignoreWounds: 1,
    },
  ],
};
