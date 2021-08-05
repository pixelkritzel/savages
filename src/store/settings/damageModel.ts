import { dicesModel } from './../modifiers/modifierModel';
import { Instance, types, SnapshotIn, getSnapshot } from 'mobx-state-tree';
import { rollDice } from 'utils/rollDice';

export const damageModel = types
  .model('damageModel', {
    dices: dicesModel,
    strength: false,
    bonus: 0,
  })
  .views((self) => ({
    get humanFriendly() {
      let humanFriendlyString = Object.entries(getSnapshot(self.dices))
        .filter(([sides, numberOfDices]) => numberOfDices > 0)
        .map(([sides, numberOfDices]) => `${numberOfDices}D${sides}`)
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
      for (const [sides, numberOfDices] of Object.entries(self.dices)) {
        for (let i = 0; i <= numberOfDices; i++) {
          sumDiceRoll += rollDice(Math.min(Number(sides), strength.dice));
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
export interface SIdamage extends SnapshotIn<typeof damageModel> {}

export function createDamageScaffold(value?: Partial<SIdamage>): SIdamage {
  return { dices: {} };
}
