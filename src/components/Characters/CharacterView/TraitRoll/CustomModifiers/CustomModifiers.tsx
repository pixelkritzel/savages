import React from 'react';
import { observer } from 'mobx-react';
import { Itrait } from 'store/characters/traitModel';
import { FormGroup } from 'ui/FormGroup';
import styled from 'styled-components';

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`;

interface CustomModifiersProps {
  trait: Itrait;
  targetValue: number;
  setTargetValue: (targetValue: number) => void;
}

export const CustomModifiers = observer(function CustomModifiersFn({
  targetValue,
  setTargetValue,
  trait,
  ...otherProps
}: CustomModifiersProps) {
  return (
    <fieldset>
      <legend>Custom Modifiers</legend>
      <Container>
        <FormGroup
          label="Dice Type"
          input={({ id }) => (
            <input
              id={id}
              type="number"
              value={trait.options.customDiceDifference}
              onChange={(event) =>
                trait.options.set('customDiceDifference', Number(event.target.value))
              }
            />
          )}
        />
        <FormGroup
          label="Bonus"
          input={({ id }) => (
            <input
              type="number"
              id={id}
              value={trait.options.customBonus}
              onChange={(event) => trait.options.set('customBonus', Number(event.target.value))}
            />
          )}
        />
        <FormGroup
          inline
          label="Target Number"
          input={({ id }) => (
            <input
              type="number"
              id={id}
              value={targetValue}
              onChange={(event) => setTargetValue(Number(event.target.value))}
              step={1}
            />
          )}
        />
      </Container>
    </fieldset>
  );
});
