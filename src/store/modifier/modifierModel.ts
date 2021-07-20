import { powerModel } from 'store/characters/power';
import { SnapshotIn, types, Instance, cast } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';

import { padWithMathOperator } from 'utils/padWithMathOpertor';

import { traitModifierModel } from './traitModifierModel';

export const modifierModel = types
  .model('modifier', {
    id: types.optional(types.identifier, uuidv4),
    name: '',
    reason: '',
    optional: types.boolean,
    conditions: '',
    traitModifiers: types.array(traitModifierModel),
    bennies: 0,
    toughness: 0,
    size: 0,
    freeEdges: 0,
    armor: 0,
    ignoreWounds: 0,
    ignoreMultiActionPenalty: 0,
    big: false,
    pace: 0,
    minumumStrength: 0,
    forbiddenEdges: types.optional(types.array(types.string), []),
    grantedEdges: types.optional(types.array(types.string), []),
    addedHindrances: types.optional(types.array(types.string), []),
    hardy: false, // TODO: Race ability - second shaken doesn't cause a wound - interesting, when implementing fight
    reach: 0,
    grantedPowers: types.optional(types.array(types.reference(powerModel)), []),
    grantedSkills: types.optional(
      types.array(types.model({ skillName: types.string, isEnhancedSkill: false })),
      []
    ),
    grantedSuperPowers: types.optional(types.array(types.reference(powerModel)), []),
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
  }))
  .actions((self) => ({
    set<K extends keyof SnapshotIn<typeof self>, T extends SnapshotIn<typeof self>>(
      key: K,
      value: T[K]
    ) {
      self[key] = cast(value);
    },
  }));

export interface Imodifier extends Instance<typeof modifierModel> {}
