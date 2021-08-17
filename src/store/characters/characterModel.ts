import { addMiddleware, types, Instance, SnapshotIn, IDisposer } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';

import { Imodifier } from 'store/modifiers';
import { weaponModel } from 'store/weapons/weaponModel';
import { edgeModel } from 'store/edges/edgeModel';
import { hindranceModel } from 'store/hindrances/hindranceModel';
import { settingModel } from 'store/settings/settingModel';
import { sizeType } from 'store/consts';

import { attributesModel } from './attributesModel';
import { powerModel } from './power';
import { Iskill, skillModel } from './skillModel';
import { traitModel } from './traitModel';
import { statesModel } from './statesModel';

export const characterModel = types
  .model('character', {
    _id: types.identifier,
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
    size: sizeType,
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
    edges: types.array(types.reference(edgeModel)),
    hindrances: types.array(types.reference(hindranceModel)),
    powers: types.map(powerModel),
    basePowerPoints: 0,
    currentPowerPoints: 0,
    hasPowers: false,
    currentlyHoldWeapon: types.reference(weaponModel),
    states: statesModel,
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
    get sizeBonus() {
      return Number(self.size) * -1;
    },
    get woundsAsNumber() {
      return self.wounds.reduce((prev, current) => (current ? prev + 1 : prev), 0);
    },
    get fatigueAsNumber() {
      return self.fatigue.reduce((prev, current) => (current ? prev + 1 : prev), 0);
    },
  }))
  .views((self) => ({
    get modifiers(): {
      edges: Imodifier[];
      hindrances: Imodifier[];
      all: Imodifier[];
    } {
      const { edges, hindrances, currentlyHoldWeapon } = self;
      const modifiers: {
        edges: Imodifier[];
        hindrances: Imodifier[];
        weapons: Imodifier[];
      } = {
        // @ts-expect-error
        edges: edges.map(({ modifiers }) => modifiers).flat(),
        // @ts-expect-error
        hindrances: hindrances.map(({ modifiers }) => modifiers).flat(),
        weapons: currentlyHoldWeapon.modifiers.array,
      };
      return {
        ...modifiers,
        all: [...modifiers.edges, ...modifiers.hindrances, ...modifiers.weapons],
      };
    },

    get activeModifiers() {
      return this.modifiers.all.filter(({ isActive }) => isActive);
    },

    getModifiersByField(fieldName: keyof Imodifier) {
      return this.activeModifiers.filter((modifier) =>
        Array.isArray(modifier[fieldName])
          ? modifier[fieldName].length > 0
          : Boolean(modifier[fieldName])
      );
    },
    get woundsPenalty() {
      const ignoreWoundSum = Math.min(
        this.getModifiersByField('ignoreWounds').reduce(
          (prev, modifier) => prev + modifier.ignoreWounds,
          0
        ),
        self.woundsAsNumber
      );

      return self.woundsAsNumber - ignoreWoundSum;
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

    getTraitModifiers(traitName: string) {
      type TraitModifiers = {
        edges: Imodifier[];
        hindrances: Imodifier[];
        weapon: Imodifier[];
        all: Imodifier[];
      };

      const nonOptionalModifiers: TraitModifiers & {
        wounds: typeof self['woundsPenalty'];
        fatigue: typeof self['fatigueAsNumber'];
      } = {
        edges: [],
        hindrances: [],
        weapon: [],
        all: [],
        wounds: self.woundsPenalty,
        fatigue: self.fatigueAsNumber,
      };
      const optionalModifiers: TraitModifiers = {
        edges: [],
        hindrances: [],
        weapon: [],
        all: [],
      };

      self.modifiers.edges.forEach((modifier) => {
        if (
          modifier.traitNames.array.includes(traitName) ||
          modifier.traitNames.array.includes('all')
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
          modifier.traitNames.array.includes(traitName) ||
          modifier.traitNames.array.includes('all')
        ) {
          if (modifier.isOptional) {
            optionalModifiers.hindrances.push(modifier);
          } else {
            nonOptionalModifiers.hindrances.push(modifier);
          }
        }
      });

      (self.currentlyHoldWeapon.minimumStrength > self.attributes.strength.dice
        ? self.currentlyHoldWeapon.modifiers.array.filter((modifier) => !modifier.isBenefit)
        : self.currentlyHoldWeapon.modifiers.array
      )
        .filter(
          (modifier) =>
            modifier.traitNames.array.includes(traitName) ||
            modifier.traitNames.array.includes('all')
        )
        .forEach((modifier) => {
          if (modifier.isOptional) {
            optionalModifiers.weapon.push(modifier);
          } else {
            nonOptionalModifiers.weapon.push(modifier);
          }
        });

      nonOptionalModifiers.all = [
        ...nonOptionalModifiers.edges,
        ...nonOptionalModifiers.weapon,
        ...nonOptionalModifiers.hindrances,
      ];

      optionalModifiers.all = [
        ...optionalModifiers.edges,
        ...optionalModifiers.weapon,
        ...optionalModifiers.hindrances,
      ];

      return {
        nonOptionalModifiers,
        optionalModifiers,
        all: [...nonOptionalModifiers.all, ...optionalModifiers.all],
      };
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
  _id: uuidv4(),
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
  states: {},
});
