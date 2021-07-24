import { isSkill } from 'store/characters/skillModel';
import { characterModel, Icharacter } from 'store/characters';
import { getParentOfType, Instance, types } from 'mobx-state-tree';
import { v4 as uuid4 } from 'uuid';

import {
  createModifierAccumulator,
  ModifierAccumulator,
} from 'components/Characters/CharacterView/TraitRoll/modifierAccumulator';

import { diceType, DICE_TYPES } from 'store/consts';

import { padWithMathOperator } from 'utils/padWithMathOpertor';
import { rollDice } from 'utils/rollDice';
import { traitOptions } from './traitOptions';

export const bonusType = types.number;

export type TraitRollResult = {
  type: 'result';
  rolls: { diceRoll: number; success: boolean; raises: number }[];
  allRolls: number[];
};

export const traitModel = types
  .model('traitModel', {
    id: types.optional(types.identifier, uuid4),
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
    options: types.optional(traitOptions, {}),
  })
  .views((self) => ({
    get unifiedOptions() {
      let options: { [key: string]: any } = { ...self.options };
      if (isSkill(self)) {
        options = { ...options, ...self.skillOptions };
      }
      console.log(Object.keys(options));

      return options;
    },
  }))
  .views((self) => ({
    getModifiersAccumulator() {
      const character = getParentOfType(self, characterModel) as Icharacter;
      const trait = self;

      const modifierAccumulator: ModifierAccumulator = createModifierAccumulator();
      modifierAccumulator.boni.wounds = -character.woundsPenalty;
      modifierAccumulator.boni.fatigue = -character.fatigueAsNumber;
      modifierAccumulator.boni.numberOfActions = -(2 * trait.options.numberOfActions);
      modifierAccumulator.boni.joker = trait.options.isJoker ? 2 : 0;

      for (const modifier of character.activeModifiers) {
        for (const traitModifier of modifier.traitModifiers) {
          if (
            traitModifier.traitName === trait.name &&
            traitModifier.isTechnicalConditionsFullfilled(self.unifiedOptions)
          ) {
            modifierAccumulator.diceDifferences[modifier.reason] = traitModifier.bonusDice;
            modifierAccumulator.boni[modifier.reason] = traitModifier.bonusValue;
          }
        }
      }
      modifierAccumulator.diceDifferences.custom = self.options.customDiceDifference;
      modifierAccumulator.boni.custom = self.options.customBonus;
      return modifierAccumulator;
    },
    getModifiedBonus(bonusModifier: number) {
      return self.bonus + bonusModifier;
    },
    getModifiedDice(diceDifference: number) {
      const diceSidesSum = self.dice + diceDifference * 2;
      return diceSidesSum < 3 ? 4 : diceSidesSum > 12 ? 12 : diceSidesSum;
    },

    get modifierSum() {
      const modifiersAccumulator = this.getModifiersAccumulator();
      const diceDifference = Object.values(modifiersAccumulator.diceDifferences).reduce(
        (sum, diceDifference) => sum + diceDifference,
        0
      );
      const bonus = Object.values(modifiersAccumulator.boni).reduce((sum, bonus) => sum + bonus, 0);
      return { diceDifference, bonus };
    },
  }))
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
    }): { type: 'critical_failure' } | TraitRollResult {
      const dice = self.getModifiedDice(diceDifference);
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
        .map((roll) => roll + self.getModifiedBonus(bonus))
        .map((roll) => ({
          diceRoll: roll,
          success: roll - targetValue > -1,
          raises: Math.max(Math.floor((roll - targetValue) / 4), 0),
        }));

      return {
        type: 'result',
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
