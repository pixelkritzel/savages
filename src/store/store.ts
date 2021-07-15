import { types, Instance } from 'mobx-state-tree';

import { single_character_mock } from 'components/Characters/CharacterView/single_character_mock';

import { vanillaSetting } from 'store/settings/data/SavageWorldsVanilla';
import { resources, resourcesScaffold } from 'store/resources/resources';
import { settingModel } from 'store/settings/settingModel';
import { characterModel } from 'store/characters';

const store = types.model('stores', {
  characters: types.array(characterModel),
  resources,
  settings: types.array(settingModel),
});

export interface Istore extends Instance<typeof store> {}

export function createStore() {
  return store.create({
    characters: [single_character_mock],
    resources: resourcesScaffold,
    settings: [vanillaSetting],
  });
}
