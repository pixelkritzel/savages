import { types, Instance } from 'mobx-state-tree';

import { single_character_mock } from 'components/Characters/CharacterView/single_character_mock';

import { vanillaSetting } from 'store/settings/data/SavageWorldsVanilla';
import { settingModel } from 'store/settings/settingModel';
import { characterModel } from 'store/characters';
import { modifierModel } from 'store/modifier';
import { modifiers } from 'store/modifier/data';

const store = types.model('stores', {
  characters: types.array(characterModel),
  settings: types.array(settingModel),
  modifiers: types.array(modifierModel),
  selectedSetting: types.reference(settingModel),
});

export interface Istore extends Instance<typeof store> {}

export function createStore() {
  return store.create({
    characters: [single_character_mock],
    settings: [vanillaSetting],
    modifiers,
    selectedSetting: 'vanilla_setting',
  });
}
