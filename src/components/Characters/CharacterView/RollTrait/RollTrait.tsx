import React from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';

import { StoreContext } from 'components/StoreContext';

import { Button } from 'ui/Button';
import { ShowObject } from 'ui/ShowObject';

import { Icharacter } from 'store/characters';
import { DICE_TYPES, Itrait } from 'store/characters/traitModel';
import { Istore } from 'store';
import { getModifierForCalledShot, Iskill, isShooting, isSkill } from 'store/characters/skillModel';

import { capitalizeFirstLetter } from 'lib/strings';
import { Joker } from './Joker';
import { Actions } from './Actions';
import { createModifierAccumulator, ModifierAccumulator } from './modifierAccumulator';
import { Attack } from './Attack';
import { padWithMathOperator } from 'utils/padWithMathOpertor';

interface RollDiceProps {
  character: Icharacter;
  trait: Itrait | Iskill;
}

@observer
export class RollTrait extends React.Component<RollDiceProps> {
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

  @computed
  get isAttack() {
    const { name: traitName } = this.props.trait;
    return (
      ['shooting', 'fighting'].includes(traitName) ||
      (traitName === 'athletics' && this.isAthleticsAttack)
    );
  }

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
    const { character, trait } = this.props;

    const modifierAccumulator: ModifierAccumulator = createModifierAccumulator();
    modifierAccumulator.boni.wounds = -character.woundsPenalty;
    modifierAccumulator.boni.fatigue = -character.fatigueAsNumber;
    modifierAccumulator.boni.numberOfActions = -(2 * trait.numberOfActions);
    modifierAccumulator.boni.joker = trait.isJoker ? 2 : 0;
    if (isSkill(trait) && this.isAttack) {
      modifierAccumulator.boni.range = Number(trait.attack.range);
      modifierAccumulator.boni.recoil = trait.attack.recoil ? -2 : 0;
      modifierAccumulator.boni.calledShot = getModifierForCalledShot(trait.attack.calledShot);
      modifierAccumulator.boni.cover = Number(trait.attack.cover);
      modifierAccumulator.boni.theDrop = trait.attack.theDrop ? 4 : 0;
      console.log(trait.name);

      modifierAccumulator.boni.proneTarget =
        trait.attack.proneTarget && trait.name !== 'fighting' ? -4 : 0;
      modifierAccumulator.boni.unarmedDefender = trait.attack.unarmedDefender ? 2 : 0;
      modifierAccumulator.boni.scale = Number(trait.attack.scale);
      modifierAccumulator.boni.speed = Number(trait.attack.speed);
      if (trait.attack.aim === 'ignore') {
        const sumOfPenalties =
          modifierAccumulator.boni.range +
          modifierAccumulator.boni.calledShot +
          modifierAccumulator.boni.cover +
          modifierAccumulator.boni.scale +
          modifierAccumulator.boni.speed;
        modifierAccumulator.boni.aim = sumOfPenalties * -1 >= 4 ? 4 : sumOfPenalties * -1;
        console.warn('Needs to be implemented!');
      } else if (trait.attack.aim === 'plusTwo') {
        modifierAccumulator.boni.aim = 2;
      }
    }

    if (isSkill(trait) && trait.isSkillSpezialized && trait.selectedSkillSpezialization === null) {
      modifierAccumulator.boni.skillSpecialization = -2;
    }

    for (const [, modifier] of this.props.trait.activeModifiers) {
      for (const traitModifier of modifier.traitModifiers) {
        if (traitModifier.traitName === trait.name) {
          modifierAccumulator.diceDifferences[modifier.reason] = traitModifier.bonusDice;
          modifierAccumulator.boni[modifier.reason] = traitModifier.bonusValue;
        }
      }
    }
    modifierAccumulator.diceDifferences.custom = this.customDiceDifference;
    modifierAccumulator.boni.custom = this.customBonus;
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

  @action
  rollDice = () => {
    const { trait } = this.props;
    const numberOfDices = isSkill(trait) && isShooting(trait) ? trait.attack.rateOfFire : 1;
    this.result = trait.roll({
      ...this.modifierSum,
      numberOfDices,
      isWildcard: this.props.character.wildcard,
      targetValue: this.targetValue,
    });
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
        <Actions trait={trait} />

        <div>
          <Joker trait={trait} />
        </div>

        <h3>Active Modifiers:</h3>
        <h4>Wounds: {-currentModifiers.nonOptionalModifiers.wounds}</h4>
        <h4>Fatigue: {-currentModifiers.nonOptionalModifiers.fatigue}</h4>
        <h4>Hindrances</h4>
        {currentModifiers.nonOptionalModifiers.hindrances.map((modifier) => (
          <label key={modifier.id}>
            <input
              type="checkbox"
              checked={trait.activeModifiers.has(modifier.id)}
              onChange={() => trait.toggleActiveModifier(modifier)}
            />
            <strong>{modifier.name}</strong> {modifier.conditions}
          </label>
        ))}
        <h4>Edges</h4>
        {currentModifiers.nonOptionalModifiers.edges.map((modifier) => (
          <label key={modifier.id}>
            <input
              type="checkbox"
              checked={trait.activeModifiers.has(modifier.id)}
              onChange={() => trait.toggleActiveModifier(modifier)}
            />
            <strong>{modifier.name}</strong> {modifier.conditions}
          </label>
        ))}

        <h3>Optional Modifiers:</h3>
        <h4>Hindrances</h4>
        {currentModifiers.optionalModifiers.hindrances.map((modifier) => (
          <label key={modifier.id}>
            <input
              type="checkbox"
              checked={trait.activeModifiers.has(modifier.id)}
              onChange={() => trait.toggleActiveModifier(modifier)}
            />
            <strong>{modifier.name}</strong> {modifier.conditions}
          </label>
        ))}

        <h4>Edges</h4>
        {currentModifiers.optionalModifiers.edges.map((modifier) => (
          <label key={modifier.id}>
            <input
              type="checkbox"
              checked={trait.activeModifiers.has(modifier.id)}
              onChange={() => trait.toggleActiveModifier(modifier)}
            />
            <strong>{modifier.name}</strong> {modifier.conditions}
            <br /> Dice {modifier.getHumanFriendlyTraitModifierValueByTrait(trait.name)}
          </label>
        ))}
        {isSkill(trait) && trait.isSkillSpezialized && (
          <div>
            <h3>Skill Spezializitions</h3>
            <p>Select a spezialization for {trait.name}</p>
            <label>
              <input
                type="radio"
                name="selected-skill-specialization"
                checked={trait.selectedSkillSpezialization === null}
                value=""
                onChange={() => trait.set('selectedSkillSpezialization', null)}
              />{' '}
              None
            </label>
            {(trait as Iskill).specializations?.map((spezialization) => (
              <label key={spezialization}>
                <input
                  type="radio"
                  name="selected-skill-specialization"
                  checked={trait.selectedSkillSpezialization === spezialization}
                  value={spezialization}
                  onChange={() =>
                    trait.set('selectedSkillSpezialization', spezialization.toString())
                  }
                />{' '}
                {capitalizeFirstLetter(spezialization)}
              </label>
            ))}
          </div>
        )}
        {isSkill(trait) && this.isAttack && <Attack attackSkill={trait} character={character} />}
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
        <ShowObject>{this.modifierSum}</ShowObject>
        <label>
          Target Value{' '}
          <input
            type="number"
            value={this.targetValue}
            onChange={(event) => this.setTargetValue(Number(event.target.value))}
            step={1}
          />
        </label>
        <Button onClick={this.rollDice}>
          {`D${this.modifiedRoll.dice} ${
            this.modifiedRoll.bonus !== 0 ? padWithMathOperator(this.modifiedRoll.bonus) : ''
          }`}
        </Button>
        {this.result && <ShowObject>{this.result}</ShowObject>}
      </>
    );
  }
}
