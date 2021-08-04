import { weaponsCollection } from './weapons/weaponsCollection';
import { types, Instance } from 'mobx-state-tree';

import { modifiersCollectionModel } from './modifiers/modifiersCollection';
import { skillsCollection } from './skills/skillsCollection';
import { createCollectionScaffold } from 'lib/state/createCollection';
import { powersCollection } from './powers';

import { single_character_mock } from 'components/Characters/CharacterView/single_character_mock';

import { vanillaSetting } from 'store/settings/data/SavageWorldsVanilla';
import { settingModel } from 'store/settings/settingModel';
import { characterModel } from 'store/characters';

const store = types
  .model('stores', {
    characters: types.array(characterModel),
    settings: types.array(settingModel),
    modifiers: modifiersCollectionModel,
    powers: powersCollection,
    selectedSetting: types.reference(settingModel),
    skills: skillsCollection,
    weapons: weaponsCollection,
  })
  .actions((self) => ({
    set<K extends keyof Instance<typeof self>, T extends Instance<typeof self>>(
      key: K,
      value: T[K]
    ) {
      self[key] = value;
    },
  }))
  .actions((self) => ({}));

export interface Istore extends Instance<typeof store> {}

export function createStore() {
  return store.create({
    skills: createCollectionScaffold(),
    characters: [single_character_mock],
    settings: [vanillaSetting],
    modifiers: createCollectionScaffold(),
    powers: createCollectionScaffold(),
    selectedSetting: 'vanilla_setting',
    weapons: createCollectionScaffold(),
  });
}
