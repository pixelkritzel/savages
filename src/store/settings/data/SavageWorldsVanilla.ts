import { nervesOfSteel } from './edges/nerves_of_steel';
import { strongWilled } from './edges/strongWilled';
import { SIsetting } from './../settingModel';

export const vanillaSetting: SIsetting = {
  id: 'vanilla-rules',
  name: 'Savage Worlds Vanilla Rules',
  creation: {
    attributePoints: 5,
  },
  availableEdges: [strongWilled, nervesOfSteel],
  availableSkills: [
    {
      id: 'fighting',
      name: 'Fighting',
      description:
        'Fighting covers all hand-to-hand (melee) attacks, whether it’s with fists, axes, laser swords, or martial arts. See Chapter Three for the combat rules and the various maneuvers a warrior might attempt.',
      associatedAttribute: 'agility',
    },
    {
      id: 'taunt',
      name: 'Taunt',
      description: `Taunt attacks a person’s pride through ridicule, cruel jests, or oneupmanship.

        Taunt is an opposed roll resisted by the opponent’s Smarts. In combat, this is a [Test](compendium/actions/test).

        Out of combat, success means the defender backs down, slinks away, or starts a fight. A raise might leave the victim cowed for the remainder of the scene, or make her storm out of the area fuming or even in tears, or attack her tormentor recklessly (perhaps with a Wild Attack on the first round of combat).

        A Critical Failure means the target is immune to this character’s Taunts for the remainder of the encounter.`,
      associatedAttribute: 'smarts',
    },
  ],
};
