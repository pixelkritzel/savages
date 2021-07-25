import { SIcharacter } from 'store/characters';

export const single_character_mock: SIcharacter = {
  id: 'jerjer',
  name: 'Jerjer Johannson',
  wildcard: true,
  setting: 'vanilla-rules',
  race: 'human',
  attributes: {
    agility: { name: 'agility', dice: 10, bonus: 2, type: 'attribute' },
    smarts: { name: 'smarts', type: 'attribute' },
    spirit: { name: 'spirit', type: 'attribute' },
    strength: { name: 'strength', type: 'attribute' },
    vigor: { name: 'vigor', type: 'attribute' },
  },
  skills: {
    athletics: {
      type: 'skill',
      settingSkill: 'athletics',
      dice: 10,
      bonus: 0,
    },
    fighting: {
      type: 'skill',
      settingSkill: 'fighting',
      specializations: ['unarmed'],
      dice: 10,
      bonus: 0,
    },
    shooting: {
      type: 'skill',
      settingSkill: 'shooting',
      specializations: ['shortarms', 'longarms'],
      dice: 10,
      bonus: 0,
    },
    taunt: {
      type: 'skill',
      settingSkill: 'taunt',
      dice: 4,
      bonus: -2,
    },
    notice: {
      type: 'skill',
      settingSkill: 'notice',
      dice: 4,
      bonus: 0,
    },
    commonKnowledge: {
      type: 'skill',
      settingSkill: 'common_knowledge',
      dice: 8,
      bonus: 0,
    },
  },
  edges: ['strong_willed', 'nerves_of_steel', 'double_tap', 'giant_killer'],
  hindrances: ['clueless', 'anemic', 'test_die_difference'],
  weapons: [
    'ranged_weapon_tommy_gun',
    'ranged_weapon_timmy_gun',
    'unarmed',
    'shotgun',
    'improvised_weapon_light',
    'improvised_weapon_medium',
    'improvised_weapon_heavy',
  ],
  runningDice: {
    type: 'runningDice',
    name: 'Running',
    dice: 6,
    bonus: 0,
  },
  basePowerPoints: 20,
  currentPowerPoints: 12,
  currentlyHoldWeapon: 'ranged_weapon_tommy_gun',
  hasPowers: true,
  powers: {
    protection: {
      name: 'Protection',
      rank: 'Novice',
      powerPoints: 1,
      range: 'Smarts',
      duration: '5',
      trapping: 'Some watery air appaers',
      summary: 'Grants Armor +2/+4.',
      description: `*Protection* creates a field of energy or armor around a character, giving him 2 points of Armor, or +4 with a raise.

      Whether the *protection* is visible or not depends on the Trapping — this is entirely up to the caster.

      *Protection* stacks with all other armor, natural or worn, and is negated by AP as usual.`,
      modifiers: [
        {
          name: 'ADDITIONAL RECIPIENTS',
          powerPoints: 1,
          description: 'The power may affect additional targets at a cost of 1 Power Point each.',
        },
      ],
    },
  },
};
