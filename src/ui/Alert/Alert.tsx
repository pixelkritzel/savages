import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

const StyledAlert = styled.div`
  padding: 18px;
  border: 2px red solid;
`;

interface AlertProps {}

export const Alert: React.FC<AlertProps> = observer(({ children, ...otherProps }) => {
  return <StyledAlert {...otherProps}>{children}</StyledAlert>;
});
