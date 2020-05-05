import { types } from 'mobx-state-tree';

import { meleeWeapon } from 'store/resources/meleeWeapon';
import { rangedWeapon } from 'store/resources/rangedWespons';

const traitModifier = types.model('traitModifier', {
  value: 0,
  maximum: 0,
  minimum: 0,
  specialization: types.array(types.string),
  optional: types.maybe(types.string),
});

export const modifier = types.model('modifier', {
  attributes: types.model({
    agility: traitModifier,
    smarts: traitModifier,
    spirit: traitModifier,
    strength: traitModifier,
    vigor: traitModifier,
  }),
  bennies: 0,
  toughness: 0,
  size: 0,
  freeEdges: 0,
  meleeWeapons: types.array(types.reference(meleeWeapon)),
  rangedWeapons: types.array(types.reference(rangedWeapon)),
  pace: types.model({
    onFoot: 0,
    swimming: 0,
    flying: 0,
  }),
  armor: 0,
});
