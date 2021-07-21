import { Instance, types } from 'mobx-state-tree';
import { diceType } from 'store/characters/traitModel';
import { rollDice } from 'utils/rollDice';

const damageDicesModel = types.model('damageDicesModel', {
  sides: types.optional(diceType, 4),
  numberOfDices: 1,
});

export const damageModel = types
  .model('damageModel', {
    dices: types.array(damageDicesModel),
    strength: false,
    bonus: 0,
  })
  .views((self) => ({
    get humanFriendly() {
      let humanFriendlyString = self.dices
        .map((dice) => `${dice.numberOfDices}D${dice.sides}`)
        .join(' + ');
      if (self.strength) {
        humanFriendlyString += ` + STR`;
      }
      if (self.bonus) {
        humanFriendlyString += ` + ${self.bonus}`;
      }
      return humanFriendlyString;
    },
  }))
  .views((self) => ({
    roll({ isRaise = false, bonus = 0, strength = { dice: 0, bonus: 0 } }) {
      let sumDiceRoll = isRaise ? rollDice(6) : 0 + bonus;
      if (self.strength) {
        sumDiceRoll += rollDice(strength.dice) + strength.bonus;
      }
      for (const dice of self.dices) {
        for (let i = 0; i <= dice.numberOfDices; i++) {
          sumDiceRoll += rollDice(dice.sides);
        }
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
