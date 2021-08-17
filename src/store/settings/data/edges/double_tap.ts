import { SIedge } from 'store/edges/edgeModel';

export const doubleTap: SIedge = {
  _id: 'double_tap',
  name: 'Double Tap',
  summary: '+1 to hit and damage when firing no more than RoF 1 per action.',
  description: `Experienced firearms experts fire two shots in rapid succession without spoiling their aim.

  Double Tap can only be used with weapons that have a Rate of Fire of 1 and can fire two shots without needing to manually reload. It adds +1 to hit and damage at the cost of one extra bullet. This is per action, so a shooter can Double Tap more than once if she performs a Multi-Action.

  Double Tap cannot be combined with Rapid Fire.

  If used with a weapon capable of Three Round Burst (see page 67), it adds +2 to Shooting and damage instead of +1 and expends six bullets.`,
  requirements: {
    rank: 'seasoned',
    attributes: [],
    skills: [{ skillName: 'shooting', value: 6 }],
  },
  modifiers: [],
};
