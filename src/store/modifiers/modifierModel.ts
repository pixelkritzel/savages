import { _modelPrototype } from 'lib/state/createCollection';
import { types, Instance, getParent, SnapshotOut, SnapshotIn, destroy } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';

import { padWithMathOperator } from 'lib/utils/padWithMathOpertor';
import { createSet } from 'lib/state/createSet';
import { createBoxedArray } from 'lib/state/createBoxedArray';

import { DICE_TYPES } from 'store/consts';

import { traitModifierModel } from './traitModifierModel';

export const dicesModel = types
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

const rangeModifierModel = types
  .model('rangeModifierModel', {
    skill: '',
    short: 0,
    medium: 0,
    long: 0,
  })
  .views((self) => ({
    get asArray() {
      const { short, medium, long } = self;
      return [short, medium, long];
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

export const modifierModel = _modelPrototype
  .named('modifierModel')
  .props({
    name: types.string,
    isActive: types.boolean,
    reason: types.string,
    isOptional: types.boolean,
    isBenefit: types.boolean,
    conditions: types.string,
    traitNames: createSet('', types.string),
    traitModifiers: createBoxedArray('', traitModifierModel),
    bennies: types.number,
    aimingHelp: types.number,
    toughness: types.number,
    size: types.number,
    freeEdges: types.number,
    bonusDamage: types.number,
    rerollBonus: types.number,
    rerollDamageBonus: types.number,
    armor: types.number,
    ignoreWounds: types.number,
    ignoreMultiActionPenalty: types.number,
    ignoreRecoil: types.number,
    ignoreVision: types.number,
    pace: types.number,
    minimumStrength: types.number,
    reach: types.number,
    ignoreImprovisedWeapon: types.boolean,
    ignoreMinimumStrength: types.boolean,
    ignoreOffhand: types.boolean,
    big: types.boolean,
    hardy: types.boolean, // TODO: Race ability - second shaken doesn't cause a wound - interesting, when implementing fight
    bonusDamageDices: dicesModel,
    freeReroll: types.string,
    forbiddenEdges: createSet('', types.string),
    grantedEdges: createSet('', types.string),
    addedHindrances: createSet('', types.string),
    grantedWeapons: createSet('', types.string),
    grantedPowers: createSet('', types.string),
    grantedSkills: createSet('', types.string),
    rangeModifier: rangeModifierModel,
  })
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

    get source() {
      const source = getParent(2) as unknown;
      return source;
    },

    getValidationErrors() {
      return {
        name: !Boolean(self.name) ? ('name_missing' as const) : false,
      };
    },
    get isValid() {
      return Object.values(this.getValidationErrors()).every((value) => !value);
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
  return {
    _id: uuidv4(),
    name: '',
    isActive: false,
    reason: '',
    isOptional: true,
    isBenefit: true,
    conditions: '',
    traitNames: { array: [] },
    traitModifiers: { array: [] },
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
    hardy: false,
    bonusDamageDices: { 4: 0, 6: 0, 8: 0, 10: 0, 12: 0 },
    freeReroll: '',
    rangeModifier: {
      skill: '',
      short: 0,
      medium: 0,
      long: 0,
    },
    forbiddenEdges: { array: [] },
    grantedEdges: { array: [] },
    addedHindrances: { array: [] },
    grantedWeapons: { array: [] },
    grantedPowers: { array: [] },
    grantedSkills: { array: [] },
  };
}
