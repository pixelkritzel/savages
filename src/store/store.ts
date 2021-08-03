import { types, Instance } from 'mobx-state-tree';

import { modifiersCollectionModel } from './modifiers/modifiersCollection';
import { createSkillsCollection, skillsCollection } from './skills/skillsCollection';
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
    skills: createSkillsCollection(),
    characters: [single_character_mock],
    settings: [vanillaSetting],
    modifiers: createCollectionScaffold(),
    powers: createCollectionScaffold(),
    selectedSetting: 'vanilla_setting',
  });
}
