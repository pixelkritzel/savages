import { createSkillScaffold, SIskill } from 'store/skills';

export const fighting: SIskill = {
  ...createSkillScaffold(),
  _id: 'fighting',
  name: 'Fighting',
  description:
    'Fighting covers all hand-to-hand (melee) attacks, whether it’s with fists, axes, laser swords, or martial arts. See Chapter Three for the combat rules and the various maneuvers a warrior might attempt.',
  associatedAttribute: 'agility',
  availableSkillSpezializations: { array: [{ _id: 'unarmed', name: 'Unarmed' }] },
};
