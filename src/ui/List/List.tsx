import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

const UL = styled.ul`
  list-style: none;
  padding: 0;
`;

interface ListProps {
  children: React.ReactNode | React.ReactNode;
}

export const List = observer(function ListFn({ children, ...otherProps }: ListProps) {
  return <UL {...otherProps}>{children}</UL>;
});
