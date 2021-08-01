import { SIskillSetting } from 'store/settings/settingSkillModel';

export const notice: SIskillSetting = {
  _id: 'notice',
  name: 'Notice',
  description: `Notice is a hero’s general awareness and alertness. It’s used to sense sights, sounds, tastes, and smells, spot clues, detect ambushes, spot hidden weapons on a foe, or tell if a rival is lying, frightened, happy, etc.

  Success conveys basic information—the character hears movement in the forest, smells distant smoke, or senses someone isn’t being completely truthful.

  A raise grants more detail, such as the direction of a sound or odor or what topic a person is avoiding or lying about.`,
  associatedAttribute: 'smarts',
};
