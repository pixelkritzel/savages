import { SIcharacter } from 'store/characters';

export const single_character_mock: SIcharacter = {
  id: 'jerjer',
  name: 'Jerjer Johannson',
  setting: 'vanilla-rules',
  attributes: {
    agility: { name: 'agility' },
    smarts: { name: 'smarts' },
    spirit: { name: 'spirit' },
    strength: { name: 'strength' },
    vigor: { name: 'vigor' },
  },
  skills: {
    fighting: {
      name: 'fighting',
      dice: 10,
      bonus: 0,
    },
  },
  runningDice: {
    name: 'running',
    dice: 6,
    bonus: 0,
  },
};
