import React from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { Observer, observer } from 'mobx-react';

import { StoreContext } from 'components/StoreContext';

import { Button } from 'ui/Button';
import { ShowObject } from 'ui/ShowObject';

import { Icharacter } from 'store/characters';
import { Itrait } from 'store/characters/traitModel';
import { Istore } from 'store';
import { Iskill, isSkill } from 'store/characters/skillModel';

import { capitalizeFirstLetter } from 'lib/strings';
import { Joker } from './Joker';
import { Actions } from './Actions';
import { createModifierAccumulator, ModifierAccumulator } from './modifierAccumulator';

interface RollDiceProps {
  character: Icharacter;
  trait: Itrait | Iskill;
}

@observer
export class RollTrait extends React.Component<RollDiceProps> {
  static contextType = StoreContext;
  // @ts-expect-error
  context!: Istore;

  @computed
  get modifierAccumulator() {
    const { character, trait } = this.props;

    const modifierAccumulator: ModifierAccumulator = createModifierAccumulator();
    modifierAccumulator.boni.wounds = -character.woundsPenalty;
    modifierAccumulator.boni.fatigue = -character.fatigueAsNumber;
    modifierAccumulator.boni.numberOfActions = -(2 * trait.numberOfActions);
    modifierAccumulator.boni.joker = trait.isJoker ? 2 : 0;

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

  @observable
  result: ReturnType<Itrait['roll']> | null = null;

  constructor(props: RollDiceProps) {
    super(props);
    makeObservable(this);
  }

  @action
  rollDice = () => {
    this.result = this.props.trait.roll(this.modifierSum, this.props.character.wildcard);
  };

  render() {
    const { character, trait } = this.props;
    const currentModifiers = character.getTraitModifiers(trait.name);

    return (
      <>
        <h2>Rolling {trait.name}</h2>
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
          <Observer>
            {() => (
              <>
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
              </>
            )}
          </Observer>
        )}
        <ShowObject>{this.modifierSum}</ShowObject>
        <Button onClick={this.rollDice}>Roll Dice</Button>
        {this.result && <ShowObject>{this.result}</ShowObject>}
      </>
    );
  }
}
