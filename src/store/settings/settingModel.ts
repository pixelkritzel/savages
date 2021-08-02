import { baseSkillModel } from 'store/skills';
import { createBoxedArray } from 'lib/state/createBoxedArray';
import { Instance, SnapshotIn, types } from 'mobx-state-tree';

import { powerModel } from 'store/powers';

import { creationRulesModel } from './creationRulesModel';

import { vanillaSetting } from './data/SavageWorldsVanilla';
import { settingEdgeModel } from './settingEdgeModel';
import { settingHindranceModel } from './settingHindranceModel';
import { weaponModel } from './settingWeaponModel';

export const settingModel = types
  .model('setting', {
    _id: types.identifier,
    name: types.optional(types.string, ''),
    creation: creationRulesModel,
    availableEdges: types.array(settingEdgeModel),
    availableSkills: createBoxedArray('', types.reference(baseSkillModel)),
    availableHindrances: types.array(settingHindranceModel),
    availablePowers: createBoxedArray('', types.reference(powerModel)),
    availableWeapons: types.array(weaponModel),
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
