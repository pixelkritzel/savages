import React from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import styled from 'styled-components/macro';

import { StoreContext } from 'components/StoreContext';
import { FormGroup } from 'ui/FormGroup';

import { Icharacter } from 'store/characters';
import { Itrait } from 'store/characters/traitModel';
import { Istore } from 'store';
import { isAttackSkill, Iskill, isShooting, isSkill } from 'store/characters/skillModel';
import { DICE_TYPES } from 'store/consts';

import { capitalizeFirstLetter } from 'lib/strings';

import { Attack } from './Attack';
import { TurnOptions } from './TurnOptions';
import { NonOptionalModifiers } from './NonOptionalModifiers';
import { OptionalModifiers } from './OptionalModifiers';
import { RollAndResult } from './RollAndResult';
import { TargetOptions } from './TargetOptions';
import { CustomModifiers } from './CustomModifiers';
import { Illumination } from './Illumination';

interface RollDiceProps {
  character: Icharacter;
  trait: Itrait | Iskill;
}

const Indent = styled.div`
  margin-left: 17px;
`;

const RollButtonPlacement = styled.div`
  margin: 24px 17px;
`;

@observer
export class TraitRoll extends React.Component<RollDiceProps> {
  static contextType = StoreContext;
  // @ts-expect-error
  context!: Istore;

  @observable
  result: ReturnType<Itrait['roll']> | null = null;

  @observable
  isAthleticsAttack = this.props.trait.name !== 'athletics';

  @action
  toggleIsAthleticsAttack = () => {
    this.isAthleticsAttack = !this.isAthleticsAttack;
  };

  @observable
  targetValue = 4;

  @action
  setTargetValue = (value: this['targetValue']) => (this.targetValue = value);

  @computed
  get modifiedRoll() {
    const { trait } = this.props;
    const indexOfTraitDice = DICE_TYPES.indexOf(this.props.trait.dice);
    const indexOfModifiedDice =
      indexOfTraitDice + trait.modifierSum.diceDifference < 0
        ? 0
        : indexOfTraitDice + trait.modifierSum.diceDifference > DICE_TYPES.length - 1
        ? DICE_TYPES.length - 1
        : indexOfTraitDice + trait.modifierSum.diceDifference;

    return {
      dice: DICE_TYPES[indexOfModifiedDice],
      bonus: this.props.trait.bonus + trait.modifierSum.bonus,
    };
  }

  constructor(props: RollDiceProps) {
    super(props);
    makeObservable(this);
  }

  @computed
  get isTraitRollable() {
    const { character, trait } = this.props;
    const isAttack =
      isSkill(trait) &&
      isAttackSkill(trait) &&
      trait.isAttackRollable(character.currentlyHoldWeapon);
    const isSkillNotAttack =
      (isSkill(trait) && !isAttackSkill(trait)) ||
      (isSkill(trait) && trait.name === 'athletics' && !trait.skillOptions.isAthleticsAttack);
    const isNotSkill = !isSkill(trait);

    return isAttack || isSkillNotAttack || isNotSkill;
  }

  @computed
  get rollConfiguration() {
    const { trait } = this.props;
    const numberOfDices = isSkill(trait) && isShooting(trait) ? trait.skillOptions.rateOfFire : 1;
    return {
      ...trait.modifierSum,
      numberOfDices,
      isWildcard: this.props.character.wildcard,
      targetValue: this.targetValue,
    };
  }

  @computed
  get currentModifiers() {
    return this.props.character.getTraitModifiers(this.props.trait.name);
  }

  render() {
    const { character, trait } = this.props;

    return (
      <>
        <Indent>
          <h2>Rolling {capitalizeFirstLetter(trait.name)}</h2>
          {trait.name === 'athletics' && (
            <FormGroup
              label="Is Athletics Attack"
              input={({ id }) => (
                <input
                  id={id}
                  type="checkbox"
                  checked={this.isAthleticsAttack}
                  onChange={this.toggleIsAthleticsAttack}
                />
              )}
            />
          )}
        </Indent>
        <TurnOptions trait={trait} />
        <NonOptionalModifiers modifiers={this.currentModifiers} trait={trait} />
        <OptionalModifiers trait={trait} currentModifiers={this.currentModifiers} />
        <Illumination trait={trait} />
        {isSkill(trait) && isAttackSkill(trait) && this.isAthleticsAttack && (
          <Attack attackSkill={trait} character={character} />
        )}

        <TargetOptions trait={trait} />
        <CustomModifiers
          trait={trait}
          targetValue={this.targetValue}
          setTargetValue={this.setTargetValue}
        />
        <RollButtonPlacement>
          <RollAndResult
            character={character}
            isTraitRollable={this.isTraitRollable}
            trait={trait}
            rollConfiguration={this.rollConfiguration}
          />
        </RollButtonPlacement>
      </>
    );
  }
}
