import React from 'react';
import styled from 'styled-components';

import { Button } from 'ui/Button';

const IncDecInnner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 200px;
`;

const StyledButton = styled(Button)`
  text-align: center;
  width: 28px;
  height: 28px;
  padding: 0;
`;

const Value = styled.span`
  display: inline-block;
  width: 60px;
  text-align: center;
`;

interface IncDecProps {
  disableDecrement?: boolean;
  disableIncrement?: boolean;
  onDecrement: () => void;
  onIncrement: () => void;
  value: React.ReactNode;
}

export const IncDec: React.FC<IncDecProps> = ({
  disableDecrement = false,
  disableIncrement = false,
  onDecrement,
  onIncrement,
  value,
  ...otherProps
}) => {
  return (
    <IncDecInnner {...otherProps}>
      <StyledButton type="button" variant="icon" disabled={disableDecrement} onClick={onDecrement}>
        -
      </StyledButton>
      <Value>{value}</Value>
      <StyledButton type="button" variant="icon" disabled={disableIncrement} onClick={onIncrement}>
        +
      </StyledButton>
    </IncDecInnner>
  );
};
