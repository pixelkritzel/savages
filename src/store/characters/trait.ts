import { Instance, types } from 'mobx-state-tree';

export const DICE_TYPES: Itrait['dice'][] = ['D4', 'D6', 'D8', 'D10', 'D12'];
export const BONI_TYPES: Itrait['bonus'][] = ['-2', '-1', '0', '+1', '+2', '+3', '+4'];

export const diceType = types.enumeration(['D4', 'D6', 'D8', 'D10', 'D12']);
export const bonusType = types.enumeration(['-2', '-1', '0', '+1', '+2', '+3', '+4']);

// const modifier = {
//   strength: {
//     dice: 'D6',
//     maximum: {
//       bonus: '+1',
//     },
//   },
// };

export const trait = types
  .model('trait', {
    name: types.identifier,
    dice: types.optional(diceType, 'D4'),
    bonus: types.optional(bonusType, '0'),
    minimum: types.optional(
      types.model({
        dice: diceType,
        bonus: bonusType,
      }),
      { dice: 'D4', bonus: '0' }
    ),
    maximum: types.optional(
      types.model({
        dice: diceType,
        bonus: bonusType,
      }),
      { dice: 'D12', bonus: '0' }
    ),
  })
  .views((self) => ({
    get isDecrementable(): boolean {
      return !(self.dice === self.minimum.dice && self.bonus === self.minimum.bonus);
    },
    get isIncrementable() {
      return !(self.dice === self.maximum.dice && self.bonus === self.maximum.bonus);
    },
    get value() {
      if (self.bonus === '0') {
        return self.dice;
      } else {
        return `${self.dice} ${self.bonus}`;
      }
    },
  }))
  .actions((self) => ({
    decrement() {
      if (
        (self.dice === 'D4' && self.bonus !== '-2') ||
        (self.dice === 'D12' && Number(self.bonus) > 0)
      ) {
        self.bonus = BONI_TYPES[BONI_TYPES.indexOf(self.bonus) - 1];
      } else {
        self.dice = DICE_TYPES[DICE_TYPES.indexOf(self.dice) - 1];
      }
    },

    increment() {
      if (self.dice === 'D4' && self.bonus === '-2') {
        self.bonus = '0';
      } else if (self.dice !== 'D12') {
        self.dice = DICE_TYPES[DICE_TYPES.indexOf(self.dice) + 1];
      } else if (self.dice === 'D12' && Number(self.bonus) < 4) {
        self.bonus = BONI_TYPES[BONI_TYPES.indexOf(self.bonus) + 1];
      }
    },
  }));

export const traitFactory = (name: string) =>
  types.compose(trait, types.model({ name: types.optional(types.identifier, name) }));

export type Itrait = Instance<typeof trait>;
