import { SIsetting } from './../settingModel';

export const vanillaSetting: SIsetting = {
  _id: 'vanilla_setting',
  name: 'Savage Worlds Vanilla Rules',
  creation: {
    attributePoints: 5,
  },
  availableEdges: { array: [] },
  availableHindrances: { array: [] },
  availableSkills: {
    array: [],
  },
  availableWeapons: {
    array: [
      // unarmed,
      // improvisedWeaponLight,
      // improvisedWeaponMedium,
      // improvisedWeaponHeavy,
    ],
  },
  availablePowers: { array: [] },
  rules: {
    skillSpezializations: ['fighting', 'shooting'],
  },
};
