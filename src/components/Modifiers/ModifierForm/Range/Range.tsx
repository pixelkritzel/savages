import React from 'react';
import { observer } from 'mobx-react';
import styled, { css } from 'styled-components';

import { IncDec } from 'ui/IncDec';

import { Imodifier } from 'store/modifiers';
import { capitalizeFirstLetter } from 'lib/strings';
import { Flex } from 'ui/Grid';
import { FormGroup } from 'ui/FormGroup';

interface RangeProps {
  rangeModifier: Imodifier['rangeModifier'];
}

const Centered = styled.div`
  text-align: center;
`;

export const Range = observer(function RangeFn({ rangeModifier, ...otherProps }: RangeProps) {
  return (
    <Flex direction="column" spacing="inside">
      <Centered as="h4">Range</Centered>
      <Flex horizontal="space-around">
        {(['short', 'medium', 'long'] as const).map((key) => (
          <FormGroup
            direction="column"
            key={key}
            label={<Centered> {capitalizeFirstLetter(key)}</Centered>}
            input={() => (
              <IncDec
                value={rangeModifier[key]}
                onIncrement={() => rangeModifier.set(key, rangeModifier[key] + 1)}
                onDecrement={() => rangeModifier.set(key, rangeModifier[key] - 1)}
              />
            )}
          />
        ))}
      </Flex>
    </Flex>
  );
});
