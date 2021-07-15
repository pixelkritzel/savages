import { types } from 'mobx-state-tree';

import { settingsSkillModel } from './../settings/settingSkillModel';

import { trait } from './trait';

export const skillModel = types
  .compose(
    'skillModel',
    trait,
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
