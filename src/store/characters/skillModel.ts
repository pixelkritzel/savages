import { Isetting } from 'store/settings';
import { types, Instance, getRoot, IAnyStateTreeNode } from 'mobx-state-tree';

import { settingsSkillModel } from '../settings/settingSkillModel';

import { traitModel } from './traitModel';

export const skillModel = types
  .compose(
    'skillModel',
    traitModel,
    types.model({
      type: types.literal('skill'),
      settingSkill: types.reference(settingsSkillModel),
      specializations: types.maybe(types.array(types.string)),
      selectedSkillSpezialization: types.optional(types.union(types.string, types.null), null),
    })
  )
  .views((self) => ({
    get isSkillSpezialized() {
      const selectedSetting: Isetting = (getRoot(self) as any).selectedSetting;
      return (
        selectedSetting.isSkillSpezializations && selectedSetting.isSpezializedSkill(self.name)
      );
    },
  }))
  .actions((self) => ({
    afterCreate() {
      self.setName(self.settingSkill.id);
    },
    resetRollModifiers() {
      self.selectedSkillSpezialization = null;
    },
    set<K extends keyof Instance<typeof self>, T extends Instance<typeof self>>(
      key: K,
      value: T[K]
    ) {
      self[key] = value;
    },
  }));

export interface Iskill extends Instance<typeof skillModel> {}

export function isSkill(model: IAnyStateTreeNode): model is Iskill {
  return model.type === 'skill';
}
