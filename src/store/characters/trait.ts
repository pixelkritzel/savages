import { Instance, types } from 'mobx-state-tree';

export const DICE_TYPES: Itrait['dice'][] = [4, 6, 8, 10, 12];

export const diceType = types.union(
  types.literal(4),
  types.literal(6),
  types.literal(8),
  types.literal(10),
  types.literal(12)
);
export const bonusType = types.number;

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
    name: types.optional(types.string, ''),
    dice: types.optional(diceType, 4),
    bonus: types.optional(bonusType, 0),
    minimum: types.optional(
      types.model({
        dice: diceType,
        bonus: bonusType,
      }),
      { dice: 4, bonus: 0 }
    ),
    maximum: types.optional(
      types.model({
        dice: diceType,
        bonus: bonusType,
      }),
      { dice: 12, bonus: +4 }
    ),
  })
  .views((self) => ({
    get isBonusDecrementable(): boolean {
      return self.bonus > self.minimum.bonus;
    },
    get isDiceDecrementable(): boolean {
      return self.dice > self.minimum.dice;
    },
    get isBonusIncrementable() {
      return self.bonus < self.maximum.bonus;
    },
    get isDiceIncrementable() {
      return self.dice < self.maximum.dice;
    },
    get value() {
      if (self.bonus === 0) {
        return `D${self.dice}`;
      } else {
        return `D${self.dice} ${self.bonus > 0 ? '+' + self.bonus : self.bonus}`;
      }
    },
  }))
  .actions((self) => ({
    decrementBonus() {
      if (self.isBonusDecrementable) {
        self.bonus = self.bonus - 1;
      }
    },

    decrementDice() {
      if (self.isDiceDecrementable) {
        self.dice = DICE_TYPES[DICE_TYPES.indexOf(self.dice) - 1];
      }
    },

    incrementBonus() {
      if (self.isBonusIncrementable) {
        self.bonus = self.bonus + 1;
      }
    },

    incrementDice() {
      if (self.isDiceIncrementable) {
        self.dice = DICE_TYPES[DICE_TYPES.indexOf(self.dice) + 1];
      }
    },
  }));

export const traitFactory = (name: string) =>
  types.compose(trait, types.model({ name: types.optional(types.identifier, name) }));

export interface Itrait extends Instance<typeof trait> {}
