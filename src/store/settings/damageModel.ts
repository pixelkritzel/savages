import { Instance, types } from 'mobx-state-tree';
import { diceType } from 'store/characters/traitModel';

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
  .actions((self) => ({
    set<K extends keyof Instance<typeof self>, T extends Instance<typeof self>>(
      key: K,
      value: T[K]
    ) {
      self[key] = value;
    },
  }));
