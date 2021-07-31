import React, { HTMLAttributes } from 'react';
import { observable, makeObservable, action } from 'mobx';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import ReactModal from 'react-modal';

import { Button } from 'ui/Button';

import { Icharacter } from 'store/characters';
import { Itrait } from 'store/characters/traitModel';

import { capitalizeFirstLetter } from 'lib/strings';

import { TraitRoll } from '../TraitRoll';

const Name = styled.div`
  font-weight: bold;
`;

const ValueButton = styled(Button)`
  font-family: 'Courier New', Courier, monospace;
  justify-self: center;
`;

const DiceContainer = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.5fr) minmax(0, 1fr);
  align-items: center;
  justify-content: space-between;
`;

interface DiceProps extends HTMLAttributes<HTMLDivElement> {
  character: Icharacter;
  isEdit?: boolean;
  trait: Itrait;
}

@observer
export class Dice extends React.Component<DiceProps, { isEdit: boolean }> {
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

  render() {
    const { character, trait } = this.props;

    return (
      <DiceContainer>
        <Name>{capitalizeFirstLetter(trait.name)}</Name>

        <ValueButton onClick={this.openRollModal}>{trait.value}</ValueButton>
        <ReactModal
          isOpen={this.isRollModalOpen}
          shouldCloseOnEsc={true}
          onRequestClose={this.closeRollModal}
          ariaHideApp={false}
        >
          <TraitRoll character={character} trait={trait} />
        </ReactModal>
      </DiceContainer>
    );
  }
}

/* <Form>
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
          </Form> */
