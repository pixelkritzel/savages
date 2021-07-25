import { Itrait } from 'store/characters/traitModel';
import { addMiddleware, types, Instance, SnapshotIn, IDisposer } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';

import { Imodifier } from 'store/modifier';
import { weaponModel } from 'store/settings/settingWeaponModel';
import { settingEdgeModel } from 'store/settings/settingEdgeModel';
import { settingHindranceModel } from 'store/settings/settingHindranceModel';
import { settingModel } from 'store/settings/settingModel';

import { attributesModel } from './attributesModel';
import { powerModel } from './power';
import { Iskill, skillModel } from './skillModel';
import { traitModel } from './traitModel';

export const characterModel = types
  .model('character', {
    id: types.identifier,
    wildcard: false,
    name: types.optional(types.string, ''),
    race: types.optional(types.string, ''),
    origin: types.optional(types.string, ''),
    money: 0,
    age: 0,
    conviction: types.optional(types.boolean, true),
    wounds: types.optional(types.array(types.boolean), [false, false, false]),
    fatigue: types.optional(types.array(types.boolean), [false, false, false]),
    incapcitaded: types.optional(types.boolean, false),
    advances: 0,
    spendAttributesPoints: 0,
    attributes: attributesModel,
    bennies: 3,
    size: 3,
    freeEdges: 0,
    pace: 6,
    runningDice: traitModel,
    armor: 0,
    weapons: types.array(types.reference(weaponModel)),
    log: types.array(
      types.model({
        date: types.number,
        message: types.string,
      })
    ),
    setting: types.reference(settingModel),
    skills: types.map(types.late(() => skillModel)),
    edges: types.array(types.reference(settingEdgeModel)),
    hindrances: types.array(types.reference(settingHindranceModel)),
    powers: types.map(powerModel),
    basePowerPoints: 0,
    currentPowerPoints: 0,
    hasPowers: false,
    currentlyHoldWeapon: types.reference(weaponModel),
  })
  .volatile((self) => ({
    showErrors: false,
    ignoreErrors: false,
  }))
  .views((self) => ({
    get parry() {
      const fightingSkill = self.skills.get('fighting');
      const parryFromFighting = fightingSkill
        ? Math.round(fightingSkill.dice / 2) + Math.floor(fightingSkill.bonus / 2)
        : 0;
      return parryFromFighting + 2;
    },
    get remainingAttributePoints() {
      return self.setting.creation.attributePoints - self.spendAttributesPoints;
    },
    get toughness() {
      return (
        Math.round(self.attributes.vigor.dice / 2) + Math.floor(self.attributes.vigor.bonus / 2) + 2
      );
    },
    get woundsAsNumber() {
      return self.wounds.reduce((prev, current) => (current ? prev + 1 : prev), 0);
    },
    get fatigueAsNumber() {
      return self.fatigue.reduce((prev, current) => (current ? prev + 1 : prev), 0);
    },
  }))
  .views((self) => ({
    get woundsPenalty() {
      const ignoreWoundLevels = self.edges.reduce(
        (prev, edge) =>
          prev + edge.modifiers.reduce((prev, modifier) => prev + modifier.ignoreWounds, 0),
        0
      );

      return Math.max(self.woundsAsNumber - ignoreWoundLevels, 0);
    },
  }))
  .views((self) => ({
    get modifiers(): {
      edges: Imodifier[];
      hindrances: Imodifier[];
      all: Imodifier[];
      wounds: number;
      fatigue: number;
    } {
      const { edges, hindrances, currentlyHoldWeapon } = self;
      const modifiers: {
        edges: Imodifier[];
        hindrances: Imodifier[];
        weapons: Imodifier[];
        wounds: number;
        fatigue: number;
      } = {
        // @ts-expect-error
        edges: edges.map(({ modifiers }) => modifiers).flat(),
        // @ts-expect-error
        hindrances: hindrances.map(({ modifiers }) => modifiers).flat(),
        weapons: currentlyHoldWeapon.modifiers,
        wounds: self.woundsPenalty,
        fatigue: self.fatigueAsNumber,
      };
      return {
        ...modifiers,
        all: [...modifiers.edges, ...modifiers.hindrances, ...modifiers.weapons],
      };
    },
  }))
  .views((self) => ({
    get errors() {
      const errors = [];
      if (self.name.length < 2) {
        errors.push('Please provide a name.');
      }
      if (self.remainingAttributePoints < 0) {
        errors.push('You spend too many points on attributes.');
      }
      if (self.remainingAttributePoints > 0) {
        errors.push('You spend not all your attribute points.');
      }
      return errors;
    },

    getModifiersByField(fieldName: keyof Imodifier) {
      return this.activeModifiers.filter((modifier) =>
        Array.isArray(modifier[fieldName])
          ? modifier[fieldName].length > 0
          : Boolean(modifier[fieldName])
      );
    },

    getTraitModifiers(trait: Itrait) {
      const nonOptionalModifiers: {
        edges: Imodifier[];
        hindrances: Imodifier[];
        wounds: typeof self['woundsPenalty'];
        fatigue: typeof self['fatigueAsNumber'];
      } = { edges: [], hindrances: [], wounds: self.woundsPenalty, fatigue: self.fatigueAsNumber };
      const optionalModifiers: { edges: Imodifier[]; hindrances: Imodifier[] } = {
        edges: [],
        hindrances: [],
      };

      self.modifiers.edges.forEach((modifier) => {
        if (
          modifier.traitNames.includes(trait.name) &&
          modifier.isTechnicalConditionsFullfilled(trait.unifiedOptions)
        ) {
          if (modifier.isOptional) {
            optionalModifiers.edges.push(modifier);
          } else {
            nonOptionalModifiers.edges.push(modifier);
          }
        }
      });

      self.modifiers.hindrances.forEach((modifier) => {
        if (
          modifier.traitNames.includes(trait.name) &&
          modifier.isTechnicalConditionsFullfilled(trait.unifiedOptions)
        ) {
          if (modifier.isOptional) {
            optionalModifiers.hindrances.push(modifier);
          } else {
            nonOptionalModifiers.hindrances.push(modifier);
          }
        }
      });

      return { nonOptionalModifiers, optionalModifiers };
    },

    get activeModifiers() {
      return self.modifiers.all.filter(({ isActive }) => isActive);
    },

    getWeaponsByAttackSkill(skill: Iskill) {
      return self.weapons.filter((weapon) => weapon.isForSkill(skill.name));
    },
  }))
  .actions((self) => ({
    addLogEntry(message: string) {
      self.log.unshift({ date: new Date().getTime(), message });
    },
    set<K extends keyof Instance<typeof self>, T extends Instance<typeof self>>(
      key: K,
      value: T[K]
    ) {
      self[key] = value;
    },
  }))
  .actions((self) => {
    let disposers: IDisposer[] = [];
    return {
      afterCreate() {
        self.addLogEntry('Character creation started');
        disposers.push(
          addMiddleware(self.attributes, (call, next, abort) => {
            self.addLogEntry(`${call.name} on ${call.context.name}`);
            if (call.name === 'increment') {
              self.set('spendAttributesPoints', self.spendAttributesPoints + 1);
            }
            if (call.name === 'decrement') {
              self.set('spendAttributesPoints', self.spendAttributesPoints - 1);
            }
            next(call, (value) => value + 1);
          })
        );
      },
      beforeDestroy() {
        disposers.forEach((d) => d());
      },
    };
  });

export type Tcharacter = typeof characterModel;

export interface Icharacter extends Instance<typeof characterModel> {}
export interface SIcharacter extends SnapshotIn<typeof characterModel> {}

export const createCharacterScaffold = (): SIcharacter => ({
  id: uuidv4(),
  name: '',
  setting: 'vanilla-rules',
  attributes: {
    agility: { name: 'agility', type: 'attribute' },
    smarts: { name: 'smarts', type: 'attribute' },
    spirit: { name: 'spirit', type: 'attribute' },
    strength: { name: 'strength', type: 'attribute' },
    vigor: { name: 'vigor', type: 'attribute' },
  },
  runningDice: {
    type: 'runningDice',
    name: 'running',
    dice: 6,
    bonus: 0,
  },
  currentlyHoldWeapon: 'unarmed',
});
