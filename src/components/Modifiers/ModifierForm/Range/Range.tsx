import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

import { Box } from 'ui/Box';
import { IncDec } from 'ui/IncDec';

import { Imodifier } from 'store/modifiers';
import { capitalizeFirstLetter } from 'lib/strings';

interface RangeProps {
  rangeModifier: Imodifier['rangeModifier'];
}

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  row-gap: ${({ theme }) => theme.rhythms.inside.vertical}px;
  justify-items: center;
`;

const RangeInput = styled.div`
  text-align: center;
  width: 120px;
`;

export const Range = observer(function RangeFn({ rangeModifier, ...otherProps }: RangeProps) {
  return (
    <Box title="Range" asFieldset {...otherProps}>
      <GridContainer>
        {(['short', 'medium', 'long'] as const).map((key) => (
          <RangeInput key={key}>
            {capitalizeFirstLetter(key)}
            <IncDec
              value={rangeModifier[key]}
              onIncrement={() => rangeModifier.set(key, rangeModifier[key] + 1)}
              onDecrement={() => rangeModifier.set(key, rangeModifier[key] - 1)}
            />
          </RangeInput>
        ))}
      </GridContainer>
    </Box>
  );
});
