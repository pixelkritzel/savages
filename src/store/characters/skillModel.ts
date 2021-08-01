import { getSpentAmmunitionByRateOfFire } from 'store/settings/settingWeaponModel';
import { Iweapon } from './../settings/settingWeaponModel';
import {
  types,
  Instance,
  getRoot,
  IAnyStateTreeNode,
  SnapshotIn,
  getParentOfType,
} from 'mobx-state-tree';

import { characterModel, Icharacter } from 'store/characters';
import { Isetting } from 'store/settings';
import { settingsSkillModel, specializationModel } from 'store/settings/settingSkillModel';

import { Itrait, traitModel } from './traitModel';
import { ATTACK_SKILLS, DICE_TYPES } from 'store/consts';
import { skillOptions } from './skillOptions';
import { sum } from 'lodash';

const _skillModel = traitModel
  .named('skillModel')
  .props({
    type: types.literal('skill'),
    settingSkill: types.reference(settingsSkillModel),
    specializations: types.optional(types.array(types.reference(specializationModel)), []),
    selectedSkillSpecialization: types.optional(
      types.union(types.reference(specializationModel), types.null),
      null
    ),
    skillOptions: types.optional(skillOptions, {}),
  })
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
    get isAttack() {
      const { name: traitName } = self;
      return (
        ['shooting', 'fighting'].includes(traitName) ||
        (traitName === 'athletics' && self.skillOptions.isAthleticsAttack)
      );
    },
    isAttackRollable(weapon: Iweapon) {
      return (
        weapon.isForSkill(self.name) &&
        weapon.remainingAmmunition >=
          getSpentAmmunitionByRateOfFire({
            rateOfFire: self.skillOptions.rateOfFire,
            isThreeRoundBurst: self.skillOptions.isThreeRoundBurst,
          })
      );
    },
    get bonusDamage(): number {
      const character = getParentOfType(self, characterModel) as Icharacter;
      const bonusDamageSum =
        (self.skillOptions.isThreeRoundBurst && self.skillOptions.rateOfFire === 1 ? 1 : 0) +
        character
          .getModifiersByField('bonusDamage')
          .filter(
            ({ isTechnicalConditionsFullfilled, traitNames }) =>
              isTechnicalConditionsFullfilled(self.unifiedOptions) && traitNames.includes(self.name)
          )
          .reduce((bonusDamageSum, { bonusDamage }) => bonusDamageSum + bonusDamage, 0);
      return bonusDamageSum;
    },
    get bonusDamageDices(): number[] {
      const character = getParentOfType(self, characterModel) as Icharacter;
      let damageDices: number[] = [];
      character
        .getModifiersByField('bonusDamageDices')
        .filter(
          ({ isTechnicalConditionsFullfilled, traitNames }) =>
            isTechnicalConditionsFullfilled(self.unifiedOptions) && traitNames.includes(self.name)
        )
        .forEach(({ bonusDamageDices }) => (damageDices = [...damageDices, ...bonusDamageDices]));
      return damageDices;
    },
  }))
  .views((self) => {
    const getTraitModifiersAccumulator = self.getModifiersAccumulator;

    return {
      getModifiersAccumulator() {
        const character = getParentOfType(self, characterModel) as Icharacter;
        const skill = self;
        const modifierAccumulator = getTraitModifiersAccumulator();
        if (
          (self.isSkillSpezialized &&
            self.isAttack &&
            character.currentlyHoldWeapon.specialization !== skill.selectedSkillSpecialization) ||
          (self.isSkillSpezialized && skill.selectedSkillSpecialization === null)
        ) {
          modifierAccumulator.boni.skillSpecialization = -2;
        }

        const modifiersForSkillSpecialization = character
          .getTraitModifiers(skill)
          .all.filter(
            ({ isActive, traitModifiers }) =>
              isActive && traitModifiers.some(({ specialization }) => Boolean(specialization))
          );

        modifierAccumulator.boni.skillSpecialization += modifiersForSkillSpecialization.reduce(
          (specializationBonusSum, { traitModifiers }) =>
            specializationBonusSum +
            traitModifiers.reduce(
              (specializationBonusSum, { specialization }) =>
                specialization.specializationName === skill.selectedSkillSpecialization
                  ? specialization.specializationBonus + specializationBonusSum
                  : specializationBonusSum,
              0
            ),
          0
        );

        modifierAccumulator.diceDifferences.skillSpecialization = modifiersForSkillSpecialization.reduce(
          (specializationBonusSum, { traitModifiers }) =>
            specializationBonusSum +
            traitModifiers.reduce(
              (specializationDiceDifferenceSum, { specialization }) =>
                specialization.specializationName === skill.selectedSkillSpecialization
                  ? specialization.specializationDiceDifference + specializationDiceDifferenceSum
                  : specializationDiceDifferenceSum,
              0
            ),
          0
        );

        if (self.isAttack) {
          modifierAccumulator.boni.isUnstablePlatform = skill.skillOptions.isUnstablePlatform
            ? -2
            : 0;
          modifierAccumulator.boni.range = Number(skill.skillOptions.range);
          modifierAccumulator.boni.isOneHandedAttack =
            character.currentlyHoldWeapon.isTwoHanded && skill.skillOptions.isOneHandedAttack
              ? -4
              : 0;
          if (
            isShooting(skill) &&
            character.currentlyHoldWeapon.minimumStrength +
              sum(character.getModifiersByField('minumumStrength')) >
              character.attributes.strength.dice &&
            character.getModifiersByField('ignoreMinimumStrength').length === 0
          ) {
            modifierAccumulator.boni.minimumStrength =
              DICE_TYPES.indexOf(character.attributes.strength.dice) -
              DICE_TYPES.indexOf(character.currentlyHoldWeapon.minimumStrength);
          }
          const recoilModifiers = character
            .getModifiersByField('ignoreRecoil')
            .filter((modifier) => character.activeModifiers.includes(modifier))
            .reduce((recoilSum, { ignoreRecoil }) => ignoreRecoil + recoilSum, 0);

          modifierAccumulator.boni.improvisedWeapon =
            character.currentlyHoldWeapon.isImprovisedWeapon &&
            character.getModifiersByField('ignoreImprovisedWeapon').length === 0
              ? -2
              : 0;

          modifierAccumulator.boni.recoil =
            skill.skillOptions.isRecoil || skill.skillOptions.isSupressiveFire
              ? -2 + (recoilModifiers > 2 ? 2 : recoilModifiers)
              : 0;
          modifierAccumulator.boni.threeRoundBurst =
            skill.skillOptions.isThreeRoundBurst && skill.skillOptions.rateOfFire === 1 ? 1 : 0;
          modifierAccumulator.boni.calledShot = getModifierForCalledShot(
            skill.skillOptions.calledShot
          );
          modifierAccumulator.boni.cover = Number(skill.skillOptions.cover);
          modifierAccumulator.boni.theDrop = skill.skillOptions.isTheDrop ? 4 : 0;
          modifierAccumulator.boni.vulnerable =
            skill.options.isVulnerableTarget && !skill.skillOptions.isTheDrop ? 2 : 0;
          modifierAccumulator.boni.proneTarget =
            skill.skillOptions.isProneTarget && skill.name !== 'fighting' ? -4 : 0;
          modifierAccumulator.boni.unarmedDefender = skill.skillOptions.isUnarmedDefender ? 2 : 0;
          modifierAccumulator.boni.scale = Number(skill.skillOptions.scale) + character.sizeBonus;
          modifierAccumulator.boni.speed = Number(skill.skillOptions.speed);
          modifierAccumulator.boni.shotgun =
            isShooting(skill) &&
            character.currentlyHoldWeapon.weaponType.includes('shotgun') &&
            !skill.skillOptions.isShotgunSlugs &&
            skill.skillOptions.range === '0'
              ? 2
              : 0;
          modifierAccumulator.boni.nonLethal = skill.skillOptions.isNonLethal ? -1 : 0;
          modifierAccumulator.boni.gangUp = skill.skillOptions.gangUp;
          if (skill.skillOptions.aim === 'ignore') {
            const sumOfPenalties =
              modifierAccumulator.boni.range +
              modifierAccumulator.boni.calledShot +
              modifierAccumulator.boni.cover +
              modifierAccumulator.boni.scale +
              modifierAccumulator.boni.speed;
            const maxAimingIgnore =
              4 +
              character
                .getModifiersByField('aimingHelp')
                .reduce((aimingHelpSum, { aimingHelp }) => aimingHelpSum + aimingHelp, 0);
            modifierAccumulator.boni.aim =
              sumOfPenalties * -1 >= maxAimingIgnore ? maxAimingIgnore : sumOfPenalties * -1;
          } else if (skill.skillOptions.aim === 'plusTwo') {
            modifierAccumulator.boni.aim = 2;
          }
        }

        console.log(JSON.stringify(modifierAccumulator, undefined, 2));
        return modifierAccumulator;
      },
    };
  })

  .actions((self) => ({
    afterCreate() {
      this.set('name', self.settingSkill._id);
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

export function getModifierForCalledShot(calledShot: Iskill['skillOptions']['calledShot']) {
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
