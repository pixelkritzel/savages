import { SImodifier } from 'store/modifiers/modifierModel';
import { modifiersDB } from './../persistence/index';
import { types, Instance } from 'mobx-state-tree';

import { single_character_mock } from 'components/Characters/CharacterView/single_character_mock';

import { vanillaSetting } from 'store/settings/data/SavageWorldsVanilla';
import { settingModel } from 'store/settings/settingModel';
import { characterModel } from 'store/characters';
import { modifierModel } from 'store/modifiers';
import { modifiers } from 'store/modifiers/data';

const store = types
  .model('stores', {
    characters: types.array(characterModel),
    settings: types.array(settingModel),
    modifiers: types.array(modifierModel),
    selectedSetting: types.reference(settingModel),
  })
  .actions((self) => ({
    set<K extends keyof Instance<typeof self>, T extends Instance<typeof self>>(
      key: K,
      value: T[K]
    ) {
      self[key] = value;
    },
  }))
  .actions((self) => ({
    async afterCreate() {
      (await modifiersDB.allDocs<SImodifier>()).rows
        .map(({ doc }) => doc)
        .filter((doc) => Boolean(doc))
        .forEach((modifier) => self.modifiers.push(modifier as SImodifier));
    },
  }));

export interface Istore extends Instance<typeof store> {}

export function createStore() {
  return store.create({
    characters: [single_character_mock],
    settings: [vanillaSetting],
    modifiers,
    selectedSetting: 'vanilla_setting',
  });
}
