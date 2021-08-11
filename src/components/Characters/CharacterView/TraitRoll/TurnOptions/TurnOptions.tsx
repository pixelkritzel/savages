import React from 'react';
import { observer } from 'mobx-react';

import { Itrait } from 'store/characters/traitModel';
import styled from 'styled-components';
import { FormGroup } from 'ui/FormGroup';
import { Checkbox } from 'ui/Checkbox';
import { generateId } from 'lib/utils/generateId';

interface TurnOptionsProps {
  trait: Itrait;
}

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 24px;
`;

@observer
export class TurnOptions extends React.Component<TurnOptionsProps> {
  numberOfActionsTickmarksID = generateId();

  inputNumberOfActions = ({ id }: { id: string }) => {
    const { trait } = this.props;

    return (
      <>
        <input
          type="range"
          id={id}
          min={0}
          max={2}
          step={1}
          value={trait.options.numberOfActions}
          onChange={(event) => trait.options.set('numberOfActions', Number(event.target.value))}
          list={this.numberOfActionsTickmarksID}
        />

        <datalist id={this.numberOfActionsTickmarksID}>
          <option value="0" label="1"></option>
          <option value="1" label="2"></option>
          <option value="2" label="3"></option>
        </datalist>
      </>
    );
  };

  render() {
    const { trait, ...otherProps } = this.props;
    return (
      <fieldset {...otherProps}>
        <legend>Turn Options</legend>
        <GridContainer>
          <FormGroup
            inline
            label={`Actions in Turn: ${trait.options.numberOfActions + 1}`}
            input={this.inputNumberOfActions}
          ></FormGroup>
          <Checkbox
            label="Joker"
            checked={trait.options.isJoker}
            onChange={() => trait.options.set('isJoker', !trait.options.isJoker)}
          ></Checkbox>
        </GridContainer>
      </fieldset>
    );
  }
}
