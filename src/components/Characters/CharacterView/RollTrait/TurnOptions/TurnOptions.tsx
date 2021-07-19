import React from 'react';
import { observer } from 'mobx-react';

import { Itrait } from 'store/characters/traitModel';
import styled from 'styled-components';
import { FormGroup } from 'ui/FormGroup';
import { Checkbox } from 'ui/Checkbox';

interface TurnOptionsProps {
  trait: Itrait;
}

const StyledFieldset = styled.fieldset`
  display: flex;
  justify-content: space-around;

  & > *::not(fieldset) {
    width: 46%;
  }
`;

export const TurnOptions: React.FC<TurnOptionsProps> = observer(({ trait, ...otherProps }) => {
  return (
    <StyledFieldset {...otherProps}>
      <legend>Turn Options</legend>
      <FormGroup
        label={`Actions in Turn: ${trait.numberOfActions + 1}`}
        input={({ id }) => (
          <>
            <input
              type="range"
              id={id}
              min={0}
              max={2}
              step={1}
              value={trait.numberOfActions}
              onChange={(event) => trait.set('numberOfActions', Number(event.target.value))}
              list="numberOfActionsTickmarks"
            />

            <datalist id="numberOfActionsTickmarks">
              <option value="0" label="1"></option>
              <option value="1" label="2"></option>
              <option value="2" label="3"></option>
            </datalist>
          </>
        )}
      ></FormGroup>
      <Checkbox
        label="Joker"
        checked={trait.isJoker}
        onChange={() => trait.set('isJoker', !trait.isJoker)}
      ></Checkbox>
    </StyledFieldset>
  );
});
