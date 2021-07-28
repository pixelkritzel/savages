import { types, Instance, getParent, SnapshotOut } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';

import { powerModel } from 'store/characters/power';

import { padWithMathOperator } from 'utils/padWithMathOpertor';

import { traitModifierModel } from './traitModifierModel';

import { Itrait } from 'store/characters/traitModel';
import { diceType } from 'store/consts';
import { objectType } from 'lib/mst-types/object';

export const modifierModel = types
  .model('modifier', {
    id: types.optional(types.identifier, uuidv4),
    name: '',
    reason: '',
    isOptional: types.boolean,
    conditions: '',
    traitNames: types.optional(types.array(types.string), []),
    traitModifiers: types.optional(types.array(traitModifierModel), []),
    bennies: 0,
    aimingHelp: 0,
    toughness: 0,
    size: 0,
    freeEdges: 0,
    freeReroll: '',
    bonusDamage: 0,
    bonusDamageDices: types.optional(types.array(diceType), []),
    rerollBonus: 0,
    rerollDamageBonus: 0,
    armor: 0,
    ignoreWounds: 0,
    ignoreMultiActionPenalty: 0,
    ignoreRecoil: 0,
    ignoreImprovisedWeapon: false,
    big: false,
    pace: 0,
    minumumStrength: 0,
    forbiddenEdges: types.optional(types.array(types.string), []),
    grantedEdges: types.optional(types.array(types.string), []),
    addedHindrances: types.optional(types.array(types.string), []),
    grantedWeapons: types.optional(types.array(types.string), []),
    hardy: false, // TODO: Race ability - second shaken doesn't cause a wound - interesting, when implementing fight
    reach: 0,
    grantedPowers: types.optional(types.array(types.reference(powerModel)), []),
    grantedSkills: types.optional(
      types.array(types.model({ skillName: types.string, isEnhancedSkill: false })),
      []
    ),
    grantedSuperPowers: types.optional(types.array(types.reference(powerModel)), []),
    isActive: false,
    technicalConditions: types.optional(types.array(objectType), []),
  })
  .views((self) => ({
    getHumanFriendlyTraitModifierValueByTrait(traitName: string) {
      const traitModifier = self.traitModifiers.find(
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
      return self.technicalConditions.length === 0
        ? true
        : self.technicalConditions
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
      self.reason = self.reason || self.name || self.id;
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
