import { Instance, types } from 'mobx-state-tree';
import { diceType } from 'store/consts';
import { rollDice } from 'utils/rollDice';

export const damageModel = types
  .model('damageModel', {
    dices: types.array(
      types.model('damageDicesModel', {
        sides: types.optional(diceType, 4),
        numberOfDices: 1,
      })
    ),
    strength: false,
    bonus: 0,
  })
  .views((self) => ({
    get humanFriendly() {
      let humanFriendlyString = self.dices
        .map((dice) => `${dice.numberOfDices}D${dice.sides}`)
        .join(' + ');
      if (self.strength) {
        humanFriendlyString += `${humanFriendlyString.length > 0 ? ' + ' : ''}STR`;
      }
      if (self.bonus) {
        humanFriendlyString += ` + ${self.bonus}`;
      }
      return humanFriendlyString;
    },
  }))
  .views((self) => ({
    roll({
      isRaise = false,
      bonus = 0,
      bonusDices = [],
      strength = { dice: 0, bonus: 0 },
      isJoker = false,
    }: {
      isRaise?: boolean;
      bonus?: number;
      bonusDices?: number[];
      strength?: { dice: number; bonus: number };
      isJoker?: boolean;
    }) {
      let sumDiceRoll = (isRaise ? rollDice(6) : 0) + bonus;
      if (self.strength) {
        sumDiceRoll += rollDice(strength.dice) + strength.bonus;
      }
      if (isJoker) {
        sumDiceRoll += 2;
      }
      for (const dice of self.dices) {
        for (let i = 0; i <= dice.numberOfDices; i++) {
          sumDiceRoll += rollDice(dice.sides);
        }
      }
      for (const dice of bonusDices) {
        sumDiceRoll += rollDice(dice);
      }
      return sumDiceRoll;
    },
  }))
  .actions((self) => ({
    set<K extends keyof Instance<typeof self>, T extends Instance<typeof self>>(
      key: K,
      value: T[K]
    ) {
      self[key] = value;
    },
  }));

export interface Idamage extends Instance<typeof damageModel> {}
