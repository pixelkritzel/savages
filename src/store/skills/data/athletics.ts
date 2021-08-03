import { createSkillScaffold, SIskill } from 'store/skills';

export const athletics: SIskill = {
  ...createSkillScaffold(),
  _id: 'athletics',
  name: 'Athletics',
  description:
    'Athletics combines an individual’s coordination with learned skills such as climbing, jumping, balancing, biking, wrestling, skiing, swimming, throwing, or catching. Characters who rely on physical power more than coordination can take the Brute Edge (page 38) to link this skill to Strength instead of Agility.',
  associatedAttribute: 'agility',
};
