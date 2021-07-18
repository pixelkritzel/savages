import { Instance, types } from 'mobx-state-tree';

import { modifierModel, Imodifier } from 'store/modifier';

import { padWithMathOperator } from 'utils/padWithMathOpertor';

export const DICE_TYPES: Itrait['dice'][] = [4, 6, 8, 10, 12];

export const diceType = types.union(
  types.literal(4),
  types.literal(6),
  types.literal(8),
  types.literal(10),
  types.literal(12)
);
export const bonusType = types.number;

function rollDice(sides: number) {
  let result = Math.ceil(Math.random() / (1 / sides));
  if (result === sides) {
    result = result + rollDice(sides);
  }
  return result;
}

export const traitModel = types
  .model('traitModel', {
    name: types.optional(types.string, ''),
    type: types.string,
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
    activeModifiers: types.map(types.reference(modifierModel)),
    numberOfActions: 0,
    isJoker: false,
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
        return `D${self.dice} ${padWithMathOperator(self.bonus)}`;
      }
    },
    roll({
      bonus,
      diceDifference,
      numberOfDices,
      isWildcard,
      targetValue,
    }: {
      diceDifference: number;
      bonus: number;
      numberOfDices: number;
      isWildcard: boolean;
      targetValue: number;
    }):
      | { type: 'critical_failure' }
      | {
          type: 'success' | 'failure';
          rolls: { result: number; success: boolean; raises: number }[];
          allRolls: number[];
        } {
      const dice = self.dice + diceDifference * 2 > 3 ? self.dice + diceDifference * 2 : 4;
      const traitDiceRoll = Array.from({ length: numberOfDices }, () => rollDice(dice));
      const wildDiceRoll = rollDice(6);
      if (isWildcard) {
        traitDiceRoll.push(wildDiceRoll);
      }
      const allRolls = [...traitDiceRoll].sort((a, b) => b - a);
      if (isWildcard) {
        traitDiceRoll.pop();
      }
      if (
        allRolls.filter((roll) => roll === 1).length >
        Math.floor(numberOfDices + (isWildcard ? 1 : 0) / 2)
      ) {
        return {
          type: 'critical_failure',
        };
      }
      if (isWildcard) {
        allRolls.pop();
      }
      const result = allRolls
        .map((roll) => roll + bonus)
        .map((roll) => ({
          result: roll,
          success: roll - targetValue > -1,
          raises: Math.max(Math.floor((roll - targetValue) / 4), 0),
        }));

      return {
        type: result.some(({ success }) => success) ? 'success' : 'failure',
        rolls: result,
        allRolls: allRolls.map((roll) => roll + bonus),
      };
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
    setName(name: string) {
      self.name = name;
    },
    addActiveModifier(modifier: Imodifier) {
      self.activeModifiers.set(modifier.id, modifier);
    },
    clearActiveModifiers() {
      self.activeModifiers.clear();
    },
    removeActiveModifier(modifier: Imodifier) {
      self.activeModifiers.delete(modifier.id);
    },
    toggleActiveModifier(modifier: Imodifier) {
      if (self.activeModifiers.has(modifier.id)) {
        self.activeModifiers.delete(modifier.id);
      } else {
        self.activeModifiers.set(modifier.id, modifier);
      }
    },
    set<K extends keyof Instance<typeof self>, T extends Instance<typeof self>>(
      key: K,
      value: T[K]
    ) {
      self[key] = value;
    },
  }));

export const traitFactory = (name: string) =>
  types.compose(traitModel, types.model({ name: types.optional(types.identifier, name) }));

export interface Itrait extends Instance<typeof traitModel> {}
