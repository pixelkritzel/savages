import { SIedge } from 'store/edges/edgeModel';

export const giantKiller: SIedge = {
  _id: 'giant_killer',
  name: 'Giant Killer',
  summary: '+1d6 damage vs. creatures three Sizes larger or more.',
  description: `The bigger they are, the harder they are to kill. At least for most. Your hero knows how to find the weak points in the most massive of foes.

  He adds +1d6 damage when attacking creatures who are three or more Sizes larger than himself (see Size, page 178). A human (Size 0) gets the bonus against a creature of Size 3 or greater.`,
  requirements: {
    rank: 'veteran',
    attributes: [],
    skills: [],
  },
  modifiers: [],
};
