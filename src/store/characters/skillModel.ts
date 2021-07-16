import { types, Instance } from 'mobx-state-tree';

import { settingsSkillModel } from '../settings/settingSkillModel';

import { traitModel } from './traitModel';

export const skillModel = types
  .compose(
    'skillModel',
    traitModel,
    types.model({
      settingSkill: types.reference(settingsSkillModel),
      specializations: types.maybe(types.array(types.string)),
    })
  )
  .actions((self) => ({
    afterCreate() {
      self.setName(self.settingSkill.name);
    },
  }));

export interface Iskill extends Instance<typeof skillModel> {}
