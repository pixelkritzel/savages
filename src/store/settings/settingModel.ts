import { settingRangedWeaponModel } from './settingRangedWeaponModel';
import { Instance, SnapshotIn, types } from 'mobx-state-tree';

import { creationRulesModel } from './creationRulesModel';
import { settingsSkillModel } from './settingSkillModel';

import { vanillaSetting } from './data/SavageWorldsVanilla';
import { settingEdgeModel } from './settingEdgeModel';
import { settingHindranceModel } from './settingHindranceModel';
import { settingMeleeWeaponModel } from './settingMeleeWeapon';

export const settingModel = types
  .model('setting', {
    id: types.identifier,
    name: types.optional(types.string, ''),
    creation: creationRulesModel,
    availableEdges: types.array(settingEdgeModel),
    availableSkills: types.array(settingsSkillModel),
    availableHindrances: types.array(settingHindranceModel),
    availableRangedWeapons: types.array(settingRangedWeaponModel),
    availableMeleeWeapons: types.array(settingMeleeWeaponModel),
    rules: types.model({
      skillSpezializations: types.array(types.string),
    }),
  })
  .views((self) => ({
    get isSkillSpezializations() {
      return !!self.rules.skillSpezializations.length;
    },
    isSpezializedSkill(skillName: string) {
      return self.rules.skillSpezializations.includes(skillName);
    },
  }))
  .actions((self) => ({
    set<K extends keyof SnapshotIn<typeof self>, T extends SnapshotIn<typeof self>>(
      key: K,
      value: T[K]
    ) {
      // @ts-ignore
      self[key] = value;
    },
  }));

export function createSettingsScaffold() {
  return {
    ...vanillaSetting,
  };
}

export type Tsetting = typeof settingModel;
export interface Isetting extends Instance<typeof settingModel> {}
export interface SIsetting extends SnapshotIn<typeof settingModel> {}
