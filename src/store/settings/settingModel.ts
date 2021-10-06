import { baseSkillModel } from 'store/skills';
import { createBoxedArray } from 'lib/state/createBoxedArray';
import { Instance, SnapshotIn, types } from 'mobx-state-tree';

import { powerModel } from 'store/powers';

import { creationRulesModel } from './creationRulesModel';

import { vanillaSetting } from './data/SavageWorldsVanilla';
import { edgeModel } from '../edges/edgeModel';
import { hindranceModel } from '../hindrances/hindranceModel';
import { weaponModel } from '../weapons/weaponModel';

export const settingModel = types
  .model('setting', {
    _id: types.identifier,
    name: types.string,
    creation: creationRulesModel,
    availableEdges: createBoxedArray('', types.reference(edgeModel)),
    availableSkills: createBoxedArray('', types.reference(baseSkillModel)),
    availableHindrances: createBoxedArray('settingHindrances', types.reference(hindranceModel)),
    availablePowers: createBoxedArray('', types.reference(powerModel)),
    availableWeapons: createBoxedArray('', types.reference(weaponModel)),
    fatigueLimit: 2,
    rules: types.model({
      skillSpezializations: types.map(
        types.model({
          name: '',
          spezializations: types.array(types.string),
        })
      ),
      isConviction: false,
      isDumbLuck: false,
      isNoPowerPoints: false,
      isUnarmoredHero: false,
    }),
  })
  .views((self) => ({
    get isSkillSpezializations() {
      return !!self.rules.skillSpezializations.entries.length;
    },
    isSpezializedSkill(skillName: string) {
      return self.rules.skillSpezializations.has(skillName);
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

export function createSettingScaffold() {
  return {
    ...vanillaSetting,
  };
}

export type Tsetting = typeof settingModel;
export interface Isetting extends Instance<typeof settingModel> {}
export interface SIsetting extends SnapshotIn<typeof settingModel> {}
