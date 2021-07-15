import { SIcharacter } from 'store/characters';

export const single_character_mock: SIcharacter = {
  id: 'jerjer',
  name: 'Jerjer Johannson',
  setting: 'vanilla-rules',
  race: 'human',
  attributes: {
    agility: { name: 'agility', dice: 10, bonus: 2 },
    smarts: { name: 'smarts' },
    spirit: { name: 'spirit' },
    strength: { name: 'strength' },
    vigor: { name: 'vigor' },
  },
  skills: {
    fighting: {
      settingSkill: 'fighting',
      specializations: ['unarmed'],
      dice: 10,
      bonus: 0,
    },
    taunt: {
      settingSkill: 'taunt',
      dice: 4,
      bonus: -2,
    },
  },
  runningDice: {
    name: 'Running',
    dice: 6,
    bonus: 0,
  },
  basePowerPoints: 20,
  currentPowerPoints: 12,
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
