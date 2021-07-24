import { Iweapon } from './../settings/settingWeaponModel';
import {
  types,
  Instance,
  getRoot,
  IAnyStateTreeNode,
  SnapshotIn,
  IDisposer,
  addMiddleware,
  getParentOfType,
} from 'mobx-state-tree';

import { characterModel, Icharacter } from 'store/characters';
import { Isetting } from 'store/settings';
import { settingsSkillModel } from 'store/settings/settingSkillModel';

import { Itrait, traitModel } from './traitModel';
import { ATTACK_SKILLS } from 'store/consts';
import {
  createModifierAccumulator,
  ModifierAccumulator,
} from 'components/Characters/CharacterView/TraitRoll/modifierAccumulator';

const attackModel = types
  .model('attackModel', {
    aim: types.optional(types.union(types.null, types.enumeration(['ignore', 'plusTwo'])), null),
    calledShot: types.optional(
      types.union(types.enumeration(['hand', 'head', 'helmet', 'limbs']), types.null, types.number),
      null
    ),
    cover: types.optional(
      types.union(types.null, types.enumeration(['-2', '-4', '-6', '-8'])),
      null
    ),
    isAthleticsAttack: true,
    isNonLethal: false,
    isOffHand: false,
    isProneTarget: false,
    isRecoil: false,
    isShotgunSlugs: false,
    isTheDrop: false,
    isUnarmedDefender: false,
    isUnstablePlatform: false,
    range: types.optional(types.enumeration(['0', '-2', '-4', '-8']), '0'),
    rateOfFire: 1,
    scale: types.optional(types.enumeration(['-6', '-4', '-2', '0', '+2', '+4', '+6']), '0'),
    speed: types.optional(types.enumeration(['0', '-1', '-2', '-4', '-6', '-8', '-10']), '0'),
  })
  .actions((self) => {
    const disposers: IDisposer[] = [];

    function afterCreate() {
      disposers.push(
        addMiddleware(self, (call, next) => {
          if (call.name === 'set' && call.args[0] === 'rateOfFire' && call.args[1] > 1) {
            set('isRecoil', true);
          }
          return next(call);
        })
      );
    }

    function beforeDestroy() {
      disposers.forEach((disposer) => disposer());
    }

    function set<K extends keyof Instance<typeof self>, T extends Instance<typeof self>>(
      key: K,
      value: T[K]
    ) {
      self[key] = value;
    }

    return { afterCreate, beforeDestroy, set };
  });

const _skillModel = traitModel
  .named('skillModel')
  .props({
    type: types.literal('skill'),
    settingSkill: types.reference(settingsSkillModel),
    specializations: types.maybe(types.array(types.string)),
    selectedSkillSpecialization: types.optional(types.union(types.string, types.null), null),
    attackOptions: types.optional(attackModel, {}),
  })

  .views((self) => ({
    get skillModifierAccumulator() {
      const character = getParentOfType(self, characterModel) as Icharacter;
      const skill = self;
      const modifierAccumulator: ModifierAccumulator = createModifierAccumulator();
      if (this.isSkillSpezialized && skill.selectedSkillSpecialization === null) {
        modifierAccumulator.boni.skillSpecialization = -2;
      }
      if (this.isAttack) {
        modifierAccumulator.boni.isUnstablePlatform = skill.attackOptions.isUnstablePlatform
          ? -2
          : 0;
        modifierAccumulator.boni.range = Number(skill.attackOptions.range);
        const recoilModifiers = character
          .getModifiersByField('ignoreRecoil')
          .filter((modifier) => self.activeModifiers.has(modifier.id))
          .reduce((recoilSum, { ignoreRecoil }) => ignoreRecoil + recoilSum, 0);

        console.log(recoilModifiers, recoilModifiers > 2);

        modifierAccumulator.boni.recoil = skill.attackOptions.isRecoil
          ? -2 + (recoilModifiers > 2 ? 2 : recoilModifiers)
          : 0;
        modifierAccumulator.boni.calledShot = getModifierForCalledShot(
          skill.attackOptions.calledShot
        );
        modifierAccumulator.boni.cover = Number(skill.attackOptions.cover);
        modifierAccumulator.boni.theDrop = skill.attackOptions.isTheDrop ? 4 : 0;
        modifierAccumulator.boni.vulnerable =
          skill.options.isVulnerableTarget && !skill.attackOptions.isTheDrop ? 2 : 0;
        modifierAccumulator.boni.proneTarget =
          skill.attackOptions.isProneTarget && skill.name !== 'fighting' ? -4 : 0;
        modifierAccumulator.boni.unarmedDefender = skill.attackOptions.isUnarmedDefender ? 2 : 0;
        modifierAccumulator.boni.scale = Number(skill.attackOptions.scale);
        modifierAccumulator.boni.speed = Number(skill.attackOptions.speed);
        modifierAccumulator.boni.shotgun =
          isShooting(skill) &&
          character.currentlyHoldWeapon.weaponType.includes('shotgun') &&
          !skill.attackOptions.isShotgunSlugs &&
          skill.attackOptions.range === '0'
            ? 2
            : 0;
        modifierAccumulator.boni.nonLethal = skill.attackOptions.isNonLethal ? -1 : 0;
        modifierAccumulator.boni.offHand = skill.attackOptions.isOffHand ? -2 : 0;
        if (skill.attackOptions.aim === 'ignore') {
          const sumOfPenalties =
            modifierAccumulator.boni.range +
            modifierAccumulator.boni.calledShot +
            modifierAccumulator.boni.cover +
            modifierAccumulator.boni.scale +
            modifierAccumulator.boni.speed;
          modifierAccumulator.boni.aim = sumOfPenalties * -1 >= 4 ? 4 : sumOfPenalties * -1;
        } else if (skill.attackOptions.aim === 'plusTwo') {
          modifierAccumulator.boni.aim = 2;
        }
      }
      return modifierAccumulator;
    },
    get isSkillSpezialized() {
      const selectedSetting: Isetting = (getRoot(self) as any).selectedSetting;
      return (
        selectedSetting.isSkillSpezializations && selectedSetting.isSpezializedSkill(self.name)
      );
    },
    get isAttackSkill() {
      return ATTACK_SKILLS.includes(self.name as any);
    },
    get isAttack() {
      const { name: traitName } = self;
      return (
        ['shooting', 'fighting'].includes(traitName) ||
        (traitName === 'athletics' && self.attackOptions.isAthleticsAttack)
      );
    },
    isAttackRollable(weapon: Iweapon) {
      return weapon.isForSkill(self.name as any);
    },
  }))
  .actions((self) => ({
    afterCreate() {
      this.set('name', self.settingSkill.id);
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

export const skillModel = types.snapshotProcessor(_skillModel, {
  preProcessor(skill: SIskill) {
    return { ...skill, id: skill.settingSkill as string };
  },
  postProcessor(skill) {
    return skill;
  },
});

export interface Iskill extends Instance<typeof _skillModel> {}
export interface SIskill extends SnapshotIn<typeof _skillModel> {}

export function isSkill(model: IAnyStateTreeNode): model is Iskill {
  return model.type === 'skill';
}

export function isShooting(trait: Itrait) {
  return trait.name === 'shooting';
}

export function isMelee(skill: Iskill) {
  return skill.name === 'fighting';
}

export function isRangedAttack(skill: Iskill) {
  return skill.name === 'shooting' || skill.name === 'athletics';
}

export function isAttackSkill(skill: Iskill) {
  return ATTACK_SKILLS.includes(skill.name as any);
}

export function getModifierForCalledShot(calledShot: Iskill['attackOptions']['calledShot']) {
  if (typeof calledShot === 'number') {
    return calledShot;
  } else if (calledShot === 'head' || calledShot === 'hand') {
    return -4;
  } else if (calledShot === 'helmet') {
    return -5;
  } else if (calledShot === 'limbs') {
    return -2;
  }
  return 0;
}
