import { addMiddleware, types, Instance, SnapshotIn, IDisposer } from 'mobx-state-tree';
import { settingModel } from './../settings/settingModel';
import { trait } from './trait';
import { v4 as uuidv4 } from 'uuid';

export const character = types
  .model('character', {
    id: types.identifier,
    name: types.optional(types.string, ''),
    advances: 0,
    spendAttributesPoints: 0,
    attributes: types.model({
      agility: trait,
      smarts: trait,
      spirit: trait,
      strength: trait,
      vigor: trait,
    }),
    log: types.array(
      types.model({
        date: types.number,
        message: types.string,
      })
    ),
    mode: types.union(
      types.literal('creation'),
      types.literal('advancement'),
      types.literal('free_mode')
    ),
    setting: types.reference(settingModel),
    skills: types.map(trait),
  })
  .volatile((self) => ({
    showErrors: false,
    ignoreErrors: false,
  }))
  .views((self) => ({
    get remainingAttributePoints() {
      return self.setting.creation.attributePoints - self.spendAttributesPoints;
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
      // @ts-ignore
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

export type Icharacter = Instance<typeof character>;
export type SIcharacter = SnapshotIn<typeof character>;

export const createCharacterScaffold = (): SIcharacter => ({
  id: uuidv4(),
  mode: 'creation',
  name: '',
  setting: 'vanilla-rules',
  attributes: {
    agility: { name: 'agility' },
    smarts: { name: 'smarts' },
    spirit: { name: 'spirit' },
    strength: { name: 'strength' },
    vigor: { name: 'vigor' },
  },
});
