import { _modelPrototype } from 'lib/state/createCollection';
import { types, Instance, getParent, SnapshotOut, SnapshotIn, destroy } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';

import { padWithMathOperator } from 'utils/padWithMathOpertor';

import { traitModifierModel } from './traitModifierModel';
import { baseSkillModel } from 'store/skills';

import { Itrait } from 'store/characters/traitModel';
import { DICE_TYPES } from 'store/consts';
import { createSet } from 'lib/state/createSet';
import { createBoxedArray } from 'lib/state/createBoxedArray';
import { traitRollOptions } from 'store/characters/traitRollOptions';

export const bonusDamageDicesModel = types
  .model({ 4: 0, 6: 0, 8: 0, 10: 0, 12: 0 })
  .views((self) => ({
    get asArray() {
      let damageDices: number[] = [];
      for (const diceSides of DICE_TYPES) {
        damageDices = [
          ...damageDices,
          ...(Array.from({ length: self[diceSides] }).fill(diceSides) as number[]),
        ];
      }
      return damageDices;
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

const modifierModelProps = {
  name: '',
  isActive: false,
  reason: '',
  isOptional: true,
  isBenefit: true,
  conditions: '',
  traitNames: createSet('', types.string),
  traitModifiers: createBoxedArray('', traitModifierModel),
  bennies: 0,
  aimingHelp: 0,
  toughness: 0,
  size: 0,
  freeEdges: 0,
  bonusDamage: 0,
  rerollBonus: 0,
  rerollDamageBonus: 0,
  armor: 0,
  ignoreWounds: 0,
  ignoreMultiActionPenalty: 0,
  ignoreRecoil: 0,
  ignoreVision: 0,
  pace: 0,
  minimumStrength: 0,
  reach: 0,
  ignoreImprovisedWeapon: false,
  ignoreMinimumStrength: false,
  ignoreOffhand: false,
  big: false,
  hardy: false, // TODO: Race ability - second shaken doesn't cause a wound - interesting, when implementing fight
  bonusDamageDices: types.optional(bonusDamageDicesModel, {}),
  freeReroll: '',
  forbiddenEdges: createSet('', types.string),
  grantedEdges: createSet('', types.string),
  addedHindrances: createSet('', types.string),
  grantedWeapons: createSet('', types.string),
  grantedPowers: createSet('', types.string),
  grantedSkills: createSet('', types.string),
  // TODO: The following fields have to be implented at ModifierForm
  technicalConditions: createBoxedArray('', traitRollOptions),
  replaceBaseSkill: createBoxedArray('', baseSkillModel),
  rangeModifier: types.optional(
    types.model('rangeModifierModel', {
      skill: '',
      range: types.optional(types.array(types.number), []),
    }),
    {}
  ),
};

export const modifierModel = _modelPrototype
  .named('modifierModel')
  .props(modifierModelProps)
  .views((self) => ({
    getHumanFriendlyTraitModifierValueByTrait(traitName: string) {
      const traitModifier = self.traitModifiers.array.find(
        (traitMod) => traitMod.traitName === traitName
      );
      if (!traitModifier) {
        throw new Error(`Tried to access non existing traitModifier ${traitName}`);
      }
      return `Dice: ${padWithMathOperator(traitModifier.bonusDice)} | Bonus: ${padWithMathOperator(
        traitModifier.bonusValue
      )}`;
    },
    isTechnicalConditionsFullfilled(options: Itrait['unifiedOptions']) {
      return self.technicalConditions.array.length === 0
        ? true
        : self.technicalConditions.array
            .map((condition) => {
              return Object.entries({ ...condition }).every(([key, value]) => {
                return options[key] === value;
              });
            })
            .some((isFullfilled) => isFullfilled);
    },

    get source() {
      const source = getParent(2) as unknown;
      return source;
    },
  }))
  .actions((self) => ({
    afterCreate() {
      self.isActive = !self.isOptional;
      self.reason = self.reason || self.name || self._id;
    },
    delete() {
      const modifiersCollection = getParent(self, 2) as typeof self[];
      modifiersCollection.splice(modifiersCollection.indexOf(self), 1);
      destroy(self);
    },
    set<K extends keyof Instance<typeof self>, T extends Instance<typeof self>>(
      key: K,
      value: T[K]
    ) {
      self[key] = value;
    },
  }));

export interface Imodifier extends Instance<typeof modifierModel> {}
export interface SOmodifier extends SnapshotOut<typeof modifierModel> {}
export interface SImodifier extends SnapshotIn<typeof modifierModel> {}

export function createModifierScaffold(): SImodifier {
  return { _id: uuidv4() };
}
