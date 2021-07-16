import React, { HTMLAttributes } from 'react';
import { observable, makeObservable, computed } from 'mobx';
import { observer } from 'mobx-react';
import cx from 'classnames';
import ReactModal from 'react-modal';
import { BsPencil } from 'react-icons/bs';
import { capitalizeFirstLetter } from 'lib/strings';

import { Button } from 'ui/Button';
import { IncDec } from 'ui/IncDec';
import { SWFormGroup } from 'ui/SWFormGroup';

import { Icharacter } from 'store/characters';
import { Itrait } from 'store/characters/traitModel';
import { ShowObject } from 'ui/ShowObject';

import CSS from './Dice.module.scss';

interface DiceProps extends HTMLAttributes<HTMLDivElement> {
  character: Icharacter;
  isEdit?: boolean;
  trait: Itrait;
}

@observer
export class Dice extends React.Component<DiceProps, { isEdit: boolean }> {
  @observable
  isEdit = this.props.isEdit;

  @observable
  isRollModalOpen = false;

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

  constructor(props: DiceProps) {
    super(props);
    makeObservable(this);
  }

  openRollModal = () => {
    const { character, trait } = this.props;
    character
      .getTraitModifiers(trait.name)
      .nonOptionalModifiers.edges.forEach((modifier) => trait.addActiveModifier(modifier));
    this.isRollModalOpen = true;
  };

  rollDice = () => {
    this.result = this.props.trait.roll(this.modifierSum, this.props.character.wildcard);
  };

  render() {
    const { character, trait } = this.props;
    const currentModifiers = character.getTraitModifiers(trait.name);

    return (
      <div className={cx({ [CSS.oneLine]: !this.isEdit })}>
        <div className={CSS.top}>
          <span>{capitalizeFirstLetter(trait.name)}</span>
          {this.isEdit && (
            <Button variant="success" onClick={() => (this.isEdit = false)}>
              Save
            </Button>
          )}
        </div>
        {this.isEdit && (
          <div className={CSS.form}>
            <SWFormGroup className={CSS.formRow} label="Dice">
              <IncDec
                disableDecrement={!trait.isDiceDecrementable}
                disableIncrement={!trait.isDiceIncrementable}
                onDecrement={trait.decrementDice}
                onIncrement={trait.incrementDice}
                value={trait.dice.toString()}
              />
            </SWFormGroup>
            <SWFormGroup label="Bonus">
              <IncDec
                disableDecrement={!trait.isBonusDecrementable}
                disableIncrement={!trait.isBonusIncrementable}
                onDecrement={trait.decrementBonus}
                onIncrement={trait.incrementBonus}
                value={trait.bonus.toString()}
              />
            </SWFormGroup>
          </div>
        )}

        {!this.isEdit && (
          <>
            <button className={CSS.value} onClick={this.openRollModal}>
              {trait.value}
            </button>
            <Button variant="link" className="btn-inline-link" onClick={() => (this.isEdit = true)}>
              <BsPencil />
            </Button>
            <ReactModal
              isOpen={this.isRollModalOpen}
              shouldCloseOnEsc={true}
              onRequestClose={() => (this.isRollModalOpen = false)}
              ariaHideApp={false}
            >
              <h2>Rolling {trait.name}</h2>
              <h3>Active Modifiers:</h3>
              <h4>Wounds: {-currentModifiers.nonOptionalModifiers.wounds}</h4>
              <h4>Fatigue: {-currentModifiers.nonOptionalModifiers.fatigue}</h4>
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
            </ReactModal>
          </>
        )}
      </div>
    );
  }
}
