import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { Box } from 'ui/Box';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, auto);
  grid-template-rows: auto;
  row-gap: ${({ theme }) => theme.rhythms.outside.vertical}px;
  column-gap: ${({ theme }) => theme.rhythms.outside.horizontal}px;
`;

const Input = styled.input`
  margin-right: 8px;
`;

interface RadioGroupProps {
  title: string;
  radios: [value: string, label: string][];
  selectedValue: string | undefined;
  setSelectedValue: (value: string) => void;
}

export const RadioGroup: React.FC<RadioGroupProps> = observer(
  ({ title, radios, selectedValue, setSelectedValue, ...otherProps }) => {
    return (
      <Box title={title} asFieldset>
        <GridContainer>
          {radios.map(([value, label]) => (
            <label key={value}>
              <Input
                type="radio"
                checked={value === selectedValue}
                onChange={() => setSelectedValue(value)}
              />
              {label}
            </label>
          ))}
        </GridContainer>
      </Box>
    );
  }
);
