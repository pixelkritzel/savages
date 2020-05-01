import { Instance, types } from 'mobx-state-tree';

export const DICE_TYPES: Itrait['dice'][] = ['D4', 'D6', 'D8', 'D10', 'D12'];
export const BONI_TYPES: Itrait['bonus'][] = ['-2', '-1', '0', '+1', '+2', '+3', '+4'];

export const trait = types
  .model('trait', {
    name: types.identifier,
    dice: types.optional(types.enumeration(['D4', 'D6', 'D8', 'D10', 'D12']), 'D4'),
    bonus: types.optional(types.enumeration(['-2', '-1', '0', '+1', '+2', '+3', '+4']), '0'),
  })
  .views((self) => ({
    get isDecrementable(): boolean {
      return !(self.dice === 'D4' && self.bonus === '-2');
    },
    get isIncrementable() {
      return self.dice !== 'D12' && self.bonus !== '+4';
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
        self.bonus = BONI_TYPES[BONI_TYPES.indexOf(self.bonus) - 2];
      } else {
        self.dice = DICE_TYPES[DICE_TYPES.indexOf(self.dice) - 2];
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
