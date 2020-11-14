import { SnapshotIn, types, Instance } from 'mobx-state-tree';
import { v4 as uuidV4 } from 'uuid';

import { ImeleeWeapon, meleeWeapon } from 'store/resources/meleeWeapon';
import { IrangedWeapon, rangedWeapon } from 'store/resources/rangedWespons';
import { traitModifierModel } from './traitModifierModel';
import { paceModel } from './paceModel';

export const modifierModel = types
  .model('modifier', {
    id: types.optional(types.identifier, uuidV4),
    agility: traitModifierModel,
    smarts: traitModifierModel,
    spirit: traitModifierModel,
    strength: traitModifierModel,
    vigor: traitModifierModel,
    bennies: 0,
    toughness: 0,
    size: 0,
    freeEdges: 0,
    meleeWeapons: types.array(types.reference(meleeWeapon)),
    rangedWeapons: types.array(types.reference(rangedWeapon)),
    pace: paceModel,
    armor: 0,
  })
  .views((self) => ({
    get modifications() {
      const modifications: {
        name: string;
        value: number | string | ImeleeWeapon[] | IrangedWeapon;
      }[] = [];
      (['agility', 'smarts', 'spirit', 'strength', 'vigor'] as [
        'agility',
        'smarts',
        'spirit',
        'strength',
        'vigor'
      ]).forEach((attributeName) => {
        self[attributeName].modifications.forEach(({ name, value }) =>
          modifications.push({ name: `${attributeName} ${name}`, value })
        );
      });
      (['bennies', 'toughness', 'size', 'freeEdges', 'armor'] as [
        'bennies',
        'toughness',
        'size',
        'freeEdges',
        'armor'
      ]).forEach((name) => {
        if (self[name] !== 0) {
          modifications.push({ name, value: self[name] });
        }
      });
      (['meleeWeapons', 'rangedWeapons'] as ['meleeWeapons', 'rangedWeapons']).forEach((name) => {
        if (self[name].length > 0) {
          modifications.push({ name, value: self[name] });
        }
      });
      return modifications;
    },
  }))
  .actions((self) => ({
    set(key: any, value: any) {
      // @ts-ignore
      self[key] = value;
    },
  }));

export const modifierScaffold: SnapshotIn<typeof modifierModel> = {
  agility: {},
  smarts: {},
  spirit: {},
  strength: {},
  vigor: {},
  pace: {},
};

export interface Imodifier extends Instance<typeof modifierModel> {}
