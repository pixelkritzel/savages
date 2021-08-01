import { SIskillSetting } from 'store/settings/settingSkillModel';

export const taunt: SIskillSetting = {
  _id: 'taunt',
  name: 'Taunt',
  description: `Taunt attacks a person’s pride through ridicule, cruel jests, or oneupmanship.

    Taunt is an opposed roll resisted by the opponent’s Smarts. In combat, this is a [Test](compendium/actions/test).

    Out of combat, success means the defender backs down, slinks away, or starts a fight. A raise might leave the victim cowed for the remainder of the scene, or make her storm out of the area fuming or even in tears, or attack her tormentor recklessly (perhaps with a Wild Attack on the first round of combat).

    A Critical Failure means the target is immune to this character’s Taunts for the remainder of the encounter.`,
  associatedAttribute: 'smarts',
};
