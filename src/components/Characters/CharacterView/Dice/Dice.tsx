import React, { HTMLAttributes } from 'react';
import { observable, makeObservable, action } from 'mobx';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import ReactModal from 'react-modal';
import { BsPencil } from 'react-icons/bs';

import { Button } from 'ui/Button';
import { IncDec } from 'ui/IncDec';
import { DiceFormGroup } from 'components/Characters/CharacterView/Dice/DiceFormGroup';

import { Icharacter } from 'store/characters';
import { Itrait } from 'store/characters/traitModel';

import { capitalizeFirstLetter } from 'lib/strings';

import { TraitRoll } from '../TraitRoll';

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
`;

const Form = styled.form`
  width: 100%;
`;

const ValueButton = styled(Button)`
  font-family: 'Courier New', Courier, monospace;
`;

const DiceContainer = styled.div<{ isOneLine: boolean }>`
  ${({ isOneLine }) =>
    isOneLine
      ? `
    display: flex;
    align-items: center;
    justify-content: space-between;
  `
      : ''}
`;

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
    this.isRollModalOpen = true;
  };

  @action
  closeRollModal = () => {
    this.isRollModalOpen = false;
  };

  @action
  toggleIsEdit = () => {
    this.isEdit = !this.isEdit;
  };

  render() {
    const { character, trait } = this.props;

    return (
      <DiceContainer isOneLine={!this.isEdit}>
        <Top>
          <span>{capitalizeFirstLetter(trait.name)}</span>
          {this.isEdit && (
            <Button variant="success" onClick={this.toggleIsEdit}>
              Save
            </Button>
          )}
        </Top>
        {this.isEdit && (
          <Form>
            <DiceFormGroup label="Dice">
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
          </Form>
        )}

        {!this.isEdit && (
          <>
            <ValueButton onClick={this.openRollModal}>{trait.value}</ValueButton>
            <Button variant="link" className="btn-inline-link" onClick={() => (this.isEdit = true)}>
              <BsPencil />
            </Button>
            <ReactModal
              isOpen={this.isRollModalOpen}
              shouldCloseOnEsc={true}
              onRequestClose={this.closeRollModal}
              ariaHideApp={false}
            >
              <TraitRoll character={character} trait={trait} />
            </ReactModal>
          </>
        )}
      </DiceContainer>
    );
  }
}
