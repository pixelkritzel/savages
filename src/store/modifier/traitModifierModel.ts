import { v4 as uuid4 } from 'uuid';
import { types, Instance, getParent } from 'mobx-state-tree';
import { traitRollOptions } from 'store/characters/traitRollOptions';
import { Itrait } from 'store/characters/traitModel';

export const traitModifierModel = types
  .model('traitModifierModel', {
    id: types.optional(types.identifier, uuid4),
    type: types.enumeration(['attribute', 'skill', 'pace']),
    traitName: types.string,
    bonusValue: 0,
    bonusDice: 0,
    diceMinimum: 0,
    diceMaximum: 0,
    bonusMinimum: 0,
    bonusMaximum: 0,
    technicalConditions: types.optional(types.array(traitRollOptions), []),
  })
  .views((self) => ({
    isTechnicalConditionsFullfilled(options: Itrait['unifiedOptions']) {
      return self.technicalConditions.length === 0
        ? true
        : self.technicalConditions
            .map((condition) =>
              Object.entries(condition).every(([key, value]) => {
                return options[key] === value;
              })
            )
            .some((isFullfilled) => isFullfilled);
    },
    get source() {
      return getParent(self, 2);
    },
  }));

export interface ItraitModifier extends Instance<typeof traitModifierModel> {}
