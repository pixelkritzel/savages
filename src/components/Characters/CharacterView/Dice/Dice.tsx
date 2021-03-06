import React, { HTMLAttributes } from 'react';
import { observable, makeObservable, action } from 'mobx';
import { observer } from 'mobx-react';
import cx from 'classnames';
import ReactModal from 'react-modal';
import { BsPencil } from 'react-icons/bs';

import { Button } from 'ui/Button';
import { IncDec } from 'ui/IncDec';
import { DiceFormGroup } from 'components/Characters/CharacterView/Dice/DiceFormGroup';

import { Icharacter } from 'store/characters';
import { Itrait } from 'store/characters/traitModel';

import { capitalizeFirstLetter } from 'lib/strings';

import { RollTrait } from '../RollTrait/';

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

  constructor(props: DiceProps) {
    super(props);
    makeObservable(this);
  }

  @action
  openRollModal = () => {
    const { character, trait } = this.props;
    const traitModifiers = character.getTraitModifiers(trait.name);

    traitModifiers.nonOptionalModifiers.edges.forEach((modifier) =>
      trait.addActiveModifier(modifier)
    );
    traitModifiers.nonOptionalModifiers.hindrances.forEach((modifier) =>
      trait.addActiveModifier(modifier)
    );
    this.isRollModalOpen = true;
  };

  @action
  closeRollModal = () => {
    this.props.trait.clearActiveModifiers();
    this.isRollModalOpen = false;
  };

  render() {
    const { character, trait } = this.props;

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
            <DiceFormGroup className={CSS.formRow} label="Dice">
              <IncDec
                disableDecrement={!trait.isDiceDecrementable}
                disableIncrement={!trait.isDiceIncrementable}
                onDecrement={trait.decrementDice}
                onIncrement={trait.incrementDice}
                value={trait.dice.toString()}
              />
            </DiceFormGroup>
            <DiceFormGroup label="Bonus">
              <IncDec
                disableDecrement={!trait.isBonusDecrementable}
                disableIncrement={!trait.isBonusIncrementable}
                onDecrement={trait.decrementBonus}
                onIncrement={trait.incrementBonus}
                value={trait.bonus.toString()}
              />
            </DiceFormGroup>
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
              onRequestClose={this.closeRollModal}
              ariaHideApp={false}
            >
              <RollTrait character={character} trait={trait} />
            </ReactModal>
          </>
        )}
      </div>
    );
  }
}
