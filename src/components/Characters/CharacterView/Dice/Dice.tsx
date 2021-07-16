import React, { HTMLAttributes } from 'react';
import { observable, makeObservable } from 'mobx';
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

import CSS from './Dice.module.scss';
import { RollDice } from './RollDice';

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

  openRollModal = () => {
    const { character, trait } = this.props;
    character
      .getTraitModifiers(trait.name)
      .nonOptionalModifiers.edges.forEach((modifier) => trait.addActiveModifier(modifier));
    this.isRollModalOpen = true;
  };

  closeModal = () => {
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
              onRequestClose={this.closeModal}
              ariaHideApp={false}
            >
              <RollDice character={character} trait={trait} />
            </ReactModal>
          </>
        )}
      </div>
    );
  }
}
