import React from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { getType } from 'mobx-state-tree';

import { StoreContext } from 'components/StoreContext';

import { Button } from 'ui/Button';
import { ShowObject } from 'ui/ShowObject';

import { Icharacter } from 'store/characters';
import { Itrait } from 'store/characters/traitModel';
import { Istore } from 'store';
import { Iskill } from 'store/characters/skillModel';

import { capitalizeFirstLetter } from 'lib/strings';

interface RollDiceProps {
  character: Icharacter;
  trait: Itrait | Iskill;
}

@observer
export class RollDice extends React.Component<RollDiceProps> {
  static contextType = StoreContext;
  // @ts-expect-error
  context!: Istore;

  @computed
  get modifierSum() {
    const { character, trait } = this.props;

    const modifierSum: Parameters<Itrait['roll']>[0] = {
      diceDifference: 0,
      bonus: -character.woundsPenalty - character.fatigueAsNumber,
    };

    if (this.isSkillSpezialized && this.selectedSkillSpezialization === null) {
      modifierSum.bonus = modifierSum.bonus - 2;
    }

    for (const [, modifier] of this.props.trait.activeModifiers) {
      for (const traitModifier of modifier.traitModifiers) {
        if (traitModifier.traitName === trait.name) {
          modifierSum.diceDifference = modifierSum.diceDifference + traitModifier.bonusDice;
          modifierSum.bonus = modifierSum.bonus + traitModifier.bonusValue;
        }
      }
    }
    return modifierSum;
  }

  @observable
  result: ReturnType<Itrait['roll']> | null = null;

  @computed
  get traitType() {
    const modelName = getType(this.props.trait).name;
    if (modelName.includes('attribute')) {
      return 'attribute';
    } else if (modelName.includes('skill')) {
      return 'skill';
    } else if (modelName.includes('trait')) {
      return 'trait';
    }
    throw new Error(`Unknown trait type: ${modelName}`);
  }

  @computed
  get isSkillSpezialized() {
    return (
      this.traitType === 'skill' &&
      this.context.selectedSetting.isSkillSpezializations &&
      this.context.selectedSetting.isSpezializedSkill(this.props.trait.name)
    );
  }

  @observable
  selectedSkillSpezialization: string | null = null;

  @action
  setSelectedSkillSpezialization = (spezialization: this['selectedSkillSpezialization']) => {
    this.selectedSkillSpezialization = spezialization;
  };

  constructor(props: RollDiceProps) {
    super(props);
    makeObservable(this);
  }

  rollDice = () => {
    this.result = this.props.trait.roll(this.modifierSum, this.props.character.wildcard);
  };

  render() {
    const { character, trait } = this.props;
    const currentModifiers = character.getTraitModifiers(trait.name);

    return (
      <>
        <h2>Rolling {trait.name}</h2>
        <h3>Active Modifiers:</h3>
        <h4>Wounds: {-currentModifiers.nonOptionalModifiers.wounds}</h4>
        <h4>Fatigue: {-currentModifiers.nonOptionalModifiers.fatigue}</h4>
        <h4>Hindrances</h4>
        {currentModifiers.nonOptionalModifiers.hindrances.map((modifier) => (
          <label>
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
          <label>
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
          <label>
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
          <label>
            <input
              type="checkbox"
              checked={trait.activeModifiers.has(modifier.id)}
              onChange={() => trait.toggleActiveModifier(modifier)}
            />
            <strong>{modifier.name}</strong> {modifier.conditions}
            <br /> Dice {modifier.getHumanFriendlyTraitModifierValueByTrait(trait.name)}
          </label>
        ))}
        {this.isSkillSpezialized && (
          <>
            <h3>Skill Spezialazitions</h3>
            <p>Select a spezialazation for {trait.name}</p>
            <label>
              <input
                type="radio"
                checked={this.selectedSkillSpezialization === null}
                value=""
                onChange={() => this.setSelectedSkillSpezialization(null)}
              />{' '}
              None
            </label>
            {(trait as Iskill).specializations?.map((spezialization) => (
              <label key={spezialization}>
                <input
                  type="radio"
                  checked={this.selectedSkillSpezialization === spezialization}
                  value={spezialization}
                  onChange={() => this.setSelectedSkillSpezialization(spezialization)}
                />{' '}
                {capitalizeFirstLetter(spezialization)}
              </label>
            ))}
          </>
        )}
        <ShowObject>{this.modifierSum}</ShowObject>
        <Button onClick={this.rollDice}>Roll Dice</Button>
        {this.result && <ShowObject>{this.result}</ShowObject>}
      </>
    );
  }
}
