import React from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { Observer, observer } from 'mobx-react';
import merge from 'lodash/merge';

import { StoreContext } from 'components/StoreContext';

import { ShowObject } from 'ui/ShowObject';

import { Icharacter } from 'store/characters';
import { Itrait } from 'store/characters/traitModel';
import { Istore } from 'store';
import { isAttackSkill, Iskill, isShooting, isSkill } from 'store/characters/skillModel';

import { Attack } from './Attack';
import { TurnOptions } from './TurnOptions';
import { ActiveModifiers } from '../ActiveModifiers';
import { OptionalModifiers } from '../OptionalModifiers';
import { RollAndResult } from './RollAndResult';

import { capitalizeFirstLetter } from 'lib/strings';
import { TargetOptions } from './TargetOptions';
import { DICE_TYPES } from 'store/consts';

interface RollDiceProps {
  character: Icharacter;
  trait: Itrait | Iskill;
}

@observer
export class TraitRoll extends React.Component<RollDiceProps> {
  static contextType = StoreContext;
  // @ts-expect-error
  context!: Istore;

  @observable
  result: ReturnType<Itrait['roll']> | null = null;

  @observable
  isAthleticsAttack = false;

  @action
  toggleIsAthleticsAttack = () => {
    this.isAthleticsAttack = !this.isAthleticsAttack;
  };

  @observable
  targetValue = 4;

  @action
  setTargetValue = (value: this['targetValue']) => (this.targetValue = value);

  @observable
  customDiceDifference = 0;

  @observable
  customBonus = 0;

  @action
  setCustomDiceDifference = (event: React.ChangeEvent<HTMLInputElement>) =>
    (this.customDiceDifference = Number(event.target.value));

  @action
  setCustomBonus = (event: React.ChangeEvent<HTMLInputElement>) =>
    (this.customBonus = Number(event.target.value));

  @computed
  get modifierAccumulator() {
    const { trait } = this.props;
    let modifierAccumulator = trait.traitModifierAccumulator;
    if (isSkill(trait)) {
      modifierAccumulator = merge(modifierAccumulator, trait.skillModifierAccumulator);
    }
    return modifierAccumulator;
  }

  @computed
  get modifierSum() {
    const diceDifference = Object.values(this.modifierAccumulator.diceDifferences).reduce(
      (sum, diceDifference) => sum + diceDifference,
      0
    );
    const bonus = Object.values(this.modifierAccumulator.boni).reduce(
      (sum, bonus) => sum + bonus,
      0
    );
    return { diceDifference, bonus };
  }

  @computed
  get modifiedRoll() {
    const indexOfTraitDice = DICE_TYPES.indexOf(this.props.trait.dice);
    const indexOfModifiedDice =
      indexOfTraitDice + this.modifierSum.diceDifference < 0
        ? 0
        : indexOfTraitDice + this.modifierSum.diceDifference > DICE_TYPES.length - 1
        ? DICE_TYPES.length - 1
        : indexOfTraitDice + this.modifierSum.diceDifference;

    return {
      dice: DICE_TYPES[indexOfModifiedDice],
      bonus: this.props.trait.bonus + this.modifierSum.bonus,
    };
  }

  constructor(props: RollDiceProps) {
    super(props);
    makeObservable(this);
  }

  @computed
  get isTraitRollable() {
    const { character, trait } = this.props;

    return (
      isSkill(trait) &&
      isAttackSkill(trait) &&
      !trait.isAttackRollable(character.currentlyHoldWeapon)
    );
  }

  @computed
  get rollConfiguration() {
    const { trait } = this.props;
    const numberOfDices = isSkill(trait) && isShooting(trait) ? trait.attackOptions.rateOfFire : 1;
    return {
      ...this.modifierSum,
      numberOfDices,
      isWildcard: this.props.character.wildcard,
      targetValue: this.targetValue,
    };
  }

  @action
  rollDice = () => {
    this.result = this.props.trait.roll(this.rollConfiguration);
  };

  render() {
    const { character, trait } = this.props;
    const currentModifiers = character.getTraitModifiers(trait.name);
    return (
      <>
        <h2>Rolling {capitalizeFirstLetter(trait.name)}</h2>
        {trait.name === 'athletics' && (
          <label>
            <input
              type="checkbox"
              checked={this.isAthleticsAttack}
              onChange={this.toggleIsAthleticsAttack}
            />{' '}
            Is Athletics Attack
          </label>
        )}
        <TurnOptions trait={trait} />
        <ActiveModifiers currentModifiers={currentModifiers} trait={trait} />
        <OptionalModifiers trait={trait} currentModifiers={currentModifiers} />
        {isSkill(trait) && trait.isAttack && <Attack attackSkill={trait} character={character} />}

        <TargetOptions trait={trait} />
        <fieldset>
          <legend>Custom Modifiers</legend>
          <label>
            Dice Type{' '}
            <input
              type="number"
              value={this.customDiceDifference}
              onChange={this.setCustomDiceDifference}
            />
          </label>
          <label>
            Bonus <input type="number" value={this.customBonus} onChange={this.setCustomBonus} />
          </label>
        </fieldset>
        <Observer>{() => <ShowObject>{this.modifierSum}</ShowObject>}</Observer>
        <label>
          Target Value{' '}
          <input
            type="number"
            value={this.targetValue}
            onChange={(event) => this.setTargetValue(Number(event.target.value))}
            step={1}
          />
        </label>

        <RollAndResult
          character={character}
          isTraitRollable={this.isTraitRollable}
          trait={trait}
          rollConfiguration={this.rollConfiguration}
        />
      </>
    );
  }
}
