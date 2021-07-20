import { Iweapon } from './../settings/settingWeaponModel';
import { types, Instance, getRoot, IAnyStateTreeNode } from 'mobx-state-tree';

import { Isetting } from 'store/settings';
import { settingsSkillModel } from 'store/settings/settingSkillModel';

import { traitModel } from './traitModel';

export const ATTACK_SKILLS = ['athletics', 'fighting', 'shooting'] as const;

const attackModel = types
  .model('attackModel', {
    aim: types.optional(types.union(types.null, types.enumeration(['ignore', 'plusTwo'])), null),
    calledShot: types.optional(
      types.union(types.enumeration(['hand', 'head', 'limbs']), types.null, types.number),
      null
    ),
    cover: types.optional(
      types.union(types.null, types.enumeration(['-2', '-4', '-6', '-8'])),
      null
    ),
    isTheDrop: false,
    range: types.optional(types.enumeration(['0', '-2', '-4', '-8']), '0'),
    isRecoil: false,
    scale: types.optional(types.enumeration(['-6', '-4', '-2', '0', '+2', '+4', '+6']), '0'),
    speed: types.optional(types.enumeration(['0', '-1', '-2', '-4', '-6', '-8', '-10']), '0'),
    isProneTarget: false,
    rateOfFire: 1,
    isUnarmedDefender: false,
    isShotgunSlugs: false,
    isNonLethal: false,
    isOffHand: false,
  })
  .actions((self) => ({
    set<K extends keyof Instance<typeof self>, T extends Instance<typeof self>>(
      key: K,
      value: T[K]
    ) {
      self[key] = value;
    },
  }));

export const skillModel = types
  .compose(
    'skillModel',
    traitModel,
    types.model({
      type: types.literal('skill'),
      settingSkill: types.reference(settingsSkillModel),
      specializations: types.maybe(types.array(types.string)),
      selectedSkillSpecialization: types.optional(types.union(types.string, types.null), null),
      attack: types.optional(attackModel, {}),
    })
  )
  .views((self) => ({
    get isSkillSpezialized() {
      const selectedSetting: Isetting = (getRoot(self) as any).selectedSetting;
      return (
        selectedSetting.isSkillSpezializations && selectedSetting.isSpezializedSkill(self.name)
      );
    },
    get isAttackSkill() {
      return ATTACK_SKILLS.includes(self.name as any);
    },
    isAttackRollable(weapon: Iweapon) {
      return weapon.isForSkill(self.name as any);
    },
  }))
  .actions((self) => ({
    afterCreate() {
      self.setName(self.settingSkill.id);
    },
    resetRollModifiers() {
      self.selectedSkillSpecialization = null;
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

export function isShooting(trait: Iskill) {
  return trait.name === 'shooting';
}

export function isMelee(skill: Iskill) {
  return skill.name === 'fighting';
}

export function isAttackSkill(skill: Iskill) {
  return ATTACK_SKILLS.includes(skill.name as any);
}

export function getModifierForCalledShot(calledShot: Iskill['attack']['calledShot']) {
  if (typeof calledShot === 'number') {
    return calledShot;
  } else if (calledShot === 'head' || calledShot === 'hand') {
    return -4;
  } else if (calledShot === 'limbs') {
    return -2;
  }
  return 0;
}
