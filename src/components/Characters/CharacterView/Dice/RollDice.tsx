import React from 'react';
import { computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';

import { Button } from 'ui/Button';
import { ShowObject } from 'ui/ShowObject';

import { Icharacter } from 'store/characters';
import { Itrait } from 'store/characters/traitModel';

interface RollDiceProps {
  character: Icharacter;
  trait: Itrait;
}

@observer
export class RollDice extends React.Component<RollDiceProps> {
  @computed
  get modifierSum() {
    const { character, trait } = this.props;

    const modifierSum: Parameters<Itrait['roll']>[0] = {
      diceDifference: 0,
      bonus: -character.woundsPenalty - character.fatigueAsNumber,
    };

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
        <ShowObject>{this.modifierSum}</ShowObject>
        <Button onClick={this.rollDice}>Roll Dice</Button>
        {this.result && <ShowObject>{this.result}</ShowObject>}
      </>
    );
  }
}
