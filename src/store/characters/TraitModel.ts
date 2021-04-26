import { BaseModel } from 'lib/state/BaseModel';

export type DiceType = 4 | 6 | 8 | 10 | 12;
export const DICE: DiceType[] = [4, 6, 8, 10, 12];

class TraitMinMax extends BaseModel {
  dice: DiceType = 4;
  bonus = 0;
}

const a = new TraitMinMax({ dice: 4, bonus: 0 });

export class TraitModel extends BaseModel {
  name = '';
  dice: DiceType = 4;
  bonus = 4;
  min = new TraitMinMax({ dice: 4, bonus: 0 });
  max = new TraitMinMax({ dice: 12, bonus: 3 });

  get isBonusDecrementable(): boolean {
    return this.bonus > this.min.bonus;
  }
  get isDiceDecrementable(): boolean {
    return this.dice > this.min.dice;
  }
  get isBonusIncrementable() {
    return this.bonus < this.max.bonus;
  }
  get isDiceIncrementable() {
    return this.dice < this.max.dice;
  }
  get value() {
    if (this.bonus === 0) {
      return `D${this.dice}`;
    } else {
      return `D${this.dice} ${this.bonus}`;
    }
  }

  decrementBonus = () => {
    if (this.isBonusDecrementable) {
      this.bonus = this.bonus - 1;
    }
  };

  decrementDice = () => {
    if (this.isDiceDecrementable) {
      this.dice = DICE[DICE.indexOf(this.dice) - 1];
    }
  };

  incrementBonus = () => {
    if (this.isBonusIncrementable) {
      this.bonus = this.bonus + 1;
    }
  };

  incrementDice = () => {
    if (this.isDiceIncrementable) {
      this.dice = DICE[DICE.indexOf(this.dice) + 1];
    }
  };
}
