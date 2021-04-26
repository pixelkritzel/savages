import { addMiddleware, types, Instance, SnapshotIn, IDisposer } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';

import { settingModel } from 'store/settings/settingModel';
import { meleeWeapon } from 'store/resources/meleeWeapon';
import { rangedWeapon } from 'store/resources/rangedWespons';
import { trait } from './trait';

export const characterModel = types
  .model('character', {
    id: types.identifier,
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
    attributes: types.model({
      agility: trait,
      smarts: trait,
      spirit: trait,
      strength: trait,
      vigor: trait,
    }),
    bennies: 3,
    size: 3,
    freeEdges: 0,
    pace: 6,
    runningDice: trait,
    armor: 0,
    meleeWeapons: types.array(types.reference(meleeWeapon)),
    rangedWeapons: types.array(types.reference(rangedWeapon)),
    log: types.array(
      types.model({
        date: types.number,
        message: types.string,
      })
    ),
    setting: types.reference(settingModel),
    skills: types.map(trait),
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
  }))
  .actions((self) => ({
    addLogEntry(message: string) {
      self.log.unshift({ date: new Date().getTime(), message });
    },
    set<K extends keyof Instance<typeof self>, T extends Instance<typeof self>>(
      key: K,
      value: T[K]
    ) {
      if (typeof value !== typeof self[key]) {
        console.warn('TYPE ERROR ! !!!!!  !!!');
        return;
      }
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
    agility: { name: 'agility' },
    smarts: { name: 'smarts' },
    spirit: { name: 'spirit' },
    strength: { name: 'strength' },
    vigor: { name: 'vigor' },
  },
  runningDice: {
    name: 'running',
    dice: 6,
    bonus: 0,
  },
});
