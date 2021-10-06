import { settingsCollectionModel } from './settings/settingsCollection';
import { edgesCollectionModel } from './edges/edgesCollection';
import { hindrancesCollectionModel } from './hindrances/hindrancesCollection';
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
    hindrances: hindrancesCollectionModel,
    settings: settingsCollectionModel,
    modifiers: modifiersCollectionModel,
    powers: powersCollection,
    selectedSetting: types.reference(settingModel),
    skills: skillsCollection,
    weapons: weaponsCollection,
    edges: edgesCollectionModel,
  })
  .views((self) => ({
    get isAllLoaded() {
      return (
        self.modifiers.isLoaded &&
        self.powers.isLoaded &&
        self.skills.isLoaded &&
        self.weapons.isLoaded &&
        self.hindrances.isLoaded &&
        self.edges.isLoaded
      );
    },
  }))
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
    hindrances: createCollectionScaffold(),
    skills: createCollectionScaffold(),
    characters: [single_character_mock],
    settings: createCollectionScaffold(),
    modifiers: createCollectionScaffold(),
    powers: createCollectionScaffold(),
    selectedSetting: 'vanilla_setting',
    weapons: createCollectionScaffold(),
    edges: createCollectionScaffold(),
  });
}
