import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { Itrait } from 'store/characters/traitModel';

const resultColors = {
  border: {
    success: 'lightgreen',
    failure: 'orange',
    critical_failure: 'red',
  },
};

const titles = {
  success: 'Success',
  failure: 'Failure',
  critical_failure: 'Critical Failure',
};

const StyledResult = styled.div`
  border: 3px ${({ type }: ResultProps) => resultColors.border[type]} solid;
`;

type ResultProps = ReturnType<Itrait['roll']> & {};

export const Result: React.FC<ResultProps> = observer(({ ...otherProps }) => {
  return <StyledResult {...otherProps}>{}</StyledResult>;
});
